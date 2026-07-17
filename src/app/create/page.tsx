'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { MusicStyleSelector } from '@/components/music-style-selector';
import { SingerStyleSelector } from '@/components/singer-style-selector';
import { DescriptionInput } from '@/components/description-input';
import { LyricsEditor } from '@/components/lyrics-editor';
import { VoiceUpload, type VoiceFile } from '@/components/voice-upload';
import { MusicPlayer } from '@/components/music-player';
import { DeepThinkingLyrics } from '@/components/deep-thinking-lyrics';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

export default function CreatePage() {
  // State
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedSingers, setSelectedSingers] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [uploadedVoices, setUploadedVoices] = useState<VoiceFile[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string>();

  const handleGenerate = async () => {
    if (selectedStyles.length === 0) {
      alert('请至少选择一个音乐风格');
      return;
    }

    if (!description.trim() && !lyrics.trim()) {
      alert('请输入描述词或歌词');
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
          styles: selectedStyles,
          singers: selectedSingers,
          description,
          lyrics,
          voiceId: selectedVoice,
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('生成失败');
      }

      const data = await response.json();
      setGenerationProgress(100);
      setGeneratedAudioUrl(data.audioUrl);
    } catch (error) {
      console.error('生成失败:', error);
      alert('音乐生成失败，请稍后重试');
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">
            AI 音乐创作
          </h1>
          <p className="text-muted-foreground">
            选择风格、描述情绪，让 AI 为你创作独一无二的音乐作品
          </p>
        </div>

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
            <DescriptionInput value={description} onChange={setDescription} />
            <LyricsEditor
              value={lyrics}
              onChange={setLyrics}
              onImportFromAI={handleLyricsFromAI}
            />
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
