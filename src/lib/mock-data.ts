// Mock data for social discovery features

export interface MockArtist {
  id: string;
  nickname: string;
  avatar: string;
  bio: string;
  slogan: string;
  is_ai_artist: boolean;
  follower_count: number;
  following_count: number;
  song_count: number;
  total_play_count: number;
}

export interface MockSong {
  id: string;
  title: string;
  artist_id: string;
  artist?: MockArtist;
  cover_url: string;
  audio_url: string;
  lyrics: string;
  style_tags: string[];
  description: string;
  duration: number;
  play_count: number;
  like_count: number;
  collect_count: number;
  comment_count: number;
  is_published: boolean;
  is_original: boolean;
  created_at: string;
}

export interface MockComment {
  id: string;
  song_id: string;
  user_id: string;
  user?: MockArtist;
  parent_id: string | null;
  content: string;
  like_count: number;
  is_pinned: boolean;
  created_at: string;
  replies?: MockComment[];
}

export interface MockNotification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  from_user_id: string;
  from_user?: MockArtist;
  target_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface MockHotSearch {
  id: string;
  keyword: string;
  category: 'song' | 'artist' | 'style' | 'topic';
  score: number;
}

// Cover image URLs using gradient placeholders
const coverImages = [
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1571330735066-03aaa9429d88?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=600&fit=crop',
];

const avatarImages = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1544725176-7c40e128714f?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
];

// Mock Artists
export const mockArtists: MockArtist[] = [
  {
    id: 'artist-1',
    nickname: '星辰音乐人',
    avatar: avatarImages[0],
    bio: '用 AI 探索音乐的无限可能，融合电子与国风，创造前所未有的声音景观。',
    slogan: '让 AI 成为你的音乐伙伴',
    is_ai_artist: true,
    follower_count: 128500,
    following_count: 42,
    song_count: 86,
    total_play_count: 5200000,
  },
  {
    id: 'artist-2',
    nickname: '深夜调频',
    avatar: avatarImages[1],
    bio: 'Lo-fi & Chillhop 制作人，用 AI 编织每一个深夜的旋律。',
    slogan: '深夜的旋律，治愈每一个灵魂',
    is_ai_artist: true,
    follower_count: 89200,
    following_count: 15,
    song_count: 52,
    total_play_count: 3100000,
  },
  {
    id: 'artist-3',
    nickname: '赛博诗人',
    avatar: avatarImages[2],
    bio: '说唱 + 电子 + 诗歌，用 AI 重新定义中文说唱的边界。',
    slogan: '代码与韵脚的碰撞',
    is_ai_artist: true,
    follower_count: 156000,
    following_count: 28,
    song_count: 43,
    total_play_count: 7800000,
  },
  {
    id: 'artist-4',
    nickname: '月光作曲',
    avatar: avatarImages[3],
    bio: '新古典 & 氛围音乐创作者，AI 辅助下的钢琴诗篇。',
    slogan: '月光下的每一个音符',
    is_ai_artist: true,
    follower_count: 67800,
    following_count: 8,
    song_count: 34,
    total_play_count: 2400000,
  },
  {
    id: 'artist-5',
    nickname: 'NeonWave',
    avatar: avatarImages[4],
    bio: 'Synthwave & Retrowave 制作人，带你穿越回 80 年代的未来。',
    slogan: 'Retro future, AI powered',
    is_ai_artist: true,
    follower_count: 203000,
    following_count: 56,
    song_count: 71,
    total_play_count: 9500000,
  },
  {
    id: 'artist-6',
    nickname: '山水间',
    avatar: avatarImages[5],
    bio: '国风 & 古风音乐人，用 AI 重现千年前的诗意与风雅。',
    slogan: '千年风雅，一歌之间',
    is_ai_artist: true,
    follower_count: 95600,
    following_count: 12,
    song_count: 38,
    total_play_count: 4100000,
  },
  {
    id: 'artist-7',
    nickname: 'BassLab',
    avatar: avatarImages[6],
    bio: 'Dubstep & Drum & Bass 制作人，AI 生成的低频震撼。',
    slogan: 'Feel the bass drop',
    is_ai_artist: true,
    follower_count: 178000,
    following_count: 33,
    song_count: 62,
    total_play_count: 8200000,
  },
  {
    id: 'artist-8',
    nickname: '民谣小站',
    avatar: avatarImages[7],
    bio: '独立民谣 & 城市民谣创作者，AI 记录生活的每一个温暖瞬间。',
    slogan: '一把吉他，一个故事',
    is_ai_artist: false,
    follower_count: 45200,
    following_count: 67,
    song_count: 28,
    total_play_count: 1800000,
  },
];

// Mock Songs
export const mockSongs: MockSong[] = [
  {
    id: 'song-1',
    title: '星河漫步',
    artist_id: 'artist-1',
    cover_url: coverImages[0],
    audio_url: '/demo-music.mp3',
    lyrics: '[Verse 1]\n漫步在星河之间\n看流星划过天际线\n银河的光洒满肩\n这一刻时间都停歇\n\n[Chorus]\n星河漫步 不问归途\n每一步都是新的领悟\n星光闪烁 照亮前路\n在这宇宙 我不孤独',
    style_tags: ['electronic', 'ambient', 'new-age'],
    description: '一首空灵的电子氛围音乐，仿佛漫步在银河之中',
    duration: 234,
    play_count: 1520000,
    like_count: 89000,
    collect_count: 45000,
    comment_count: 3200,
    is_published: true,
    is_original: true,
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'song-2',
    title: '深夜咖啡',
    artist_id: 'artist-2',
    cover_url: coverImages[1],
    audio_url: '/demo-music.mp3',
    lyrics: '[Verse 1]\n窗外的雨滴敲打着玻璃\n咖啡的香气弥漫在空气\n翻开那本旧日记\n回忆像电影在放映\n\n[Chorus]\n深夜咖啡 温暖了寂寞\n每一个音符都是诉说\n在这城市 灯火阑珊处\n有一首歌 只为你而作',
    style_tags: ['lo-fi', 'chillhop', 'jazz'],
    description: '深夜的 Lo-fi 音乐，适合独自品咖啡时聆听',
    duration: 198,
    play_count: 980000,
    like_count: 67000,
    collect_count: 38000,
    comment_count: 2100,
    is_published: true,
    is_original: true,
    created_at: '2024-01-20T15:30:00Z',
  },
  {
    id: 'song-3',
    title: '代码与诗',
    artist_id: 'artist-3',
    cover_url: coverImages[2],
    audio_url: '/demo-music.mp3',
    lyrics: '[Verse 1]\n键盘敲出的节奏\n像诗人在吟诵\n0和1之间的梦\n是我追逐的星空\n\n[Chorus]\n代码与诗 交织成章\n在数字世界里翱翔\n每一行都是信仰\n每一句都是力量',
    style_tags: ['trap', 'electronic', 'mandopop'],
    description: '赛博朋克风格的中文说唱，代码与诗歌的碰撞',
    duration: 212,
    play_count: 2340000,
    like_count: 156000,
    collect_count: 78000,
    comment_count: 5600,
    is_published: true,
    is_original: true,
    created_at: '2024-02-01T08:00:00Z',
  },
  {
    id: 'song-4',
    title: '月光奏鸣曲',
    artist_id: 'artist-4',
    cover_url: coverImages[3],
    audio_url: '/demo-music.mp3',
    lyrics: '[Instrumental]\n\n月光洒在琴键上\n每一个音符都在发光\n闭上眼 聆听\n这来自灵魂的声音',
    style_tags: ['neo-classical', 'ambient', 'piano'],
    description: 'AI 辅助创作的新古典钢琴曲，月光下的沉思',
    duration: 267,
    play_count: 756000,
    like_count: 45000,
    collect_count: 32000,
    comment_count: 1800,
    is_published: true,
    is_original: true,
    created_at: '2024-02-10T20:00:00Z',
  },
  {
    id: 'song-5',
    title: 'Neon Dreams',
    artist_id: 'artist-5',
    cover_url: coverImages[4],
    audio_url: '/demo-music.mp3',
    lyrics: '[Verse 1]\nDriving through the neon lights\nCity never sleeps at night\nSynthesizers fill the air\nElectric dreams everywhere\n\n[Chorus]\nNeon dreams 不夜城中\nRetrowave 带我穿越时空\n80年代的未来梦\n在这旋律中重逢',
    style_tags: ['synthwave', 'retrowave', 'electronic'],
    description: '复古合成器浪潮，带你回到 80 年代的未来',
    duration: 245,
    play_count: 3200000,
    like_count: 203000,
    collect_count: 98000,
    comment_count: 7200,
    is_published: true,
    is_original: true,
    created_at: '2024-02-15T12:00:00Z',
  },
  {
    id: 'song-6',
    title: '山水谣',
    artist_id: 'artist-6',
    cover_url: coverImages[5],
    audio_url: '/demo-music.mp3',
    lyrics: '[Verse 1]\n青山绿水间\n白云悠悠然\n一曲高山流水\n千年风华在眼前\n\n[Chorus]\n山水谣 唱不完\n人间烟火 诗与远方\n琴声悠扬 笛声长\n醉在这 水墨画卷中',
    style_tags: ['chinese-style', 'gufeng', 'folk'],
    description: '国风古韵，AI 演绎千年前的诗意山水',
    duration: 223,
    play_count: 1120000,
    like_count: 78000,
    collect_count: 45000,
    comment_count: 3400,
    is_published: true,
    is_original: true,
    created_at: '2024-02-20T16:00:00Z',
  },
  {
    id: 'song-7',
    title: 'Bass Drop',
    artist_id: 'artist-7',
    cover_url: coverImages[6],
    audio_url: '/demo-music.mp3',
    lyrics: '[Drop]\nFeel the bass\nFeel the bass drop\n\n[Verse]\n低频震动 撕裂夜空\n每一个节拍都是冲击\n在这音浪中 释放自我\n让音乐 统治一切',
    style_tags: ['dubstep', 'edm', 'bass-house'],
    description: '震撼低频 Dubstep，AI 生成的极致低音体验',
    duration: 198,
    play_count: 2780000,
    like_count: 178000,
    collect_count: 89000,
    comment_count: 6100,
    is_published: true,
    is_original: true,
    created_at: '2024-03-01T22:00:00Z',
  },
  {
    id: 'song-8',
    title: '城市漫步',
    artist_id: 'artist-8',
    cover_url: coverImages[7],
    audio_url: '/demo-music.mp3',
    lyrics: '[Verse 1]\n走在城市的街头\n看人来人往不停留\n咖啡馆的门口\n有人在弹着吉他\n\n[Chorus]\n城市漫步 不问归处\n每一个转角都是故事\n在这喧嚣中 寻找宁静\n有一首歌 陪伴前行',
    style_tags: ['indie-folk', 'city-folk', 'acoustic'],
    description: '城市民谣，记录每一个平凡而温暖的瞬间',
    duration: 215,
    play_count: 567000,
    like_count: 34000,
    collect_count: 21000,
    comment_count: 1500,
    is_published: true,
    is_original: true,
    created_at: '2024-03-05T14:00:00Z',
  },
  {
    id: 'song-9',
    title: '量子纠缠',
    artist_id: 'artist-1',
    cover_url: coverImages[8],
    audio_url: '/demo-music.mp3',
    lyrics: '[Verse 1]\n两个粒子 跨越时空\n无论多远 心都相通\n量子世界 奇妙无穷\n纠缠在一起 不再孤独\n\n[Chorus]\n量子纠缠 爱的证明\n超越距离 超越时间\n在这宇宙 某个角落\n有个人 和你心意相通',
    style_tags: ['electronic', 'future-bass', 'mandopop'],
    description: '用音乐诠释量子物理的浪漫，电子与流行的完美融合',
    duration: 238,
    play_count: 1890000,
    like_count: 112000,
    collect_count: 56000,
    comment_count: 4200,
    is_published: true,
    is_original: true,
    created_at: '2024-03-10T10:00:00Z',
  },
  {
    id: 'song-10',
    title: 'Rainy Jazz',
    artist_id: 'artist-2',
    cover_url: coverImages[9],
    audio_url: '/demo-music.mp3',
    lyrics: '[Instrumental]\n\n雨滴的旋律\n爵士的即兴\n在这 rainy day\n让音乐治愈一切',
    style_tags: ['jazz', 'lo-fi', 'chillhop'],
    description: '雨天的爵士 Lo-fi，适合发呆和冥想',
    duration: 256,
    play_count: 890000,
    like_count: 56000,
    collect_count: 34000,
    comment_count: 2300,
    is_published: true,
    is_original: true,
    created_at: '2024-03-15T18:00:00Z',
  },
];

// Add artist info to songs
export const mockSongsWithArtists: MockSong[] = mockSongs.map((song) => ({
  ...song,
  artist: mockArtists.find((a) => a.id === song.artist_id),
}));

// Mock Comments
export const mockComments: MockComment[] = [
  {
    id: 'comment-1',
    song_id: 'song-1',
    user_id: 'artist-2',
    user: mockArtists[1],
    parent_id: null,
    content: '太美了！仿佛真的在星河中漫步，编曲的氛围感绝了 🌟',
    like_count: 234,
    is_pinned: true,
    created_at: '2024-01-16T08:00:00Z',
  },
  {
    id: 'comment-2',
    song_id: 'song-1',
    user_id: 'artist-3',
    user: mockArtists[2],
    parent_id: null,
    content: '这个音色是怎么调的？太梦幻了',
    like_count: 89,
    is_pinned: false,
    created_at: '2024-01-16T10:00:00Z',
    replies: [
      {
        id: 'comment-2-1',
        song_id: 'song-1',
        user_id: 'artist-1',
        user: mockArtists[0],
        parent_id: 'comment-2',
        content: '用了大量的 reverb 和 delay，加上一些 granular synthesis 的效果～',
        like_count: 45,
        is_pinned: false,
        created_at: '2024-01-16T12:00:00Z',
      },
    ],
  },
  {
    id: 'comment-3',
    song_id: 'song-3',
    user_id: 'artist-5',
    user: mockArtists[4],
    parent_id: null,
    content: '说唱 + 电子的融合太酷了，flow 很有特色 🔥',
    like_count: 567,
    is_pinned: false,
    created_at: '2024-02-02T09:00:00Z',
  },
  {
    id: 'comment-4',
    song_id: 'song-5',
    user_id: 'artist-1',
    user: mockArtists[0],
    parent_id: null,
    content: 'Synthwave 做得太正宗了！有种开车在迈阿密的感觉 🚗',
    like_count: 345,
    is_pinned: true,
    created_at: '2024-02-16T14:00:00Z',
  },
];

// Mock Hot Search
export const mockHotSearch: MockHotSearch[] = [
  { id: 'hs-1', keyword: '星河漫步', category: 'song', score: 9800 },
  { id: 'hs-2', keyword: '赛博诗人', category: 'artist', score: 9200 },
  { id: 'hs-3', keyword: 'Synthwave', category: 'style', score: 8900 },
  { id: 'hs-4', keyword: 'AI 音乐创作', category: 'topic', score: 8500 },
  { id: 'hs-5', keyword: 'Neon Dreams', category: 'song', score: 8200 },
  { id: 'hs-6', keyword: '国风', category: 'style', score: 7800 },
  { id: 'hs-7', keyword: '深夜调频', category: 'artist', score: 7500 },
  { id: 'hs-8', keyword: 'Lo-fi 学习', category: 'topic', score: 7200 },
  { id: 'hs-9', keyword: 'Bass Drop', category: 'song', score: 6900 },
  { id: 'hs-10', keyword: 'Dubstep', category: 'style', score: 6600 },
  { id: 'hs-11', keyword: '月光奏鸣曲', category: 'song', score: 6300 },
  { id: 'hs-12', keyword: '民谣小站', category: 'artist', score: 6000 },
  { id: 'hs-13', keyword: '电子音乐', category: 'style', score: 5700 },
  { id: 'hs-14', keyword: '说唱新势力', category: 'topic', score: 5400 },
  { id: 'hs-15', keyword: '代码与诗', category: 'song', score: 5100 },
];

// Mock Notifications
export const mockNotifications: MockNotification[] = [
  {
    id: 'notif-1',
    user_id: 'artist-1',
    type: 'like',
    from_user_id: 'artist-2',
    from_user: mockArtists[1],
    target_id: 'song-1',
    content: '赞了你的作品「星河漫步」',
    is_read: false,
    created_at: '2024-03-20T10:00:00Z',
  },
  {
    id: 'notif-2',
    user_id: 'artist-1',
    type: 'comment',
    from_user_id: 'artist-3',
    from_user: mockArtists[2],
    target_id: 'song-1',
    content: '评论了你的作品「星河漫步」',
    is_read: false,
    created_at: '2024-03-20T09:00:00Z',
  },
  {
    id: 'notif-3',
    user_id: 'artist-1',
    type: 'follow',
    from_user_id: 'artist-5',
    from_user: mockArtists[4],
    target_id: 'artist-1',
    content: '关注了你',
    is_read: true,
    created_at: '2024-03-19T15:00:00Z',
  },
  {
    id: 'notif-4',
    user_id: 'artist-1',
    type: 'mention',
    from_user_id: 'artist-4',
    from_user: mockArtists[3],
    target_id: 'comment-2',
    content: '在评论中提到了你',
    is_read: true,
    created_at: '2024-03-18T12:00:00Z',
  },
];

// Helper functions
export function formatCount(count: number): string {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getChartRanking(songs: MockSong[], type: 'hot' | 'rising' | 'new' | 'original'): MockSong[] {
  const sorted = [...songs];
  switch (type) {
    case 'hot':
      return sorted.sort((a, b) => b.play_count * 0.5 + b.like_count * 0.3 + b.collect_count * 0.2 - (a.play_count * 0.5 + a.like_count * 0.3 + a.collect_count * 0.2));
    case 'rising':
      return sorted.sort((a, b) => b.like_count - a.like_count);
    case 'new':
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case 'original':
      return sorted.filter((s) => s.is_original).sort((a, b) => b.play_count - a.play_count);
    default:
      return sorted;
  }
}

export function getArtistRanking(artists: MockArtist[]): MockArtist[] {
  return [...artists].sort(
    (a, b) =>
      b.follower_count * 0.3 +
      b.song_count * 0.2 +
      b.total_play_count * 0.0001 * 0.5 -
      (a.follower_count * 0.3 + a.song_count * 0.2 + a.total_play_count * 0.0001 * 0.5)
  );
}
