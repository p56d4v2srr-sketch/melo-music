/**
 * 音色描述词 chip 数据
 * 用于 Suno tab 下的音色选择器
 */

export interface VocalTimbre {
  emoji: string;
  label: string;
  tag: string;
}

export const VOCAL_TIMBRES: VocalTimbre[] = [
  { emoji: '🌸', label: '柔美', tag: 'soft & gentle' },
  { emoji: '🔥', label: '沙哑', tag: 'raspy vocal' },
  { emoji: '✨', label: '清亮', tag: 'clear & bright' },
  { emoji: '🌑', label: '低沉', tag: 'deep & husky' },
  { emoji: '🎭', label: '戏腔', tag: 'chinese opera vocal' },
  { emoji: '👼', label: '童声', tag: 'childlike vocal' },
  { emoji: '🌊', label: '空灵', tag: 'ethereal & airy' },
  { emoji: '🎤', label: '磁性', tag: 'magnetic baritone' },
  { emoji: '💫', label: '慵懒', tag: 'lazy & smoky' },
  { emoji: '🎶', label: '甜美', tag: 'sweet & sugary' },
  { emoji: '🔊', label: '高亢', tag: 'powerful & belting' },
  { emoji: '🕯️', label: '呢喃', tag: 'whispery & intimate' },
];
