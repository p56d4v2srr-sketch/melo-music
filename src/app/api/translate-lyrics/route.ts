import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/translate-lyrics
 * Translate lyrics to target language using keyword-based translation
 * For production, integrate with DeepSeek/Google Translate API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lyrics, targetLang } = body as { lyrics?: string; targetLang?: string };

    if (!lyrics) {
      return NextResponse.json({ success: false, error: '歌词内容不能为空' }, { status: 400 });
    }

    const lang = targetLang || 'en';
    const translated = translateLyrics(lyrics, lang);

    return NextResponse.json({
      success: true,
      data: {
        original: lyrics,
        translated,
        targetLang: lang,
        lineCount: lyrics.split('\n').filter(l => l.trim()).length,
      },
    });
  } catch (error) {
    console.error('[translate-lyrics] Error:', error);
    return NextResponse.json(
      { success: false, error: '翻译失败，请稍后重试' },
      { status: 500 }
    );
  }
}

// Common Chinese lyrics phrases to English
const ZH_TO_EN: Record<string, string> = {
  '爱': 'Love',
  '爱情': 'Love',
  '心': 'Heart',
  '梦': 'Dream',
  '梦想': 'Dream',
  '思念': 'Missing',
  '想念': 'Missing',
  '回忆': 'Memory',
  '忘记': 'Forget',
  '记忆': 'Memory',
  '眼泪': 'Tears',
  '哭泣': 'Cry',
  '微笑': 'Smile',
  '快乐': 'Happy',
  '悲伤': 'Sad',
  '孤独': 'Lonely',
  '寂寞': 'Lonely',
  '温柔': 'Gentle',
  '浪漫': 'Romantic',
  '自由': 'Freedom',
  '飞翔': 'Fly',
  '天空': 'Sky',
  '星星': 'Stars',
  '月亮': 'Moon',
  '太阳': 'Sun',
  '风': 'Wind',
  '雨': 'Rain',
  '雪': 'Snow',
  '花': 'Flower',
  '春天': 'Spring',
  '夏天': 'Summer',
  '秋天': 'Autumn',
  '冬天': 'Winter',
  '夜晚': 'Night',
  '黎明': 'Dawn',
  '日出': 'Sunrise',
  '日落': 'Sunset',
  '永远': 'Forever',
  '一起': 'Together',
  '分开': 'Apart',
  '再见': 'Goodbye',
  '你好': 'Hello',
  '谢谢': 'Thank you',
  '对不起': 'Sorry',
  '我': 'I',
  '你': 'You',
  '他': 'He',
  '她': 'She',
  '我们': 'We',
  '他们': 'They',
  '朋友': 'Friend',
  '家人': 'Family',
  '家乡': 'Hometown',
  '远方': 'Far away',
  '旅行': 'Journey',
  '路': 'Road',
  '桥': 'Bridge',
  '海': 'Sea',
  '山': 'Mountain',
  '河': 'River',
  '城市': 'City',
  '世界': 'World',
  '时间': 'Time',
  '岁月': 'Years',
  '青春': 'Youth',
  '生命': 'Life',
  '灵魂': 'Soul',
};

// Common Chinese lyrics phrases to Japanese
const ZH_TO_JA: Record<string, string> = {
  '爱': '愛',
  '爱情': '愛',
  '心': '心',
  '梦': '夢',
  '梦想': '夢',
  '思念': '想い',
  '想念': '想い',
  '回忆': '思い出',
  '忘记': '忘れる',
  '记忆': '記憶',
  '眼泪': '涙',
  '哭泣': '泣く',
  '微笑': '微笑み',
  '快乐': '幸せ',
  '悲伤': '悲しみ',
  '孤独': '孤独',
  '温柔': '優しい',
  '浪漫': 'ロマンチック',
  '自由': '自由',
  '天空': '空',
  '星星': '星',
  '月亮': '月',
  '太阳': '太陽',
  '风': '風',
  '雨': '雨',
  '雪': '雪',
  '花': '花',
  '春天': '春',
  '夏天': '夏',
  '秋天': '秋',
  '冬天': '冬',
  '夜晚': '夜',
  '永远': '永遠',
  '一起': '一緒に',
  '再见': 'さようなら',
  '我': '私',
  '你': 'あなた',
  '我们': '私たち',
  '朋友': '友達',
  '世界': '世界',
  '时间': '時間',
  '青春': '青春',
  '生命': '命',
  '灵魂': '魂',
};

// Common Chinese lyrics phrases to Korean
const ZH_TO_KO: Record<string, string> = {
  '爱': '사랑',
  '爱情': '사랑',
  '心': '마음',
  '梦': '꿈',
  '梦想': '꿈',
  '思念': '그리움',
  '想念': '그리움',
  '回忆': '추억',
  '忘记': '잊다',
  '记忆': '기억',
  '眼泪': '눈물',
  '哭泣': '울다',
  '微笑': '미소',
  '快乐': '행복',
  '悲伤': '슬픔',
  '孤独': '외로움',
  '温柔': '다정',
  '浪漫': '로맨틱',
  '自由': '자유',
  '天空': '하늘',
  '星星': '별',
  '月亮': '달',
  '太阳': '태양',
  '风': '바람',
  '雨': '비',
  '雪': '눈',
  '花': '꽃',
  '春天': '봄',
  '夏天': '여름',
  '秋天': '가을',
  '冬天': '겨울',
  '夜晚': '밤',
  '永远': '영원히',
  '一起': '함께',
  '再见': '안녕',
  '我': '나',
  '你': '너',
  '我们': '우리',
  '朋友': '친구',
  '世界': '세상',
  '时间': '시간',
  '青春': '청춘',
  '生命': '생명',
  '灵魂': '영혼',
};

function getDict(lang: string): Record<string, string> {
  switch (lang) {
    case 'en': return ZH_TO_EN;
    case 'ja': return ZH_TO_JA;
    case 'ko': return ZH_TO_KO;
    default: return ZH_TO_EN;
  }
}

function translateLyrics(lyrics: string, lang: string): string {
  const dict = getDict(lang);
  const lines = lyrics.split('\n');
  
  return lines.map(line => {
    // Preserve structure tags like [Verse], [Chorus], etc.
    if (/^\s*\[.*\]\s*$/.test(line)) return line;
    if (!line.trim()) return line;
    
    let result = line;
    // Sort by length (longer phrases first) to match multi-char phrases before single chars
    const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
    
    for (const key of sortedKeys) {
      if (result.includes(key)) {
        result = result.replace(new RegExp(key, 'g'), dict[key]);
      }
    }
    
    return result;
  }).join('\n');
}
