/**
 * Music Provider 抽象层
 * 定义统一的音乐生成接口，支持多 provider 扩展
 * 当前仅实装 AceData，未来接入新 provider 时在 getMusicProvider() 加分支
 */

export interface GenerateParams {
  prompt: string;
  lyric?: string;
  style?: string;
  model_version: string; // v5-5 / v5 / v4-5-plus / v4-5 / v4
  custom_mode?: boolean;
  instrumental?: boolean;
  vocal_gender?: 'male' | 'female' | 'auto';
  title?: string;
  duration?: number;
  language?: string;
  emotion?: string;
  is_public?: boolean;
  cover_style?: string;
  [key: string]: unknown;
}

export interface GenerateResult {
  task_id: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  provider: string;         // 例如 'acedata' / 'demo'
  model_version: string;    // 用户请求的版本
  actual_model?: string;    // 实际下发到底层 API 的模型（如 'chirp-v4'）
  warning?: string;         // 例如 'AceData 当前仅支持 v4，其他版本待接入新 provider 后启用'
  data?: unknown;           // 兼容当前返回结构
}

export interface ProviderTaskStatus {
  task_id: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  provider: string;
  songs?: Array<{
    id: string;
    title: string;
    audio_url?: string;
    image_url?: string;
    lyric?: string;
    duration?: number;
    [key: string]: unknown;
  }>;
  error?: string;
}

export interface MusicProvider {
  name: string;
  generate(params: GenerateParams): Promise<GenerateResult>;
  queryTask(taskId: string): Promise<ProviderTaskStatus>;
}

// 单实装工厂：目前只有 AceData
// 未来接入新 provider 时再在这里加分支
export function getMusicProvider(): MusicProvider {
  // 延迟导入避免循环依赖
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { AceDataProvider } = require('./acedata');
  return new AceDataProvider();
}
