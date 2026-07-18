/**
 * 2026 新国风 TOP 10 热门歌曲
 * 用于首页推荐和风格引导
 */

export interface GuofengSong {
  rank: number;
  medal?: '🥇' | '🥈' | '🥉';
  song: string;
  artist: string;
  hotness: string;
  styleTagEmoji: string;
  styleTags: string[];
  oneLiner: string;
}

export const NEW_GUOFENG_TOP10: GuofengSong[] = [
  {
    rank: 1,
    medal: '🥇',
    song: '虞兮叹',
    artist: '闻人听書',
    hotness: '97.5万',
    styleTagEmoji: '🔥',
    styleTags: ['戏腔国风'],
    oneLiner: '戏腔一开口，头皮发麻',
  },
  {
    rank: 2,
    medal: '🥈',
    song: '吉量',
    artist: '周深',
    hotness: '爆款',
    styleTagEmoji: '🔥',
    styleTags: ['国风电子', '国风交响'],
    oneLiner: '编钟+电子，大气祥瑞',
  },
  {
    rank: 3,
    medal: '🥉',
    song: '龙耀华夏',
    artist: '—',
    hotness: '国潮顶流',
    styleTagEmoji: '🔥',
    styleTags: ['国风电子'],
    oneLiner: '龙纹变装BGM，古筝+电子节奏',
  },
  {
    rank: 4,
    song: '外婆桥',
    artist: '任然',
    hotness: '50.8万',
    styleTagEmoji: '🌸',
    styleTags: ['新国风民谣'],
    oneLiner: '江南丝竹感，温柔杀',
  },
  {
    rank: 5,
    song: '清明雨上',
    artist: '许嵩',
    hotness: '47.5万',
    styleTagEmoji: '🏯',
    styleTags: ['中国风'],
    oneLiner: '五声音阶经典，永不过时',
  },
  {
    rank: 6,
    song: '难生恨',
    artist: 'Dawn',
    hotness: '38.6万',
    styleTagEmoji: '🌑',
    styleTags: ['暗黑国风'],
    oneLiner: '暗黑国风，又虐又燃',
  },
  {
    rank: 7,
    song: '是风动',
    artist: '河图×银临',
    hotness: '23.9万',
    styleTagEmoji: '🌸',
    styleTags: ['新国风民谣'],
    oneLiner: '神仙合唱，仙侠天花板',
  },
  {
    rank: 8,
    song: '一吻天荒',
    artist: '胡歌',
    hotness: '29.4万',
    styleTagEmoji: '🏯',
    styleTags: ['中国风'],
    oneLiner: '仙剑情怀杀',
  },
  {
    rank: 9,
    song: '怜城辞',
    artist: '鹿晗',
    hotness: '25.2万',
    styleTagEmoji: '🏯',
    styleTags: ['中国风'],
    oneLiner: '温柔古风，城市夜景',
  },
  {
    rank: 10,
    song: '百鸟朝凤（新编版）',
    artist: '自得琴社',
    hotness: '22.1万',
    styleTagEmoji: '🪕',
    styleTags: ['新国风民乐'],
    oneLiner: '民乐+现代编曲，传统新生',
  },
];
