/**
 * Provider 模型常量集中管理
 * 避免字面串散落到 UI 层导致 400003 等错误
 */

/**
 * MiniMax 模型
 */
export const MINIMAX_MODEL = 'music-2.0' as const;

/**
 * PuLe（天谱乐 tianpuyue.cn）模型
 * V5.8: 实测有效 model 字面串为 'TemPolor v4.5'（v4.6 不存在，上游返回 400003）
 * 其他有效值：'TemPolor v4.0'、'TemPolor v3.5'、'TemPolor v3'
 */
export const PULE_MODEL = 'TemPolor v4.5' as const;

/**
 * Suno（谱乐 AI yourmusic.fun）版本枚举
 * V5.8: 上游探测 5 个版本全部有效（返回 insufficient_credits 而非 invalid model）
 */
export const SUNO_VERSIONS = [
  { value: 'chirp-v3-5', label: 'Suno v3.5', desc: '经典款，快速稳定' },
  { value: 'chirp-v4', label: 'Suno v4', desc: '编曲更饱满' },
  { value: 'chirp-v4-5', label: 'Suno v4.5', desc: '中英双语加强' },
  { value: 'chirp-v5', label: 'Suno v5', desc: '综合最佳' },
  { value: 'chirp-v5-5', label: 'Suno v5.5', desc: '最新版·风格更狂野' },
] as const;

export const DEFAULT_SUNO_VERSION = 'chirp-v5' as const;

/**
 * @deprecated 使用 DEFAULT_SUNO_VERSION 代替
 */
export const SUNO_MODEL_V55 = 'chirp-v5.5' as const;

/**
 * 音色 chip 最大可选数量
 */
export const MAX_TIMBRE_CHIP_SELECTED = 3;

/**
 * Provider 标识（DB 落库 + UI 判分支用）
 */
export const PROVIDER_MINIMAX = 'minimax' as const;
export const PROVIDER_PULE = 'pule' as const;
export const PROVIDER_SUNO = 'suno' as const;

export type ProviderKey =
  | typeof PROVIDER_MINIMAX
  | typeof PROVIDER_PULE
  | typeof PROVIDER_SUNO;

/**
 * 所有模型名的枚举（供 UI 显示、type-safe check）
 */
export const ALL_MODEL_NAMES = {
  minimax: MINIMAX_MODEL,
  pule: PULE_MODEL,
  suno: SUNO_MODEL_V55,
} as const;
