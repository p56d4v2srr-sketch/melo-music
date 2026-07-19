/**
 * 智创聚合 (LCONAI / lconai.com) Suno API 封装
 * 
 * AIGC 模型聚合平台，支持 Suno V3.5/V4/V4.5/V5 全系列音乐生成。
 * 
 * - 域名：s.lconai.com（香港线路，国内首选）/ n.lconai.com（备用）
 * - 鉴权：Bearer token（带 Bearer 前缀）
 * - 环境变量：LCONAI_API_KEY / LCONAI_API_BASE
 * - 提交：POST /suno/submit/music
 * - 查询：GET /suno/fetch/{task_id}
 * - 响应格式：{ code: "success" | "xxx", data: ..., message: "..." }
 */

import { sanitizeLyrics } from '@/lib/lyrics-sanitizer';

// ============ 类型定义 ============

export interface LconaiGenerateParams {
  mode: 'prompt' | 'custom';
  prompt?: string;             // prompt 模式必填（gpt_description_prompt）
  title?: string;              // custom 模式必填
  lyrics?: string;             // custom 模式建议填
  tags?: string;               // custom 模式必填
  instrumental?: boolean;
  mv?: string;                 // 模型版本，默认 'chirp-v5'
}

export interface LconaiSubmitResponse {
  code: string;
  data: string;    // task_id
  message: string;
}

export interface LconaiSong {
  song_id?: string;
  id?: string;
  status?: string;
  title?: string;
  audio_url?: string;
  image_url?: string;
  lyric?: string;
  tags?: string;
  duration?: number;
  model_name?: string;
  created_at?: string;
  error_message?: string;
}

export interface LconaiFetchData {
  clips?: LconaiSong[];
  songs?: LconaiSong[];
  status?: string;
  [key: string]: unknown;
}

export interface LconaiFetchResponse {
  code: string;
  data: LconaiFetchData;
  message: string;
}

// ============ 错误处理 ============

export class LconaiApiError extends Error {
  code: string;
  statusCode: number;
  
  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.name = 'LconaiApiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

function getErrorMessage(statusCode: number, body: unknown): string {
  const raw = body as Record<string, unknown> | null;
  const rawMessage = (raw?.message as string) || (raw?.error as string) || '未知错误';
  const serverMessage = typeof rawMessage === 'string' 
    ? rawMessage 
    : JSON.stringify(rawMessage);
  
  switch (statusCode) {
    case 401:
      return '智创聚合认证失败，请检查 LCONAI_API_KEY';
    case 402:
      return '智创聚合余额不足，请联系管理员充值';
    case 429:
      return '请求过频繁，请稍后重试';
    case 400:
      return `参数错误: ${serverMessage}`;
    default:
      return `智创聚合错误 [${statusCode}]: ${serverMessage}`;
  }
}

// ============ 配置 ============

function getApiBase(): string {
  return process.env.LCONAI_API_BASE || 'https://s.lconai.com';
}

function getApiKey(): string {
  const key = process.env.LCONAI_API_KEY;
  if (!key) {
    throw new LconaiApiError('LCONAI_API_KEY 环境变量未配置', 'CONFIG_ERROR', 500);
  }
  return key;
}

export function hasLconaiKey(): boolean {
  return !!process.env.LCONAI_API_KEY;
}

// ============ 核心 API ============

/**
 * 提交音乐生成任务
 * POST /suno/submit/music
 */
export async function submitLconaiMusic(params: LconaiGenerateParams): Promise<LconaiSubmitResponse> {
  const apiKey = getApiKey();
  const apiBase = getApiBase();
  const mv = params.mv || 'chirp-v5';
  
  let requestBody: Record<string, unknown>;
  
  if (params.mode === 'prompt') {
    // 灵感模式
    if (!params.prompt?.trim()) {
      throw new LconaiApiError('prompt 模式必须提供 prompt 参数', 'VALIDATION_ERROR', 400);
    }
    requestBody = {
      gpt_description_prompt: params.prompt,
      make_instrumental: params.instrumental || false,
      mv,
    };
  } else {
    // 自定义模式
    if (!params.tags?.trim()) {
      throw new LconaiApiError('custom 模式必须提供 tags 参数', 'VALIDATION_ERROR', 400);
    }
    
    // 歌词净化
    let sanitizedLyrics = params.lyrics;
    if (params.lyrics?.trim()) {
      const sanitizeResult = sanitizeLyrics(params.lyrics);
      sanitizedLyrics = sanitizeResult.cleaned;
      
      if (!params.instrumental && !sanitizedLyrics.trim()) {
        throw new LconaiApiError('歌词净化后为空，请提供有效歌词或勾选纯乐器', 'VALIDATION_ERROR', 400);
      }
    } else if (!params.instrumental) {
      throw new LconaiApiError('需要提供歌词或勾选纯乐器', 'VALIDATION_ERROR', 400);
    }
    
    requestBody = {
      prompt: sanitizedLyrics || '',
      tags: params.tags,
      title: params.title || 'Untitled Melo',
      make_instrumental: params.instrumental || false,
      mv,
    };
  }
  
  // 添加最高音质配置：stereo 双声道，256kbps+
  requestBody.audio_quality = 'high';
  requestBody.output_format = 'mp3';
  requestBody.bitrate = '320';
  requestBody.channels = 'stereo';
  
  console.log(`[lconai] Submitting ${params.mode} mode request:`, {
    mv,
    hasLyrics: !!params.lyrics,
    instrumental: params.instrumental || false,
  });
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);
  
  try {
    const response = await fetch(`${apiBase}/suno/submit/music`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const data = await response.json() as LconaiSubmitResponse & { message?: string };
    
    // 检查业务级错误（如 insufficient_user_quota）
    if (data.code && data.code !== 'success') {
      const errMsg = data.message || data.code;
      
      if (data.code === 'insufficient_user_quota') {
        throw new LconaiApiError('智创聚合余额不足，请联系管理员充值', 'QUOTA_EXCEEDED', 402);
      }
      if (response.status === 401 || data.code.includes('invalid') || data.code.includes('auth')) {
        throw new LconaiApiError('智创聚合认证失败，请检查 LCONAI_API_KEY', 'INVALID_KEY', 401);
      }
      throw new LconaiApiError(`智创聚合错误: ${errMsg}`, data.code, response.status || 500);
    }
    
    if (!response.ok) {
      const message = getErrorMessage(response.status, data);
      throw new LconaiApiError(message, `HTTP_${response.status}`, response.status);
    }
    
    // data.data 是 task_id 字符串
    const taskId = typeof data.data === 'string' ? data.data : '';
    if (!taskId) {
      throw new LconaiApiError('智创聚合未返回有效的 task_id', 'NO_TASK_ID', 500);
    }
    
    return {
      code: 'success',
      data: taskId,
      message: '',
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof LconaiApiError) {
      throw error;
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new LconaiApiError('请求超时（60s）', 'TIMEOUT', 504);
    }
    
    throw new LconaiApiError(
      error instanceof Error ? error.message : '未知错误',
      'NETWORK_ERROR',
      500
    );
  }
}

/**
 * 查询任务状态
 * GET /suno/fetch/{task_id}
 */
export async function fetchLconaiTask(taskId: string): Promise<LconaiFetchData> {
  const apiKey = getApiKey();
  const apiBase = getApiBase();
  
  if (!taskId) {
    throw new LconaiApiError('task_id 不能为空', 'VALIDATION_ERROR', 400);
  }
  
  console.log(`[lconai] Fetching task: ${taskId}`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);
  
  try {
    const response = await fetch(`${apiBase}/suno/fetch/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const data = await response.json() as LconaiFetchResponse;
    
    // 检查业务级错误
    if (data.code && data.code !== 'success') {
      if (data.code === 'task_not_exist') {
        throw new LconaiApiError('任务不存在', 'TASK_NOT_FOUND', 404);
      }
      throw new LconaiApiError(`智创聚合查询错误: ${data.message || data.code}`, data.code, response.status || 500);
    }
    
    if (!response.ok) {
      const message = getErrorMessage(response.status, data);
      throw new LconaiApiError(message, `HTTP_${response.status}`, response.status);
    }
    
    // 对返回的歌词做净化（防御式）
    const resultData = data.data;
    const songs = resultData.clips || resultData.songs || [];
    const sanitizedSongs = songs.map((song) => {
      if (song.lyric) {
        const sanitized = sanitizeLyrics(song.lyric);
        return { ...song, lyric: sanitized.cleaned };
      }
      return song;
    });
    
    return {
      ...resultData,
      clips: sanitizedSongs,
      songs: sanitizedSongs,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof LconaiApiError) {
      throw error;
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new LconaiApiError('查询超时（60s）', 'TIMEOUT', 504);
    }
    
    throw new LconaiApiError(
      error instanceof Error ? error.message : '未知错误',
      'NETWORK_ERROR',
      500
    );
  }
}
