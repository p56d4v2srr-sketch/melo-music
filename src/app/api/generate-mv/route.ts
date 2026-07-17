import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// MV generation styles
const MV_STYLES = {
  realistic: '写实风格',
  anime: '二次元',
  retro: '复古胶片',
  cyberpunk: '赛博朋克',
  ink: '水墨国风',
  minimal: '极简艺术',
};

// Generate storyboard from lyrics
function generateStoryboard(lyrics: string, style: string, duration: number): any[] {
  const lines = lyrics.split('\n').filter(line => line.trim());
  const segmentCount = Math.min(Math.max(6, Math.floor(duration / 15)), 12);
  const segmentDuration = duration / segmentCount;
  
  const storyboards = [];
  
  for (let i = 0; i < segmentCount; i++) {
    const lyricSegment = lines[i % lines.length] || '';
    const startTime = Math.floor(i * segmentDuration);
    const endTime = Math.floor((i + 1) * segmentDuration);
    
    // Generate scene description based on lyrics and style
    const sceneDescription = generateSceneDescription(lyricSegment, style, i);
    
    storyboards.push({
      id: `scene-${i + 1}`,
      startTime,
      endTime,
      duration: endTime - startTime,
      lyrics: lyricSegment,
      sceneDescription,
      emotion: getEmotionFromLyrics(lyricSegment),
      prompt: `${MV_STYLES[style as keyof typeof MV_STYLES] || style}, ${sceneDescription}, cinematic lighting, high quality`,
      imageUrl: null,
      videoUrl: null,
      status: 'pending',
    });
  }
  
  return storyboards;
}

function generateSceneDescription(lyrics: string, style: string, index: number): string {
  const scenes = [
    '广阔的星空下，一个人影独立于山巅',
    '城市霓虹闪烁的街道，雨后的倒影',
    '古老的庭院，樱花飘落',
    '未来感的实验室，全息投影',
    '海边的日落，金色的光芒',
    '森林深处，萤火虫点点',
    '摩天大楼的顶端，俯瞰城市',
    '复古的唱片店，黑胶旋转',
    '赛博空间的数字流',
    '水墨山水间，一叶扁舟',
    '极光下的冰原',
    '温暖的咖啡馆，窗边的光影',
  ];
  
  return scenes[index % scenes.length];
}

function getEmotionFromLyrics(lyrics: string): string {
  const emotionKeywords: Record<string, string[]> = {
    '浪漫': ['爱', '心', '梦', '星光', '月光'],
    '忧伤': ['泪', '离别', '寂寞', '孤独', '思念'],
    '激昂': ['燃烧', '战斗', '力量', '冲', '飞'],
    '平静': ['安静', '宁静', '微风', '流水', '月光'],
    '怀旧': ['回忆', '过去', '曾经', '那年', '旧'],
  };
  
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some(keyword => lyrics.includes(keyword))) {
      return emotion;
    }
  }
  
  return '中性';
}

// Simulate MV generation progress
async function simulateGeneration(
  songId: string,
  style: string,
  duration: number,
  lyrics: string
): Promise<{ storyboard: any[]; videoUrl: string; coverUrl: string }> {
  const storyboard = generateStoryboard(lyrics, style, duration);
  
  // Simulate generation time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In demo mode, use sample video
  const videoUrl = '/sample-mv.mp4';
  const coverUrl = `https://images.unsplash.com/photo-${1511671782779 + storyboard.length}C9D37-431D-8BB0-A3A392B0F80A?w=800&h=450&fit=crop`;
  
  // Mark storyboard items as completed
  storyboard.forEach((item, index) => {
    item.status = 'completed';
    item.imageUrl = `https://images.unsplash.com/photo-${1511671782779 + index * 100}?w=400&h=225&fit=crop`;
    item.videoUrl = videoUrl;
  });
  
  return { storyboard, videoUrl, coverUrl };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { songId, style = 'realistic', aspectRatio = '9:16', duration = 30, lyrics = '' } = body;

    if (!songId) {
      return NextResponse.json(
        { error: '缺少歌曲 ID' },
        { status: 400 }
      );
    }

    // Validate style
    if (!Object.keys(MV_STYLES).includes(style)) {
      return NextResponse.json(
        { error: '无效的画风' },
        { status: 400 }
      );
    }

    // Validate aspect ratio
    if (!['9:16', '16:9'].includes(aspectRatio)) {
      return NextResponse.json(
        { error: '无效的比例' },
        { status: 400 }
      );
    }

    // Validate duration
    if (duration < 15 || duration > 300) {
      return NextResponse.json(
        { error: '时长应在 15-300 秒之间' },
        { status: 400 }
      );
    }

    // Generate MV (demo mode)
    const result = await simulateGeneration(songId, style, duration, lyrics);

    return NextResponse.json({
      success: true,
      mv: {
        id: `mv-${Date.now()}`,
        songId,
        style,
        aspectRatio,
        duration,
        storyboard: result.storyboard,
        videoUrl: result.videoUrl,
        coverUrl: result.coverUrl,
        status: 'done',
        progress: 100,
        createdAt: new Date().toISOString(),
      },
      message: 'MV 生成成功（演示模式）',
    });
  } catch (error) {
    console.error('MV generation error:', error);
    return NextResponse.json(
      { error: 'MV 生成失败' },
      { status: 500 }
    );
  }
}
