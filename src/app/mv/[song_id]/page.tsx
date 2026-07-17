'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Download, 
  Share2, 
  Film, 
  Palette, 
  Ratio, 
  Clock,
  Sparkles,
  Check,
  Loader2,
  RefreshCw,
  Edit3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// MV styles
const MV_STYLES = [
  { id: 'realistic', name: '写实', icon: '🎬' },
  { id: 'anime', name: '二次元', icon: '🎨' },
  { id: 'retro', name: '复古胶片', icon: '📽️' },
  { id: 'cyberpunk', name: '赛博朋克', icon: '🌃' },
  { id: 'ink', name: '水墨国风', icon: '🎋' },
  { id: 'minimal', name: '极简艺术', icon: '◻️' },
];

const ASPECT_RATIOS = [
  { id: '9:16', name: '竖屏 9:16', desc: '抖音/快手风格' },
  { id: '16:9', name: '横屏 16:9', desc: '影院/YouTube' },
];

const DURATION_OPTIONS = [
  { id: 30, name: '30秒', desc: '精华片段' },
  { id: 60, name: '60秒', desc: '完整MV' },
  { id: 0, name: '全曲', desc: '跟随歌曲时长' },
];

interface StoryboardScene {
  id: string;
  startTime: number;
  endTime: number;
  lyrics: string;
  sceneDescription: string;
  emotion: string;
  prompt: string;
  imageUrl: string | null;
  videoUrl: string | null;
  status: 'pending' | 'generating' | 'completed';
}

interface MVData {
  id: string;
  songId: string;
  style: string;
  aspectRatio: string;
  duration: number;
  storyboard: StoryboardScene[];
  videoUrl: string;
  coverUrl: string;
  status: string;
  progress: number;
  createdAt: string;
}

export default function MVPage() {
  const params = useParams();
  const router = useRouter();
  const songId = params.song_id as string;

  const [step, setStep] = useState<'config' | 'generating' | 'result'>('config');
  const [style, setStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [duration, setDuration] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [mvData, setMvData] = useState<MVData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedScene, setSelectedScene] = useState<number | null>(null);

  // Simulate generation progress
  useEffect(() => {
    if (!isGenerating) return;

    const stages = [
      { text: '分析歌词，生成分镜脚本...', progress: 10 },
      { text: '生成关键帧图片 (1/8)...', progress: 25 },
      { text: '生成关键帧图片 (3/8)...', progress: 40 },
      { text: '生成关键帧图片 (5/8)...', progress: 55 },
      { text: '生成关键帧图片 (8/8)...', progress: 70 },
      { text: '合成视频片段...', progress: 85 },
      { text: '音视频对齐合成中...', progress: 95 },
      { text: '完成！', progress: 100 },
    ];

    let stageIndex = 0;
    const interval = setInterval(() => {
      if (stageIndex < stages.length) {
        setProgressText(stages[stageIndex].text);
        setProgress(stages[stageIndex].progress);
        stageIndex++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStep('generating');

    try {
      const response = await fetch('/api/generate-mv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          songId,
          style,
          aspectRatio,
          duration,
          lyrics: '漫步在星河之间\n看流星划过天际线\n许下心愿在午夜前\n让梦想不再遥远',
        }),
      });

      const data = await response.json();

      // Wait for progress animation to complete
      setTimeout(() => {
        if (data.success) {
          setMvData(data.mv);
          setStep('result');
        }
        setIsGenerating(false);
      }, 6500);
    } catch (error) {
      console.error('MV generation failed:', error);
      setIsGenerating(false);
    }
  };

  const handleRegenerateScene = (index: number) => {
    if (!mvData) return;
    const updatedStoryboard = [...mvData.storyboard];
    updatedStoryboard[index] = { ...updatedStoryboard[index], status: 'generating' };
    setMvData({ ...mvData, storyboard: updatedStoryboard });

    // Simulate regeneration
    setTimeout(() => {
      updatedStoryboard[index].status = 'completed';
      setMvData({ ...mvData, storyboard: updatedStoryboard });
    }, 2000);
  };

  if (step === 'config') {
    return (
      <div className="min-h-screen bg-background pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
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
              <h1 className="text-2xl font-bold text-gradient-gold">AI MV 生成</h1>
              <p className="text-sm text-muted-foreground">为你的歌曲生成专属 MV</p>
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-8">
            {/* Style Selection */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Palette className="w-5 h-5 text-primary" />
                  选择画风
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {MV_STYLES.map((s) => (
                    <motion.button
                      key={s.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStyle(s.id)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                        style === s.id
                          ? 'border-primary bg-primary/10 glow-gold'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      )}
                    >
                      <span className="text-2xl">{s.icon}</span>
                      <span className="text-xs text-center">{s.name}</span>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Aspect Ratio */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Ratio className="w-5 h-5 text-accent" />
                  画面比例
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {ASPECT_RATIOS.map((ratio) => (
                    <motion.button
                      key={ratio.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAspectRatio(ratio.id)}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl border-2 transition-all',
                        aspectRatio === ratio.id
                          ? 'border-primary bg-primary/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      )}
                    >
                      <div
                        className={cn(
                          'border-2 rounded',
                          ratio.id === '9:16' ? 'w-8 h-14' : 'w-14 h-8',
                          aspectRatio === ratio.id ? 'border-primary' : 'border-white/30'
                        )}
                      />
                      <div className="text-left">
                        <div className="font-medium">{ratio.name}</div>
                        <div className="text-xs text-muted-foreground">{ratio.desc}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Duration */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-green-400" />
                  时长目标
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {DURATION_OPTIONS.map((opt) => (
                    <motion.button
                      key={opt.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDuration(opt.id)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                        duration === opt.id
                          ? 'border-primary bg-primary/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      )}
                    >
                      <span className="font-bold text-lg">{opt.name}</span>
                      <span className="text-xs text-muted-foreground">{opt.desc}</span>
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
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                开始生成 MV
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

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
                <Film className="w-16 h-16 text-primary" />
              </motion.div>
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold text-gradient-gold mb-4">AI 正在创作 MV</h2>
          
          <div className="space-y-4">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-muted-foreground">{progressText}</p>
            <p className="text-2xl font-bold text-primary">{progress}%</p>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            生成过程中可以关闭页面，完成后会通知你
          </p>
        </div>
      </div>
    );
  }

  // Result view
  return (
    <div className="min-h-screen bg-background pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
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
            <div>
              <h1 className="text-2xl font-bold text-gradient-gold">MV 生成完成</h1>
              <p className="text-sm text-muted-foreground">
                {mvData?.storyboard.length} 个分镜 · {mvData?.style} 风格
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              下载
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
          </div>
        </div>

        {/* Video Player */}
        <Card className="glass-card mb-6 overflow-hidden">
          <div className="relative aspect-video bg-black">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-white/10 backdrop-blur flex items-center justify-center mb-4">
                  <Play className="w-10 h-10 text-white ml-1" />
                </div>
                <p className="text-white/60 text-sm">点击播放 MV</p>
              </motion.div>
            </div>
            {/* Melo Watermark */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-xs text-white/80">
              Melo Music
            </div>
          </div>
        </Card>

        {/* Storyboard Editor */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Film className="w-5 h-5 text-primary" />
              分镜脚本
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mvData?.storyboard.map((scene, index) => (
                <motion.div
                  key={scene.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div
                    className={cn(
                      'aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer',
                      selectedScene === index ? 'border-primary' : 'border-white/10'
                    )}
                    onClick={() => setSelectedScene(index)}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Film className="w-8 h-8 text-white/40" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">
                      {scene.startTime}s - {scene.endTime}s
                    </p>
                    <p className="text-xs line-clamp-2">{scene.lyrics}</p>
                  </div>
                  {/* Actions on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRegenerateScene(index);
                      }}
                      className="w-6 h-6 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
                    >
                      <RefreshCw className="w-3 h-3 text-white" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-6 h-6 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
                    >
                      <Edit3 className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  {/* Status badge */}
                  {scene.status === 'completed' && (
                    <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {scene.status === 'generating' && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
