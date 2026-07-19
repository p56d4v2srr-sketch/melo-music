import { NextRequest, NextResponse } from 'next/server';
import { GENRES, type Genre } from '@/data/genres';
import { ARTISTS } from '@/data/artists';

// 心情关键词 → 曲风 oneLiner / category 映射
const MOOD_KEYWORDS: Record<string, string[]> = {
  '开心': ['欢快', '甜蜜', '活泼', '元气', '青春'],
  '快乐': ['欢快', '甜蜜', '活泼', '元气'],
  '高兴': ['欢快', '甜蜜', '活泼'],
  '兴奋': ['激昂', '热烈', '力量', '高能量'],
  '激动': ['激昂', '热烈', '力量'],
  '悲伤': ['悲伤', '忧郁', '深情', '凄美', '哀伤'],
  '伤心': ['悲伤', '忧郁', '深情', '凄美'],
  '难过': ['悲伤', '忧郁', '深情'],
  '忧郁': ['忧郁', '阴暗', '悲伤', '沉思'],
  '愤怒': ['愤怒', '激烈', '力量', '高能量', '激昂'],
  '生气': ['愤怒', '激烈', '力量'],
  '浪漫': ['浪漫', '甜蜜', '温柔', '梦幻', '柔美'],
  '甜蜜': ['甜蜜', '浪漫', '温柔', '甜美'],
  '温柔': ['温柔', '柔美', '宁静', '治愈', '梦幻'],
  '安静': ['宁静', '沉思', '治愈', '空灵', '温柔'],
  '平静': ['宁静', '沉思', '治愈', '空灵'],
  '放松': ['治愈', '宁静', '慵懒', '轻松', '舒适'],
  '慵懒': ['慵懒', '放松', '舒适', '柔和'],
  '孤独': ['孤独', '沉思', '忧郁', '空灵'],
  '寂寞': ['孤独', '沉思', '忧郁'],
  '思念': ['思念', '深情', '怀旧', '温柔'],
  '怀旧': ['怀旧', '复古', '经典'],
  '回忆': ['怀旧', '复古', '经典', '思念'],
  '力量': ['力量', '激昂', '热烈', '高能量'],
  '坚强': ['力量', '激昂', '高能量'],
  '自信': ['力量', '自信', '激昂', '酷炫'],
  '酷炫': ['酷炫', '力量', '自信', '激烈'],
  '神秘': ['神秘', '阴暗', '空灵', '梦幻'],
  '梦幻': ['梦幻', '空灵', '柔美', '神秘'],
  '空灵': ['空灵', '梦幻', '宁静', '神秘'],
  '热血': ['激昂', '热烈', '力量', '高能量'],
  '战斗': ['激昂', '力量', '激烈', '高能量'],
  '自由': ['自由', '轻松', '欢快', '空灵'],
  '旅行': ['轻松', '自由', '欢快', '治愈'],
  '夜晚': ['慵懒', '浪漫', '神秘', '柔和', '梦幻'],
  '深夜': ['慵懒', '沉思', '忧郁', '空灵'],
  '派对': ['欢快', '高能量', '活泼', '热烈', '动感'],
  '跳舞': ['欢快', '高能量', '动感', '活泼'],
  '运动': ['高能量', '力量', '激昂', '动感'],
  '学习': ['宁静', '治愈', '轻松', '沉思'],
  '工作': ['轻松', '宁静', '专注', '治愈'],
  '冥想': ['空灵', '宁静', '治愈', '神秘'],
  '春天': ['欢快', '清新', '浪漫', '温柔'],
  '夏天': ['欢快', '高能量', '活泼', '热烈'],
  '秋天': ['怀旧', '温柔', '思念', '柔和'],
  '冬天': ['宁静', '温柔', '孤独', '治愈'],
  '阳光': ['欢快', '明亮', '温暖'],
  '黑暗': ['阴暗', '神秘', '激烈', '愤怒'],
  '爱情': ['浪漫', '甜蜜', '温柔', '深情'],
  '失恋': ['悲伤', '思念', '忧郁', '深情'],
};

// 描述关键词 → 曲风 category / nameZh 映射
const DESC_KEYWORDS: Record<string, string[]> = {
  '吉他': ['吉他', '弹唱', '木吉他', '民谣'],
  '钢琴': ['钢琴', '键盘', '古典'],
  '鼓': ['鼓', '节奏', '打击'],
  '贝斯': ['贝斯', 'bass', '放克'],
  '电子': ['电子', '合成器', 'EDM', 'Techno', 'House'],
  '说唱': ['说唱', 'rap', 'hip-hop', '嘻哈'],
  '摇滚': ['摇滚', '电吉他', 'Rock'],
  '民谣': ['民谣', '木吉他', '弹唱', 'Folk'],
  '古典': ['古典', '管弦', '钢琴', 'Classical'],
  '爵士': ['爵士', '摇摆', '即兴', 'Jazz'],
  '蓝调': ['蓝调', '布鲁斯', 'Blues'],
  '乡村': ['乡村', '民谣', '木吉他', 'Country'],
  '舞曲': ['舞曲', '电子', '节拍', 'Dance'],
  '节奏': ['节奏', '律动', 'groove', 'R&B'],
  '旋律': ['旋律', '抒情', '优美', '流行'],
  '氛围': ['氛围', '环境', 'ambient', '氛围电子'],
  '实验': ['实验', '前卫', '先锋', 'Experimental'],
  '复古': ['复古', '怀旧', '经典', 'Retro'],
  '现代': ['现代', '当代', '流行', 'Pop'],
  '传统': ['传统', '民族', '古典', '世界'],
  '东方': ['东方', '中国风', '亚洲', '古风'],
  '西方': ['西方', '欧美', '西洋'],
  '拉丁': ['拉丁', '热带', '雷鬼', 'Latin'],
  '非洲': ['非洲', '部落', '世界', 'Afro'],
  '快速': ['快速', '高能量', '激昂', '硬核'],
  '慢速': ['慢速', '舒缓', '温柔', '抒情'],
  '轻柔': ['轻柔', '温柔', '柔和', '轻音乐'],
  '强烈': ['强烈', '激昂', '力量', '金属'],
  '低沉': ['低沉', '深沉', '厚重', '暗黑'],
  '高亢': ['高亢', '激昂', '明亮', '歌剧'],
  '清澈': ['清澈', '空灵', '纯净', '独立'],
  '沙哑': ['沙哑', '沧桑', '粗犷', '蓝调'],
};

interface RecommendRequest {
  description?: string;
  mood?: string;
  artistIds?: number[];
  selectedGenreIds?: number[];
  limit?: number;
}

interface ScoredGenre {
  genre: Genre;
  score: number;
  reason: string;
}

function getMoodKeywords(text: string): string[] {
  const keywords: string[] = [];
  for (const [mood, moods] of Object.entries(MOOD_KEYWORDS)) {
    if (text.includes(mood)) {
      keywords.push(...moods);
    }
  }
  return keywords;
}

function getDescKeywords(text: string): string[] {
  const keywords: string[] = [];
  for (const [desc, kws] of Object.entries(DESC_KEYWORDS)) {
    if (text.includes(desc)) {
      keywords.push(...kws);
    }
  }
  return keywords;
}

function scoreGenre(
  genre: Genre,
  moodKws: string[],
  descKws: string[],
  artistGenreIds: Set<number>
): { score: number; reason: string } {
  let score = 0;
  const reasons: string[] = [];

  const searchText = [
    genre.oneLiner,
    genre.nameZh,
    genre.nameEn,
    genre.category,
    genre.categoryEn,
    ...(genre.movement || []),
  ].join(' ').toLowerCase();

  // 1. 心情匹配（通过 oneLiner 和 category）
  for (const kw of moodKws) {
    if (searchText.includes(kw.toLowerCase())) {
      score += 3;
      if (!reasons.includes('心情匹配')) reasons.push('心情匹配');
    }
  }

  // 2. 描述关键词匹配
  for (const kw of descKws) {
    if (searchText.includes(kw.toLowerCase())) {
      score += 2;
      if (!reasons.includes('风格匹配')) reasons.push('风格匹配');
    }
  }

  // 3. 歌手关联曲风加成
  if (artistGenreIds.has(genre.id)) {
    score += 5;
    reasons.push('歌手推荐');
  }

  // 4. 名称/别名匹配
  for (const kw of [...moodKws, ...descKws]) {
    const lkw = kw.toLowerCase();
    if (genre.nameZh.toLowerCase().includes(lkw) || genre.nameEn.toLowerCase().includes(lkw)) {
      score += 4;
      if (!reasons.includes('名称匹配')) reasons.push('名称匹配');
    }
  }

  // 5. 热度加成
  score += (genre.hotness || 0) * 0.01;

  return { score, reason: reasons.join('、') || '综合推荐' };
}

export async function POST(request: NextRequest) {
  try {
    const body: RecommendRequest = await request.json();
    const { description = '', mood = '', artistIds = [], selectedGenreIds = [], limit = 8 } = body;

    // 收集心情和描述关键词
    const moodKws = getMoodKeywords(description + ' ' + mood);
    const descKws = getDescKeywords(description);

    // 收集歌手关联的曲风 ID
    const artistGenreIds = new Set<number>();
    if (artistIds.length > 0) {
      for (const artist of ARTISTS) {
        if (artistIds.includes(artist.id)) {
          for (const gid of artist.genres) {
            artistGenreIds.add(gid);
          }
        }
      }
    }

    // 为所有曲风打分
    const scored: ScoredGenre[] = GENRES.map(genre => {
      const { score, reason } = scoreGenre(genre, moodKws, descKws, artistGenreIds);
      return { genre, score, reason };
    });

    // 排序：分数高的在前，同分数按热度排序
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.genre.hotness || 0) - (a.genre.hotness || 0);
    });

    // 返回前 N 个（有分数的优先）
    const withScore = scored.filter(s => s.score > 0);
    const result = withScore.length >= limit
      ? withScore.slice(0, limit)
      : [...withScore, ...scored.filter(s => s.score === 0)].slice(0, limit);

    return NextResponse.json({
      success: true,
      data: result.map(s => ({
        id: s.genre.id,
        nameZh: s.genre.nameZh,
        nameEn: s.genre.nameEn,
        category: s.genre.category,
        score: Math.round(s.score * 100) / 100,
        reason: s.reason,
        hotness: s.genre.hotness || 0,
      })),
      meta: {
        totalGenres: GENRES.length,
        matchedMoodKeywords: moodKws.length,
        matchedDescKeywords: descKws.length,
        artistGenreCount: artistGenreIds.size,
      },
    });
  } catch (error) {
    console.error('Recommend genres error:', error);
    return NextResponse.json(
      { success: false, error: '推荐失败，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      totalGenres: GENRES.length,
      moodKeywords: Object.keys(MOOD_KEYWORDS),
      descKeywords: Object.keys(DESC_KEYWORDS),
    },
  });
}
