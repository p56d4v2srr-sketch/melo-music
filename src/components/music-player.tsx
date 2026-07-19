'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { cn } from '@/lib/utils';
import { Play, Pause, Download, Share2, SkipBack, SkipForward, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface AudioCandidate {
  url: string;
  label?: string;
  /** High quality audio URL (WAV/FLAC) if available */
  hqUrl?: string;
}

interface MusicPlayerProps {
  audioUrl?: string;
  /** Multiple audio candidates for switching (Suno/PuLe return 2 songs) */
  candidates?: AudioCandidate[];
  title?: string;
  /** Provider name for download filename */
  provider?: string;
  isGenerating?: boolean;
  generationProgress?: number;
}

/**
 * Detect file extension from URL (ignoring query params)
 * e.g. "https://example.com/song.wav?auth=xxx" -> "wav"
 */
function getUrlExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    const ext = pathname.split('.').pop();
    if (ext && ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'].includes(ext)) {
      return ext;
    }
  } catch { /* ignore */ }
  return 'mp3'; // default fallback
}

/**
 * Sanitize filename for Windows/macOS compatibility
 */
function sanitizeFilename(name: string): string {
  return name.replace(/[/\\:*?"<>|]/g, '_').replace(/\s+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

/**
 * Build download filename: <title>-<provider>-<idx>.<ext>
 * Prevents double extension like .mp3.wav
 */
function buildDownloadFilename(title: string, provider: string, idx: number, url: string): string {
  const ext = getUrlExtension(url);
  const safeTitle = sanitizeFilename(title) || 'melo-music';
  const safeProvider = sanitizeFilename(provider) || 'ai';
  return `${safeTitle}-${safeProvider}-${idx + 1}.${ext}`;
}

export function MusicPlayer({ audioUrl, candidates, title, provider, isGenerating, generationProgress = 0 }: MusicPlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  // Build effective candidates list
  const effectiveCandidates: AudioCandidate[] = candidates && candidates.length > 0
    ? candidates
    : audioUrl
      ? [{ url: audioUrl, label: '第 1 首' }]
      : [];

  const currentCandidate = effectiveCandidates[currentIdx];
  // Prefer high quality URL for playback to avoid noise/compression artifacts
  const currentUrl = currentCandidate?.hqUrl || currentCandidate?.url;
  const hasMultiple = effectiveCandidates.length > 1;

  // Switch track
  const switchTrack = (newIdx: number) => {
    if (newIdx < 0 || newIdx >= effectiveCandidates.length) return;
    setCurrentIdx(newIdx);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  useEffect(() => {
    if (!waveformRef.current || !currentUrl) return;

    // Destroy previous instance
    wavesurferRef.current?.destroy();

    // Initialize WaveSurfer
    // Use MediaElement backend to avoid Web Audio API sample rate issues that can cause noise
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
      backend: 'MediaElement', // Use HTML5 Audio backend to avoid Web Audio API noise issues
    });

    wavesurferRef.current.load(currentUrl);

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
  }, [currentUrl]);

  // Reset index when candidates change
  useEffect(() => {
    setCurrentIdx(0);
  }, [effectiveCandidates.length]);

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

  const handleDownload = (quality: 'standard' | 'high' = 'standard') => {
    if (!currentUrl) return;
    setShowQualityMenu(false);
    
    // Determine which URL to use based on quality
    const downloadUrl = quality === 'high' && currentCandidate?.hqUrl 
      ? currentCandidate.hqUrl 
      : currentUrl;
    
    const ext = quality === 'high' && currentCandidate?.hqUrl 
      ? getUrlExtension(currentCandidate.hqUrl)
      : getUrlExtension(currentUrl);
    
    const qualitySuffix = quality === 'high' ? '-HQ' : '';
    const filename = buildDownloadFilename(
      title || 'melo-music',
      provider || 'ai',
      currentIdx,
      downloadUrl
    ).replace(`.${ext}`, `${qualitySuffix}.${ext}`);
    
    const apiDownloadUrl = `/api/download-song?url=${encodeURIComponent(downloadUrl)}&filename=${encodeURIComponent(filename)}`;
    window.open(apiDownloadUrl, '_self');
  };

  const handleShare = async () => {
    if (!currentUrl) return;
    try {
      await navigator.clipboard.writeText(currentUrl);
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

  if (!currentUrl) {
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-primary">🎵</span>
          音乐播放
          <span className="px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary rounded font-medium">Hi-Fi</span>
          <span className="px-1.5 py-0.5 text-[10px] bg-white/10 text-muted-foreground rounded">立体声</span>
        </h3>
        {/* Candidate switcher */}
        {hasMultiple && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => switchTrack(currentIdx - 1)}
              disabled={currentIdx === 0}
              className="p-1 rounded hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="上一首"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground px-2 min-w-[60px] text-center">
              {currentCandidate?.label || `第 ${currentIdx + 1} 首`}
              <span className="ml-1 text-muted-foreground/50">({currentIdx + 1}/{effectiveCandidates.length})</span>
            </span>
            <button
              onClick={() => switchTrack(currentIdx + 1)}
              disabled={currentIdx === effectiveCandidates.length - 1}
              className="p-1 rounded hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="下一首"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

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
            {/* Prev candidate */}
            {hasMultiple && (
              <button
                onClick={() => switchTrack(currentIdx - 1)}
                disabled={currentIdx === 0}
                className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="上一首候选"
              >
                <SkipBack className="w-4 h-4" />
              </button>
            )}
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
            {/* Next candidate */}
            {hasMultiple && (
              <button
                onClick={() => switchTrack(currentIdx + 1)}
                disabled={currentIdx === effectiveCandidates.length - 1}
                className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="下一首候选"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Download with quality selection */}
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors flex items-center gap-0.5"
                title={`下载${hasMultiple ? ` (第 ${currentIdx + 1} 首)` : ''}`}
              >
                <Download className="w-4 h-4" />
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
              {/* Quality dropdown menu */}
              {showQualityMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowQualityMenu(false)} 
                  />
                  <div className="absolute right-0 bottom-full mb-2 z-50 min-w-[140px] glass-card p-1.5 border border-white/10 shadow-xl">
                    <button
                      onClick={() => handleDownload('standard')}
                      className="w-full text-left px-3 py-2 text-xs rounded hover:bg-white/10 transition-colors flex items-center justify-between"
                    >
                      <span>标准质量</span>
                      <span className="text-muted-foreground">MP3</span>
                    </button>
                    {currentCandidate?.hqUrl && (
                      <button
                        onClick={() => handleDownload('high')}
                        className="w-full text-left px-3 py-2 text-xs rounded hover:bg-white/10 transition-colors flex items-center justify-between group"
                      >
                        <span className="text-primary font-medium">最高质量</span>
                        <span className="px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary rounded">
                          {getUrlExtension(currentCandidate.hqUrl).toUpperCase()}
                        </span>
                      </button>
                    )}
                    {!currentCandidate?.hqUrl && (
                      <div className="px-3 py-2 text-[10px] text-muted-foreground/60 text-center">
                        高品质不可用
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
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
