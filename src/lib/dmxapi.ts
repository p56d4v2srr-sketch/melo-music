/**
 * DMXAPI Suno Provider
 * 通过 DMXAPI 网关调用 Suno 音乐生成，异步任务模式
 * Docs: https://doc.dmxapi.cn/suno-music-all.html
 */

import type { MusicProvider, GenerateParams, GenerateResult, ProviderTaskStatus } from './music-provider';

export function hasDmxApiKey(): boolean {
  return !!process.env.DMXAPI_API_KEY && process.env.DMXAPI_API_KEY.trim() !== '';
}

export function getDmxApiBase(): string {
  return process.env.DMXAPI_API_BASE || 'https://www.dmxapi.cn';
}

interface DmxApiSubmitResponse {
  code: string;
  data: string;  // task_id 是字符串
  message: string;
}

interface DmxApiFetchSong {
  title?: string;
  duration?: number;
  audio_url?: string;
  image_url?: string;
  lyric?: string;
  video_url?: string;
  metadata?: Record<string, unknown>;
}

interface DmxApiFetchResponse {
  code: string;
  message?: string;
  data: {
    status: string;  // SUCCESS / FAILED / PENDING / TEXT_SUCCESS / FIRST_SUCCESS / IN_PROGRESS
    progress?: string;
    data?: DmxApiFetchSong[];
    task_id?: string;
    fail_reason?: string;
  };
}

// UI model_version → DMXAPI mv 字段（chirp-<version>，version 内部的 . 替换成 -）
function toChirpModel(version: string): string {
  const normalized = version.trim().replace(/\./g, '-').toLowerCase();
  // 已经带 chirp- 前缀就原样返回
  if (normalized.startsWith('chirp-')) return normalized;
  // 直接拼 chirp- 前缀
  return `chirp-${normalized}`;
}

async function dmxapiFetch(
  path: string,
  init: { method: 'GET' | 'POST'; body?: unknown; timeout?: number }
): Promise<{ ok: boolean; status: number; data?: unknown; error?: string }> {
  const { method, body, timeout = 120000 } = init;
  const url = `${getDmxApiBase()}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${process.env.DMXAPI_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(timer);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, status: res.status, data, error: `DMXAPI ${res.status}: ${JSON.stringify(data).slice(0, 200)}` };
    }
    return { ok: true, status: res.status, data };
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === 'AbortError') {
      return { ok: false, status: 0, error: `DMXAPI 请求超时（${Math.round(timeout / 1000)}s）` };
    }
    return { ok: false, status: 0, error: `DMXAPI 网络错误: ${err instanceof Error ? err.message : String(err)}` };
  }
}

export class DmxApiProvider implements MusicProvider {
  name = 'dmxapi';

  async generate(params: GenerateParams): Promise<GenerateResult> {
    const mv = toChirpModel(params.model_version);
    // 模式选择：有歌词/标题走自定义，否则走灵感
    const useCustom = !!(params.lyric || params.title);
    const body: Record<string, unknown> = {
      mv,
      make_instrumental: !!params.instrumental,
      notify_hook: '',
    };
    if (useCustom) {
      // 自定义模式：prompt 字段承载歌词
      body.prompt = params.lyric || params.prompt || '';
      if (params.style) body.tags = params.style;
      if (params.title) body.title = params.title;
    } else {
      // 灵感模式：gpt_description_prompt 承载描述
      body.gpt_description_prompt = params.prompt || '';
    }

    console.log('[DMXAPI] Submit:', { url: `${getDmxApiBase()}/suno/submit/music`, body });
    const res = await dmxapiFetch('/suno/submit/music', { method: 'POST', body });

    if (!res.ok) {
      console.error('[DMXAPI] Submit failed:', res.error, res.data);
      return {
        task_id: '',
        status: 'failed',
        provider: this.name,
        model_version: params.model_version,
        actual_model: mv,
        data: { error: res.error || 'DMXAPI 请求失败' },
      };
    }

    const submitData = res.data as DmxApiSubmitResponse;
    if (submitData.code !== 'success' || !submitData.data) {
      return {
        task_id: '',
        status: 'failed',
        provider: this.name,
        model_version: params.model_version,
        actual_model: mv,
        data: { error: submitData.message || 'DMXAPI 返回失败', response: submitData },
      };
    }

    return {
      task_id: submitData.data,
      status: 'pending',
      provider: this.name,
      model_version: params.model_version,
      actual_model: mv,
      data: { task_id: submitData.data },
    };
  }

  async queryTask(taskId: string): Promise<ProviderTaskStatus> {
    if (!taskId) {
      return { task_id: '', status: 'failed', provider: this.name, error: 'task_id 为空' };
    }
    const res = await dmxapiFetch(`/suno/fetch/${taskId}`, { method: 'GET' });
    if (!res.ok) {
      return {
        task_id: taskId,
        status: 'failed',
        provider: this.name,
        error: res.error || 'DMXAPI 查询失败',
      };
    }
    const body = res.data as DmxApiFetchResponse;
    if (body.code !== 'success' || !body.data) {
      return {
        task_id: taskId,
        status: 'failed',
        provider: this.name,
        error: body.message || 'DMXAPI 返回失败',
      };
    }
    const upstream = body.data.status || '';
    let mapped: ProviderTaskStatus['status'] = 'processing';
    if (upstream === 'SUCCESS') mapped = 'succeeded';
    else if (upstream === 'FAILED') mapped = 'failed';
    else if (upstream === 'PENDING') mapped = 'pending';

    const songs = (body.data.data || []).map((s, idx) => ({
      id: `${taskId}_${idx}`,
      title: s.title || 'Untitled',
      audio_url: s.audio_url,
      image_url: s.image_url,
      lyric: s.lyric,
      duration: s.duration,
    }));

    return {
      task_id: taskId,
      status: mapped,
      provider: this.name,
      songs: songs.length > 0 ? songs : undefined,
      error: mapped === 'failed' ? body.data.fail_reason : undefined,
    };
  }
}
