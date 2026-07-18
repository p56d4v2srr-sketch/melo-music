/**
 * 全站统一视觉 token —— 选择器类控件共用样式
 */
export const SELECTION_STYLES = {
  /** 选中态：金框 + 微阴影 */
  selected: 'ring-2 ring-yellow-400/60 shadow-lg shadow-yellow-400/20 bg-yellow-400/[0.03]',
  /** 未选态：细边 + 极浅底 */
  unselected: 'border border-white/10 bg-white/[0.02] hover:border-white/30 transition',
  /** 禁用态 */
  disabled: 'opacity-40 cursor-not-allowed pointer-events-none',
} as const;
