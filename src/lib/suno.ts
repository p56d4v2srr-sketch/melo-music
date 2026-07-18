/**
 * 谱乐 AI (yourmusic.fun) Suno API 封装
 * 
 * ⚠️ 与天谱乐 (tianpuyue.cn) 是完全不同的两家公司：
 * - 域名：api.yourmusic.fun
 * - 鉴权：Bearer token（带 Bearer 前缀）
 * - 环境变量：PUYUE_API_KEY / PUYUE_API_BASE
 * - 一次返回 2 首歌
 * - 状态机：pending/processing/succeeded/failed
 * - 查询接口：GET /v1/music/generations/query?songid=id1,id2
 */

import { sanitizeLyrics } from '@/lib/lyrics-sanitizer';

// ============ 类型定义 ============

export interface SunoGenerateParams {
  mode: 'prompt' | 'custom';
  prompt?: string;             // prompt 模式必填
  title?: string;              // custom 模式必填
  lyrics?: string;             // custom 模式建议填
  tags?: string;               // custom 模式必填
  instrumental?: boolean;
  model?: string;              // 默认 'chirp-v5.5'
  negative_tags?: string;
  vocal_gender?: 'male' | 'female';
  style_weight?: number;
  weirdness_constraint?: number;
}

export interface SunoSong {
  id: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | string;
  title?: string;
  audio_url?: string;
  image_url?: string;
  lyric?: string;
  tags?: string;
  duration?: number;
  model_name?: string;
  instrumental?: boolean;
  created_at?: string;
  error_message?: string;
}

export interface SunoGenerateResponse {
  task_id: string;
  status: string;
  songs: SunoSong[];
  created_at?: string;
}

// ============ 错误处理 ============

export class SunoApiError extends Error {
  code: string;
  statusCode: number;
  
  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.name = 'SunoApiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

function getErrorMessage(statusCode: number, body: any): string {
  // 确保 serverMessage 是字符串，避免 [object Object]
  const rawMessage = body?.message || body?.error || '未知错误';
  const serverMessage = typeof rawMessage === 'string' 
    ? rawMessage 
    : JSON.stringify(rawMessage);
  
  switch (statusCode) {
    case 401:
      return '谱乐 AI 认证失败，请检查 PUYUE_API_KEY';
    case 402:
      return '谱乐 AI 余额不足，请去 https://api.yourmusic.fun/dashboard 充值';
    case 429:
      return '请求过频繁，请稍后重试';
    case 400:
      return `参数错误: ${serverMessage}`;
    default:
      return `谱乐 AI 错误 [${statusCode}]: ${serverMessage}`;
  }
}

// ============ 核心 API ============

/**
 * 提交生成任务
 * - prompt 模式：AI 自动写歌词
 * - custom 模式：用户提供歌词，需要 title/tags/model
 */
export async function generateSuno(params: SunoGenerateParams): Promise<SunoGenerateResponse> {
  const apiKey = process.env.PUYUE_API_KEY;
  const apiBase = process.env.PUYUE_API_BASE || 'https://api.yourmusic.fun';
  
  if (!apiKey) {
    throw new SunoApiError('PUYUE_API_KEY 环境变量未配置', 'CONFIG_ERROR', 500);
  }
  
  const model = params.model || 'chirp-v5.5';
  
  // 构建请求体
  let requestBody: Record<string, any>;
  let endpoint: string;
  
  if (params.mode === 'prompt') {
    // Prompt 模式
    if (!params.prompt?.trim()) {
      throw new SunoApiError('prompt 模式必须提供 prompt 参数', 'VALIDATION_ERROR', 400);
    }
    endpoint = '/v1/suno/generate/prompt';
    requestBody = {
      prompt: params.prompt,
      model,
      instrumental: params.instrumental || false,
    };
  } else {
    // Custom 模式
    if (!params.tags?.trim()) {
      throw new SunoApiError('custom 模式必须提供 tags 参数', 'VALIDATION_ERROR', 400);
    }
    
    // 歌词净化（如果有）
    let sanitizedLyrics = params.lyrics;
    if (params.lyrics?.trim()) {
      const sanitizeResult = sanitizeLyrics(params.lyrics);
      sanitizedLyrics = sanitizeResult.cleaned;
      
      // 非纯乐器模式，净化后歌词为空则报错
      if (!params.instrumental && !sanitizedLyrics.trim()) {
        throw new SunoApiError('歌词净化后为空，请提供有效歌词或勾选纯乐器', 'VALIDATION_ERROR', 400);
      }
    } else if (!params.instrumental) {
      // 非纯乐器模式但没有歌词
      throw new SunoApiError('需要提供歌词或勾选纯乐器', 'VALIDATION_ERROR', 400);
    }
    
    endpoint = '/v1/suno/generate/custom';
    requestBody = {
      title: params.title || 'Untitled Melo',
      tags: params.tags,
      model,
      lyrics: sanitizedLyrics,
      instrumental: params.instrumental || false,
    };
    
    // 可选参数
    if (params.negative_tags) requestBody.negative_tags = params.negative_tags;
    if (params.vocal_gender) requestBody.vocal_gender = params.vocal_gender;
    if (params.style_weight !== undefined) requestBody.style_weight = params.style_weight;
    if (params.weirdness_constraint !== undefined) requestBody.weirdness_constraint = params.weirdness_constraint;
  }
  
  console.log(`[suno] Submitting ${params.mode} mode request:`, {
    endpoint,
    model,
    hasLyrics: !!params.lyrics,
    instrumental: params.instrumental || false,
  });
  
  // 发起请求
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  
  try {
    const response = await fetch(`${apiBase}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    if (!response.ok) {
      const message = getErrorMessage(response.status, data);
      throw new SunoApiError(message, `HTTP_${response.status}`, response.status);
    }
    
    // 对返回的歌词也做净化（防御式）
    if (data.songs && Array.isArray(data.songs)) {
      data.songs = data.songs.map((song: SunoSong) => {
        if (song.lyric) {
          const sanitized = sanitizeLyrics(song.lyric);
          return { ...song, lyric: sanitized.cleaned };
        }
        return song;
      });
    }
    
    return data as SunoGenerateResponse;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof SunoApiError) {
      throw error;
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new SunoApiError('请求超时（60s）', 'TIMEOUT', 504);
    }
    
    throw new SunoApiError(
      error instanceof Error ? error.message : '未知错误',
      'NETWORK_ERROR',
      500
    );
  }
}

/**
 * 查询歌曲状态
 * GET /v1/music/generations/query?songid=id1,id2
 * 注意：是 GET 请求，songid 用逗号拼接
 */
export async function querySunoSongs(songIds: string[]): Promise<SunoSong[]> {
  const apiKey = process.env.PUYUE_API_KEY;
  const apiBase = process.env.PUYUE_API_BASE || 'https://api.yourmusic.fun';
  
  if (!apiKey) {
    throw new SunoApiError('PUYUE_API_KEY 环境变量未配置', 'CONFIG_ERROR', 500);
  }
  
  if (!songIds || songIds.length === 0) {
    return [];
  }
  
  // 用逗号拼接 songid
  const songidParam = songIds.join(',');
  const url = `${apiBase}/v1/music/generations/query?songid=${encodeURIComponent(songidParam)}`;
  
  console.log(`[suno] Querying ${songIds.length} songs:`, songIds);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    if (!response.ok) {
      const message = getErrorMessage(response.status, data);
      throw new SunoApiError(message, `HTTP_${response.status}`, response.status);
    }
    
    // 返回的是数组
    let songs: SunoSong[] = Array.isArray(data) ? data : (data.songs || []);
    
    // 对返回的歌词也做净化（防御式）
    songs = songs.map((song) => {
      if (song.lyric) {
        const sanitized = sanitizeLyrics(song.lyric);
        return { ...song, lyric: sanitized.cleaned };
      }
      return song;
    });
    
    return songs;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof SunoApiError) {
      throw error;
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new SunoApiError('查询超时（60s）', 'TIMEOUT', 504);
    }
    
    throw new SunoApiError(
      error instanceof Error ? error.message : '未知错误',
      'NETWORK_ERROR',
      500
    );
  }
}
