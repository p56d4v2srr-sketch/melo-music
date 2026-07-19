/**
 * 300 种音乐风格库
 * 覆盖：摇滚、流行、电子、嘻哈、爵士/布鲁斯、古典/新世纪、世界音乐、R&B/Soul、金属、乡村/民谣、雷鬼/拉丁、中国风、新国风、戏曲、民族民间、传统器乐、华语周杰伦式、后摇、数学摇滚、K-Pop、J-Pop、C-Pop、T-Pop、V-Pop、Latin Urban、Lo-fi、Bass、Epic Score、Anime Score 等
 */

export interface Genre {
  id: number;
  category: string;
  categoryEn: string;
  nameZh: string;
  nameEn: string;
  emoji: string;
  oneLiner: string;
  representative?: string;
  movement?: string[];
  hotness?: number;
}

export const GENRES: Genre[] = [
  // 🎸 摇滚系 1-15
  { id: 1, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '经典摇滚', nameEn: 'Classic Rock', emoji: '🎸', oneLiner: '热血、怀旧、自由' },
  { id: 2, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '硬摇滚', nameEn: 'Hard Rock', emoji: '🎸', oneLiner: '愤怒、力量、爆发' },
  { id: 3, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '软摇滚', nameEn: 'Soft Rock', emoji: '🎸', oneLiner: '温柔、浪漫、感伤' },
  { id: 4, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '朋克摇滚', nameEn: 'Punk Rock', emoji: '🤘', oneLiner: '反叛、宣泄、不服' },
  { id: 5, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '流行朋克', nameEn: 'Pop Punk', emoji: '🤘', oneLiner: '青春、躁动、倔强' },
  { id: 6, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '垃圾摇滚', nameEn: 'Grunge', emoji: '🎸', oneLiner: '颓废、迷茫、挣扎' },
  { id: 7, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '英伦摇滚', nameEn: 'Britpop', emoji: '🇬🇧', oneLiner: '优雅、都市、淡淡忧伤' },
  { id: 8, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '前卫摇滚', nameEn: 'Progressive Rock', emoji: '🎸', oneLiner: '史诗、哲学、宏大叙事' },
  { id: 9, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '艺术摇滚', nameEn: 'Art Rock', emoji: '🎨', oneLiner: '实验、深邃、意识流' },
  { id: 10, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '另类摇滚', nameEn: 'Alternative Rock', emoji: '🎸', oneLiner: '个性、独立、与众不同' },
  { id: 11, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '后摇', nameEn: 'Post-Rock', emoji: '🌌', oneLiner: '大气、渐进、电影感' },
  { id: 12, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '数学摇滚', nameEn: 'Math Rock', emoji: '🧮', oneLiner: '复杂、精密、烧脑' },
  { id: 13, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '后朋克', nameEn: 'Post-Punk', emoji: '🌆', oneLiner: '冷峻、都市、疏离' },
  { id: 14, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '盯鞋摇滚', nameEn: 'Shoegaze', emoji: '👟', oneLiner: '迷幻、沉浸、模糊美' },
  { id: 15, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '梦泡', nameEn: 'Dream Pop', emoji: '☁️', oneLiner: '梦幻、朦胧、漂浮感' },

  // 🎤 流行系 16-27
  { id: 16, category: '🎤 流行', categoryEn: 'Pop', nameZh: '主流流行', nameEn: 'Mainstream Pop', emoji: '🎤', oneLiner: '大众、明亮、朗朗上口' },
  { id: 17, category: '🎤 流行', categoryEn: 'Pop', nameZh: '独立流行', nameEn: 'Indie Pop', emoji: '🎧', oneLiner: '清新、文艺、小众感' },
  { id: 18, category: '🎤 流行', categoryEn: 'Pop', nameZh: '合成器流行', nameEn: 'Synthpop', emoji: '🎹', oneLiner: '复古未来、霓虹、电子感' },
  { id: 19, category: '🎤 流行', categoryEn: 'Pop', nameZh: '舞曲流行', nameEn: 'Dance-Pop', emoji: '💃', oneLiner: '派对、快乐、动感' },
  { id: 20, category: '🎤 流行', categoryEn: 'Pop', nameZh: '巴洛克流行', nameEn: 'Baroque Pop', emoji: '🎼', oneLiner: '华丽、古典优雅、戏剧感' },
  { id: 21, category: '🎤 流行', categoryEn: 'Pop', nameZh: '室内流行', nameEn: 'Chamber Pop', emoji: '🎻', oneLiner: '精致、内敛、弦乐感' },
  { id: 22, category: '🎤 流行', categoryEn: 'Pop', nameZh: '可爱流行', nameEn: 'Twee Pop', emoji: '🌸', oneLiner: '甜美、天真、少女心' },
  { id: 23, category: '🎤 流行', categoryEn: 'Pop', nameZh: '欧陆舞曲', nameEn: 'Eurodance', emoji: '🕺', oneLiner: '90s狂欢、高能、怀旧' },
  { id: 24, category: '🎤 流行', categoryEn: 'Pop', nameZh: '韩流流行', nameEn: 'K-Pop', emoji: '🇰🇷', oneLiner: '精致、潮流、偶像感' },
  { id: 25, category: '🎤 流行', categoryEn: 'Pop', nameZh: '华语流行', nameEn: 'C-Pop', emoji: '🇨🇳', oneLiner: '情歌、叙事、大众共鸣' },
  { id: 26, category: '🎤 流行', categoryEn: 'Pop', nameZh: '日系流行', nameEn: 'J-Pop', emoji: '🇯🇵', oneLiner: '细腻、青春、二次元感' },
  { id: 27, category: '🎤 流行', categoryEn: 'Pop', nameZh: '卧室流行', nameEn: 'Bedroom Pop', emoji: '🛏️', oneLiner: '私密、慵懒、DIY感' },

  // 🎹 电子系 28-39
  { id: 28, category: '🎹 电子', categoryEn: 'Electronic', nameZh: '电子舞曲', nameEn: 'EDM', emoji: '🎧', oneLiner: '燃、炸、现场感' },
  { id: 29, category: '🎹 电子', categoryEn: 'Electronic', nameZh: '浩室', nameEn: 'House', emoji: '🏠', oneLiner: '律动、夜店、自由' },
  { id: 30, category: '🎹 电子', categoryEn: 'Electronic', nameZh: '科技舞曲', nameEn: 'Techno', emoji: '🤖', oneLiner: '机械、冷酷、未来' },
  { id: 31, category: '🎹 电子', categoryEn: 'Electronic', nameZh: '迷幻舞曲', nameEn: 'Trance', emoji: '🌌', oneLiner: '升天、超越、宇宙感' },
  { id: 32, category: '🎹 电子', categoryEn: 'Electronic', nameZh: '鼓打贝斯', nameEn: 'Drum & Bass', emoji: '🥁', oneLiner: '高速、紧张、肾上腺素' },
  { id: 33, category: '🎹 电子', categoryEn: 'Electronic', nameZh: '回响贝斯', nameEn: 'Dubstep', emoji: '🔊', oneLiner: '重低音、炸裂、力量' },
  { id: 34, category: '🎹 电子', categoryEn: 'Electronic', nameZh: '氛围电子', nameEn: 'Ambient', emoji: '🌫️', oneLiner: '空灵、冥想、太空' },
  { id: 35, category: '🎹 电子', categoryEn: 'Electronic', nameZh: '弛放', nameEn: 'Chillout', emoji: '🌅', oneLiner: '放松、海边、日落' },
  { id: 36, category: '🎹 电子', categoryEn: 'Electronic', nameZh: '低保真', nameEn: 'Lo-fi', emoji: '📻', oneLiner: '慵懒、学习、怀旧磁带感' },
  { id: 37, category: '🎹 电子', categoryEn: 'Electronic', nameZh: '蒸汽波', nameEn: 'Vaporwave', emoji: '🌴', oneLiner: '复古、梦幻、互联网美学' },
  { id: 38, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Future Bass', nameEn: 'Future Bass', emoji: '🎹', oneLiner: '明亮、跳跃、情感爆发' },
  { id: 39, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Trap EDM', nameEn: 'Trap EDM', emoji: '🔥', oneLiner: '重拍、街头、电子融合' },

  // 🎤 嘻哈/说唱系 40-52
  { id: 40, category: '🎤 嘻哈', categoryEn: 'Hip-Hop', nameZh: '老派嘻哈', nameEn: 'Old School Hip-Hop', emoji: '🎤', oneLiner: '经典、节奏、街头' },
  { id: 41, category: '🎤 嘻哈', categoryEn: 'Hip-Hop', nameZh: '新派嘻哈', nameEn: 'New School Hip-Hop', emoji: '🎤', oneLiner: '现代、多变、潮流' },
  { id: 42, category: '🎤 嘻哈', categoryEn: 'Hip-Hop', nameZh: '陷阱说唱', nameEn: 'Trap', emoji: '🔥', oneLiner: '重低音、快速hi-hat、街头' },
  { id: 43, category: '🎤 嘻哈', categoryEn: 'Hip-Hop', nameZh: '钻头说唱', nameEn: 'Drill', emoji: '🗡️', oneLiner: '暗黑、暴力美学、伦敦/芝加哥' },
  { id: 44, category: '🎤 嘻哈', categoryEn: 'Hip-Hop', nameZh: '爵士说唱', nameEn: 'Jazz Rap', emoji: '🎷', oneLiner: '优雅、采样、文艺' },
  { id: 45, category: '🎤 嘻哈', categoryEn: 'Hip-Hop', nameZh: '意识说唱', nameEn: 'Conscious Rap', emoji: '🧠', oneLiner: '社会议题、深度、思考' },
  { id: 46, category: '🎤 嘻哈', categoryEn: 'Hip-Hop', nameZh: '匪帮说唱', nameEn: 'Gangsta Rap', emoji: '🔫', oneLiner: '街头、真实、硬核' },
  { id: 47, category: '🎤 嘻哈', categoryEn: 'Hip-Hop', nameZh: '流行说唱', nameEn: 'Pop Rap', emoji: '🎤', oneLiner: '旋律、大众、电台友好' },
  { id: 48, category: '🎤 嘻哈', categoryEn: 'Hip-Hop', nameZh: '中文说唱', nameEn: 'Chinese Hip-Hop', emoji: '🇨🇳', oneLiner: '方言、本土、新世代' },
  { id: 49, category: '🎤 嘻哈', categoryEn: 'Hip-Hop', nameZh: '国风说唱', nameEn: 'Guofeng Rap', emoji: '🏮', oneLiner: '中国风+说唱，古今碰撞', movement: ['新国风'] },
  { id: 50, category: '🎤 嘻哈', categoryEn: 'Hip-Hop', nameZh: 'Emo Rap', nameEn: 'Emo Rap', emoji: '💔', oneLiner: '情绪化、脆弱、旋律说唱' },
  { id: 51, category: '🎤 嘻哈', categoryEn: 'Hip-Hop', nameZh: 'Boom Bap', nameEn: 'Boom Bap', emoji: '🥁', oneLiner: '经典鼓点、采样、90s纽约' },
  { id: 52, category: '🎤 嘻哈', categoryEn: 'Hip-Hop', nameZh: 'Lo-fi Hip-Hop', nameEn: 'Lo-fi Hip-Hop', emoji: '📻', oneLiner: '学习伴侣、慵懒、怀旧' },

  // 🎷 爵士/布鲁斯系 53-62
  { id: 53, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '爵士', nameEn: 'Jazz', emoji: '🎷', oneLiner: '即兴、摇摆、优雅' },
  { id: 54, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '摇摆乐', nameEn: 'Swing', emoji: '🕺', oneLiner: '30s复古、舞厅、欢快' },
  { id: 55, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '比波普', nameEn: 'Bebop', emoji: '🎷', oneLiner: '快速、复杂、即兴' },
  { id: 56, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '冷爵士', nameEn: 'Cool Jazz', emoji: '🧊', oneLiner: '冷静、内敛、西海岸' },
  { id: 57, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '自由爵士', nameEn: 'Free Jazz', emoji: '🎺', oneLiner: '无拘无束、实验、前卫' },
  { id: 58, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '融合爵士', nameEn: 'Jazz Fusion', emoji: '🎸', oneLiner: '爵士+摇滚+放克' },
  { id: 59, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '波萨诺瓦', nameEn: 'Bossa Nova', emoji: '🌴', oneLiner: '巴西、慵懒、海边' },
  { id: 60, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '布鲁斯', nameEn: 'Blues', emoji: '🎸', oneLiner: '忧郁、十二小节、灵魂' },
  { id: 61, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '节奏布鲁斯', nameEn: 'R&B', emoji: '🎤', oneLiner: '律动、灵魂、现代' },
  { id: 62, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '新灵魂', nameEn: 'Neo-Soul', emoji: '🎤', oneLiner: '90s复兴、温暖、有机' },

  // 🎻 古典/新世纪/氛围 63-77
  { id: 63, category: '🎻 古典/新世纪', categoryEn: 'Classical/New Age', nameZh: '巴洛克', nameEn: 'Baroque', emoji: '🎻', oneLiner: '华丽、对位、巴赫时代' },
  { id: 64, category: '🎻 古典/新世纪', categoryEn: 'Classical/New Age', nameZh: '古典主义', nameEn: 'Classical', emoji: '🎼', oneLiner: '均衡、优雅、莫扎特时代' },
  { id: 65, category: '🎻 古典/新世纪', categoryEn: 'Classical/New Age', nameZh: '浪漫主义', nameEn: 'Romantic', emoji: '🎹', oneLiner: '情感、宏大、肖邦时代' },
  { id: 66, category: '🎻 古典/新世纪', categoryEn: 'Classical/New Age', nameZh: '现代古典', nameEn: 'Modern Classical', emoji: '🎹', oneLiner: '极简、实验、当代' },
  { id: 67, category: '🎻 古典/新世纪', categoryEn: 'Classical/New Age', nameZh: '极简主义', nameEn: 'Minimalism', emoji: '🎹', oneLiner: '重复、渐进、冥想' },
  { id: 68, category: '🎻 古典/新世纪', categoryEn: 'Classical/New Age', nameZh: '管弦乐', nameEn: 'Orchestral', emoji: '🎻', oneLiner: '交响、宏大、电影感' },
  { id: 69, category: '🎻 古典/新世纪', categoryEn: 'Classical/New Age', nameZh: '室内乐', nameEn: 'Chamber Music', emoji: '🎻', oneLiner: '精致、小编制、对话' },
  { id: 70, category: '🎻 古典/新世纪', categoryEn: 'Classical/New Age', nameZh: '歌剧', nameEn: 'Opera', emoji: '🎭', oneLiner: '戏剧、咏叹调、华丽' },
  { id: 71, category: '🎻 古典/新世纪', categoryEn: 'Classical/New Age', nameZh: '合唱', nameEn: 'Choral', emoji: '🎵', oneLiner: '人声、神圣、和谐' },
  { id: 72, category: '🎻 古典/新世纪', categoryEn: 'Classical/New Age', nameZh: '管弦流行', nameEn: 'Orchestral Pop', emoji: '🎻', oneLiner: '流行+交响，大气磅礴' },
  { id: 73, category: '🎻 古典/新世纪', categoryEn: 'Classical/New Age', nameZh: '新世纪', nameEn: 'New Age', emoji: '🌅', oneLiner: '冥想、自然、疗愈' },
  { id: 74, category: '🎻 古典/新世纪', categoryEn: 'Classical/New Age', nameZh: '冥想音乐', nameEn: 'Meditation', emoji: '🧘', oneLiner: '空灵、瑜伽、内心' },
  { id: 75, category: '🎻 古典/新世纪', categoryEn: 'Classical/New Age', nameZh: '环境音乐', nameEn: 'Environmental', emoji: '🌿', oneLiner: '自然声、放松、背景' },
  { id: 76, category: '🎻 古典/新世纪', categoryEn: 'Classical/New Age', nameZh: '治愈音乐', nameEn: 'Healing', emoji: '💆', oneLiner: '频率、疗愈、身心' },
  { id: 77, category: '🎻 古典/新世纪', categoryEn: 'Classical/New Age', nameZh: '太空音乐', nameEn: 'Space Music', emoji: '🚀', oneLiner: '宇宙、漂浮、科幻' },

  // 🌍 世界音乐/民族系 78-86
  { id: 78, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: '凯尔特', nameEn: 'Celtic', emoji: '🍀', oneLiner: '爱尔兰、风笛、田园' },
  { id: 79, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: '弗拉门戈', nameEn: 'Flamenco', emoji: '💃', oneLiner: '西班牙、吉他、激情' },
  { id: 80, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: '探戈', nameEn: 'Tango', emoji: '🕺', oneLiner: '阿根廷、班多钮、忧郁' },
  { id: 81, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: '非洲节拍', nameEn: 'Afrobeat', emoji: '🥁', oneLiner: '西非、律动、放克' },
  { id: 82, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: '雷鬼', nameEn: 'Reggae', emoji: '🇯🇲', oneLiner: '牙买加、反拍、和平' },
  { id: 83, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: '萨尔萨', nameEn: 'Salsa', emoji: '💃', oneLiner: '拉丁、热情、舞池' },
  { id: 84, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: '桑巴', nameEn: 'Samba', emoji: '🇧🇷', oneLiner: '巴西、狂欢、节奏' },
  { id: 85, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: '印度古典', nameEn: 'Indian Classical', emoji: '🇮🇳', oneLiner: '西塔琴、拉格、冥想' },
  { id: 86, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: '中东音乐', nameEn: 'Middle Eastern', emoji: '🕌', oneLiner: '乌德琴、神秘、异域' },

  // 🎸 金属系 87-93
  { id: 87, category: '🎸 金属', categoryEn: 'Metal', nameZh: '重金属', nameEn: 'Heavy Metal', emoji: '🤘', oneLiner: '力量、riff、经典' },
  { id: 88, category: '🎸 金属', categoryEn: 'Metal', nameZh: '鞭挞金属', nameEn: 'Thrash Metal', emoji: '🤘', oneLiner: '快速、攻击性、80s' },
  { id: 89, category: '🎸 金属', categoryEn: 'Metal', nameZh: '死亡金属', nameEn: 'Death Metal', emoji: '💀', oneLiner: '极端、咆哮、黑暗' },
  { id: 90, category: '🎸 金属', categoryEn: 'Metal', nameZh: '黑金属', nameEn: 'Black Metal', emoji: '🌑', oneLiner: '冰冷、原始、反宗教' },
  { id: 91, category: '🎸 金属', categoryEn: 'Metal', nameZh: '力量金属', nameEn: 'Power Metal', emoji: '⚔️', oneLiner: '史诗、高亢、奇幻' },
  { id: 92, category: '🎸 金属', categoryEn: 'Metal', nameZh: '交响金属', nameEn: 'Symphonic Metal', emoji: '🎻', oneLiner: '金属+管弦，宏大叙事' },
  { id: 93, category: '🎸 金属', categoryEn: 'Metal', nameZh: '前卫金属', nameEn: 'Progressive Metal', emoji: '🎸', oneLiner: '复杂、技术、长篇' },

  // 🤠 乡村/民谣系 94-100
  { id: 94, category: '🤠 乡村/民谣', categoryEn: 'Country/Folk', nameZh: '传统乡村', nameEn: 'Traditional Country', emoji: '🤠', oneLiner: '纳什维尔、吉他、故事' },
  { id: 95, category: '🤠 乡村/民谣', categoryEn: 'Country/Folk', nameZh: '现代乡村', nameEn: 'Modern Country', emoji: '🤠', oneLiner: '流行化、电台、大众' },
  { id: 96, category: '🤠 乡村/民谣', categoryEn: 'Country/Folk', nameZh: '蓝草', nameEn: 'Bluegrass', emoji: '🪕', oneLiner: '班卓、快速、阿巴拉契亚' },
  { id: 97, category: '🤠 乡村/民谣', categoryEn: 'Country/Folk', nameZh: '美式民谣', nameEn: 'Americana', emoji: '🇺🇸', oneLiner: '根源、质朴、美国精神' },
  { id: 98, category: '🤠 乡村/民谣', categoryEn: 'Country/Folk', nameZh: '民谣', nameEn: 'Folk', emoji: '🎸', oneLiner: '木吉他、叙事、传统' },
  { id: 99, category: '🤠 乡村/民谣', categoryEn: 'Country/Folk', nameZh: '独立民谣', nameEn: 'Indie Folk', emoji: '🌲', oneLiner: '文艺、清新、现代' },
  { id: 100, category: '🤠 乡村/民谣', categoryEn: 'Country/Folk', nameZh: '民谣摇滚', nameEn: 'Folk Rock', emoji: '🎸', oneLiner: '民谣+摇滚，60s复兴' },

  // 🏮 中国风/新国风 101-112
  { id: 101, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '中国风', nameEn: 'Chinese Style', emoji: '🏮', oneLiner: '五声音阶、古风歌词、传统乐器', hotness: 85 },
  { id: 102, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '国风电子', nameEn: 'Guofeng Electronic', emoji: '🐉', oneLiner: '电子+国风，赛博古典', movement: ['新国风'], hotness: 86 },
  { id: 103, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '古风', nameEn: 'Ancient Style', emoji: '🏯', oneLiner: '仙侠、古典、诗意', hotness: 80 },
  { id: 104, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '国风摇滚', nameEn: 'Guofeng Rock', emoji: '🎸', oneLiner: '摇滚+国风，燃炸', movement: ['新国风'], hotness: 75 },
  { id: 105, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '国风流行', nameEn: 'Guofeng Pop', emoji: '🎤', oneLiner: '流行+国风，大众化', hotness: 82 },
  { id: 106, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '国风说唱', nameEn: 'Guofeng Rap', emoji: '🎤', oneLiner: '说唱+国风，古今碰撞', movement: ['新国风'], hotness: 78 },
  { id: 107, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '新国风民乐', nameEn: 'New Chinese Folk', emoji: '🪕', oneLiner: '民乐+现代编曲+流行唱法', representative: '自得琴社《百鸟朝凤》新编版', movement: ['新国风'], hotness: 82 },
  { id: 108, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '新国风民谣', nameEn: 'New Guofeng Folk', emoji: '🌸', oneLiner: '木吉他+竹笛+诗意歌词', representative: '银临《锦鲤抄》、河图《倾尽天下》', movement: ['新国风'], hotness: 90 },
  { id: 109, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '戏腔国风', nameEn: 'Opera-Pop', emoji: '🎭', oneLiner: '流行旋律+京剧/昆曲唱腔', representative: '霍尊《卷珠帘》、闻人听書《虞兮叹》', movement: ['新国风'], hotness: 97 },
  { id: 110, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '国风交响', nameEn: 'Guofeng Symphony', emoji: '🎻', oneLiner: '民族乐团+管弦编曲', representative: '艺术体操队《凤鸣凌霄》巴黎夺冠用曲', movement: ['新国风'], hotness: 89 },
  { id: 111, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '暗黑国风', nameEn: 'Dark Guofeng', emoji: '🌑', oneLiner: '暗黑编曲+古风歌词', representative: 'Dawn《难生恨》', movement: ['新国风'], hotness: 78 },
  { id: 112, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '国潮电子', nameEn: 'Guochao Electronic', emoji: '🐉', oneLiner: 'AI+电子+国风，赛博国潮', representative: '2026最新趋势', movement: ['新国风'], hotness: 86 },

  // 🎭 戏曲系 113-119
  { id: 113, category: '🎭 戏曲', categoryEn: 'Chinese-Opera', nameZh: '京剧', nameEn: 'Peking Opera', emoji: '🎭', oneLiner: '西皮二黄、唱念做打' },
  { id: 114, category: '🎭 戏曲', categoryEn: 'Chinese-Opera', nameZh: '昆曲', nameEn: 'Kunqu Opera', emoji: '🌸', oneLiner: '水磨腔、典雅精致、百戏之祖' },
  { id: 115, category: '🎭 戏曲', categoryEn: 'Chinese-Opera', nameZh: '越剧', nameEn: 'Yue Opera', emoji: '💜', oneLiner: '柔美婉转、江南水乡' },
  { id: 116, category: '🎭 戏曲', categoryEn: 'Chinese-Opera', nameZh: '黄梅戏', nameEn: 'Huangmei Opera', emoji: '🌼', oneLiner: '清新明快、通俗易懂' },
  { id: 117, category: '🎭 戏曲', categoryEn: 'Chinese-Opera', nameZh: '豫剧', nameEn: 'Yu Opera', emoji: '⚔️', oneLiner: '铿锵有力、中原大气' },
  { id: 118, category: '🎭 戏曲', categoryEn: 'Chinese-Opera', nameZh: '川剧', nameEn: 'Sichuan Opera', emoji: '🔥', oneLiner: '变脸喷火、高腔帮腔' },
  { id: 119, category: '🎭 戏曲', categoryEn: 'Chinese-Opera', nameZh: '粤剧', nameEn: 'Cantonese Opera', emoji: '🥁', oneLiner: '粤语唱腔、南国风韵' },

  // 🏔️ 民族/民间系 120-125
  { id: 120, category: '🏔️ 民族/民间', categoryEn: 'Ethnic-Folk', nameZh: '江南丝竹', nameEn: 'Jiangnan Sizhu', emoji: '🎋', oneLiner: '丝弦+竹管、清新雅致' },
  { id: 121, category: '🏔️ 民族/民间', categoryEn: 'Ethnic-Folk', nameZh: '广东音乐', nameEn: 'Cantonese Music', emoji: '🌊', oneLiner: '高胡领奏、轻快明亮' },
  { id: 122, category: '🏔️ 民族/民间', categoryEn: 'Ethnic-Folk', nameZh: '蒙古长调', nameEn: 'Mongolian Long Tune', emoji: '🐎', oneLiner: '辽阔草原、气息悠长' },
  { id: 123, category: '🏔️ 民族/民间', categoryEn: 'Ethnic-Folk', nameZh: '藏族民歌', nameEn: 'Tibetan Folk', emoji: '⛰️', oneLiner: '高原天籁、庄严肃穆' },
  { id: 124, category: '🏔️ 民族/民间', categoryEn: 'Ethnic-Folk', nameZh: '西北民歌', nameEn: 'Northwest Folk', emoji: '🌾', oneLiner: '信天游、苍凉高亢' },
  { id: 125, category: '🏔️ 民族/民间', categoryEn: 'Ethnic-Folk', nameZh: '少数民族歌舞', nameEn: 'Ethnic Dance', emoji: '💃', oneLiner: '56个民族56朵花' },

  // 🪕 传统器乐/曲艺系 126-132
  { id: 126, category: '🪕 传统器乐', categoryEn: 'Traditional-Instruments', nameZh: '古琴', nameEn: 'Guqin', emoji: '🪕', oneLiner: '七弦清音、文人雅乐' },
  { id: 127, category: '🪕 传统器乐', categoryEn: 'Traditional-Instruments', nameZh: '古筝', nameEn: 'Guzheng', emoji: '🪕', oneLiner: '二十一弦、流水行云' },
  { id: 128, category: '🪕 传统器乐', categoryEn: 'Traditional-Instruments', nameZh: '二胡', nameEn: 'Erhu', emoji: '🎻', oneLiner: '两根弦拉尽人间悲欢' },
  { id: 129, category: '🪕 传统器乐', categoryEn: 'Traditional-Instruments', nameZh: '琵琶', nameEn: 'Pipa', emoji: '🪕', oneLiner: '武曲杀气腾腾，文曲如梦如幻' },
  { id: 130, category: '🪕 传统器乐', categoryEn: 'Traditional-Instruments', nameZh: '唢呐', nameEn: 'Suona', emoji: '📯', oneLiner: '百般乐器唢呐为王' },
  { id: 131, category: '🪕 传统器乐', categoryEn: 'Traditional-Instruments', nameZh: '评弹', nameEn: 'Pingtan', emoji: '🎋', oneLiner: '吴侬软语、说唱结合' },
  { id: 132, category: '🪕 传统器乐', categoryEn: 'Traditional-Instruments', nameZh: '道乐/禅乐', nameEn: 'Taoist/Buddhist', emoji: '🔔', oneLiner: '钟磬之声、空灵超脱' },
  // ===== 华语周杰伦式 (133-135) =====
  { id: 133, category: '🏯 国风流行', categoryEn: 'Guofeng-Pop', nameZh: '华语暗黑哥特', nameEn: 'Dark Gothic (C-Pop Style)', emoji: '⛪', oneLiner: '教堂钟声+管风琴+圣咏和声+华语流行旋律+古典哥特意境+中式叙事', representative: '周杰伦《以父之名》《夜的第七章》《威廉古堡》《爷爷泡的茶》', movement: ['华语暗黑', '周杰伦式'], hotness: 88 },
  { id: 134, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: '华语旋律说唱', nameEn: 'Melodic Rap (C-Pop Style)', emoji: '🎙️', oneLiner: 'Rap 段落+副歌 melody line+中文韵律+情感叙事+华语流行框架', representative: '周杰伦《听妈妈的话》《止战之殇》《退后》《稻香》《爸我回来了》', movement: ['华语说唱', '周杰伦式'], hotness: 92 },
  { id: 135, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: '华语流行说唱', nameEn: 'Pop Rap (C-Pop / Chou-Style)', emoji: '🥋', oneLiner: '主歌 Rap+副歌 pop hook+中国风元素+双截棍式节拍', representative: '周杰伦《双截棍》《本草纲目》《牛仔很忙》《忍者》《龙拳》', movement: ['华语说唱', '周杰伦式', '中国风'], hotness: 90 },

  // ===== V5.9 扩充：新增曲风 (136-210) =====
  // 🎸 摇滚扩充 136-145
  { id: 136, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '车库摇滚', nameEn: 'Garage Rock', emoji: '🎸', oneLiner: '粗糙原始、Lo-fi、朋克前身', representative: 'The Stooges, MC5', hotness: 65 },
  { id: 137, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '迷幻摇滚', nameEn: 'Psychedelic Rock', emoji: '🌈', oneLiner: '致幻、即兴、东方元素', representative: 'Pink Floyd, Jefferson Airplane', hotness: 72 },
  { id: 138, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '前卫金属', nameEn: 'Progressive Metal', emoji: '🎸', oneLiner: '技术精湛、复杂编曲、长篇', representative: 'Dream Theater, Tool', hotness: 70 },
  { id: 139, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '工业摇滚', nameEn: 'Industrial Rock', emoji: '⚙️', oneLiner: '机械、冰冷、电子噪音', representative: 'Nine Inch Nails, Rammstein', hotness: 68 },
  { id: 140, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '哥特摇滚', nameEn: 'Gothic Rock', emoji: '🦇', oneLiner: '阴暗、浪漫、戏剧化', representative: 'The Cure, Bauhaus', hotness: 65 },
  { id: 141, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: 'Emo', nameEn: 'Emo', emoji: '💔', oneLiner: '情绪化、内省、青春焦虑', representative: 'My Chemical Romance, Fall Out Boy', hotness: 70 },
  { id: 142, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '后硬核', nameEn: 'Post-Hardcore', emoji: '🎸', oneLiner: '激烈与旋律并存、情感爆发', representative: 'Fugazi, At the Drive-In', hotness: 62 },
  { id: 143, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '噪音摇滚', nameEn: 'Noise Rock', emoji: '📢', oneLiner: '失真、混沌、反旋律', representative: 'Sonic Youth, Shellac', hotness: 55 },
  { id: 144, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '冲浪摇滚', nameEn: 'Surf Rock', emoji: '🏄', oneLiner: '混响吉他、阳光海滩', representative: 'The Beach Boys, Dick Dale', hotness: 60 },
  { id: 145, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '摇滚复兴', nameEn: 'Rock Revival', emoji: '🎸', oneLiner: '2020s吉他回归、新锐摇滚', representative: 'Wet Leg, Måneskin', hotness: 75 },

  // 🎤 流行扩充 146-155
  { id: 146, category: '🎤 流行', categoryEn: 'Pop', nameZh: '艺术流行', nameEn: 'Art Pop', emoji: '🎨', oneLiner: '实验性、前卫、视觉艺术', representative: 'Björk, FKA twigs', hotness: 72 },
  { id: 147, category: '🎤 流行', categoryEn: 'Pop', nameZh: '梦幻流行', nameEn: 'Dream Pop', emoji: '💭', oneLiner: '朦胧、飘渺、氛围感', representative: 'Beach House, Cigarettes After Sex', hotness: 78 },
  { id: 148, category: '🎤 流行', categoryEn: 'Pop', nameZh: '电子流行', nameEn: 'Electropop', emoji: '🎹', oneLiner: '合成器主导、电子节拍', representative: 'Lady Gaga, Charli XCX', hotness: 82 },
  { id: 149, category: '🎤 流行', categoryEn: 'Pop', nameZh: '拉丁流行', nameEn: 'Latin Pop', emoji: '💃', oneLiner: '热情、节奏感、西班牙语', representative: 'Ricky Martin, Shakira', hotness: 85 },
  { id: 150, category: '🎤 流行', categoryEn: 'Pop', nameZh: '青少年流行', nameEn: 'Teen Pop', emoji: '🌟', oneLiner: '青春、偶像、活力', representative: 'Britney Spears, NSYNC', hotness: 70 },
  { id: 151, category: '🎤 流行', categoryEn: 'Pop', nameZh: '成人当代', nameEn: 'Adult Contemporary', emoji: '🎵', oneLiner: '成熟、温暖、电台友好', representative: 'Adele, John Mayer', hotness: 75 },
  { id: 152, category: '🎤 流行', categoryEn: 'Pop', nameZh: '城市流行', nameEn: 'City Pop', emoji: '🌃', oneLiner: '80s日本都市、复古时尚', representative: '山下达郎, 竹内まりや', hotness: 80 },
  { id: 153, category: '🎤 流行', categoryEn: 'Pop', nameZh: '蒸汽波', nameEn: 'Vaporwave', emoji: '🌴', oneLiner: '怀旧、采样、网络美学', representative: 'Macintosh Plus, Saint Pepsi', hotness: 65 },
  { id: 154, category: '🎤 流行', categoryEn: 'Pop', nameZh: '未来贝斯', nameEn: 'Future Bass', emoji: '🔮', oneLiner: '明亮和弦、cut vocal、跳跃', representative: 'Flume, San Holo', hotness: 72 },
  { id: 155, category: '🎤 流行', categoryEn: 'Pop', nameZh: ' hyperpop', nameEn: 'Hyperpop', emoji: '💥', oneLiner: '极端、失真、互联网文化', representative: 'SOPHIE, 100 gecs', hotness: 75 },

  // 🎧 嘻哈/说唱扩充 156-165
  { id: 156, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: '陷阱音乐', nameEn: 'Trap', emoji: '🔥', oneLiner: '808鼓机、hi-hat、暗黑', representative: 'Future, Migos', hotness: 90 },
  { id: 157, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: '爵士说唱', nameEn: 'Jazz Rap', emoji: '🎷', oneLiner: '爵士采样、慵懒、知性', representative: 'A Tribe Called Quest, De La Soul', hotness: 75 },
  { id: 158, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: '匪帮说唱', nameEn: 'Gangsta Rap', emoji: '🔫', oneLiner: '街头、写实、硬核', representative: 'N.W.A, Tupac', hotness: 80 },
  { id: 159, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: '意识说唱', nameEn: 'Conscious Rap', emoji: '🧠', oneLiner: '社会议题、思想性、深度', representative: 'Kendrick Lamar, J. Cole', hotness: 85 },
  { id: 160, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: 'Drill', nameEn: 'Drill', emoji: '🗽', oneLiner: '暗黑、sliding 808、芝加哥/伦敦', representative: 'Chief Keef, Central Cee', hotness: 82 },
  { id: 161, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: 'Boom Bap', nameEn: 'Boom Bap', emoji: '🎤', oneLiner: '经典鼓点、采样、90s东海岸', representative: 'Nas, Wu-Tang Clan', hotness: 78 },
  { id: 162, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: 'Emo Rap', nameEn: 'Emo Rap', emoji: '😢', oneLiner: '情绪化、旋律、Lo-fi', representative: 'Lil Peep, Juice WRLD', hotness: 75 },
  { id: 163, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: 'Lo-fi HipHop', nameEn: 'Lo-fi HipHop', emoji: '📻', oneLiner: '放松、学习伴侣、循环', representative: 'Nujabes, J Dilla', hotness: 88 },
  { id: 164, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: 'Grime', nameEn: 'Grime', emoji: '🇬🇧', oneLiner: '英国、140BPM、街头', representative: 'Skepta, Stormzy', hotness: 70 },
  { id: 165, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: 'Afrobeats', nameEn: 'Afrobeats', emoji: '🌍', oneLiner: '非洲节拍、融合、全球热曲', representative: 'Burna Boy, Wizkid', hotness: 88 },

  // 🎹 电子/舞曲扩充 166-180
  { id: 166, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Techno', nameEn: 'Techno', emoji: '🎹', oneLiner: '4/4拍、机械、底特律/柏林', representative: 'Jeff Mills, Richie Hawtin', hotness: 75 },
  { id: 167, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'House', nameEn: 'House', emoji: '🏠', oneLiner: '4/4拍、灵魂、芝加哥', representative: 'Frankie Knuckles, Daft Punk', hotness: 85 },
  { id: 168, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Deep House', nameEn: 'Deep House', emoji: '🌊', oneLiner: '深沉、温暖、律动', representative: 'Kerri Chandler, Maya Jane Coles', hotness: 78 },
  { id: 169, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Trance', nameEn: 'Trance', emoji: '🌀', oneLiner: '渐进、催眠、情感高潮', representative: 'Armin van Buuren, Above & Beyond', hotness: 72 },
  { id: 170, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Dubstep', nameEn: 'Dubstep', emoji: '💥', oneLiner: 'wobble bass、140BPM、重型', representative: 'Skrillex, Burial', hotness: 75 },
  { id: 171, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Drum & Bass', nameEn: 'Drum & Bass', emoji: '🥁', oneLiner: '碎拍、174BPM、低音', representative: 'Goldie, LTJ Bukem', hotness: 70 },
  { id: 172, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Ambient', nameEn: 'Ambient', emoji: '🌌', oneLiner: '氛围、无节拍、沉浸', representative: 'Brian Eno, Aphex Twin', hotness: 68 },
  { id: 173, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'IDM', nameEn: 'IDM', emoji: '🤖', oneLiner: '智能舞曲、实验、复杂', representative: 'Aphex Twin, Boards of Canada', hotness: 65 },
  { id: 174, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Synthwave', nameEn: 'Synthwave', emoji: '🌆', oneLiner: '80s复古、霓虹、怀旧', representative: 'Perturbator, Carpenter Brut', hotness: 78 },
  { id: 175, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Retrowave', nameEn: 'Retrowave', emoji: '📼', oneLiner: '复古未来、合成器、夜景', representative: 'The Midnight, FM-84', hotness: 75 },
  { id: 176, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Downtempo', nameEn: 'Downtempo', emoji: '🛋️', oneLiner: '慢节奏、放松、氛围', representative: 'Massive Attack, Thievery Corporation', hotness: 70 },
  { id: 177, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'UK Garage', nameEn: 'UK Garage', emoji: '🇬🇧', oneLiner: '切分节拍、灵魂、伦敦', representative: 'Craig David, Artful Dodger', hotness: 68 },
  { id: 178, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Hardstyle', nameEn: 'Hardstyle', emoji: '💪', oneLiner: '硬派、失真kick、高能', representative: 'Headhunterz, Brennan Heart', hotness: 72 },
  { id: 179, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Phonk', nameEn: 'Phonk', emoji: '🚗', oneLiner: '漂移、Memphis采样、TikTok', representative: 'Kordhell, DVRST', hotness: 85 },
  { id: 180, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Jersey Club', nameEn: 'Jersey Club', emoji: '💃', oneLiner: '弹性kick、切分、舞池', representative: 'DJ Sliink, UNIIQU3', hotness: 75 },

  // 🎷 爵士/布鲁斯扩充 181-188
  { id: 181, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '摇摆乐', nameEn: 'Swing', emoji: '🎷', oneLiner: '大乐队、舞蹈、30-40s', representative: 'Frank Sinatra, Ella Fitzgerald', hotness: 70 },
  { id: 182, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: 'Bebop', nameEn: 'Bebop', emoji: '🎺', oneLiner: '快速、即兴、复杂和声', representative: 'Charlie Parker, Dizzy Gillespie', hotness: 68 },
  { id: 183, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '冷爵士', nameEn: 'Cool Jazz', emoji: '❄️', oneLiner: '克制、放松、西海岸', representative: 'Miles Davis, Chet Baker', hotness: 72 },
  { id: 184, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '自由爵士', nameEn: 'Free Jazz', emoji: '🆓', oneLiner: '无规则、先锋、解放', representative: 'Ornette Coleman, John Coltrane', hotness: 60 },
  { id: 185, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '融合爵士', nameEn: 'Jazz Fusion', emoji: '🔀', oneLiner: '爵士+摇滚+放克', representative: 'Weather Report, Herbie Hancock', hotness: 70 },
  { id: 186, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '酸性爵士', nameEn: 'Acid Jazz', emoji: '🧪', oneLiner: '爵士+放克+嘻哈', representative: 'Jamiroquai, Brand New Heavies', hotness: 68 },
  { id: 187, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '三角洲布鲁斯', nameEn: 'Delta Blues', emoji: '🎸', oneLiner: '密西西比、原声、滑棒', representative: 'Robert Johnson, Son House', hotness: 65 },
  { id: 188, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '芝加哥布鲁斯', nameEn: 'Chicago Blues', emoji: '🎸', oneLiner: '电吉他、乐队、城市化', representative: 'Muddy Waters, B.B. King', hotness: 68 },

  // 🎼 古典/管弦扩充 189-195
  { id: 189, category: '🎼 古典/管弦', categoryEn: 'Classical/Orchestral', nameZh: '巴洛克', nameEn: 'Baroque', emoji: '🎼', oneLiner: '华丽、对位、羽管键琴', representative: 'Bach, Vivaldi, Handel', hotness: 70 },
  { id: 190, category: '🎼 古典/管弦', categoryEn: 'Classical/Orchestral', nameZh: '浪漫主义', nameEn: 'Romantic', emoji: '🎹', oneLiner: '情感、宏大、钢琴', representative: 'Chopin, Liszt, Tchaikovsky', hotness: 75 },
  { id: 191, category: '🎼 古典/管弦', categoryEn: 'Classical/Orchestral', nameZh: '印象主义', nameEn: 'Impressionist', emoji: '🌅', oneLiner: '色彩、氛围、模糊', representative: 'Debussy, Ravel', hotness: 68 },
  { id: 192, category: '🎼 古典/管弦', categoryEn: 'Classical/Orchestral', nameZh: '极简主义', nameEn: 'Minimalist', emoji: '⚪', oneLiner: '重复、渐进、冥想', representative: 'Philip Glass, Steve Reich', hotness: 65 },
  { id: 193, category: '🎼 古典/管弦', categoryEn: 'Classical/Orchestral', nameZh: '电影配乐', nameEn: 'Film Score', emoji: '🎬', oneLiner: '史诗、情感、画面感', representative: 'Hans Zimmer, John Williams', hotness: 88 },
  { id: 194, category: '🎼 古典/管弦', categoryEn: 'Classical/Orchestral', nameZh: '游戏配乐', nameEn: 'Game Score', emoji: '🎮', oneLiner: '奇幻、冒险、沉浸', representative: 'Nobuo Uematsu, Jeremy Soule', hotness: 82 },
  { id: 195, category: '🎼 古典/管弦', categoryEn: 'Classical/Orchestral', nameZh: '新世纪', nameEn: 'New Age', emoji: '🕊️', oneLiner: '冥想、自然、治愈', representative: 'Enya, Yanni', hotness: 70 },

  // 🌍 世界音乐扩充 196-205
  { id: 196, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: '雷鬼', nameEn: 'Reggae', emoji: '🇯🇲', oneLiner: '牙买加、反拍、拉斯塔', representative: 'Bob Marley, Peter Tosh', hotness: 78 },
  { id: 197, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: '斯卡', nameEn: 'Ska', emoji: '🎺', oneLiner: '欢快、管乐、跳跃', representative: 'The Specials, Madness', hotness: 65 },
  { id: 198, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: '桑巴', nameEn: 'Samba', emoji: '🇧🇷', oneLiner: '巴西、狂欢、打击乐', representative: 'Cartola, Bethânia', hotness: 72 },
  { id: 199, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: '波萨诺瓦', nameEn: 'Bossa Nova', emoji: '🏖️', oneLiner: '巴西、慵懒、爵士融合', representative: 'João Gilberto, Stan Getz', hotness: 75 },
  { id: 200, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: '弗拉门戈', nameEn: 'Flamenco', emoji: '💃', oneLiner: '西班牙、吉他、激情', representative: 'Paco de Lucía, Rosalía', hotness: 78 },
  { id: 201, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: '凯尔特', nameEn: 'Celtic', emoji: '🍀', oneLiner: '爱尔兰、风笛、民间', representative: 'Enya, The Chieftains', hotness: 68 },
  { id: 202, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: '中东音乐', nameEn: 'Middle Eastern', emoji: '🕌', oneLiner: '乌德琴、微分音、神秘', representative: 'Oum Kalthum, Fairuz', hotness: 65 },
  { id: 203, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: '印度古典', nameEn: 'Indian Classical', emoji: '🇮🇳', oneLiner: '拉格、西塔尔、冥想', representative: 'Ravi Shankar, Ali Akbar Khan', hotness: 62 },
  { id: 204, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: 'Amapiano', nameEn: 'Amapiano', emoji: '🇿🇦', oneLiner: '南非、深house、钢琴', representative: 'Kabza De Small, DJ Maphorisa', hotness: 85 },
  { id: 205, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: 'Kizomba', nameEn: 'Kizomba', emoji: '🇦🇴', oneLiner: '安哥拉、浪漫、慢节奏', representative: 'C4 Pedro, Anselmo Ralph', hotness: 65 },

  // 🎤 人声/合唱扩充 206-210
  { id: 206, category: '🎤 人声/合唱', categoryEn: 'Vocal/Choir', nameZh: '无伴奏合唱', nameEn: 'A cappella', emoji: '🎵', oneLiner: '纯人声、和声、无伴奏', representative: 'Pentatonix, Take 6', hotness: 72 },
  { id: 207, category: '🎤 人声/合唱', categoryEn: 'Vocal/Choir', nameZh: '福音', nameEn: 'Gospel', emoji: '⛪', oneLiner: '宗教、灵魂、合唱', representative: 'Kirk Franklin, Aretha Franklin', hotness: 70 },
  { id: 208, category: '🎤 人声/合唱', categoryEn: 'Vocal/Choir', nameZh: '灵魂乐', nameEn: 'Soul', emoji: '💫', oneLiner: '情感、放克、非裔', representative: 'Marvin Gaye, Stevie Wonder', hotness: 80 },
  { id: 209, category: '🎤 人声/合唱', categoryEn: 'Vocal/Choir', nameZh: '节奏布鲁斯', nameEn: 'R&B', emoji: '🎶', oneLiner: '流畅、情感、现代', representative: 'Beyoncé, The Weeknd', hotness: 88 },
  { id: 210, category: '🎤 人声/合唱', categoryEn: 'Vocal/Choir', nameZh: '民谣摇滚', nameEn: 'Folk Rock', emoji: '🎸', oneLiner: '民谣+摇滚、诗意、60s', representative: 'Bob Dylan, Simon & Garfunkel', hotness: 75 },

  // ===== V5.9 Part2 扩充：新增曲风 (211-300) =====
  // 🎸 摇滚扩充 211-220
  { id: 211, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '数学摇滚', nameEn: 'Math Rock', emoji: '🔢', oneLiner: '复杂节拍、奇数拍、技术流', representative: 'Polyphia, Animals As Leaders', hotness: 68 },
  { id: 212, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '后摇', nameEn: 'Post-Rock', emoji: '🌊', oneLiner: '长篇、氛围、情感递进', representative: 'Explosions in the Sky, Mogwai', hotness: 75 },
  { id: 213, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '盯鞋摇滚', nameEn: 'Shoegaze', emoji: '👟', oneLiner: '音墙、朦胧、自赏', representative: 'My Bloody Valentine, Slowdive', hotness: 72 },
  { id: 214, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '新迷幻', nameEn: 'Neo-Psychedelia', emoji: '🌀', oneLiner: '复古迷幻、现代制作', representative: 'Tame Impala, MGMT', hotness: 78 },
  { id: 215, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '后朋克', nameEn: 'Post-Punk', emoji: '🖤', oneLiner: '冷峻、实验、70s末', representative: 'Joy Division, Wire', hotness: 65 },
  { id: 216, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '新浪潮', nameEn: 'New Wave', emoji: '🌊', oneLiner: '合成器、时尚、80s', representative: 'Depeche Mode, New Order', hotness: 70 },
  { id: 217, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '华丽摇滚', nameEn: 'Glam Rock', emoji: '💄', oneLiner: '华丽、性别模糊、戏剧', representative: 'T. Rex, David Bowie', hotness: 62 },
  { id: 218, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '南方摇滚', nameEn: 'Southern Rock', emoji: '🤠', oneLiner: '布鲁斯根源、美国南方', representative: 'Lynyrd Skynyrd, Allman Brothers', hotness: 58 },
  { id: 219, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: '石人摇滚', nameEn: 'Stoner Rock', emoji: '🪨', oneLiner: '沉重riff、迷幻、缓慢', representative: 'Kyuss, Sleep', hotness: 55 },
  { id: 220, category: '🎸 摇滚', categoryEn: 'Rock', nameZh: 'Emo Revival', nameEn: 'Emo Revival', emoji: '💔', oneLiner: '2010s情绪回归、内省', representative: 'Modern Baseball, The Hotelier', hotness: 60 },

  // 🎤 流行扩充 221-230
  { id: 221, category: '🎤 流行', categoryEn: 'Pop', nameZh: '合成器流行', nameEn: 'Synth Pop', emoji: '🎹', oneLiner: '80s合成器、电子旋律', representative: 'Depeche Mode, Pet Shop Boys', hotness: 80 },
  { id: 222, category: '🎤 流行', categoryEn: 'Pop', nameZh: '舞蹈流行', nameEn: 'Dance Pop', emoji: '💃', oneLiner: '舞曲节拍、流行旋律', representative: 'Madonna, Dua Lipa', hotness: 88 },
  { id: 223, category: '🎤 流行', categoryEn: 'Pop', nameZh: '巴洛克流行', nameEn: 'Baroque Pop', emoji: '🎻', oneLiner: '管弦编曲、精致华丽', representative: 'Sufjan Stevens, Florence', hotness: 68 },
  { id: 224, category: '🎤 流行', categoryEn: 'Pop', nameZh: '室内流行', nameEn: 'Chamber Pop', emoji: '🎼', oneLiner: '小编制、精致、文艺', representative: 'Sufjan Stevens, Rufus Wainwright', hotness: 62 },
  { id: 225, category: '🎤 流行', categoryEn: 'Pop', nameZh: '拉丁都市', nameEn: 'Latin Urban', emoji: '💃', oneLiner: '雷鬼顿+流行、西语热曲', representative: 'Bad Bunny, J Balvin', hotness: 92 },
  { id: 226, category: '🎤 流行', categoryEn: 'Pop', nameZh: 'K-Pop', nameEn: 'K-Pop', emoji: '🇰🇷', oneLiner: '偶像、唱跳、视觉系', representative: 'BTS, BLACKPINK', hotness: 95 },
  { id: 227, category: '🎤 流行', categoryEn: 'Pop', nameZh: 'J-Pop', nameEn: 'J-Pop', emoji: '🇯🇵', oneLiner: '日系偶像、动画、多元', representative: 'YOASOBI, Ado', hotness: 88 },
  { id: 228, category: '🎤 流行', categoryEn: 'Pop', nameZh: 'C-Pop', nameEn: 'C-Pop', emoji: '🇨🇳', oneLiner: '华语流行、多元融合', representative: '周杰伦、林俊杰、邓紫棋', hotness: 92 },
  { id: 229, category: '🎤 流行', categoryEn: 'Pop', nameZh: 'T-Pop', nameEn: 'T-Pop', emoji: '🇹🇭', oneLiner: '泰国流行、东南亚新势力', representative: 'Tilly Birds, Ink Waruntorn', hotness: 70 },
  { id: 230, category: '🎤 流行', categoryEn: 'Pop', nameZh: 'V-Pop', nameEn: 'V-Pop', emoji: '🇻🇳', oneLiner: '越南流行、新兴音乐市场', representative: 'Sơn Tùng M-TP, Hoàng Thùy Linh', hotness: 65 },

  // 🎧 嘻哈/说唱扩充 231-240
  { id: 231, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: '旋律说唱', nameEn: 'Melodic Rap', emoji: '🎙️', oneLiner: '唱+rap、旋律hook', representative: 'Drake, Post Malone', hotness: 92 },
  { id: 232, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: '拉丁说唱', nameEn: 'Latin Rap', emoji: '💃', oneLiner: '西语+说唱、拉丁律动', representative: 'Bad Bunny, Anuel AA', hotness: 85 },
  { id: 233, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: '中国风说唱', nameEn: 'Chinese Rap', emoji: '🐉', oneLiner: '国风+说唱、古今碰撞', representative: 'GAI、C-Block', hotness: 88 },
  { id: 234, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: '爵士嘻哈', nameEn: 'Jazz HipHop', emoji: '🎷', oneLiner: '爵士采样+说唱、知性', representative: 'Nujabes, A Tribe Called Quest', hotness: 78 },
  { id: 235, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: '实验嘻哈', nameEn: 'Experimental HipHop', emoji: '🧪', oneLiner: '前卫制作、非常规结构', representative: 'Kendrick Lamar, Tyler the Creator', hotness: 82 },
  { id: 236, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: 'Cloud Rap', nameEn: 'Cloud Rap', emoji: '☁️', oneLiner: '梦幻、朦胧、氛围', representative: 'Clams Casino, Yung Lean', hotness: 65 },
  { id: 237, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: 'Rage', nameEn: 'Rage', emoji: '🔥', oneLiner: '合成器朋克+说唱、高能', representative: 'Playboi Carti, Trippie Redd', hotness: 78 },
  { id: 238, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: 'UK Drill', nameEn: 'UK Drill', emoji: '🇬🇧', oneLiner: ' sliding 808、伦敦街头', representative: 'Central Cee, Headie One', hotness: 82 },
  { id: 239, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: 'Brooklyn Drill', nameEn: 'Brooklyn Drill', emoji: '🗽', oneLiner: '纽约Drill、采样创新', representative: 'Pop Smoke, Fivio Foreign', hotness: 80 },
  { id: 240, category: '🎧 嘻哈/说唱', categoryEn: 'HipHop-Rap', nameZh: 'Pluggnb', nameEn: 'Pluggnb', emoji: '🔌', oneLiner: '柔和合成器、情感说唱', representative: 'Summrs, Kankan', hotness: 68 },

  // 🎹 电子/舞曲扩充 241-255
  { id: 241, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Lo-fi Beats', nameEn: 'Lo-fi Beats', emoji: '📻', oneLiner: '放松学习、循环节拍', representative: 'Lofi Girl, Nujabes', hotness: 90 },
  { id: 242, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Midtempo Bass', nameEn: 'Midtempo Bass', emoji: '🔊', oneLiner: '100BPM、暗黑低音', representative: 'Rezz, 1788-L', hotness: 72 },
  { id: 243, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Melodic Dubstep', nameEn: 'Melodic Dubstep', emoji: '🌈', oneLiner: '情感和弦+wobble bass', representative: 'Seven Lions, Illenium', hotness: 78 },
  { id: 244, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Progressive House', nameEn: 'Progressive House', emoji: '🏠', oneLiner: '渐进build-up、大旋律', representative: 'Eric Prydz, Deadmau5', hotness: 75 },
  { id: 245, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Tropical House', nameEn: 'Tropical House', emoji: '🌴', oneLiner: '热带、排箫、夏日', representative: 'Kygo, Matoma', hotness: 72 },
  { id: 246, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Future House', nameEn: 'Future House', emoji: '🏡', oneLiner: '金属bass+house节拍', representative: 'Don Diablo, Tchami', hotness: 70 },
  { id: 247, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Electro Swing', nameEn: 'Electro Swing', emoji: '🎩', oneLiner: '复古摇摆+电子节拍', representative: 'Caravan Palace, Parov Stelar', hotness: 68 },
  { id: 248, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Glitch Hop', nameEn: 'Glitch Hop', emoji: '🤖', oneLiner: '故障美学+hop律动', representative: 'The Glitch Mob, Pretty Lights', hotness: 62 },
  { id: 249, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Vaporwave', nameEn: 'Vaporwave', emoji: '🌴', oneLiner: '怀旧采样、网络美学', representative: 'Macintosh Plus, Saint Pepsi', hotness: 65 },
  { id: 250, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Witch House', nameEn: 'Witch House', emoji: '🧙', oneLiner: '暗黑、减速、 occult', representative: 'Salem, †††', hotness: 55 },
  { id: 251, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Breakbeat', nameEn: 'Breakbeat', emoji: '🥁', oneLiner: '碎拍、funk采样、90s', representative: 'The Chemical Brothers, Fatboy Slim', hotness: 68 },
  { id: 252, category: '🎹 电子', categoryEn: 'Electronic', nameZh: ' Goa Trance', nameEn: 'Goa Trance', emoji: '🕉️', oneLiner: '印度、迷幻、高频bpm', representative: 'Infected Mushroom, Astrix', hotness: 60 },
  { id: 253, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Chillwave', nameEn: 'Chillwave', emoji: '🌊', oneLiner: '放松、复古合成器、夏日', representative: 'Washed Out, Toro y Moi', hotness: 70 },
  { id: 254, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Hyperpop', nameEn: 'Hyperpop', emoji: '💥', oneLiner: '极端、失真、互联网文化', representative: 'SOPHIE, 100 gecs', hotness: 78 },
  { id: 255, category: '🎹 电子', categoryEn: 'Electronic', nameZh: 'Bass House', nameEn: 'Bass House', emoji: '🔊', oneLiner: '重低音+house、舞池炸裂', representative: 'Jauz, Habstrakt', hotness: 75 },

  // 🎷 爵士/布鲁斯扩充 256-265
  { id: 256, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '拉丁爵士', nameEn: 'Latin Jazz', emoji: '🎺', oneLiner: '拉丁节奏+爵士即兴', representative: 'Tito Puente, Cal Tjader', hotness: 68 },
  { id: 257, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '波萨诺瓦', nameEn: 'Bossa Nova', emoji: '🏖️', oneLiner: '巴西、慵懒、爵士融合', representative: 'João Gilberto, Stan Getz', hotness: 78 },
  { id: 258, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '当代爵士', nameEn: 'Contemporary Jazz', emoji: '🎷', oneLiner: '现代制作、跨界融合', representative: 'Robert Glasper, Kamasi Washington', hotness: 75 },
  { id: 259, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: 'Nu Jazz', nameEn: 'Nu Jazz', emoji: '🎹', oneLiner: '电子+爵士、新派', representative: 'St Germain, Bugge Wesseltoft', hotness: 65 },
  { id: 260, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '德克萨斯布鲁斯', nameEn: 'Texas Blues', emoji: '🤠', oneLiner: '电吉他、德州风情', representative: 'Stevie Ray Vaughan, ZZ Top', hotness: 62 },
  { id: 261, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '灵魂布鲁斯', nameEn: 'Soul Blues', emoji: '💫', oneLiner: '灵魂+布鲁斯、情感', representative: 'Bobby Bland, Johnnie Taylor', hotness: 60 },
  { id: 262, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '跳跃布鲁斯', nameEn: 'Jump Blues', emoji: '🎺', oneLiner: '欢快、摇摆、摇滚前身', representative: 'Louis Jordan, Big Joe Turner', hotness: 55 },
  { id: 263, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '放克爵士', nameEn: 'Funk Jazz', emoji: '🎸', oneLiner: '放克律动+爵士即兴', representative: 'The Meters, Rebirth Brass Band', hotness: 68 },
  { id: 264, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '硬波普', nameEn: 'Hard Bop', emoji: '🎺', oneLiner: '50s、蓝调根源、有力', representative: 'Art Blakey, Horace Silver', hotness: 62 },
  { id: 265, category: '🎷 爵士/布鲁斯', categoryEn: 'Jazz/Blues', nameZh: '灵魂爵士', nameEn: 'Soul Jazz', emoji: '💫', oneLiner: '灵魂乐+爵士、风琴主导', representative: 'Jimmy Smith, Groove Holmes', hotness: 60 },

  // 🎼 古典/管弦扩充 266-275
  { id: 266, category: '🎼 古典/管弦', categoryEn: 'Classical/Orchestral', nameZh: '古典时期', nameEn: 'Classical Period', emoji: '🎼', oneLiner: '莫扎特、海顿、均衡典雅', representative: 'Mozart, Haydn', hotness: 72 },
  { id: 267, category: '🎼 古典/管弦', categoryEn: 'Classical/Orchestral', nameZh: '文艺复兴音乐', nameEn: 'Renaissance', emoji: '🏰', oneLiner: '复调、宗教、中世纪', representative: 'Palestrina, Josquin', hotness: 55 },
  { id: 268, category: '🎼 古典/管弦', categoryEn: 'Classical/Orchestral', nameZh: '民族乐派', nameEn: 'Nationalist', emoji: '🏔️', oneLiner: '民族元素、浪漫主义', representative: 'Dvořák, Grieg, Sibelius', hotness: 65 },
  { id: 269, category: '🎼 古典/管弦', categoryEn: 'Classical/Orchestral', nameZh: '序列主义', nameEn: 'Serialism', emoji: '🔢', oneLiner: '十二音、数学化、前卫', representative: 'Schoenberg, Webern', hotness: 45 },
  { id: 270, category: '🎼 古典/管弦', categoryEn: 'Classical/Orchestral', nameZh: '具体音乐', nameEn: 'Musique Concrète', emoji: '🔊', oneLiner: '采样拼贴、实验先驱', representative: 'Pierre Schaeffer', hotness: 42 },
  { id: 271, category: '🎼 古典/管弦', categoryEn: 'Classical/Orchestral', nameZh: '动漫配乐', nameEn: 'Anime Score', emoji: '🎌', oneLiner: '日系动漫OST、热血感动', representative: '久石让、的场佑辅、的浦叶由树', hotness: 90 },
  { id: 272, category: '🎼 古典/管弦', categoryEn: 'Classical/Orchestral', nameZh: '史诗配乐', nameEn: 'Epic Score', emoji: '⚔️', oneLiner: '宏大叙事、预告片风格', representative: 'Two Steps from Hell, Hans Zimmer', hotness: 88 },
  { id: 273, category: '🎼 古典/管弦', categoryEn: 'Classical/Orchestral', nameZh: '纪录片配乐', nameEn: 'Documentary Score', emoji: '🎬', oneLiner: '自然、人文、沉思', representative: 'BBC纪录片配乐风格', hotness: 65 },
  { id: 274, category: '🎼 古典/管弦', categoryEn: 'Classical/Orchestral', nameZh: '恐怖配乐', nameEn: 'Horror Score', emoji: '👻', oneLiner: '不安、弦乐刺耳、悬疑', representative: 'Penderecki, Horror OST', hotness: 62 },
  { id: 275, category: '🎼 古典/管弦', categoryEn: 'Classical/Orchestral', nameZh: '浪漫钢琴', nameEn: 'Romantic Piano', emoji: '🎹', oneLiner: '肖邦式、诗意、独奏', representative: 'Chopin, Schumann, Liszt', hotness: 78 },

  // 🌍 世界音乐扩充 276-285
  { id: 276, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: 'Cumbia', nameEn: 'Cumbia', emoji: '🇨🇴', oneLiner: '哥伦比亚、手风琴、舞池', representative: 'Celso Piña, Grupo Niche', hotness: 72 },
  { id: 277, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: 'Reggaeton', nameEn: 'Reggaeton', emoji: '💃', oneLiner: '拉丁、dembow节拍、热辣', representative: 'Daddy Yankee, Don Omar', hotness: 90 },
  { id: 278, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: 'Bachata', nameEn: 'Bachata', emoji: '💑', oneLiner: '多米尼加、浪漫、吉他', representative: 'Romeo Santos, Aventura', hotness: 78 },
  { id: 279, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: 'Dancehall', nameEn: 'Dancehall', emoji: '🇯🇲', oneLiner: '牙买加、dance、高能', representative: 'Sean Paul, Shabba Ranks', hotness: 75 },
  { id: 280, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: 'Afropop', nameEn: 'Afropop', emoji: '🌍', oneLiner: '非洲流行、多元融合', representative: 'Burna Boy, Wizkid', hotness: 85 },
  { id: 281, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: 'Highlife', nameEn: 'Highlife', emoji: '🇬🇭', oneLiner: '加纳、吉他、欢快', representative: 'E.T. Mensah, Osibisa', hotness: 58 },
  { id: 282, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: 'Qawwali', nameEn: 'Qawwali', emoji: '🕌', oneLiner: '苏菲派、冥想、激情', representative: 'Nusrat Fateh Ali Khan', hotness: 55 },
  { id: 283, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: 'Bollywood', nameEn: 'Bollywood', emoji: '🇮🇳', oneLiner: '宝莱坞、歌舞、华丽', representative: 'A.R. Rahman, Pritam', hotness: 82 },
  { id: 284, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: 'Enka', nameEn: 'Enka', emoji: '🇯🇵', oneLiner: '日本演歌、传统、感伤', representative: '美空ひばり、北島三郎', hotness: 60 },
  { id: 285, category: '🌍 世界音乐', categoryEn: 'World Music', nameZh: 'Trot', nameEn: 'Trot', emoji: '🇰🇷', oneLiner: '韩国传统流行、复古', representative: '임영웅, 영탁', hotness: 72 },

  // 🏮 中国风/新国风扩充 286-295
  { id: 286, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '赛博国风', nameEn: 'Cyber Guofeng', emoji: '🤖', oneLiner: 'AI+电子+国风、未来东方', representative: '2026最新趋势', movement: ['新国风'], hotness: 88 },
  { id: 287, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '仙侠风', nameEn: 'Xianxia Style', emoji: '🗡️', oneLiner: '仙侠、飘逸、古风', representative: '仙侠剧OST风格', hotness: 85 },
  { id: 288, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '禅意国风', nameEn: 'Zen Chinese', emoji: '🧘', oneLiner: '空灵、禅意、极简', representative: '巫娜古琴、空灵鼓', hotness: 72 },
  { id: 289, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '武侠风', nameEn: 'Wuxia Style', emoji: '⚔️', oneLiner: '江湖、豪迈、侠义', representative: '黄霑《沧海一声笑》', hotness: 82 },
  { id: 290, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '敦煌风', nameEn: 'Dunhuang Style', emoji: '🏜️', oneLiner: '丝路、壁画、异域东方', representative: '敦煌研究院合作项目', hotness: 75 },
  { id: 291, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '少数民族风', nameEn: 'Ethnic Chinese', emoji: '🏔️', oneLiner: '苗族/藏族/彝族元素', representative: '阿朵、萨顶顶', hotness: 70 },
  { id: 292, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '粤语国风', nameEn: 'Cantonese Guofeng', emoji: '🏮', oneLiner: '粤语+国风、港风古典', representative: '粤语古风歌曲', hotness: 72 },
  { id: 293, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '国风电子舞曲', nameEn: 'Guofeng EDM', emoji: '🐉', oneLiner: '国风+EDM、燃炸舞池', representative: '国风电子remix', hotness: 78 },
  { id: 294, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '古风说唱', nameEn: 'Ancient Rap', emoji: '🎤', oneLiner: '古诗词+说唱flow', representative: '古风说唱作品', hotness: 80 },
  { id: 295, category: '🏮 中国风', categoryEn: 'Chinese-Style', nameZh: '国风摇滚', nameEn: 'Guofeng Rock', emoji: '🎸', oneLiner: '民乐+摇滚、燃炸', representative: '二手玫瑰、苏阳', hotness: 75 },

  // 🎭 戏曲扩充 296-300
  { id: 296, category: '🎭 戏曲', categoryEn: 'Chinese-Opera', nameZh: '秦腔', nameEn: 'Qinqiang', emoji: '🔥', oneLiner: '西北、高亢、粗犷', hotness: 55 },
  { id: 297, category: '🎭 戏曲', categoryEn: 'Chinese-Opera', nameZh: '晋剧', nameEn: 'Jin Opera', emoji: '🎭', oneLiner: '山西、梆子腔、激越', hotness: 48 },
  { id: 298, category: '🎭 戏曲', categoryEn: 'Chinese-Opera', nameZh: '评剧', nameEn: 'Ping Opera', emoji: '🎭', oneLiner: '北方、通俗、生活化', hotness: 50 },
  { id: 299, category: '🎭 戏曲', categoryEn: 'Chinese-Opera', nameZh: '吕剧', nameEn: 'Lv Opera', emoji: '🎭', oneLiner: '山东、民间、朴实', hotness: 45 },
  { id: 300, category: '🎭 戏曲', categoryEn: 'Chinese-Opera', nameZh: '锡剧', nameEn: 'Xi Opera', emoji: '🎭', oneLiner: '江苏、婉转、江南', hotness: 42 },
];

// 校验数量
if (GENRES.length !== 300) {
  throw new Error(`GENRES 应有 300 条，实际 ${GENRES.length} 条`);
}

// 按大类分组索引
export const GENRES_BY_CATEGORY: Record<string, Genre[]> = GENRES.reduce((acc, g) => {
  if (!acc[g.category]) acc[g.category] = [];
  acc[g.category].push(g);
  return acc;
}, {} as Record<string, Genre[]>);

// 按 ID 索引
export const GENRES_BY_ID: Record<number, Genre> = Object.fromEntries(
  GENRES.map(g => [g.id, g])
);

// 新国风风格筛选
export const NEW_GUOFENG_GENRES: Genre[] = GENRES.filter(
  g => g.movement?.includes('新国风')
);
