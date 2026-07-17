'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { cn } from '@/lib/utils';
import { Play, Pause, Download, Share2, SkipBack, SkipForward } from 'lucide-react';

interface MusicPlayerProps {
  audioUrl?: string;
  title?: string;
  isGenerating?: boolean;
  generationProgress?: number;
}

export function MusicPlayer({ audioUrl, title, isGenerating, generationProgress = 0 }: MusicPlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!waveformRef.current || !audioUrl) return;

    // Initialize WaveSurfer
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'rgba(139, 92, 246, 0.5)',
      progressColor: 'rgba(212, 175, 55, 0.8)',
      cursorColor: 'rgba(212, 175, 55, 1)',
      barWidth: 2,
      barRadius: 2,
      barGap: 1,
      height: 80,
      normalize: true,
    });

    wavesurferRef.current.load(audioUrl);

    wavesurferRef.current.on('ready', () => {
      setDuration(wavesurferRef.current?.getDuration() || 0);
    });

    wavesurferRef.current.on('audioprocess', () => {
      setCurrentTime(wavesurferRef.current?.getCurrentTime() || 0);
    });

    wavesurferRef.current.on('seeking', () => {
      setCurrentTime(wavesurferRef.current?.getCurrentTime() || 0);
    });

    wavesurferRef.current.on('play', () => setIsPlaying(true));
    wavesurferRef.current.on('pause', () => setIsPlaying(false));
    wavesurferRef.current.on('finish', () => setIsPlaying(false));

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [audioUrl]);

  const togglePlay = () => {
    wavesurferRef.current?.playPause();
  };

  const seekTo = (time: number) => {
    wavesurferRef.current?.setTime(time);
    setCurrentTime(time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const safeTitle = title
      ? title.replace(/[/\\:*?"<>|]/g, '_').replace(/\s+/g, '_')
      : `melo-music-${Date.now()}`;
    const downloadUrl = `/api/download-song?url=${encodeURIComponent(audioUrl)}&filename=${encodeURIComponent(safeTitle + '.mp3')}`;
    window.open(downloadUrl, '_self');
  };

  const handleShare = async () => {
    if (!audioUrl) return;
    try {
      await navigator.clipboard.writeText(audioUrl);
      alert('链接已复制到剪贴板');
    } catch {
      alert('复制失败，请手动复制链接');
    }
  };

  if (isGenerating) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-primary">🎵</span>
          生成中...
        </h3>
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>生成进度</span>
              <span>{Math.round(generationProgress)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full gradient-gold-purple transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
          </div>

          {/* Waveform Animation */}
          <div className="flex items-center justify-center gap-1 h-20">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-primary to-accent rounded-full wave-animation"
                style={{
                  height: `${20 + (i % 5) * 12}%`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>

          <p className="text-sm text-center text-muted-foreground">
            AI 正在创作你的音乐，请稍候...
          </p>
        </div>
      </div>
    );
  }

  if (!audioUrl) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-primary">🎵</span>
          音乐播放
        </h3>
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
            <Play className="w-8 h-8 opacity-50" />
          </div>
          <p className="text-sm">设置参数后点击生成按钮</p>
          <p className="text-xs mt-1">AI 将为你创作独一无二的音乐</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-primary">🎵</span>
        音乐播放
      </h3>

      {/* Waveform */}
      <div ref={waveformRef} className="mb-4 rounded-lg overflow-hidden" />

      {/* Controls */}
      <div className="space-y-3">
        {/* Time */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Progress Bar */}
        <div
          className="h-1 bg-white/10 rounded-full cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            seekTo(percent * duration);
          }}
        >
          <div
            className="h-full gradient-gold-purple rounded-full relative group-hover:h-1.5 transition-all"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => seekTo(Math.max(0, currentTime - 10))}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={togglePlay}
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center transition-all',
                'bg-primary text-primary-foreground hover:scale-105 glow-gold'
              )}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button
              onClick={() => seekTo(Math.min(duration, currentTime + 10))}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="下载"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="分享"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
