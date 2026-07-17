'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, Mic2, X, Play, Pause } from 'lucide-react';

interface VoiceUploadProps {
  uploadedVoices: VoiceFile[];
  onUpload: (voice: VoiceFile) => void;
  onRemove: (id: string) => void;
  selectedVoice?: string;
  onSelectVoice?: (id: string) => void;
}

export interface VoiceFile {
  id: string;
  name: string;
  duration: number;
  file?: File;
  url?: string;
}

export function VoiceUpload({
  uploadedVoices,
  onUpload,
  onRemove,
  selectedVoice,
  onSelectVoice,
}: VoiceUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      if (!file.type.startsWith('audio/')) {
        alert('请上传音频文件（wav/mp3）');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('文件大小不能超过 10MB');
        return;
      }

      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        if (audio.duration > 60) {
          alert('音频时长不能超过 60 秒');
          URL.revokeObjectURL(audio.src);
          return;
        }

        const voiceFile: VoiceFile = {
          id: Date.now().toString(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          duration: audio.duration,
          file,
          url: URL.createObjectURL(file),
        };
        onUpload(voiceFile);
      };
    });
  };

  const togglePlay = (voice: VoiceFile) => {
    if (playingId === voice.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (voice.url) {
        audioRef.current = new Audio(voice.url);
        audioRef.current.play();
        audioRef.current.onended = () => setPlayingId(null);
        setPlayingId(voice.id);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-primary">🎙️</span>
        音色上传
      </h3>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-white/20 hover:border-white/40 hover:bg-white/5'
        )}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          拖拽音频文件到此处，或点击上传
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          支持 wav/mp3，最长 60 秒
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Voice List */}
      {uploadedVoices.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-muted-foreground mb-2">我的音色库：</p>
          {uploadedVoices.map((voice) => (
            <div
              key={voice.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg transition-all',
                selectedVoice === voice.id
                  ? 'bg-primary/10 border border-primary/30'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              )}
            >
              <button
                onClick={() => togglePlay(voice)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                {playingId === voice.id ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{voice.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDuration(voice.duration)}
                </p>
              </div>
              {onSelectVoice && (
                <button
                  onClick={() => onSelectVoice(voice.id)}
                  className={cn(
                    'px-2 py-1 text-xs rounded transition-colors',
                    selectedVoice === voice.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/10 hover:bg-white/20'
                  )}
                >
                  {selectedVoice === voice.id ? '已选' : '选择'}
                </button>
              )}
              <button
                onClick={() => onRemove(voice.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <p className="text-xs text-muted-foreground">
          💡 音色克隆功能将通过 Suno v4 自定义人声或 ElevenLabs API 实现（接口预留中）
        </p>
      </div>
    </div>
  );
}
