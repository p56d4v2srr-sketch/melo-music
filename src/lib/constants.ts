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
 * Suno（谱乐 AI yourmusic.fun）模型
 */
export const SUNO_MODEL_V55 = 'chirp-v5.5' as const;

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
