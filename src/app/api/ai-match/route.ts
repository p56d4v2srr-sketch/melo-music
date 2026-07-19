import { NextResponse } from 'next/server';
import { getAllSingers, type SingerStyle } from '@/lib/singer-styles';
import { musicStyles, type MusicStyle, type SubStyle } from '@/lib/music-styles';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface AIRecommendation {
  singers: Array<{
    id: string;
    name: string;
    nameEn: string;
    reason: string;
    matchScore: number;
  }>;
  genres: Array<{
    id: string;
    name: string;
    nameEn: string;
    parentId: string;
    parentName: string;
    reason: string;
    matchScore: number;
  }>;
  emotions: string[];
  themes: string[];
}

// Emotion keywords mapping
const emotionKeywords: Record<string, string[]> = {
  '悲伤': ['泪', '哭', '伤', '痛', '离', '别', '散', '忘', '忆', 'sad', 'cry', 'tear', 'pain', 'miss', 'lonely', 'alone', 'heart'],
  '快乐': ['笑', '乐', '欢', '喜', '开', 'happy', 'joy', 'smile', 'laugh', 'fun', 'dance', 'party'],
  '浪漫': ['爱', '恋', '情', '吻', '抱', 'love', 'kiss', 'romance', 'heart', 'darling', 'baby', 'sweet'],
  '愤怒': ['恨', '怒', '火', '杀', '死', 'angry', 'hate', 'rage', 'fire', 'fight', 'war', 'kill'],
  '思念': ['想', '念', '思', '盼', '望', 'miss', 'think', 'wait', 'hope', 'wish', 'remember'],
  '孤独': ['独', '单', '孤', '寂', 'lonely', 'alone', 'empty', 'silence', 'quiet'],
  '自由': ['飞', '风', '天', '云', '自', 'free', 'fly', 'wind', 'sky', 'cloud', 'run', 'escape'],
  '力量': ['强', '力', '勇', '敢', '战', 'strong', 'power', 'brave', 'fight', 'warrior', 'hero'],
  '迷茫': ['迷', '惑', '乱', 'confused', 'lost', 'confuse', 'direction', 'way', 'where'],
  '希望': ['光', '明', '希', '望', '梦', 'hope', 'light', 'dream', 'future', 'believe'],
};

// Genre keywords mapping
const genreKeywords: Record<string, string[]> = {
  'pop': ['流行', '大众', '朗朗上口', 'pop', 'mainstream', 'catchy', '旋律', '好听'],
  'rock': ['摇滚', '叛逆', '吉他', 'rock', 'guitar', 'punk', 'rebel', '力量', '爆发'],
  'electronic': ['电子', '合成', '节拍', 'electronic', 'synth', 'beat', 'techno', 'house', 'edm', '舞曲'],
  'hiphop': ['说唱', 'rap', 'hiphop', '嘻哈', '节奏', 'flow', '韵脚', 'beat', '街头'],
  'rnb': ['rnb', '节奏蓝调', '灵魂', 'soul', 'groove', '转音', '律动'],
  'chinese-style': ['国风', '古风', '中国', '传统', '古典', 'chinese', 'traditional', '东方', '琴', '笛', '诗'],
  'folk': ['民谣', '木吉他', '清新', 'folk', 'acoustic', '吉他', '故事', '叙事', '简单'],
  'jazz': ['爵士', '即兴', '摇摆', 'jazz', 'swing', 'improv', '萨克斯', 'blue'],
  'classical': ['古典', '交响', '钢琴', 'classical', 'symphony', 'piano', 'orchestra', '优雅'],
  'country': ['乡村', '田园', 'country', 'western', '牛仔', '吉他', '故事'],
  'metal': ['金属', '重金属', 'metal', 'heavy', '嘶吼', '双踩', '极端'],
  'ambient': ['氛围', '环境', 'ambient', '冥想', '放松', '背景', '沉浸'],
};

// Language detection
function detectLanguage(text: string): string {
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const japaneseChars = (text.match(/[\u3040-\u309f\u30a0-\u30ff]/g) || []).length;
  const koreanChars = (text.match(/[\uac00-\ud7af]/g) || []).length;
  const totalChars = text.replace(/\s/g, '').length;
  
  if (totalChars === 0) return 'unknown';
  
  const chineseRatio = chineseChars / totalChars;
  const japaneseRatio = japaneseChars / totalChars;
  const koreanRatio = koreanChars / totalChars;
  
  if (japaneseRatio > 0.1) return 'japanese';
  if (koreanRatio > 0.1) return 'korean';
  if (chineseRatio > 0.3) return 'chinese';
  return 'english';
}

// Detect emotions from text
function detectEmotions(text: string): string[] {
  const lowerText = text.toLowerCase();
  const detected: string[] = [];
  
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    const matchCount = keywords.filter(kw => lowerText.includes(kw)).length;
    if (matchCount >= 2) {
      detected.push(emotion);
    }
  }
  
  return detected.length > 0 ? detected : ['中性'];
}

// Detect genres from text
function detectGenres(text: string): Array<{ id: string; score: number }> {
  const lowerText = text.toLowerCase();
  const scores: Array<{ id: string; score: number }> = [];
  
  for (const [genre, keywords] of Object.entries(genreKeywords)) {
    const matchCount = keywords.filter(kw => lowerText.includes(kw)).length;
    if (matchCount > 0) {
      scores.push({ id: genre, score: matchCount });
    }
  }
  
  return scores.sort((a, b) => b.score - a.score);
}

// Match singers based on detected characteristics
function matchSingers(emotions: string[], genres: string[], language: string, count: number = 5): SingerStyle[] {
  const allSingers = getAllSingers();
  const scored = allSingers.map(singer => {
    let score = 0;
    
    // Language match
    if (language === 'chinese' && singer.region === 'chinese') score += 3;
    if (language === 'japanese' && singer.region === 'japanese') score += 3;
    if (language === 'korean' && singer.region === 'korean') score += 3;
    if (language === 'english' && singer.region === 'western') score += 3;
    
    // Tag match with emotions
    for (const emotion of emotions) {
      if (singer.tags.some(t => t.includes(emotion))) score += 2;
    }
    
    // Tag match with genres
    for (const genre of genres) {
      if (singer.tags.some(t => t.toLowerCase().includes(genre))) score += 2;
    }
    
    // Technique match
    if (emotions.includes('悲伤') && singer.techniques.some(t => t.includes('情感'))) score += 1;
    if (emotions.includes('力量') && singer.techniques.some(t => t.includes('高音'))) score += 1;
    
    return { singer, score };
  });
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(s => s.singer);
}

// Match genres based on detected characteristics
function matchGenres(detectedGenres: Array<{ id: string; score: number }>, count: number = 3): Array<{ parent: MusicStyle; sub: SubStyle }> {
  const results: Array<{ parent: MusicStyle; sub: SubStyle; score: number }> = [];
  
  for (const { id, score } of detectedGenres.slice(0, 5)) {
    const parent = musicStyles.find(m => m.id === id);
    if (parent && parent.subStyles.length > 0) {
      // Pick a random sub-style or the most relevant one
      const subIndex = Math.floor(Math.random() * Math.min(3, parent.subStyles.length));
      results.push({
        parent,
        sub: parent.subStyles[subIndex],
        score,
      });
    }
  }
  
  // If not enough matches, add some popular defaults
  if (results.length < count) {
    const defaults = ['pop', 'chinese-style', 'folk'];
    for (const defaultId of defaults) {
      if (results.length >= count) break;
      if (results.some(r => r.parent.id === defaultId)) continue;
      
      const parent = musicStyles.find(m => m.id === defaultId);
      if (parent && parent.subStyles.length > 0) {
        results.push({
          parent,
          sub: parent.subStyles[0],
          score: 1,
        });
      }
    }
  }
  
  return results.slice(0, count);
}

// Generate reason for singer recommendation
function generateSingerReason(singer: SingerStyle, emotions: string[], language: string): string {
  const reasons: string[] = [];
  
  if (language === 'chinese' && singer.region === 'chinese') {
    reasons.push('中文歌曲匹配华语歌手');
  } else if (language === 'japanese' && singer.region === 'japanese') {
    reasons.push('日文歌曲匹配日系歌手');
  } else if (language === 'korean' && singer.region === 'korean') {
    reasons.push('韩文歌曲匹配韩系歌手');
  }
  
  for (const emotion of emotions.slice(0, 2)) {
    if (singer.tags.some(t => t.includes(emotion))) {
      reasons.push(`擅长${emotion}风格演绎`);
    }
  }
  
  if (singer.techniques.some(t => t.includes('情感'))) {
    reasons.push('情感表达细腻');
  }
  
  if (reasons.length === 0) {
    reasons.push('声线与歌曲风格契合');
  }
  
  return reasons.join('，');
}

// Generate reason for genre recommendation
function generateGenreReason(parent: MusicStyle, sub: SubStyle, emotions: string[]): string {
  const reasons: string[] = [];
  
  if (sub.description) {
    reasons.push(sub.description);
  } else {
    reasons.push(`${parent.name}风格，${sub.name}特色`);
  }
  
  if (emotions.includes('悲伤') && ['chinese-style', 'folk', 'ambient'].includes(parent.id)) {
    reasons.push('适合表达忧伤情绪');
  } else if (emotions.includes('快乐') && ['pop', 'electronic', 'dance'].includes(parent.id)) {
    reasons.push('节奏明快，适合欢快氛围');
  } else if (emotions.includes('力量') && ['rock', 'metal', 'hiphop'].includes(parent.id)) {
    reasons.push('充满力量感');
  }
  
  return reasons.join('，');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lyrics, description, songName } = body;
    
    // Combine all text for analysis
    const fullText = [lyrics, description, songName].filter(Boolean).join(' ');
    
    if (!fullText.trim()) {
      return NextResponse.json({
        success: false,
        error: '请提供歌词、描述或歌名',
      });
    }
    
    // Detect language
    const language = detectLanguage(fullText);
    
    // Detect emotions
    const emotions = detectEmotions(fullText);
    
    // Detect genres
    const detectedGenres = detectGenres(fullText);
    
    // Match singers
    const matchedSingers = matchSingers(emotions, detectedGenres.map(g => g.id), language, 5);
    
    // Match genres
    const matchedGenres = matchGenres(detectedGenres, 3);
    
    // Build response
    const recommendation: AIRecommendation = {
      singers: matchedSingers.map((singer, index) => ({
        id: singer.id,
        name: singer.name,
        nameEn: singer.nameEn,
        reason: generateSingerReason(singer, emotions, language),
        matchScore: Math.max(0.5, 1 - index * 0.1),
      })),
      genres: matchedGenres.map(({ parent, sub }, index) => ({
        id: sub.id,
        name: sub.name,
        nameEn: sub.nameEn,
        parentId: parent.id,
        parentName: parent.name,
        reason: generateGenreReason(parent, sub, emotions),
        matchScore: Math.max(0.5, 1 - index * 0.15),
      })),
      emotions,
      themes: emotions.slice(0, 3),
    };
    
    return NextResponse.json({
      success: true,
      data: recommendation,
    });
  } catch (error) {
    console.error('AI match error:', error);
    return NextResponse.json({
      success: false,
      error: 'AI 推荐失败',
    });
  }
}
