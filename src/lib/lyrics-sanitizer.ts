const BRACKET_TAG_RE = /\[[^\]]+\]/g;

export interface SanitizeResult {
  cleaned: string;            // 原样透传，等于输入
  bracketTags: string[];      // 所有方括号标签原文列表，给 UI 展示用
  structureTagCount: number;
  totalLines: number;
}

/**
 * 歌词预处理：识别方括号标签（结构 / 配器 / 氛围描述），全部原样保留，
 * 不做任何词汇过滤或替换。方括号标签仅供 AI 创作参考，不会被演唱。
 */
export function sanitizeLyrics(input: string): SanitizeResult {
  const text = String(input ?? '');
  const tags = text.match(BRACKET_TAG_RE) ?? [];
  const totalLines = text ? text.split('\n').filter(l => l.trim().length > 0).length : 0;
  return {
    cleaned: text,
    bracketTags: tags,
    structureTagCount: tags.length,
    totalLines,
  };
}

// 兼容 page.tsx 之前的调用签名
export const analyzeLyrics = sanitizeLyrics;
export type LyricsSegment = SanitizeResult;
