'use client';

import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { Navbar } from '@/components/navbar';
import { MusicStyleSelector } from '@/components/music-style-selector';
import { SingerStyleSelector } from '@/components/singer-style-selector';
import { DescriptionInput } from '@/components/description-input';
import { LyricsEditor } from '@/components/lyrics-editor';
import { VoiceUpload, type VoiceFile } from '@/components/voice-upload';
import { MusicPlayer } from '@/components/music-player';
import { DeepThinkingLyrics } from '@/components/deep-thinking-lyrics';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { analyzeLyricsForUI } from '@/lib/lyrics-sanitizer';

// 模型系列 tab 定义
const MODEL_TABS = [
  { key: 'minimax', name: 'MiniMax（海螺音乐）', enabled: true },
  { key: 'suno', name: 'Suno', enabled: false, badge: '暂不可用' },
  { key: 'mureka', name: 'Mureka', enabled: false },
  { key: 'acestep', name: 'ACE-Step', enabled: false },
  { key: 'voice-clone', name: '音色克隆', enabled: false },
];

// Suno 版本定义
const SUNO_VERSIONS = [
  { key: 'v5-5', name: 'Suno V5.5', desc: '最新发布实验模型，人声更细腻，输出音质提升', credits: '5 积分/首', badge: 'NEW' },
  { key: 'v5', name: 'Suno V5.0', desc: '实验模型，音质细腻，默认推荐', credits: '5 积分/首', badge: '默认' },
  { key: 'v4-5-plus', name: 'Suno V4.5+', desc: '主力生成模型，最长 8 分钟', credits: '5 积分/首', badge: null },
  { key: 'v4-5', name: 'Suno V4.5', desc: '支持自然语言描述音乐风格，最长 8 分钟', credits: '5 积分/首', badge: null },
  { key: 'v4', name: 'Suno V4.0', desc: '超强音乐生成，堪比真人', credits: '5 积分/首', badge: null },
];

// MiniMax 版本定义
const MINIMAX_VERSIONS = [
  { key: 'music-2.0', name: 'MiniMax music-2.0', desc: '同步返回 · 约 40 秒生成 · 原生 WAV 无损输出', credits: '免费', badge: '推荐' },
];

export default function CreatePage() {
  // State
  const [activeModelTab, setActiveModelTab] = useState('minimax');
  const [selectedModelVersion, setSelectedModelVersion] = useState('music-2.0');
  const [songTitle, setSongTitle] = useState('');
  const [songDuration, setSongDuration] = useState(300); // 默认 5 分钟（300秒）
  const [language, setLanguage] = useState('zh');
  const [vocalType, setVocalType] = useState('female');
  const [mood, setMood] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [coverSource, setCoverSource] = useState<'ai' | 'upload'>('ai');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedSingers, setSelectedSingers] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [uploadedVoices, setUploadedVoices] = useState<VoiceFile[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string>();
  const [lyricsAnalysis, setLyricsAnalysis] = useState<{
    hasBrackets: boolean;
    bracketTags: string[];
    warningText: string;
  }>({ hasBrackets: false, bracketTags: [], warningText: '' });

  // Auto-analyze lyrics when they change
  useEffect(() => {
    const analysis = analyzeLyricsForUI(lyrics);
    setLyricsAnalysis({
      hasBrackets: analysis.hasBrackets,
      bracketTags: analysis.bracketTags,
      warningText: analysis.warningText,
    });
  }, [lyrics]);

  const handleModelTabClick = (tabKey: string) => {
    const tab = MODEL_TABS.find(t => t.key === tabKey);
    if (!tab?.enabled) {
      toast.info('敬请期待', { description: `${tab?.name} 即将上线` });
      return;
    }
    setActiveModelTab(tabKey);
  };

  const handleGenerate = async () => {
    if (selectedStyles.length === 0) {
      toast.error('请至少选择一个音乐风格');
      return;
    }

    if (!description.trim() && !lyrics.trim()) {
      toast.error('请输入描述词或歌词');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedAudioUrl(undefined);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: songTitle,
          duration: songDuration,
          language,
          vocal_type: vocalType,
          mood: mood || undefined,
          is_public: isPublic,
          cover_source: coverSource,
          cover_url: coverUrl || undefined,
          styles: selectedStyles,
          singers: selectedSingers,
          description,
          lyrics,
          voiceId: selectedVoice,
          model_version: selectedModelVersion,
        }),
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (!response.ok) {
        // Structured error from backend
        const errorType = data.error_type || 'unknown';
        const message = data.error || data.message || '生成失败';
        const suggestion = data.suggestion || '请稍后重试';
        
        if (errorType === 'invalid_key') {
          toast.error('API Key 无效', { description: suggestion });
        } else if (errorType === 'quota_exceeded') {
          toast.error('额度不足', { description: suggestion });
        } else if (errorType === 'rate_limit') {
          toast.error('请求频率超限', { description: suggestion });
        } else {
          toast.error(message, { description: suggestion });
        }
        return;
      }

      // Success - handle demo mode
      if (data.is_demo) {
        toast.success('演示模式', { description: data.message || '当前为演示模式，配置 API Key 后可生成真实音乐' });
      } else {
        toast.success('音乐生成任务已提交');
      }

      // Show warning if provider returned one (e.g., version downgrade)
      if (data.warning) {
        toast.info(data.warning);
      }
      
      setGenerationProgress(100);
      setGeneratedAudioUrl(data.audioUrl);
    } catch (error) {
      console.error('生成失败:', error);
      toast.error('音乐生成失败', { description: '网络异常，请检查网络连接后重试' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVoiceUpload = (voice: VoiceFile) => {
    setUploadedVoices([...uploadedVoices, voice]);
  };

  const handleVoiceRemove = (id: string) => {
    setUploadedVoices(uploadedVoices.filter((v) => v.id !== id));
    if (selectedVoice === id) {
      setSelectedVoice(undefined);
    }
  };

  const handleLyricsFromAI = (aiLyrics: string) => {
    setLyrics(aiLyrics);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">
            AI 音乐创作
          </h1>
          <p className="text-muted-foreground">
            选择风格、描述情绪，让 AI 为你创作独一无二的音乐作品
          </p>
        </div>

        {/* Model Series Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {MODEL_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleModelTabClick(tab.key)}
                className={`
                  relative px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${!tab.enabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${activeModelTab === tab.key && tab.enabled
                    ? 'text-amber-400 bg-amber-400/10 border border-amber-400/30 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }
                `}
              >
                {tab.name}
                {tab.badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/10 text-muted-foreground border border-white/10">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Suno Version Cards (only show when Suno tab is active) */}
        {activeModelTab === 'suno' && (
          <div className="mb-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {SUNO_VERSIONS.map((version) => (
                <button
                  key={version.key}
                  onClick={() => setSelectedModelVersion(version.key)}
                  className={`
                    relative flex-shrink-0 w-48 p-4 rounded-xl transition-all text-left
                    ${selectedModelVersion === version.key
                      ? 'border-2 border-amber-400 bg-amber-400/5 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                      : 'border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }
                  `}
                >
                  {/* Badge */}
                  {version.badge && (
                    <span className={`
                      absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold
                      ${version.badge === 'NEW' 
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black' 
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }
                    `}>
                      {version.badge}
                    </span>
                  )}
                  
                  {/* Version Name */}
                  <h3 className={`text-sm font-bold mb-1 ${selectedModelVersion === version.key ? 'text-amber-400' : 'text-foreground'}`}>
                    {version.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {version.desc}
                  </p>
                  
                  {/* Credits */}
                  <span className="text-[10px] text-muted-foreground/70">
                    {version.credits}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MiniMax Version Cards (only show when MiniMax tab is active) */}
        {activeModelTab === 'minimax' && (
          <div className="mb-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {MINIMAX_VERSIONS.map((version) => (
                <button
                  key={version.key}
                  onClick={() => setSelectedModelVersion(version.key)}
                  className={`
                    relative flex-shrink-0 w-64 p-4 rounded-xl transition-all text-left
                    ${selectedModelVersion === version.key
                      ? 'border-2 border-amber-400 bg-amber-400/5 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                      : 'border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }
                  `}
                >
                  {/* Badge */}
                  {version.badge && (
                    <span className={`
                      absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold
                      bg-gradient-to-r from-amber-400 to-orange-500 text-black
                    `}>
                      {version.badge}
                    </span>
                  )}
                  
                  {/* Version Name */}
                  <h3 className={`text-sm font-bold mb-1 ${selectedModelVersion === version.key ? 'text-amber-400' : 'text-foreground'}`}>
                    {version.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {version.desc}
                  </p>
                  
                  {/* Credits */}
                  <span className="text-[10px] text-muted-foreground/70">
                    {version.credits}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Parameters */}
          <div className="lg:col-span-3 space-y-6">
            <MusicStyleSelector
              selectedStyles={selectedStyles}
              onSelectionChange={setSelectedStyles}
            />
            <SingerStyleSelector
              selectedSingers={selectedSingers}
              onSelectionChange={setSelectedSingers}
            />
            <VoiceUpload
              uploadedVoices={uploadedVoices}
              onUpload={handleVoiceUpload}
              onRemove={handleVoiceRemove}
              selectedVoice={selectedVoice}
              onSelectVoice={setSelectedVoice}
            />
          </div>

          {/* Middle Column - Creation */}
          <div className="lg:col-span-5 space-y-6">
            {/* Song Title Input */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-foreground">
                  歌曲名称
                </label>
                <span className="text-xs text-muted-foreground">
                  {songTitle.length}/20
                </span>
              </div>
              <input
                type="text"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                maxLength={20}
                placeholder="请为你的歌曲起个名字"
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            {/* Song Duration Slider */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-foreground">
                  歌曲时长
                </label>
                <span className="text-sm font-mono text-primary">
                  {Math.floor(songDuration / 60)}:{(songDuration % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <input
                type="range"
                min={240}
                max={480}
                step={30}
                value={songDuration}
                onChange={(e) => setSongDuration(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-gold"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>4:00</span>
                <span>6:00</span>
                <span>8:00</span>
              </div>
            </div>
            <DescriptionInput value={description} onChange={setDescription} />
            <LyricsEditor
              value={lyrics}
              onChange={setLyrics}
              onImportFromAI={handleLyricsFromAI}
            />
            
            {/* Lyrics Analysis Bar - shows bracket tag warning */}
            {lyricsAnalysis.hasBrackets && (
              <div className="glass-card p-3 border-l-2 border-amber-400/60 bg-amber-500/5">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-amber-200/90 leading-relaxed">
                      {lyricsAnalysis.warningText}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {lyricsAnalysis.bracketTags.slice(0, 8).map((tag, i) => (
                        <span
                          key={i}
                          className="inline-block px-1.5 py-0.5 text-[10px] font-mono bg-amber-400/10 text-amber-300 rounded"
                        >
                          [{tag}]
                        </span>
                      ))}
                      {lyricsAnalysis.bracketTags.length > 8 && (
                        <span className="inline-block px-1.5 py-0.5 text-[10px] text-amber-400/60">
                          +{lyricsAnalysis.bracketTags.length - 8}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <DeepThinkingLyrics onLyricsGenerated={handleLyricsFromAI} />
          </div>

          {/* Right Column - Result */}
          <div className="lg:col-span-4 space-y-6">
            <MusicPlayer
              audioUrl={generatedAudioUrl}
              isGenerating={isGenerating}
              generationProgress={generationProgress}
            />

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-6 text-lg font-semibold gradient-gold-purple hover:opacity-90 glow-gold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  生成音乐
                </>
              )}
            </Button>

            {/* Tips */}
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold mb-2">💡 创作提示</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 选择 2-3 个风格可以创造独特的融合效果</li>
                <li>• 描述词越详细，生成效果越精准</li>
                <li>• 使用 AI 深度思考功能创作高质量歌词</li>
                <li>• 上传音色可以克隆特定的声音特质</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
