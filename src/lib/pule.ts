/**
 * 天谱乐 (PuLe / TianPuYue) AI 音乐 API
 * 异步提交 + 轮询架构
 * 
 * 接口文档：
 * - 生成：POST /open-apis/v1/song/generate
 * - 查询：POST /open-apis/v1/song/query
 * 
 * 鉴权：Authorization: <api_key>（不带 Bearer）
 * 定价：TemPolor v4.6 ¥0.3/首（一次提交返回 1+ 首）
 */

import { sanitizeLyrics } from './lyrics-sanitizer';

// ============ Types ============

export interface PuleGenerateParams {
  prompt: string;
  model?: string;  // V5.8: 不传则上游使用默认模型
  lyrics?: string;
  instrumental?: boolean;
  callback_url?: string;
}

export interface PuleSong {
  item_id: string;
  status: 'running' | 'main_succeeded' | 'succeeded' | 'part_failed' | 'failed';
  audio_url?: string;
  audio_hi_url?: string;
  streamAudioUrl?: string;
  lyrics?: string;
  lyrics_sections?: Array<{ start_ms: number; end_ms: number; text: string }>;
  duration?: number;
  error?: string;
  // 额外字段（查询接口返回）
  title?: string;
  style?: string;
  prompt?: string;
  event?: string | null;
  audio_hi_status?: string | null;
  lyrics_sections_status?: string | null;
  lyrics_disp?: string | null;
  lrc_mv?: string | null;
  audio_bgm_url?: string | null;
  created_at?: number;
  finished_at?: number | null;
  model?: string;
}

export interface PuleGenerateResponse {
  item_ids: string[];
}

export interface PuleQueryResponse {
  songs: PuleSong[];
}

// ============ Config ============

function getApiBase(): string {
  const base = process.env.PULE_API_BASE;
  if (!base) {
    throw new Error('PULE_API_BASE 环境变量未配置');
  }
  return base;
}

function getApiKey(): string {
  const key = process.env.PULE_API_KEY;
  if (!key) {
    throw new Error('PULE_API_KEY 环境变量未配置');
  }
  return key;
}

function getCallbackUrl(): string {
  // callback_url 必填，否则上游返回 400
  return process.env.PULE_CALLBACK_URL || 'https://webhook.site/token-placeholder';
}

export function hasPuleKey(): boolean {
  return !!process.env.PULE_API_KEY;
}

// ============ Error Handling ============

interface PuleErrorResponse {
  status?: number;
  code?: number;
  message?: string;
  request_id?: string;
}

function formatPuleError(data: PuleErrorResponse): string {
  const code = data.status || data.code;
  const msg = data.message || '未知错误';
  
  // 常见错误码人性化提示
  switch (code) {
    case 400001:
      return `PuLe 认证失败：Authorization 头缺失（code=${code}）`;
    case 400002:
      return `PuLe 认证失败：API Key 无效或已过期（code=${code}）`;
    case 402001:
    case 402002:
    case 402003:
      return `PuLe 余额不足，请充值后重试（code=${code}）`;
    default:
      return `PuLe 错误 [${code}]: ${msg}`;
  }
}

// ============ API Functions ============

/**
 * 提交生成任务
 * 返回 item_ids 用于后续轮询
 */
export async function generatePule(params: PuleGenerateParams): Promise<PuleGenerateResponse> {
  const apiKey = getApiKey();
  const apiBase = getApiBase();
  const endpoint = `${apiBase}/open-apis/v1/song/generate`;

  // 如果有 lyrics，先净化一次（防御式）
  let sanitizedLyrics: string | undefined;
  if (params.lyrics) {
    const result = sanitizeLyrics(params.lyrics);
    sanitizedLyrics = result.cleaned;
    console.log('[PuLe] Lyrics sanitized:', {
      original_length: params.lyrics.length,
      cleaned_length: sanitizedLyrics.length,
      bracketTagCount: result.structureTagCount,
    });
  }

  // 构建请求体
  const body: Record<string, unknown> = {
    prompt: params.prompt,
    callback_url: params.callback_url || getCallbackUrl(),
    action: null,
    upload_audio_url: null,
    style_negative: null,
  };

  // V5.8: 使用实测有效的 model 字面串
  body.model = params.model || 'TemPolor v4.5';

  // 最高音质输出
  body.quality = 'studio';
  body.audio_format = 'wav';

  // PuLe API 要求必须传 lyrics，即使是 instrumental 模式
  // instrumental 模式下用 [Instrumental] 占位
  if (params.instrumental) {
    body.instrumental = false;  // API 不支持 instrumental=true，用歌词占位
    body.lyrics = sanitizedLyrics?.trim() || '[Instrumental]';
  } else if (sanitizedLyrics && sanitizedLyrics.trim()) {
    body.lyrics = sanitizedLyrics;
    body.instrumental = false;
  } else {
    // 非 instrumental 但没有歌词，报错
    throw new Error('非纯音乐模式必须提供歌词');
  }

  console.log('[PuLe] Submit:', {
    endpoint,
    model: body.model,
    prompt_length: params.prompt.length,
    has_lyrics: !!body.lyrics,
    instrumental: body.instrumental,
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000); // 60s timeout（提交接口应该很快）

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey,  // 注意：不带 Bearer
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await res.json() as { status?: number; data?: { item_ids?: string[] }; message?: string; code?: number; request_id?: string };

    if (!res.ok) {
      throw new Error(formatPuleError(data));
    }

    // 检查业务状态码
    if (data.status !== 200000) {
      throw new Error(formatPuleError(data));
    }

    const itemIds = data.data?.item_ids;
    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      throw new Error('PuLe 返回的 item_ids 为空');
    }

    console.log('[PuLe] Submit success:', { item_ids: itemIds });
    return { item_ids: itemIds };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('PuLe 请求超时（60s）');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 查询歌曲状态
 * 用于轮询，最多 10 个 item_id
 */
export async function queryPuleSongs(itemIds: string[]): Promise<PuleQueryResponse> {
  if (!itemIds || itemIds.length === 0) {
    throw new Error('item_ids 不能为空');
  }
  if (itemIds.length > 10) {
    throw new Error('单次最多查询 10 个 item_id');
  }

  const apiKey = getApiKey();
  const apiBase = getApiBase();
  const endpoint = `${apiBase}/open-apis/v1/song/query`;

  console.log('[PuLe] Query:', { item_ids: itemIds });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
      },
      body: JSON.stringify({ item_ids: itemIds }),
      signal: controller.signal,
    });

    const data = await res.json() as { status?: number; data?: { songs?: unknown[] }; message?: string; code?: number };

    if (!res.ok) {
      throw new Error(formatPuleError(data));
    }

    if (data.status !== 200000) {
      throw new Error(formatPuleError(data));
    }

    const rawSongs = (data.data?.songs || []) as Array<Record<string, unknown>>;
    
    // 解析并净化返回的歌曲数据
    const songs: PuleSong[] = rawSongs.map((song) => {
      const item = song as {
        item_id: string;
        status: PuleSong['status'];
        audio_url?: string;
        audio_hi_url?: string;
        streamAudioUrl?: string;
        lyrics?: string;
        lyrics_sections?: PuleSong['lyrics_sections'];
        duration?: number;
        error?: string;
      };

      // 对返回的歌词也做净化（防御式）
      let sanitizedLyrics = item.lyrics;
      if (item.lyrics) {
        const result = sanitizeLyrics(item.lyrics);
        sanitizedLyrics = result.cleaned;
      }

      return {
        item_id: item.item_id,
        status: item.status,
        audio_url: item.audio_url,
        audio_hi_url: item.audio_hi_url,
        streamAudioUrl: item.streamAudioUrl,
        lyrics: sanitizedLyrics,
        lyrics_sections: item.lyrics_sections,
        duration: item.duration,
        error: item.error,
      };
    });

    console.log('[PuLe] Query result:', {
      songs_count: songs.length,
      statuses: songs.map(s => `${s.item_id.slice(0, 8)}: ${s.status}`),
    });

    return { songs };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('PuLe 查询超时（60s）');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
