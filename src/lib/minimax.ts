/**
 * MiniMax music-2.0 Provider
 * 通过 DMXAPI 网关调用 MiniMax music-2.0 音乐生成，同步返回音频 URL
 * Endpoint: POST /v1/responses
 * Auth: Authorization: <API_KEY>（不带 Bearer）
 * Docs: https://doc.dmxapi.cn
 */

import type { MusicProvider, GenerateParams, GenerateResult, ProviderTaskStatus } from './music-provider';

// 内存缓存：同步任务完成后存储结果，供 queryTask 查询
const taskCache = new Map<string, {
  status: ProviderTaskStatus['status'];
  songs: ProviderTaskStatus['songs'];
  error?: string;
}>();

interface MiniMaxAudioContent {
  type: string;       // "output_audio"
  audio?: string;     // 音频 URL
}

interface MiniMaxOutputItem {
  content?: MiniMaxAudioContent[];
}

interface MiniMaxResponse {
  task_id?: string;
  id?: string;
  state?: string;     // "completed" / "failed" / ...
  status?: string;
  output?: MiniMaxOutputItem[];
  extra_info?: {
    music_duration?: number;
    music_size?: number;
  };
  usage?: {
    total_tokens?: number;
  };
  error?: {
    message?: string;
    code?: string;
  };
}

function getApiBase(): string {
  return process.env.DMXAPI_API_BASE || 'https://www.dmxapi.cn';
}

function getApiKey(): string {
  return process.env.DMXAPI_API_KEY || '';
}

export function hasMiniMaxKey(): boolean {
  return !!getApiKey();
}

export class MiniMaxProvider implements MusicProvider {
  name = 'minimax';

  async generate(params: GenerateParams): Promise<GenerateResult> {
    const apiKey = getApiKey();
    if (!apiKey) {
      return {
        task_id: '',
        status: 'failed',
        provider: this.name,
        model_version: params.model_version,
        actual_model: 'music-2.0',
        data: { error: 'DMXAPI_API_KEY not configured' },
      };
    }

    const endpoint = `${getApiBase()}/v1/responses`;
    const body = {
      model: 'music-2.0',
      input: params.prompt || '',
      lyrics: params.lyric || '',
      audio_setting: {
        sample_rate: 44100,
        bitrate: 256000,
        format: 'wav',
      },
      output_format: 'url',
      aigc_watermark: false,
      stream: false,
    };

    console.log('[MiniMax] Submit:', { endpoint, model: 'music-2.0', input_length: body.input.length, lyrics_length: body.lyrics.length });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 120000); // 120s timeout

    let res: Response;
    try {
      res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey,  // 不带 Bearer
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof Error && err.name === 'AbortError') {
        const errorMsg = `MiniMax 请求超时（120s）`;
        console.error('[MiniMax]', errorMsg);
        return {
          task_id: '',
          status: 'failed',
          provider: this.name,
          model_version: params.model_version,
          actual_model: 'music-2.0',
          data: { error: errorMsg },
        };
      }
      const errorMsg = `MiniMax 网络错误: ${err instanceof Error ? err.message : String(err)}`;
      console.error('[MiniMax]', errorMsg);
      return {
        task_id: '',
        status: 'failed',
        provider: this.name,
        model_version: params.model_version,
        actual_model: 'music-2.0',
        data: { error: errorMsg },
      };
    }
    clearTimeout(timer);

    const text = await res.text();

    if (!res.ok) {
      console.error('[MiniMax] HTTP error:', res.status, text.slice(0, 500));
      return {
        task_id: '',
        status: 'failed',
        provider: this.name,
        model_version: params.model_version,
        actual_model: 'music-2.0',
        data: { error: `MiniMax HTTP ${res.status}: ${text.slice(0, 300)}` },
      };
    }

    let data: MiniMaxResponse;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('[MiniMax] JSON parse error:', text.slice(0, 300));
      return {
        task_id: '',
        status: 'failed',
        provider: this.name,
        model_version: params.model_version,
        actual_model: 'music-2.0',
        data: { error: `MiniMax 响应解析失败: ${text.slice(0, 200)}` },
      };
    }

    // 检查 API 级别错误
    if (data.error) {
      const errorMsg = `MiniMax API 错误: ${data.error.message || data.error.code || 'unknown'}`;
      console.error('[MiniMax]', errorMsg);
      return {
        task_id: data.task_id || data.id || '',
        status: 'failed',
        provider: this.name,
        model_version: params.model_version,
        actual_model: 'music-2.0',
        data: { error: errorMsg, raw: data },
      };
    }

    // 提取音频 URL
    const audioUrl = data.output?.[0]?.content?.[0]?.audio;
    if (!audioUrl) {
      console.error('[MiniMax] No audio URL in response:', text.slice(0, 500));
      return {
        task_id: data.task_id || data.id || '',
        status: 'failed',
        provider: this.name,
        model_version: params.model_version,
        actual_model: 'music-2.0',
        data: { error: 'MiniMax 响应中无音频 URL', raw: data },
      };
    }

    const taskId = data.task_id || data.id || `minimax-${Date.now()}`;
    const duration = data.extra_info?.music_duration || params.duration || 0;
    const title = params.title || 'Untitled';

    console.log('[MiniMax] Success:', { taskId, audioUrl: audioUrl.slice(0, 80) + '...', duration });

    // 缓存结果供 queryTask 使用
    taskCache.set(taskId, {
      status: 'succeeded',
      songs: [{
        id: taskId,
        title,
        audio_url: audioUrl,
        duration,
      }],
    });

    // 同步返回成功结果（data 字段为数组，对齐其他 provider）
    return {
      task_id: taskId,
      status: 'succeeded',
      provider: this.name,
      model_version: params.model_version,
      actual_model: 'music-2.0',
      data: [{
        id: taskId,
        title,
        audio_url: audioUrl,
        image_url: null,
        duration,
        lyric: params.lyric || '',
        format: 'wav',
        extra_info: data.extra_info,
        usage: data.usage,
      }],
    };
  }

  async queryTask(taskId: string): Promise<ProviderTaskStatus> {
    if (!taskId) {
      return { task_id: '', status: 'failed', provider: this.name, error: 'task_id 为空' };
    }

    // 从缓存中查找
    const cached = taskCache.get(taskId);
    if (cached) {
      return {
        task_id: taskId,
        status: cached.status,
        provider: this.name,
        songs: cached.songs,
        error: cached.error,
      };
    }

    // 缓存未命中（可能是重启后丢失），返回 pending 让上层重试
    return {
      task_id: taskId,
      status: 'processing',
      provider: this.name,
      error: '任务缓存已丢失（MiniMax 为同步接口，结果应在 generate 阶段返回）',
    };
  }
}
