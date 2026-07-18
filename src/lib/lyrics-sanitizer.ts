/**
 * Lyrics Sanitizer - 歌词方括号净化模块
 * 
 * 功能：
 * - 保留结构标签（[Verse], [Chorus], [主歌], [副歌] 等）
 * - 剔除描述词/演唱指示（[温柔地], [钢琴独奏], [女声哼唱] 等）
 * - 处理嵌套方括号、未闭合方括号等边界情况
 */

// 结构标签白名单（英文）
export const STRUCTURE_TAG_WHITELIST: readonly string[] = [
  'verse', 'chorus', 'bridge', 'intro', 'outro',
  'instrumental', 'hook', 'pre-chorus', 'interlude',
  'refrain', 'break', 'solo', 'ad-lib', 'end'
];

// 中文别名映射
const CHINESE_ALIAS_MAP: Record<string, string> = {
  '主歌': 'verse',
  '副歌': 'chorus',
  '前奏': 'intro',
  '尾奏': 'outro',
  '过渡': 'bridge',
  '间奏': 'interlude',
  '纯音乐': 'instrumental',
  '独奏': 'solo'
};

export interface LyricsSegment {
  type: 'text' | 'structure' | 'description';
  content: string;         // 不含方括号
  raw: string;             // 包含方括号的原始片段（结构/描述用）
  start: number;           // 在原字符串中的起始位置
  end: number;             // 结束位置
}

export interface SanitizeResult {
  sanitized: string;        // 净化后可直接发给上游的 lyrics
  segments: LyricsSegment[];// 用于前端高亮渲染
  removedCount: number;     // 被净化剔除的描述词数量
  removedSamples: string[]; // 被剔除内容前 5 条 raw 样例
}

/**
 * 判断 inner 是否为结构标签
 * 规则：
 * 1. 去两侧空格 + 转小写
 * 2. 允许尾部数字/空格+数字/中文数字（如 Verse 1, Chorus 2, 副歌 1）
 * 3. 允许中文别名映射
 * 4. 完全匹配白名单前缀或中文别名 → structure
 */
export function isStructureTag(inner: string): boolean {
  const trimmed = inner.trim().toLowerCase();
  
  // 检查中文别名（先匹配中文，因为中文不会被 toLowerCase 影响）
  const originalTrimmed = inner.trim();
  for (const [cn, en] of Object.entries(CHINESE_ALIAS_MAP)) {
    // 完全匹配中文别名
    if (originalTrimmed === cn) return true;
    // 中文别名 + 数字（如 "主歌 1", "副歌2"）
    if (originalTrimmed.startsWith(cn) && /^[\s\d一二三四五六七八九十]+$/.test(originalTrimmed.slice(cn.length))) {
      return true;
    }
  }
  
  // 检查英文白名单
  for (const tag of STRUCTURE_TAG_WHITELIST) {
    // 完全匹配
    if (trimmed === tag) return true;
    // 白名单标签 + 空格/数字（如 "verse 1", "chorus2"）
    if (trimmed.startsWith(tag)) {
      const rest = trimmed.slice(tag.length);
      if (/^[\s\d一二三四五六七八九十]+$/.test(rest)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * 分析歌词，返回分段列表
 * 处理嵌套方括号：按最外层匹配
 * 处理未闭合方括号：视为普通文本
 */
export function analyzeLyrics(input: string): LyricsSegment[] {
  if (!input) return [];
  
  const segments: LyricsSegment[] = [];
  let pos = 0;
  let textStart = 0;
  
  while (pos < input.length) {
    if (input[pos] === '[') {
      // 找到未闭合的方括号，视为普通文本
      let bracketEnd = input.indexOf(']', pos);
      if (bracketEnd === -1) {
        // 未闭合，整个剩余部分都是文本
        break;
      }
      
      // 处理嵌套：找到最外层的闭合括号
      let depth = 1;
      let i = pos + 1;
      while (i < input.length && depth > 0) {
        if (input[i] === '[') depth++;
        else if (input[i] === ']') depth--;
        i++;
      }
      
      if (depth !== 0) {
        // 未闭合，视为普通文本
        break;
      }
      
      bracketEnd = i - 1; // 最外层 ] 的位置
      
      // 提取方括号内的内容
      const inner = input.slice(pos + 1, bracketEnd);
      const raw = input.slice(pos, bracketEnd + 1);
      
      // 保存之前的文本
      if (pos > textStart) {
        segments.push({
          type: 'text',
          content: input.slice(textStart, pos),
          raw: '',
          start: textStart,
          end: pos
        });
      }
      
      // 判断是结构标签还是描述词
      const type = isStructureTag(inner) ? 'structure' : 'description';
      segments.push({
        type,
        content: inner,
        raw,
        start: pos,
        end: bracketEnd + 1
      });
      
      pos = bracketEnd + 1;
      textStart = pos;
    } else {
      pos++;
    }
  }
  
  // 保存最后的文本
  if (textStart < input.length) {
    segments.push({
      type: 'text',
      content: input.slice(textStart),
      raw: '',
      start: textStart,
      end: input.length
    });
  }
  
  return segments;
}

/**
 * 净化歌词
 * - text 片段原样保留
 * - structure 片段用 raw（含方括号）保留
 * - description 片段丢弃
 */
export function sanitizeLyrics(input: string): SanitizeResult {
  if (!input) {
    return {
      sanitized: '',
      segments: [],
      removedCount: 0,
      removedSamples: []
    };
  }
  
  const segments = analyzeLyrics(input);
  const removedSamples: string[] = [];
  let removedCount = 0;
  
  // 构建净化后的字符串
  const parts: string[] = [];
  for (const seg of segments) {
    if (seg.type === 'text') {
      parts.push(seg.content);
    } else if (seg.type === 'structure') {
      parts.push(seg.raw);
    } else {
      // description - 被剔除
      removedCount++;
      if (removedSamples.length < 5) {
        removedSamples.push(seg.raw);
      }
    }
  }
  
  // 合并并处理首尾空白
  let sanitized = parts.join('');
  // 首尾可以 trim，但内部不 trim
  sanitized = sanitized.trim();
  
  return {
    sanitized,
    segments,
    removedCount,
    removedSamples
  };
}

/**
 * UI-friendly analysis result
 */
export interface LyricsAnalysisUI {
  hasBrackets: boolean;
  bracketTags: string[];
  structureTags: string[];
  descriptionTags: string[];
  warningText: string;
}

/**
 * Analyze lyrics for UI display
 * Returns a UI-friendly summary of bracket tags found in the lyrics
 */
export function analyzeLyricsForUI(input: string): LyricsAnalysisUI {
  if (!input) {
    return { hasBrackets: false, bracketTags: [], structureTags: [], descriptionTags: [], warningText: '' };
  }
  
  const segments = analyzeLyrics(input);
  const bracketTags: string[] = [];
  const structureTags: string[] = [];
  const descriptionTags: string[] = [];
  
  for (const seg of segments) {
    if (seg.type === 'structure' || seg.type === 'description') {
      bracketTags.push(seg.raw);
      if (seg.type === 'structure') {
        structureTags.push(seg.raw);
      } else {
        descriptionTags.push(seg.raw);
      }
    }
  }
  
  const hasBrackets = bracketTags.length > 0;
  const warningText = hasBrackets
    ? `检测到 ${bracketTags.length} 个方括号标签，生成时将自动净化`
    : '';
  
  return { hasBrackets, bracketTags, structureTags, descriptionTags, warningText };
}
