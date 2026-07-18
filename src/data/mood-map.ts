/**
 * 13 种情绪场景匹配
 * 用于根据用户选择的情绪推荐对应风格
 */

export interface MoodScene {
  key: string;
  emoji: string;
  scene: string;
  description: string;
  genreIds: number[];
}

export const MOOD_MAP: MoodScene[] = [
  {
    key: 'battle',
    emoji: '🔥',
    scene: '热血战斗',
    description: '硬摇滚 / 力量金属 / Trap / 豫剧 / 唢呐 / 国风摇滚',
    genreIds: [2, 91, 42, 117, 130, 104],
  },
  {
    key: 'heartbreak',
    emoji: '💔',
    scene: '失恋伤感',
    description: '抒情流行 / 布鲁斯 / Emo / Trip-Hop / 二胡独奏 / 越剧 / 暗黑国风',
    genreIds: [16, 60, 50, 93, 128, 115, 111, 133],
  },
  {
    key: 'healing',
    emoji: '🌅',
    scene: '治愈温暖',
    description: 'Lo-fi / 民谣 / 波萨诺瓦 / 新世纪 / 古琴 / 新国风民谣',
    genreIds: [36, 98, 59, 73, 126, 108, 134],
  },
  {
    key: 'urban-lonely',
    emoji: '🏙️',
    scene: '都市孤独',
    description: '独立流行 / 盯鞋 / Trip-Hop / 后朋克 / 评弹',
    genreIds: [17, 14, 93, 13, 131],
  },
  {
    key: 'future-tech',
    emoji: '🚀',
    scene: '未来科技',
    description: '合成器流行 / Techno / 蒸汽波 / 国风电子 / 国潮电子',
    genreIds: [18, 30, 37, 102, 112],
  },
  {
    key: 'epic',
    emoji: '🎭',
    scene: '史诗宏大',
    description: '管弦流行 / 前卫摇滚 / 力量金属 / 合唱 / 京剧 / 国风交响',
    genreIds: [72, 8, 91, 71, 113, 110],
  },
  {
    key: 'late-night',
    emoji: '🌙',
    scene: '深夜私密',
    description: '爵士 / R&B / 弛放 / 氛围电子 / 古琴',
    genreIds: [53, 61, 35, 34, 126],
  },
  {
    key: 'rebel',
    emoji: '🗣️',
    scene: '态度叛逆',
    description: '朋克 / 垃圾摇滚 / Drill / 嘻哈 / 国风说唱',
    genreIds: [4, 6, 43, 48, 106, 135],
  },
  {
    key: 'sweet-love',
    emoji: '🌸',
    scene: '甜蜜恋爱',
    description: '舞曲流行 / 萨尔萨 / K-Pop / 雷鬼 / 黄梅戏',
    genreIds: [19, 83, 24, 82, 116],
  },
  {
    key: 'philosophy',
    emoji: '🧠',
    scene: '哲学意识流',
    description: '迷幻摇滚 / 艺术摇滚 / 先锋爵士 / 禅乐',
    genreIds: [87, 9, 42, 132],
  },
  {
    key: 'landscape',
    emoji: '🏔️',
    scene: '山水田园',
    description: '西北民歌 / 江南丝竹 / 广东音乐 / 蒙古长调',
    genreIds: [124, 120, 121, 122, 134],
  },
  {
    key: 'guochao',
    emoji: '🏮',
    scene: '国潮文化',
    description: '中国风 / 国风电子 / 戏腔国风 / 昆曲 / 川剧变脸 / 新国风民乐',
    genreIds: [101, 102, 109, 114, 118, 107, 135],
  },
  {
    key: 'oriental-aesthetics',
    emoji: '🎌',
    scene: '东方美学',
    description: '古琴 / 古筝 / 琵琶 / 茶道音乐 / 道教音乐',
    genreIds: [126, 127, 129, 73, 132, 133],
  },
];

// 按 key 索引
export const MOOD_BY_KEY: Record<string, MoodScene> = Object.fromEntries(
  MOOD_MAP.map(m => [m.key, m])
);
