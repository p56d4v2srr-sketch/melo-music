'use client';

import { useState, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Music,
  X,
  Maximize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Player context
interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration?: number;
}

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  isMuted: boolean;
  play: (song: Song) => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seek: (progress: number) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

// Player Provider
export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio();
    }
  }, []);

  const audio = audioRef.current;

  useEffect(() => {
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audio]);

  useEffect(() => {
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted, audio]);

  const play = (song: Song) => {
    if (!audio) return;
    
    if (currentSong?.id !== song.id) {
      setCurrentSong(song);
      audio.src = song.audioUrl;
    }
    
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(console.error);
  };

  const pause = () => {
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else if (currentSong) {
      audio?.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const next = () => {
    // In a real app, this would play the next song in the queue
    console.log('Next song');
  };

  const previous = () => {
    // In a real app, this would play the previous song in the queue
    console.log('Previous song');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const seek = (newProgress: number) => {
    if (!audio || !audio.duration) return;
    audio.currentTime = (newProgress / 100) * audio.duration;
    setProgress(newProgress);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        volume,
        isMuted,
        play,
        pause,
        togglePlay,
        next,
        previous,
        setVolume,
        toggleMute,
        seek,
      }}
    >
      {children}
      <GlobalPlayer />
    </PlayerContext.Provider>
  );
}

// Global Player Component
function GlobalPlayer() {
  const { currentSong, isPlaying, progress, volume, isMuted, togglePlay, next, previous, setVolume, toggleMute, seek } = usePlayer();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentSong) return null;

  return (
    <>
      {/* Mini Player */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/10"
      >
        {/* Progress Bar */}
        <div 
          className="h-1 bg-white/10 cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const newProgress = (x / rect.width) * 100;
            seek(newProgress);
          }}
        >
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex items-center gap-4 px-4 py-3">
          {/* Song Info */}
          <div 
            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0">
              {currentSong.coverUrl ? (
                <img src={currentSong.coverUrl} alt={currentSong.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-6 h-6 text-primary/50" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{currentSong.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={previous}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button
              onClick={next}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2 w-32">
            <button
              onClick={toggleMute}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume * 100}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
              className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
          </div>
        </div>
      </motion.div>

      {/* Expanded Player (Modal) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => setIsExpanded(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
              <p className="text-sm text-muted-foreground">正在播放</p>
              <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Cover */}
            <div className="flex-1 flex items-center justify-center px-8">
              <motion.div
                animate={{ scale: isPlaying ? 1 : 0.9 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-primary/20"
              >
                {currentSong.coverUrl ? (
                  <img src={currentSong.coverUrl} alt={currentSong.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Music className="w-24 h-24 text-primary/50" />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Info & Controls */}
            <div className="p-8 space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold">{currentSong.title}</h2>
                <p className="text-muted-foreground mt-1">{currentSong.artist}</p>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div 
                  className="h-1 bg-white/10 rounded-full cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const newProgress = (x / rect.width) * 100;
                    seek(newProgress);
                  }}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-8">
                <button
                  onClick={previous}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipBack className="w-6 h-6" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>
                <button
                  onClick={next}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipForward className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
