/**
 * Music Provider 抽象层
 * 定义统一的音乐生成接口，支持多 provider 扩展
 * 支持 MiniMax（默认）、AceData、DMXAPI 三个 provider，通过 MUSIC_PROVIDER 环境变量切换
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

// 工厂：根据 MUSIC_PROVIDER 环境变量切换 provider
// 'minimax' → MiniMaxProvider（默认，需 DMXAPI_API_KEY，同步返回 WAV）
// 'dmxapi'  → DmxApiProvider（Suno 通道，需 DMXAPI_API_KEY）
// 'acedata' → AceDataProvider（需 ACEDATA_API_KEY）
// 'mureka'  → MurekaProvider（昆仑万维，需 MUREKA_API_KEY，待 API 文档确认）
// 未设置/其他 → MiniMaxProvider（默认）
export function getMusicProvider(): MusicProvider {
  const provider = (process.env.MUSIC_PROVIDER || 'minimax').toLowerCase().trim();
  console.log('[getMusicProvider] MUSIC_PROVIDER env:', process.env.MUSIC_PROVIDER, '→ resolved:', provider);
  if (provider === 'dmxapi') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DmxApiProvider } = require('./dmxapi');
    return new DmxApiProvider();
  }
  if (provider === 'acedata') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AceDataProvider } = require('./acedata');
    return new AceDataProvider();
  }
  if (provider === 'mureka') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { MurekaProvider } = require('./mureka');
    return new MurekaProvider();
  }
  // 默认走 MiniMax（同步返回 WAV 无损音频）
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MiniMaxProvider } = require('./minimax');
  return new MiniMaxProvider();
}
