/**
 * DeepSeek API 工具函数
 * 封装 DeepSeek Chat Completions API 调用
 */

// DeepSeek System Prompts
export const LYRICS_SYSTEM_PROMPT = `你是一位专业的华语流行音乐词作家，擅长创作有画面感、有情感张力的中文歌词。

请根据用户提供的主题描述、曲风、情感基调，创作一首完整的中文歌词。

要求：
1. 输出结构化歌词，必须包含区块标记，例如：[Verse 1] [Chorus] [Verse 2] [Chorus] [Bridge] [Outro]
2. 主歌（Verse）4-6 行，副歌（Chorus）4-6 行，桥段（Bridge）2-4 行
3. 副歌要有记忆点、押韵、情感高潮
4. 意象具体、画面感强，避免空泛口号
5. 总长度不超过 5000 字符
6. 只输出歌词正文，不要额外解释、不要 markdown 代码块包裹

严格按照区块标记格式输出，方便前端识别渲染。`;

export const ANALYZE_SYSTEM_PROMPT = `你是一位资深的音乐评论家兼文学评论人，擅长从主题、情感、意象、韵律四个维度深度分析中文歌词。

请对用户提供的歌词做深度分析，输出严格的 JSON（不要 markdown 代码块包裹），字段如下：

{
  "theme": "主题解读，80-150 字，说清歌词讲了什么故事、传达什么核心思想",
  "emotion_arc": "情感走向分析，80-150 字，描述情绪从开头到结尾的变化曲线",
  "imagery_highlights": ["意象亮点 1", "意象亮点 2", "意象亮点 3"],
  "rhyme_evaluation": "韵律评价，60-120 字，评价押韵、节奏感、可唱性",
  "scores": {
    "theme": 0-100 的整数,
    "emotion": 0-100 的整数,
    "imagery": 0-100 的整数,
    "rhyme": 0-100 的整数,
    "overall": 0-100 的整数（综合评分，非简单平均）
  },
  "one_line_verdict": "一句话总评，20-40 字，带情感倾向"
}

严格输出 JSON，不要任何额外文字、不要 markdown 包裹。`;

// 错误类型
export type DeepSeekErrorCode =
  | 'invalid_key'
  | 'insufficient_balance'
  | 'rate_limit'
  | 'server_error'
  | 'timeout'
  | 'unknown';

export interface DeepSeekError {
  code: DeepSeekErrorCode;
  message: string;
  details?: unknown;
}

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekChatOptions {
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' };
  stream?: boolean;
}

export interface DeepSeekChatResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 解析 DeepSeek API 错误
 */
function parseDeepSeekError(error: unknown): DeepSeekError {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('timeout') || message.includes('aborted')) {
      return { code: 'timeout', message: 'DeepSeek 请求超时，请稍后重试' };
    }
    
    if (message.includes('401') || message.includes('unauthorized')) {
      return { code: 'invalid_key', message: 'DeepSeek API Key 无效或已过期' };
    }
    
    if (message.includes('402') || message.includes('insufficient balance') || message.includes('余额不足')) {
      return { code: 'insufficient_balance', message: 'DeepSeek 账户额度不足，请充值' };
    }
    
    if (message.includes('429') || message.includes('rate limit')) {
      return { code: 'rate_limit', message: 'DeepSeek 请求频率超限，请稍后再试' };
    }
    
    if (message.includes('5') && message.includes('0') || message.includes('server error')) {
      return { code: 'server_error', message: 'DeepSeek 服务异常，请稍后重试' };
    }
    
    return { code: 'unknown', message: error.message, details: error };
  }
  
  return { code: 'unknown', message: '未知错误', details: error };
}

/**
 * 调用 DeepSeek Chat Completions API
 */
export async function deepseekChat(options: DeepSeekChatOptions): Promise<DeepSeekChatResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const apiBase = process.env.DEEPSEEK_API_BASE || 'https://api.deepseek.com';
  
  if (!apiKey || apiKey.trim() === '') {
    throw { code: 'invalid_key' as DeepSeekErrorCode, message: 'DeepSeek API Key 未配置' };
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 秒超时
  
  try {
    const response = await fetch(`${apiBase}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: options.messages,
        temperature: options.temperature ?? 0.9,
        max_tokens: options.max_tokens ?? 2048,
        stream: options.stream ?? false,
        ...(options.response_format && { response_format: options.response_format }),
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData: unknown;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = errorText;
      }
      
      const error = new Error(`DeepSeek API error: ${response.status} ${JSON.stringify(errorData)}`);
      throw parseDeepSeekError(error);
    }
    
    const data: DeepSeekChatResponse = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error && typeof error === 'object' && 'code' in error) {
      throw error; // 已经是 DeepSeekError
    }
    
    throw parseDeepSeekError(error);
  }
}

/**
 * 解析歌词区块
 * 将歌词文本按 [Verse 1] [Chorus] 等标记拆分成 sections 数组
 */
export interface LyricSection {
  type: 'verse' | 'chorus' | 'bridge' | 'outro' | 'pre-chorus' | 'intro';
  index: number;
  content: string;
}

export function parseLyricSections(rawLyric: string): LyricSection[] {
  const sections: LyricSection[] = [];
  
  // 匹配 [Verse 1] [Chorus] [Bridge] [Outro] [Pre-Chorus] [Intro] 等标记
  const sectionRegex = /\[(Verse|Chorus|Bridge|Outro|Pre-Chorus|Intro)\s*(\d*)\]/gi;
  
  const matches = [...rawLyric.matchAll(sectionRegex)];
  
  if (matches.length === 0) {
    // 没有标记，整段作为一个 verse
    sections.push({
      type: 'verse',
      index: 1,
      content: rawLyric.trim(),
    });
    return sections;
  }
  
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const type = match[1].toLowerCase() as LyricSection['type'];
    const index = match[2] ? parseInt(match[2], 10) : 1;
    
    const startIdx = match.index! + match[0].length;
    const endIdx = i < matches.length - 1 ? matches[i + 1].index! : rawLyric.length;
    
    const content = rawLyric.slice(startIdx, endIdx).trim();
    
    if (content) {
      sections.push({ type, index, content });
    }
  }
  
  return sections;
}

/**
 * 获取错误对应的友好提示
 */
export function getDeepSeekErrorMessage(code: DeepSeekErrorCode): string {
  const messages: Record<DeepSeekErrorCode, string> = {
    invalid_key: 'DeepSeek API Key 无效或已过期，请检查配置',
    insufficient_balance: 'DeepSeek 账户额度不足，请前往平台充值',
    rate_limit: '请求频率超限，请稍后再试',
    server_error: 'DeepSeek 服务异常，请稍后重试',
    timeout: '请求超时，请稍后重试',
    unknown: '未知错误，请稍后重试',
  };
  return messages[code];
}
