/**
 * AceData Cloud API 工具函数
 * 封装所有与 AceData Cloud 的 API 交互
 */

export interface AceDataError {
  code: 'invalid_key' | 'insufficient_balance' | 'rate_limit' | 'server_error' | 'unknown';
  message: string;
  details?: unknown;
}

export interface AceDataResponse<T = unknown> {
  success: boolean;
  data?: T;
  task_id?: string;
  trace_id?: string;
  error?: AceDataError;
}

/**
 * 检查是否配置了 AceData API Key
 */
export function hasAceDataKey(): boolean {
  return !!process.env.ACEDATA_API_KEY && process.env.ACEDATA_API_KEY.trim() !== '';
}

/**
 * 获取 AceData API 基础 URL
 */
export function getAceDataBase(): string {
  return process.env.ACEDATA_API_BASE || 'https://api.acedata.cloud';
}

/**
 * 解析 AceData API 错误
 */
function parseAceDataError(status: number, body: unknown): AceDataError {
  const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
  
  // 401/403 - Token 无效或权限不足
  if (status === 401 || status === 403) {
    return {
      code: 'invalid_key',
      message: 'AceData Token 无效或权限不足',
      details: body,
    };
  }
  
  // 402 - 额度不足
  if (status === 402 || bodyStr.toLowerCase().includes('insufficient balance') || bodyStr.toLowerCase().includes('balance not enough')) {
    return {
      code: 'insufficient_balance',
      message: 'AceData 账户额度不足，请到 platform.acedata.cloud 充值',
      details: body,
    };
  }
  
  // 429 - 频率限制
  if (status === 429) {
    return {
      code: 'rate_limit',
      message: 'AceData 请求频率超限，请稍后再试',
      details: body,
    };
  }
  
  // 5xx - 服务端错误
  if (status >= 500) {
    return {
      code: 'server_error',
      message: 'AceData 服务异常，请稍后重试',
      details: body,
    };
  }
  
  // 其它错误
  return {
    code: 'unknown',
    message: `AceData API 错误: ${status}`,
    details: body,
  };
}

/**
 * 通用 AceData API 请求函数
 */
export async function acedataFetch<T = unknown>(
  endpoint: string,
  body: Record<string, unknown> = {},
  options: { method?: string; timeout?: number } = {}
): Promise<AceDataResponse<T>> {
  const { method = 'POST', timeout = 180000 } = options; // 默认 3 分钟，音乐生成需要 30-120s
  const baseUrl = getAceDataBase();
  const url = `${baseUrl}${endpoint}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${process.env.ACEDATA_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      return {
        success: false,
        error: parseAceDataError(response.status, data),
      };
    }
    
    return {
      success: true,
      data: data as T,
      task_id: data?.task_id,
      trace_id: data?.trace_id,
    };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error('[AceData] Request aborted (timeout after', timeout, 'ms):', url);
      return {
        success: false,
        error: {
          code: 'server_error',
          message: `AceData 请求超时（${Math.round(timeout / 1000)}s），请稍后重试`,
        },
      };
    }
    
    return {
      success: false,
      error: {
        code: 'server_error',
        message: '网络错误，无法连接到 AceData 服务',
        details: err instanceof Error ? err.message : String(err),
      },
    };
  }
}

/**
 * 查询任务状态
 */
export interface TaskStatus {
  status: 'pending' | 'processing' | 'complete' | 'failed';
  progress?: number;
  data?: Record<string, unknown>;
  error?: AceDataError;
}

export async function getTaskStatus(taskId: string, type: 'music' | 'mv' = 'music'): Promise<AceDataResponse<TaskStatus>> {
  if (type === 'music') {
    const result = await acedataFetch<{ status: string; tasks?: Array<{ status: string; data?: Record<string, unknown> }> }>('/suno/tasks', {
      task_id: taskId,
    });
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    const taskData = result.data;
    const task = taskData?.tasks?.[0];
    const status = task?.status || taskData?.status;
    
    let mappedStatus: TaskStatus['status'] = 'pending';
    if (status === 'complete' || status === 'completed') {
      mappedStatus = 'complete';
    } else if (status === 'failed' || status === 'error') {
      mappedStatus = 'failed';
    } else if (status === 'processing' || status === 'running') {
      mappedStatus = 'processing';
    }
    
    return {
      success: true,
      data: {
        status: mappedStatus,
        data: task?.data,
      },
    };
  }
  
  // MV 任务状态查询（使用 Luma 或其他视频 API）
  const result = await acedataFetch<{ status: string; data?: Record<string, unknown> }>('/luma/tasks', {
    task_id: taskId,
  });
  
  if (!result.success) {
    return { success: false, error: result.error };
  }
  
  const status = result.data?.status;
  let mappedStatus: TaskStatus['status'] = 'pending';
  if (status === 'completed' || status === 'complete') {
    mappedStatus = 'complete';
  } else if (status === 'failed' || status === 'error') {
    mappedStatus = 'failed';
  } else if (status === 'processing' || status === 'running') {
    mappedStatus = 'processing';
  }
  
  return {
    success: true,
    data: {
      status: mappedStatus,
      data: result.data?.data,
    },
  };
}

/**
 * 生成音乐
 */
export interface GenerateMusicParams {
  prompt: string;
  lyric?: string;
  style?: string;
  title?: string;
  model?: string;
  custom?: boolean;
  instrumental?: boolean;
  persona_id?: string;
  wait?: boolean;
  duration?: number;
  vocal_gender?: 'male' | 'female';
}

export interface MusicResult {
  audio_url?: string;
  image_url?: string;
  duration?: number;
  lyric?: string;
  title?: string;
  id?: string;
}

export async function generateMusic(params: GenerateMusicParams): Promise<AceDataResponse<{ task_id?: string; data?: MusicResult[] }>> {
  // 截断 prompt 到 1500 字符
  const truncatedPrompt = params.prompt.slice(0, 1500);
  
  const body: Record<string, unknown> = {
    prompt: truncatedPrompt,
    model: params.model || 'chirp-v4-5',
    action: 'generate',
  };
  
  if (params.lyric) body.lyric = params.lyric;
  if (params.style) body.style = params.style;
  if (params.title) body.title = params.title;
  if (params.custom !== undefined) body.custom = params.custom;
  if (params.instrumental !== undefined) body.instrumental = params.instrumental;
  if (params.persona_id) body.persona_id = params.persona_id;
  if (params.wait !== undefined) body.wait = params.wait;
  if (params.duration !== undefined) body.duration = params.duration;
  if (params.vocal_gender) body.vocal_gender = params.vocal_gender;
  
  console.log('[AceData] Request:', { url: `${getAceDataBase()}/suno/audios`, body });
  
  const result = await acedataFetch<{ task_id?: string; data?: MusicResult[] }>('/suno/audios', body);
  
  if (!result.success) {
    console.error('[AceData] Error response:', JSON.stringify(result.error, null, 2));
  }
  
  return result;
}

/**
 * 生成歌词
 */
export async function generateLyrics(prompt: string): Promise<AceDataResponse<{ lyric?: string; sections?: string[] }>> {
  return acedataFetch<{ lyric?: string; sections?: string[] }>('/suno/lyrics', {
    prompt,
  });
}

/**
 * 音色克隆
 */
export async function cloneVoice(audioId: string, name: string): Promise<AceDataResponse<{ persona_id?: string }>> {
  return acedataFetch<{ persona_id?: string }>('/suno/persona', {
    audio_id: audioId,
    name,
  });
}

/**
 * 生成 MV 视频（使用 Luma 图生视频）
 */
export interface GenerateMVParams {
  image_url: string;
  prompt: string;
  duration?: number;
  audio_url?: string;
}

export async function generateMV(params: GenerateMVParams): Promise<AceDataResponse<{ task_id?: string }>> {
  const body: Record<string, unknown> = {
    image_url: params.image_url,
    prompt: params.prompt,
  };
  
  if (params.duration) body.duration = params.duration;
  if (params.audio_url) body.audio_url = params.audio_url;
  
  return acedataFetch<{ task_id?: string }>('/luma/videos', body);
}
