export interface SubStyle {
  id: string;
  name: string;
  nameEn: string;
  description?: string;
  artists?: string[];
}

export interface MusicStyle {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  subStyles: SubStyle[];
}

export const musicStyles: MusicStyle[] = [
  {
    id: 'pop',
    name: '流行',
    nameEn: 'Pop',
    icon: '🎤',
    color: '#ec4899',
    subStyles: [
      { id: 'mandopop', name: '华语流行', nameEn: 'Mandopop', artists: ['周杰伦', '林俊杰', '陈奕迅'] },
      { id: 'kpop', name: 'K-pop', nameEn: 'K-pop', artists: ['BTS', 'BLACKPINK', 'NewJeans'] },
      { id: 'citypop', name: 'City Pop', nameEn: 'City Pop', artists: ['竹内まりや', '山下达郎'] },
      { id: 'western-pop', name: '欧美流行', nameEn: 'Western Pop', artists: ['Taylor Swift', 'Ed Sheeran'] },
      { id: 'jpop', name: 'J-pop', nameEn: 'J-pop', artists: ['宇多田ヒカル', 'YOASOBI'] },
      { id: 'indie-pop', name: '独立流行', nameEn: 'Indie Pop', artists: ['Lana Del Rey', 'Clairo'] },
    ],
  },
  {
    id: 'rock',
    name: '摇滚',
    nameEn: 'Rock',
    icon: '🎸',
    color: '#ef4444',
    subStyles: [
      { id: 'punk', name: '朋克', nameEn: 'Punk', artists: ['Green Day', 'Blink-182'] },
      { id: 'post-rock', name: '后摇', nameEn: 'Post-Rock', artists: ['Explosions in the Sky', 'Mono'] },
      { id: 'indie-rock', name: '独立摇滚', nameEn: 'Indie Rock', artists: ['Arctic Monkeys', 'Tame Impala'] },
      { id: 'hard-rock', name: '硬摇滚', nameEn: 'Hard Rock', artists: ['AC/DC', 'Guns N\' Roses'] },
      { id: 'psychedelic', name: '迷幻摇滚', nameEn: 'Psychedelic Rock', artists: ['Pink Floyd', 'The Beatles'] },
      { id: 'alt-rock', name: '另类摇滚', nameEn: 'Alternative Rock', artists: ['Radiohead', 'Muse'] },
    ],
  },
  {
    id: 'electronic',
    name: '电子',
    nameEn: 'Electronic',
    icon: '🎹',
    color: '#8b5cf6',
    subStyles: [
      { id: 'house', name: 'House', nameEn: 'House', artists: ['Daft Punk', 'Disclosure'] },
      { id: 'techno', name: 'Techno', nameEn: 'Techno', artists: ['Carl Cox', 'Adam Beyer'] },
      { id: 'trance', name: 'Trance', nameEn: 'Trance', artists: ['Armin van Buuren', 'Above & Beyond'] },
      { id: 'dubstep', name: 'Dubstep', nameEn: 'Dubstep', artists: ['Skrillex', 'Excision'] },
      { id: 'future-bass', name: 'Future Bass', nameEn: 'Future Bass', artists: ['Flume', 'San Holo'] },
      { id: 'synthwave', name: 'Synthwave', nameEn: 'Synthwave', artists: ['The Midnight', 'FM-84'] },
      { id: 'ambient', name: 'Ambient', nameEn: 'Ambient', artists: ['Brian Eno', 'Aphex Twin'] },
    ],
  },
  {
    id: 'hiphop',
    name: '说唱',
    nameEn: 'Hip-Hop',
    icon: '🎙️',
    color: '#f59e0b',
    subStyles: [
      { id: 'trap', name: 'Trap', nameEn: 'Trap', artists: ['Travis Scott', 'Future'] },
      { id: 'boom-bap', name: 'Boom Bap', nameEn: 'Boom Bap', artists: ['Nas', 'Wu-Tang Clan'] },
      { id: 'northeast-rap', name: '东北说唱', nameEn: 'Northeast Rap', artists: ['宝石Gem', '董宝石'] },
      { id: 'sichuan-rap', name: '川渝说唱', nameEn: 'Sichuan Rap', artists: ['Higher Brothers', '王以太'] },
      { id: 'uk-drill', name: 'UK Drill', nameEn: 'UK Drill', artists: ['Central Cee', 'Headie One'] },
      { id: 'conscious', name: '意识说唱', nameEn: 'Conscious Rap', artists: ['Kendrick Lamar', 'J. Cole'] },
    ],
  },
  {
    id: 'rnb',
    name: 'R&B',
    nameEn: 'R&B',
    icon: '🎵',
    color: '#d946ef',
    subStyles: [
      { id: 'neo-soul', name: 'Neo Soul', nameEn: 'Neo Soul', artists: ['Erykah Badu', 'D\'Angelo'] },
      { id: 'retro-soul', name: '复古灵魂', nameEn: 'Retro Soul', artists: ['Aretha Franklin', 'Marvin Gaye'] },
      { id: 'contemporary-rnb', name: '当代R&B', nameEn: 'Contemporary R&B', artists: ['The Weeknd', 'Frank Ocean'] },
      { id: 'alternative-rnb', name: '另类R&B', nameEn: 'Alternative R&B', artists: ['SZA', 'Daniel Caesar'] },
    ],
  },
  {
    id: 'chinese-style',
    name: '国风',
    nameEn: 'Chinese Style',
    icon: '🏮',
    color: '#dc2626',
    subStyles: [
      { id: 'new-chinese', name: '新中式', nameEn: 'New Chinese', artists: ['周杰伦', '方文山'] },
      { id: 'opera-style', name: '戏腔', nameEn: 'Opera Style', artists: ['李玉刚'] },
      { id: 'ancient-style', name: '古风', nameEn: 'Ancient Style', artists: ['河图', 'HITA'] },
    ],
  },
  {
    id: 'folk',
    name: '民谣',
    nameEn: 'Folk',
    icon: '🪕',
    color: '#84cc16',
    subStyles: [
      { id: 'campus-folk', name: '校园民谣', nameEn: 'Campus Folk', artists: ['老狼', '朴树'] },
      { id: 'indie-folk', name: '独立民谣', nameEn: 'Indie Folk', artists: ['Bon Iver', 'Fleet Foxes'] },
      { id: 'urban-folk', name: '城市民谣', nameEn: 'Urban Folk', artists: ['赵雷', '宋冬野'] },
    ],
  },
  {
    id: 'jazz',
    name: '爵士',
    nameEn: 'Jazz',
    icon: '🎷',
    color: '#0ea5e9',
    subStyles: [
      { id: 'bebop', name: 'Bebop', nameEn: 'Bebop', artists: ['Charlie Parker', 'Dizzy Gillespie'] },
      { id: 'cool-jazz', name: 'Cool Jazz', nameEn: 'Cool Jazz', artists: ['Miles Davis', 'Chet Baker'] },
      { id: 'fusion', name: 'Fusion', nameEn: 'Fusion', artists: ['Herbie Hancock', 'Weather Report'] },
      { id: 'smooth-jazz', name: 'Smooth Jazz', nameEn: 'Smooth Jazz', artists: ['Kenny G', 'George Benson'] },
    ],
  },
  {
    id: 'classical',
    name: '古典',
    nameEn: 'Classical',
    icon: '🎻',
    color: '#6366f1',
    subStyles: [
      { id: 'romantic', name: '浪漫主义', nameEn: 'Romantic', artists: ['Chopin', 'Liszt'] },
      { id: 'neo-classical', name: '新古典', nameEn: 'Neo-Classical', artists: ['Ludovico Einaudi', 'Max Richter'] },
      { id: 'baroque', name: '巴洛克', nameEn: 'Baroque', artists: ['Bach', 'Vivaldi'] },
    ],
  },
  {
    id: 'country',
    name: '乡村',
    nameEn: 'Country',
    icon: '🤠',
    color: '#a16207',
    subStyles: [
      { id: 'new-country', name: '新乡村', nameEn: 'New Country', artists: ['Taylor Swift', 'Keith Urban'] },
      { id: 'bluegrass', name: '蓝草', nameEn: 'Bluegrass', artists: ['Bill Monroe', 'Alison Krauss'] },
    ],
  },
  {
    id: 'metal',
    name: '金属',
    nameEn: 'Metal',
    icon: '🤘',
    color: '#374151',
    subStyles: [
      { id: 'death-metal', name: '死金', nameEn: 'Death Metal', artists: ['Death', 'Cannibal Corpse'] },
      { id: 'black-metal', name: '黑金', nameEn: 'Black Metal', artists: ['Mayhem', 'Burzum'] },
      { id: 'progressive-metal', name: '前卫金属', nameEn: 'Progressive Metal', artists: ['Dream Theater', 'Tool'] },
    ],
  },
  {
    id: 'ambient-new-age',
    name: '氛围',
    nameEn: 'Ambient',
    icon: '🌌',
    color: '#06b6d4',
    subStyles: [
      { id: 'new-age', name: '新世纪', nameEn: 'New Age', artists: ['Enya', 'Yanni'] },
      { id: 'post-classical', name: '后古典', nameEn: 'Post-Classical', artists: ['Nils Frahm', 'Ólafur Arnalds'] },
      { id: 'drone', name: 'Drone', nameEn: 'Drone', artists: ['Sunn O)))', 'Earth'] },
    ],
  },
  {
    id: 'lofi',
    name: 'Lo-fi',
    nameEn: 'Lo-fi',
    icon: '📻',
    color: '#78716c',
    subStyles: [
      { id: 'chillhop', name: 'Chillhop', nameEn: 'Chillhop', artists: ['Idealism', 'Philanthrope'] },
      { id: 'lofi-hiphop', name: 'Lo-fi Hip-Hop', nameEn: 'Lo-fi Hip-Hop', artists: ['Nujabes', 'J Dilla'] },
    ],
  },
  {
    id: 'reggae',
    name: '雷鬼',
    nameEn: 'Reggae',
    icon: '🟢',
    color: '#16a34a',
    subStyles: [
      { id: 'reggae', name: 'Reggae', nameEn: 'Reggae', artists: ['Bob Marley', 'Peter Tosh'] },
      { id: 'dub', name: 'Dub', nameEn: 'Dub', artists: ['King Tubby', 'Lee "Scratch" Perry'] },
    ],
  },
  {
    id: 'world',
    name: '世界音乐',
    nameEn: 'World',
    icon: '🌍',
    color: '#059669',
    subStyles: [
      { id: 'celtic', name: '凯尔特', nameEn: 'Celtic', artists: ['Enya', 'Loreena McKennitt'] },
      { id: 'latin', name: '拉丁', nameEn: 'Latin', artists: ['Buena Vista Social Club'] },
      { id: 'african', name: '非洲鼓', nameEn: 'African', artists: ['Youssou N\'Dour'] },
      { id: 'indian', name: '印度', nameEn: 'Indian', artists: ['Ravi Shankar', 'A.R. Rahman'] },
    ],
  },
  {
    id: 'edm',
    name: 'EDM',
    nameEn: 'EDM',
    icon: '🎧',
    color: '#e11d48',
    subStyles: [
      { id: 'big-room', name: 'Big Room', nameEn: 'Big Room', artists: ['Martin Garrix', 'Dimitri Vegas'] },
      { id: 'progressive', name: 'Progressive', nameEn: 'Progressive House', artists: ['Deadmau5', 'Eric Prydz'] },
      { id: 'bass-house', name: 'Bass House', nameEn: 'Bass House', artists: ['Jauz', 'Joyryde'] },
    ],
  },
  {
    id: 'funk-disco',
    name: 'Funk/Disco',
    nameEn: 'Funk/Disco',
    icon: '🕺',
    color: '#f97316',
    subStyles: [
      { id: 'funk', name: 'Funk', nameEn: 'Funk', artists: ['James Brown', 'Parliament'] },
      { id: 'disco', name: 'Disco', nameEn: 'Disco', artists: ['Bee Gees', 'Donna Summer'] },
    ],
  },
  {
    id: 'blues',
    name: '布鲁斯',
    nameEn: 'Blues',
    icon: '🎸',
    color: '#1d4ed8',
    subStyles: [
      { id: 'delta-blues', name: 'Delta Blues', nameEn: 'Delta Blues', artists: ['Robert Johnson'] },
      { id: 'chicago-blues', name: 'Chicago Blues', nameEn: 'Chicago Blues', artists: ['Muddy Waters', 'B.B. King'] },
    ],
  },
  {
    id: 'ska',
    name: 'Ska',
    nameEn: 'Ska',
    icon: '🎺',
    color: '#eab308',
    subStyles: [
      { id: 'traditional-ska', name: 'Traditional Ska', nameEn: 'Traditional Ska', artists: ['The Specials'] },
      { id: 'ska-punk', name: 'Ska Punk', nameEn: 'Ska Punk', artists: ['Reel Big Fish', 'Less Than Jake'] },
    ],
  },
  {
    id: 'shoegaze',
    name: '自赏',
    nameEn: 'Shoegaze',
    icon: '🌊',
    color: '#7c3aed',
    subStyles: [
      { id: 'shoegaze', name: 'Shoegaze', nameEn: 'Shoegaze', artists: ['My Bloody Valentine', 'Slowdive'] },
      { id: 'dream-pop', name: 'Dream Pop', nameEn: 'Dream Pop', artists: ['Cocteau Twins', 'Beach House'] },
    ],
  },
];

export function getAllSubStyles(): SubStyle[] {
  return musicStyles.flatMap((style) => style.subStyles);
}

export function getStyleById(id: string): MusicStyle | undefined {
  return musicStyles.find((s) => s.id === id);
}

export function getSubStyleById(id: string): SubStyle | undefined {
  return getAllSubStyles().find((s) => s.id === id);
}
