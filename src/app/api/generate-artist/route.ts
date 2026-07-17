import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Artist name generation templates
const NAME_TEMPLATES = {
  male: ['墨辰', '陆离', '云深', '夜行', '风吟', '星辰', '月白', '天青', '凌霄', '逸尘'],
  female: ['清欢', '念安', '语嫣', '若兮', '梦璃', '雪落', '花影', '月见', '星瑶', '雨桐'],
  neutral: ['零', '幻', '灵', '影', '光', '梦', '音', '律', '韵', '声'],
  virtual: ['V-1', 'NEXUS', 'ECHO', 'NOVA', 'AURA', 'LYRA', 'CYBER', 'VOID', 'FLUX', 'PRISM'],
};

const SLOGAN_TEMPLATES = [
  '用音乐编织梦境',
  '在旋律中寻找自我',
  '每个音符都是故事',
  '让声音穿越时空',
  '音乐是我的语言',
  '用节奏定义态度',
  '在音符间流浪',
  '唱出心中的光',
  '音乐是灵魂的镜子',
  '用旋律治愈世界',
];

const BIO_TEMPLATES = [
  '来自数字世界的音乐旅人，在代码与旋律之间寻找属于自己的声音。每一首歌都是一次跨越维度的对话，每一个音符都承载着对未知世界的探索。',
  '诞生于深夜的录音棚，由无数个灵感碎片拼凑而成。音乐风格游走于梦幻与现实之间，用独特的声线讲述着属于这个时代的故事。',
  '一个神秘的AI音乐人，没有人知道ta的真实身份。只在深夜发布作品，用音乐构建着一个属于自己的乌托邦。',
  '从虚拟世界走来的歌者，带着对人类情感的好奇与敬畏。每一首歌都是对"什么是真实"的追问，每一次演唱都是对边界的突破。',
  '在数据的海洋中诞生的音乐精灵，用算法编织旋律，用逻辑构建情感。相信音乐是连接虚拟与现实的桥梁。',
];

const PERSONALITY_TAGS = ['文艺', '狂野', '可爱', '忧郁', '桀骜', '治愈', '神秘', '浪漫', '叛逆', '温柔', '冷艳', '阳光'];

const SINGING_TECHNIQUES = [
  '气声唱法', '假声转换', 'R&B转音', '高音爆发', '低音磁性',
  '颤音控制', '即兴发挥', '情感渲染', '节奏律动', '音色变化',
];

function generateArtistName(gender: string): string {
  const namePool = NAME_TEMPLATES[gender as keyof typeof NAME_TEMPLATES] || NAME_TEMPLATES.neutral;
  const surname = ['林', '苏', '顾', '沈', '陆', '叶', '白', '慕', '洛', '楚'];
  
  if (gender === 'virtual') {
    return namePool[Math.floor(Math.random() * namePool.length)];
  }
  
  const s = surname[Math.floor(Math.random() * surname.length)];
  const n = namePool[Math.floor(Math.random() * namePool.length)];
  return s + n;
}

function generateBio(): string {
  return BIO_TEMPLATES[Math.floor(Math.random() * BIO_TEMPLATES.length)];
}

function generateSlogan(): string {
  return SLOGAN_TEMPLATES[Math.floor(Math.random() * SLOGAN_TEMPLATES.length)];
}

function selectTags(pool: string[], count: number): string[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateAvatarUrl(gender: string, style: string): string {
  // Use Unsplash for demo avatars
  const avatarIds: Record<string, string[]> = {
    male: ['1539571696357-5a69c06a7f12', '1507003211169-0a1dd7228f2d', '1500648767791-00dcc994a43e'],
    female: ['1494790108377-be9c29b29330', '1438761681033-6461ffad8d80', '1534528741775-53994a69daeb'],
    neutral: ['1535713875002-d1d0cf377fde', '1489980557514-251d61e3eeb6', '1506794778202-cad84cf45f1d'],
    virtual: ['1511671782779-C97D3D27A5D4', '1514320291840-2e0a9bf2a965', '1517841905240-472988babdf9'],
  };
  
  const ids = avatarIds[gender as keyof typeof avatarIds] || avatarIds.neutral;
  const id = ids[Math.floor(Math.random() * ids.length)];
  return `https://images.unsplash.com/photo-${id}?w=400&h=400&fit=crop`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      gender = 'neutral',
      styles = [],
      ageGroup = '都市成熟',
      personality = [],
      language = '中文',
    } = body;

    // Generate artist profile
    const name = generateArtistName(gender);
    const slogan = generateSlogan();
    const bio = generateBio();
    const avatarUrl = generateAvatarUrl(gender, styles[0] || 'pop');
    
    // Select style tags from provided or default
    const styleTags = styles.length > 0 
      ? styles.slice(0, 5)
      : selectTags(['流行', 'R&B', '电子', '民谣', '说唱', '摇滚', '国风', '爵士'], 3);
    
    // Select singing techniques
    const singingTechniques = selectTags(SINGING_TECHNIQUES, 3 + Math.floor(Math.random() * 3));
    
    // Select personality tags
    const personalityTags = personality.length > 0
      ? personality.slice(0, 5)
      : selectTags(PERSONALITY_TAGS, 3);

    // Generate debut date (within last 2 years)
    const debutDate = new Date();
    debutDate.setFullYear(debutDate.getFullYear() - Math.floor(Math.random() * 2));
    debutDate.setMonth(Math.floor(Math.random() * 12));

    const artist = {
      id: `artist-${Date.now()}`,
      name,
      avatarUrl,
      slogan,
      bio,
      gender,
      ageGroup,
      personalityTags,
      styleTags,
      singingTechniques,
      languagePreference: language,
      debutDate: debutDate.toISOString().split('T')[0],
      region: '华语',
      isAiGenerated: true,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      artist,
      message: 'AI 音乐人生成成功（演示模式）',
    });
  } catch (error) {
    console.error('Artist generation error:', error);
    return NextResponse.json(
      { error: '音乐人生成失败' },
      { status: 500 }
    );
  }
}
