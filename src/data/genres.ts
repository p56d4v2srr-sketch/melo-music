/**
 * 135 种音乐风格库
 * 覆盖：摇滚、流行、电子、嘻哈、爵士/布鲁斯、古典/新世纪、世界音乐、R&B/Soul、金属、乡村/民谣、雷鬼/拉丁、中国风、新国风、戏曲、民族民间、传统器乐、华语周杰伦式
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
];

// 校验数量
if (GENRES.length !== 135) {
  throw new Error(`GENRES 应有 135 条，实际 ${GENRES.length} 条`);
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
