'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  User, 
  Music, 
  Mic2, 
  Globe, 
  Heart,
  Loader2,
  Check,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Gender options
const GENDER_OPTIONS = [
  { id: 'male', name: '男', icon: '♂' },
  { id: 'female', name: '女', icon: '♀' },
  { id: 'neutral', name: '非二元', icon: '⚧' },
  { id: 'virtual', name: '虚拟角色', icon: '🤖' },
];

// Age group options
const AGE_OPTIONS = [
  { id: '青春系', name: '青春系', desc: '18-25岁活力' },
  { id: '都市成熟', name: '都市成熟', desc: '25-35岁魅力' },
  { id: '前辈大神', name: '前辈大神', desc: '资深音乐人' },
  { id: '神秘', name: '神秘', desc: '年龄成谜' },
];

// Personality tags
const PERSONALITY_TAGS = [
  '文艺', '狂野', '可爱', '忧郁', '桀骜', '治愈', 
  '神秘', '浪漫', '叛逆', '温柔', '冷艳', '阳光',
];

// Style tags (subset of 130+ styles)
const STYLE_TAGS = [
  '流行', 'R&B', '电子', '民谣', '说唱', '摇滚', 
  '国风', '爵士', '古典', '乡村', '金属', '氛围',
  'Lo-fi', 'Reggae', 'Funk', 'Blues', 'EDM',
];

// Language options
const LANGUAGE_OPTIONS = [
  { id: '中文', name: '中文', flag: '🇨🇳' },
  { id: '英文', name: '英文', flag: '🇺🇸' },
  { id: '日语', name: '日语', flag: '🇯🇵' },
  { id: '韩语', name: '韩语', flag: '🇰🇷' },
  { id: '双语', name: '双语', flag: '🌐' },
];

interface ArtistData {
  id: string;
  name: string;
  avatarUrl: string;
  slogan: string;
  bio: string;
  gender: string;
  ageGroup: string;
  personalityTags: string[];
  styleTags: string[];
  singingTechniques: string[];
  languagePreference: string;
  debutDate: string;
  region: string;
  isAiGenerated: boolean;
  createdAt: string;
}

export default function CreateArtistPage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'generating' | 'result'>('form');
  
  // Form state
  const [gender, setGender] = useState('neutral');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [ageGroup, setAgeGroup] = useState('都市成熟');
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([]);
  const [language, setLanguage] = useState('中文');
  
  // Result state
  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : prev.length < 3 ? [...prev, style] : prev
    );
  };

  const togglePersonality = (tag: string) => {
    setSelectedPersonality(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : prev.length < 5 ? [...prev, tag] : prev
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStep('generating');

    try {
      const response = await fetch('/api/generate-artist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender,
          styles: selectedStyles,
          ageGroup,
          personality: selectedPersonality,
          language,
        }),
      });

      const data = await response.json();

      // Simulate generation time
      setTimeout(() => {
        if (data.success) {
          setArtist(data.artist);
          setStep('result');
        }
        setIsGenerating(false);
      }, 3000);
    } catch (error) {
      console.error('Artist generation failed:', error);
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setStep('form');
    setArtist(null);
  };

  const handleSave = () => {
    // In a real app, this would save to the database
    alert('音乐人已保存！（演示模式）');
    router.push(`/artist/${artist?.id}`);
  };

  if (step === 'generating') {
    return (
      <div className="min-h-screen bg-background pt-20 pb-10 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-16 h-16 text-primary" />
              </motion.div>
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold text-gradient-gold mb-4">AI 正在创造音乐人</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>正在生成头像、名字、背景故事...</span>
            </div>
          </div>

          <div className="mt-8 space-y-2 text-sm text-muted-foreground">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              ✨ 构思独特的艺名...
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              🎨 生成专属头像...
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              📝 编写背景故事...
            </motion.p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'result' && artist) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-10 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gradient-gold">你的 AI 音乐人</h1>
            </div>
            <Button variant="outline" onClick={handleRegenerate}>
              <RefreshCw className="w-4 h-4 mr-2" />
              重新生成
            </Button>
          </div>

          {/* Artist Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass-card overflow-hidden">
              {/* Cover */}
              <div className="h-32 bg-gradient-to-r from-primary/30 to-accent/30" />
              
              {/* Avatar */}
              <div className="relative px-6 -mt-16">
                <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden bg-gradient-to-br from-primary to-accent">
                  <img
                    src={artist.avatarUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/20 backdrop-blur text-xs text-primary">
                  AI 生成
                </div>
              </div>

              {/* Info */}
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gradient-gold">{artist.name}</h2>
                    <p className="text-muted-foreground italic mt-1">"{artist.slogan}"</p>
                  </div>

                  <p className="text-sm text-foreground/80 leading-relaxed">{artist.bio}</p>

                  {/* Tags */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">音乐风格</p>
                      <div className="flex flex-wrap gap-2">
                        {artist.styleTags.map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">演唱技巧</p>
                      <div className="flex flex-wrap gap-2">
                        {artist.singingTechniques.map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">性格标签</p>
                      <div className="flex flex-wrap gap-2">
                        {artist.personalityTags.map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-foreground/70 text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{artist.gender === 'male' ? '男' : artist.gender === 'female' ? '女' : '虚拟'}</p>
                      <p className="text-xs text-muted-foreground">性别</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{artist.ageGroup}</p>
                      <p className="text-xs text-muted-foreground">年龄段</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{artist.languagePreference}</p>
                      <p className="text-xs text-muted-foreground">语言</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-primary to-accent text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              保存到我的音乐人
            </Button>
            <Button
              variant="outline"
              onClick={handleRegenerate}
            >
              换一个
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="min-h-screen bg-background pt-20 pb-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gradient-gold">AI 虚拟音乐人</h1>
            <p className="text-sm text-muted-foreground">一键生成专属 AI 音乐人 Profile</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Gender */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-primary" />
                性别
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {GENDER_OPTIONS.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGender(option.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                      gender === option.id
                        ? 'border-primary bg-primary/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    )}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-xs">{option.name}</span>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Styles */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Music className="w-5 h-5 text-accent" />
                主打风格 <span className="text-xs text-muted-foreground font-normal">（最多选 3 个）</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {STYLE_TAGS.map((style) => (
                  <motion.button
                    key={style}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleStyle(style)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm transition-all',
                      selectedStyles.includes(style)
                        ? 'bg-primary text-white'
                        : 'bg-white/5 text-foreground/70 hover:bg-white/10'
                    )}
                  >
                    {style}
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Age Group */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-pink-400" />
                年龄段
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {AGE_OPTIONS.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAgeGroup(option.id)}
                    className={cn(
                      'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all',
                      ageGroup === option.id
                        ? 'border-primary bg-primary/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    )}
                  >
                    <span className="text-sm font-medium">{option.name}</span>
                    <span className="text-xs text-muted-foreground">{option.desc}</span>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Personality */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                性格标签 <span className="text-xs text-muted-foreground font-normal">（最多选 5 个）</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {PERSONALITY_TAGS.map((tag) => (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => togglePersonality(tag)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm transition-all',
                      selectedPersonality.includes(tag)
                        ? 'bg-accent text-white'
                        : 'bg-white/5 text-foreground/70 hover:bg-white/10'
                    )}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5 text-blue-400" />
                语言偏好
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-3">
                {LANGUAGE_OPTIONS.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLanguage(option.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                      language === option.id
                        ? 'border-primary bg-primary/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    )}
                  >
                    <span className="text-2xl">{option.flag}</span>
                    <span className="text-xs">{option.name}</span>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all disabled:opacity-50"
          >
            <span className="flex items-center justify-center gap-2">
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              一键生成音乐人
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
