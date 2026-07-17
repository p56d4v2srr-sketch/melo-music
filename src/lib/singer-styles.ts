export interface SingerStyle {
  id: string;
  name: string;
  nameEn: string;
  region: 'chinese' | 'western' | 'korean' | 'japanese';
  gender: 'male' | 'female';
  tags: string[];
  techniques: string[];
  description: string;
  representativeWorks?: string[];
}

export const singerStyles: SingerStyle[] = [
  // 华语男歌手
  {
    id: 'jay-chou',
    name: '周杰伦',
    nameEn: 'Jay Chou',
    region: 'chinese',
    gender: 'male',
    tags: ['R&B', '中国风', '说唱'],
    techniques: ['饶舌律动', '咬字含糊', 'R&B转音', '假声切换'],
    description: '独特的咬字方式和R&B律动感，融合中国风元素',
    representativeWorks: ['晴天', '七里香', '青花瓷'],
  },
  {
    id: 'jj-lin',
    name: '林俊杰',
    nameEn: 'JJ Lin',
    region: 'chinese',
    gender: 'male',
    tags: ['流行', '抒情', '高音'],
    techniques: ['高音张力', '假声连接', '情感爆发', '气息控制'],
    description: '极具张力的高音和细腻的情感表达',
    representativeWorks: ['江南', '修炼爱情', '可惜没如果'],
  },
  {
    id: 'eason-chan',
    name: '陈奕迅',
    nameEn: 'Eason Chan',
    region: 'chinese',
    gender: 'male',
    tags: ['抒情', '粤语', '叙事'],
    techniques: ['情感叙事', '中低音磁性', '气息稳定', '情感层次'],
    description: '深情的中低音和细腻的情感表达',
    representativeWorks: ['十年', '浮夸', '爱情转移'],
  },
  {
    id: 'mao-buyi',
    name: '毛不易',
    nameEn: 'Mao Buyi',
    region: 'chinese',
    gender: 'male',
    tags: ['民谣', '叙事', '说唱'],
    techniques: ['说唱式咬字', '叙事感', '低音沉稳', '情感真挚'],
    description: '说唱式的咬字方式和强烈的叙事感',
    representativeWorks: ['像我这样的人', '消愁', '平凡的一天'],
  },
  {
    id: 'xue-zhiqian',
    name: '薛之谦',
    nameEn: 'Joker Xue',
    region: 'chinese',
    gender: 'male',
    tags: ['流行', '抒情', '情歌'],
    techniques: ['情感爆发', '高音撕裂', '情绪张力', '沙哑音色'],
    description: '极具情感张力的演唱方式',
    representativeWorks: ['演员', '丑八怪', '认真的雪'],
  },
  // 华语女歌手
  {
    id: 'deng-ziqi',
    name: '邓紫棋',
    nameEn: 'G.E.M.',
    region: 'chinese',
    gender: 'female',
    tags: ['流行', '高音', '爆发力'],
    techniques: ['爆发力高音', '胸声共鸣', '音域宽广', '情感爆发'],
    description: '强大的爆发力和宽广的音域',
    representativeWorks: ['光年之外', '泡沫', '句号'],
  },
  {
    id: 'faye-wong',
    name: '王菲',
    nameEn: 'Faye Wong',
    region: 'chinese',
    gender: 'female',
    tags: ['空灵', '另类', '梦幻'],
    techniques: ['空灵音色', '气声运用', '梦幻感', '独特咬字'],
    description: '空灵梦幻的音色和独特的演唱风格',
    representativeWorks: ['传奇', '红豆', '匆匆那年'],
  },
  {
    id: 'zhang-huimei',
    name: '张惠妹',
    nameEn: 'A-Mei',
    region: 'chinese',
    gender: 'female',
    tags: ['实力', '高音', '情感'],
    techniques: ['高音爆发', '情感张力', '胸声厚度', '技巧娴熟'],
    description: '极具爆发力的高音和深厚的情感表达',
    representativeWorks: ['听海', '解脱', '我最亲爱的'],
  },
  {
    id: 'tian-fu-zhen',
    name: '田馥甄',
    nameEn: 'Hebe Tien',
    region: 'chinese',
    gender: 'female',
    tags: ['清新', '文艺', '高音'],
    techniques: ['清亮高音', '气息控制', '情感细腻', '音色纯净'],
    description: '清亮纯净的音色和细腻的演唱',
    representativeWorks: ['小幸运', '魔鬼中的天使', '寂寞寂寞就好'],
  },
  // 欧美男歌手
  {
    id: 'bruno-mars',
    name: 'Bruno Mars',
    nameEn: 'Bruno Mars',
    region: 'western',
    gender: 'male',
    tags: ['复古', '灵魂', '放克'],
    techniques: ['复古灵魂', 'Falsetto', '节奏感强', '舞台表现力'],
    description: '复古灵魂乐风格，擅长假声和节奏感',
    representativeWorks: ['Uptown Funk', '24K Magic', 'That\'s What I Like'],
  },
  {
    id: 'ed-sheeran',
    name: 'Ed Sheeran',
    nameEn: 'Ed Sheeran',
    region: 'western',
    gender: 'male',
    tags: ['民谣', '流行', '创作'],
    techniques: ['叙事式演唱', '吉他弹唱', '情感真挚', 'loop技巧'],
    description: '叙事式的演唱方式和真挚的情感表达',
    representativeWorks: ['Shape of You', 'Perfect', 'Thinking Out Loud'],
  },
  {
    id: 'the-weeknd',
    name: 'The Weeknd',
    nameEn: 'The Weeknd',
    region: 'western',
    gender: 'male',
    tags: ['R&B', '迷幻', '另类'],
    techniques: ['迷幻假声', 'MJ式转音', '暗色调', '情感深沉'],
    description: '迷幻的假声和Michael Jackson式的转音',
    representativeWorks: ['Blinding Lights', 'Starboy', 'Can\'t Feel My Face'],
  },
  {
    id: 'sam-smith',
    name: 'Sam Smith',
    nameEn: 'Sam Smith',
    region: 'western',
    gender: 'male',
    tags: ['灵魂', '抒情', '高音'],
    techniques: ['灵魂唱腔', '高音细腻', '情感爆发', '性别模糊音色'],
    description: '极具灵魂感的唱腔和细腻的高音',
    representativeWorks: ['Stay With Me', 'Too Good at Goodbyes', 'I\'m Not the Only One'],
  },
  {
    id: 'frank-ocean',
    name: 'Frank Ocean',
    nameEn: 'Frank Ocean',
    region: 'western',
    gender: 'male',
    tags: ['另类R&B', '实验', '文艺'],
    techniques: ['另类R&B', '实验性', '情感内敛', '叙事性强'],
    description: '另类R&B风格，实验性强，情感内敛',
    representativeWorks: ['Thinkin Bout You', 'Nights', 'Ivy'],
  },
  // 欧美女歌手
  {
    id: 'adele',
    name: 'Adele',
    nameEn: 'Adele',
    region: 'western',
    gender: 'female',
    tags: ['灵魂', '抒情', '力量'],
    techniques: ['胸声厚度', '情感颤音', '力量感', '情感共鸣'],
    description: '深厚的胸声和极具感染力的情感颤音',
    representativeWorks: ['Rolling in the Deep', 'Someone Like You', 'Hello'],
  },
  {
    id: 'taylor-swift',
    name: 'Taylor Swift',
    nameEn: 'Taylor Swift',
    region: 'western',
    gender: 'female',
    tags: ['流行', '乡村', '叙事'],
    techniques: ['叙事式演唱', '乡村气息', '情感表达', '旋律感强'],
    description: '叙事式的演唱方式和乡村音乐气息',
    representativeWorks: ['Love Story', 'Shake It Off', 'Blank Space'],
  },
  {
    id: 'billie-eilish',
    name: 'Billie Eilish',
    nameEn: 'Billie Eilish',
    region: 'western',
    gender: 'female',
    tags: ['另类', '暗黑', '实验'],
    techniques: ['气声耳语', 'ASMR感', '低音区', '氛围感'],
    description: '气声耳语式演唱，ASMR般的听觉体验',
    representativeWorks: ['Bad Guy', 'Happier Than Ever', 'Lovely'],
  },
  {
    id: 'ariana-grande',
    name: 'Ariana Grande',
    nameEn: 'Ariana Grande',
    region: 'western',
    gender: 'female',
    tags: ['流行', 'R&B', '高音'],
    techniques: ['花腔高音', 'R&B转音', '海豚音', '音域宽广'],
    description: '花腔高音和精湛的R&B转音技巧',
    representativeWorks: ['7 Rings', 'Thank U, Next', 'Positions'],
  },
  {
    id: 'dua-lipa',
    name: 'Dua Lipa',
    nameEn: 'Dua Lipa',
    region: 'western',
    gender: 'female',
    tags: ['流行', '迪斯科', '舞曲'],
    techniques: ['中低音磁性', '节奏感强', '舞曲风格', '复古感'],
    description: '磁性的中低音和强烈的节奏感',
    representativeWorks: ['Levitating', 'Don\'t Start Now', 'Physical'],
  },
  // 韩国歌手
  {
    id: 'iu',
    name: 'IU',
    nameEn: 'IU',
    region: 'korean',
    gender: 'female',
    tags: ['清新', '抒情', '创作'],
    techniques: ['清亮音色', '情感细腻', '高音纯净', '叙事感'],
    description: '清亮纯净的音色和细腻的情感表达',
    representativeWorks: ['Good Day', 'Palette', 'Through the Night'],
  },
  {
    id: 'bts-jungkook',
    name: 'BTS 柾国',
    nameEn: 'Jungkook',
    region: 'korean',
    gender: 'male',
    tags: ['流行', 'R&B', '全能'],
    techniques: ['音域宽广', '高音清亮', 'R&B转音', '情感丰富'],
    description: '宽广的音域和全能的演唱风格',
    representativeWorks: ['Dreamers', 'Stay Alive', 'My Time'],
  },
  // 日本歌手
  {
    id: 'hikaru-utada',
    name: '宇多田光',
    nameEn: 'Hikaru Utada',
    region: 'japanese',
    gender: 'female',
    tags: ['R&B', 'J-pop', '创作'],
    techniques: ['R&B唱腔', '中低音磁性', '情感深沉', '独特音色'],
    description: '独特的R&B唱腔和深沉的情感表达',
    representativeWorks: ['First Love', 'Automatic', 'Flavor Life'],
  },
];

export const techniqueCategories = {
  vocal: ['高音', '中音', '低音', '假声', '气声', '胸声', '头声'],
  style: ['R&B转音', '颤音', '嘶吼', '耳语', '叙事', '说唱式'],
  emotion: ['情感爆发', '情感细腻', '情感内敛', '情感张力'],
  special: ['海豚音', '花腔', 'loop', 'ASMR感', '氛围感'],
};

export function getSingersByRegion(region: SingerStyle['region']): SingerStyle[] {
  return singerStyles.filter((s) => s.region === region);
}

export function getSingersByGender(gender: SingerStyle['gender']): SingerStyle[] {
  return singerStyles.filter((s) => s.gender === gender);
}

export function searchSingers(query: string): SingerStyle[] {
  const lowerQuery = query.toLowerCase();
  return singerStyles.filter(
    (s) =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.nameEn.toLowerCase().includes(lowerQuery) ||
      s.tags.some((t) => t.toLowerCase().includes(lowerQuery)) ||
      s.techniques.some((t) => t.toLowerCase().includes(lowerQuery))
  );
}
