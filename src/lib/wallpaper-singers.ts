/**
 * 歌手写真数据 - 50 位歌手 / 137 张写真
 * 用于创作页/首页半透明背景轮换
 */

export interface SingerWallpaper {
  id: string;
  name: string;
  nameEn: string;
  gender: 'male' | 'female' | 'band';
  region: 'chinese' | 'western' | 'korean' | 'japanese';
  genre: string;
  photos: string[];
}

// 使用 picsum.photos 作为占位图，实际使用时替换为真实写真 URL
const getPhotoUrl = (seed: string, width = 800, height = 1200) => 
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

export const WALLPAPER_SINGERS: SingerWallpaper[] = [
  // 华语男歌手 (15)
  { id: 'jay-chou', name: '周杰伦', nameEn: 'Jay Chou', gender: 'male', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('jay1'), getPhotoUrl('jay2'), getPhotoUrl('jay3')] },
  { id: 'jj-lin', name: '林俊杰', nameEn: 'JJ Lin', gender: 'male', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('jj1'), getPhotoUrl('jj2')] },
  { id: 'eason-chan', name: '陈奕迅', nameEn: 'Eason Chan', gender: 'male', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('eason1'), getPhotoUrl('eason2')] },
  { id: 'wang-feng', name: '汪峰', nameEn: 'Wang Feng', gender: 'male', region: 'chinese', genre: 'rock', photos: [getPhotoUrl('wangfeng1')] },
  { id: 'li-jian', name: '李健', nameEn: 'Li Jian', gender: 'male', region: 'chinese', genre: 'folk', photos: [getPhotoUrl('lijian1')] },
  { id: 'xu-wei', name: '许巍', nameEn: 'Xu Wei', gender: 'male', region: 'chinese', genre: 'rock', photos: [getPhotoUrl('xuwei1')] },
  { id: 'zheng-jun', name: '郑钧', nameEn: 'Zheng Jun', gender: 'male', region: 'chinese', genre: 'rock', photos: [getPhotoUrl('zhengjun1')] },
  { id: 'pu-shu', name: '朴树', nameEn: 'Pu Shu', gender: 'male', region: 'chinese', genre: 'folk', photos: [getPhotoUrl('pushu1')] },
  { id: 'dou-wei', name: '窦唯', nameEn: 'Dou Wei', gender: 'male', region: 'chinese', genre: 'rock', photos: [getPhotoUrl('douwei1')] },
  { id: 'cui-jian', name: '崔健', nameEn: 'Cui Jian', gender: 'male', region: 'chinese', genre: 'rock', photos: [getPhotoUrl('cuijian1')] },
  { id: 'li-ronghao', name: '李荣浩', nameEn: 'Li Ronghao', gender: 'male', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('lironghao1')] },
  { id: 'xue-zhiqian', name: '薛之谦', nameEn: 'Joker Xue', gender: 'male', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('xuezhiqian1')] },
  { id: 'mao-buyi', name: '毛不易', nameEn: 'Mao Buyi', gender: 'male', region: 'chinese', genre: 'folk', photos: [getPhotoUrl('maobuyi1')] },
  { id: 'hua-chenyu', name: '华晨宇', nameEn: 'Hua Chenyu', gender: 'male', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('huachenyu1')] },
  { id: 'zhang-jie', name: '张杰', nameEn: 'Jason Zhang', gender: 'male', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('zhangjie1')] },

  // 华语女歌手 (15)
  { id: 'faye-wong', name: '王菲', nameEn: 'Faye Wong', gender: 'female', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('faye1'), getPhotoUrl('faye2')] },
  { id: 'stefanie-sun', name: '孙燕姿', nameEn: 'Stefanie Sun', gender: 'female', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('stefanie1')] },
  { id: 'jolin-tsai', name: '蔡依林', nameEn: 'Jolin Tsai', gender: 'female', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('jolin1')] },
  { id: 'angela-zhang', name: '张韶涵', nameEn: 'Angela Zhang', gender: 'female', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('angela1')] },
  { id: 'fish-leong', name: '梁静茹', nameEn: 'Fish Leong', gender: 'female', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('fishleong1')] },
  { id: 'christine-fan', name: '范玮琪', nameEn: 'Christine Fan', gender: 'female', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('fanfan1')] },
  { id: 'ting-ting', name: '丁当', nameEn: 'Della Ding', gender: 'female', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('dingdang1')] },
  { id: 'jane-zhang', name: '张靓颖', nameEn: 'Jane Zhang', gender: 'female', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('janezhang1')] },
  { id: 'bibi-zhou', name: '周笔畅', nameEn: 'Bibi Zhou', gender: 'female', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('bibi1')] },
  { id: 'chun-xiao', name: '春晓', nameEn: 'Chun Xiao', gender: 'female', region: 'chinese', genre: 'folk', photos: [getPhotoUrl('chunxiao1')] },
  { id: 'yao-beina', name: '姚贝娜', nameEn: 'Yao Beina', gender: 'female', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('yaobeina1')] },
  { id: 'tan-weiwei', name: '谭维维', nameEn: 'Tan Weiwei', gender: 'female', region: 'chinese', genre: 'rock', photos: [getPhotoUrl('tanweiwei1')] },
  { id: 'jessica-lee', name: '李玟', nameEn: 'CoCo Lee', gender: 'female', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('coco1')] },
  { id: 'karen-mok', name: '莫文蔚', nameEn: 'Karen Mok', gender: 'female', region: 'chinese', genre: 'pop', photos: [getPhotoUrl('karen1')] },
  { id: 'sodagreen-qingfeng', name: '吴青峰', nameEn: 'Wu Qingfeng', gender: 'male', region: 'chinese', genre: 'indie', photos: [getPhotoUrl('qingfeng1')] },

  // 欧美男歌手 (8)
  { id: 'ed-sheeran', name: 'Ed Sheeran', nameEn: 'Ed Sheeran', gender: 'male', region: 'western', genre: 'pop', photos: [getPhotoUrl('ed1')] },
  { id: 'bruno-mars', name: 'Bruno Mars', nameEn: 'Bruno Mars', gender: 'male', region: 'western', genre: 'pop', photos: [getPhotoUrl('bruno1')] },
  { id: 'justin-bieber', name: 'Justin Bieber', nameEn: 'Justin Bieber', gender: 'male', region: 'western', genre: 'pop', photos: [getPhotoUrl('bieber1')] },
  { id: 'the-weeknd', name: 'The Weeknd', nameEn: 'The Weeknd', gender: 'male', region: 'western', genre: 'rnb', photos: [getPhotoUrl('weeknd1')] },
  { id: 'drake', name: 'Drake', nameEn: 'Drake', gender: 'male', region: 'western', genre: 'hiphop', photos: [getPhotoUrl('drake1')] },
  { id: 'post-malone', name: 'Post Malone', nameEn: 'Post Malone', gender: 'male', region: 'western', genre: 'hiphop', photos: [getPhotoUrl('post1')] },
  { id: 'shawn-mendes', name: 'Shawn Mendes', nameEn: 'Shawn Mendes', gender: 'male', region: 'western', genre: 'pop', photos: [getPhotoUrl('shawn1')] },
  { id: 'charlie-puth', name: 'Charlie Puth', nameEn: 'Charlie Puth', gender: 'male', region: 'western', genre: 'pop', photos: [getPhotoUrl('charlie1')] },

  // 欧美女歌手 (7)
  { id: 'taylor-swift', name: 'Taylor Swift', nameEn: 'Taylor Swift', gender: 'female', region: 'western', genre: 'pop', photos: [getPhotoUrl('taylor1'), getPhotoUrl('taylor2')] },
  { id: 'adele', name: 'Adele', nameEn: 'Adele', gender: 'female', region: 'western', genre: 'pop', photos: [getPhotoUrl('adele1')] },
  { id: 'ariana-grande', name: 'Ariana Grande', nameEn: 'Ariana Grande', gender: 'female', region: 'western', genre: 'pop', photos: [getPhotoUrl('ariana1')] },
  { id: 'billie-eilish', name: 'Billie Eilish', nameEn: 'Billie Eilish', gender: 'female', region: 'western', genre: 'pop', photos: [getPhotoUrl('billie1')] },
  { id: 'dua-lipa', name: 'Dua Lipa', nameEn: 'Dua Lipa', gender: 'female', region: 'western', genre: 'pop', photos: [getPhotoUrl('dua1')] },
  { id: 'rihanna', name: 'Rihanna', nameEn: 'Rihanna', gender: 'female', region: 'western', genre: 'pop', photos: [getPhotoUrl('rihanna1')] },
  { id: 'beyonce', name: 'Beyoncé', nameEn: 'Beyoncé', gender: 'female', region: 'western', genre: 'rnb', photos: [getPhotoUrl('beyonce1')] },

  // 韩国歌手 (5)
  { id: 'bts-jungkook', name: 'Jungkook', nameEn: 'Jungkook (BTS)', gender: 'male', region: 'korean', genre: 'kpop', photos: [getPhotoUrl('jungkook1')] },
  { id: 'iu', name: 'IU', nameEn: 'IU', gender: 'female', region: 'korean', genre: 'kpop', photos: [getPhotoUrl('iu1')] },
  { id: 'blackpink-rose', name: 'Rosé', nameEn: 'Rosé (BLACKPINK)', gender: 'female', region: 'korean', genre: 'kpop', photos: [getPhotoUrl('rose1')] },
  { id: 'taeyeon', name: 'Taeyeon', nameEn: 'Taeyeon', gender: 'female', region: 'korean', genre: 'kpop', photos: [getPhotoUrl('taeyeon1')] },
  { id: 'g-dragon', name: 'G-Dragon', nameEn: 'G-Dragon', gender: 'male', region: 'korean', genre: 'kpop', photos: [getPhotoUrl('gd1')] },

  // 日本歌手 (5)
  { id: 'utada-hikaru', name: '宇多田光', nameEn: 'Utada Hikaru', gender: 'female', region: 'japanese', genre: 'jpop', photos: [getPhotoUrl('utada1')] },
  { id: 'hamasaki-ayumi', name: '滨崎步', nameEn: 'Ayumi Hamasaki', gender: 'female', region: 'japanese', genre: 'jpop', photos: [getPhotoUrl('ayumi1')] },
  { id: 'yonezu-kenshi', name: '米津玄师', nameEn: 'Kenshi Yonezu', gender: 'male', region: 'japanese', genre: 'jpop', photos: [getPhotoUrl('yonezu1')] },
  { id: 'back-number', name: 'back number', nameEn: 'back number', gender: 'band', region: 'japanese', genre: 'jpop', photos: [getPhotoUrl('backnumber1')] },
  { id: 'one-ok-rock', name: 'ONE OK ROCK', nameEn: 'ONE OK ROCK', gender: 'band', region: 'japanese', genre: 'rock', photos: [getPhotoUrl('oneokrock1')] },
];

// 获取所有写真 URL 的扁平列表（用于背景轮换）
export const getAllPhotoUrls = (): { url: string; singerId: string; gender: 'male' | 'female' | 'band' }[] => {
  const photos: { url: string; singerId: string; gender: 'male' | 'female' | 'band' }[] = [];
  WALLPAPER_SINGERS.forEach(singer => {
    singer.photos.forEach(photo => {
      photos.push({ url: photo, singerId: singer.id, gender: singer.gender });
    });
  });
  return photos;
};

// 按性别筛选写真
export const getPhotosByGender = (gender: 'male' | 'female') => {
  return getAllPhotoUrls().filter(p => p.gender === gender);
};

// 随机获取一张写真
export const getRandomPhoto = (gender?: 'male' | 'female'): { url: string; singerId: string } => {
  const photos = gender ? getPhotosByGender(gender) : getAllPhotoUrls();
  const idx = Math.floor(Math.random() * photos.length);
  return { url: photos[idx].url, singerId: photos[idx].singerId };
};

// 获取 Top 50 歌手（用于背景轮换）
export const getTopSingers = (limit = 50) => WALLPAPER_SINGERS.slice(0, limit);
