'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/navbar';
import { mockSongsWithArtists, formatCount, formatDuration, type MockSong } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import {
  Play,
  Pause,
  Heart,
  MessageCircle,
  Star,
  Share2,
  ChevronUp,
  ChevronDown,
  Music,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function DiscoverPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const [collectedSongs, setCollectedSongs] = useState<Set<string>>(new Set());
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const songs = mockSongsWithArtists;
  const currentSong = songs[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < songs.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(true);
    }
  }, [currentIndex, songs.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
      setIsPlaying(true);
    }
  }, [currentIndex]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 30) {
        goNext();
      } else if (e.deltaY < -30) {
        goPrev();
      }
    },
    [goNext, goPrev]
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;
      if (diff > 50) {
        goNext();
      } else if (diff < -50) {
        goPrev();
      }
    },
    [goNext, goPrev]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goPrev();
      }
    },
    [goNext, goPrev]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleTouchStart, handleTouchEnd, handleKeyDown]);

  const toggleLike = () => {
    const songId = currentSong.id;
    setLikedSongs((prev) => {
      const next = new Set(prev);
      if (next.has(songId)) {
        next.delete(songId);
      } else {
        next.add(songId);
      }
      return next;
    });
  };

  const toggleCollect = () => {
    const songId = currentSong.id;
    setCollectedSongs((prev) => {
      const next = new Set(prev);
      if (next.has(songId)) {
        next.delete(songId);
      } else {
        next.add(songId);
      }
      return next;
    });
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Parse current lyrics line
  const getCurrentLyricLine = () => {
    if (!currentSong.lyrics) return '';
    const lines = currentSong.lyrics.split('\n').filter((l) => l.trim() && !l.startsWith('['));
    return lines[0] || '';
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      <Navbar />

      <div ref={containerRef} className="relative h-full w-full pt-16">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSong.id}
            custom={direction}
            initial={{
              y: direction > 0 ? '100%' : '-100%',
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: direction > 0 ? '-100%' : '100%',
              opacity: 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Background with blur */}
            <div className="absolute inset-0">
              <div
                className="absolute inset-0 bg-cover bg-center scale-110 blur-3xl opacity-30"
                style={{ backgroundImage: `url(${currentSong.cover_url})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 max-w-6xl w-full">
                {/* Cover Art */}
                <div className="relative group">
                  <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20">
                    <img
                      src={currentSong.cover_url}
                      alt={currentSong.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Play overlay */}
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={togglePlay}
                    >
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-white" />
                        ) : (
                          <Play className="w-8 h-8 text-white ml-1" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Wave animation */}
                  {isPlaying && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-gradient-to-t from-primary to-accent rounded-full wave-animation"
                          style={{
                            height: `${20 + Math.sin(i * 0.5) * 30 + 30}%`,
                            animationDelay: `${i * 0.05}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Song Info */}
                <div className="flex-1 text-center lg:text-left max-w-lg">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient-gold mb-4">
                    {currentSong.title}
                  </h1>

                  {/* Artist */}
                  <div className="flex items-center gap-3 justify-center lg:justify-start mb-6">
                    <img
                      src={currentSong.artist?.avatar}
                      alt={currentSong.artist?.nickname}
                      className="w-10 h-10 rounded-full border-2 border-primary/50"
                    />
                    <div>
                      <p className="text-foreground font-medium">{currentSong.artist?.nickname}</p>
                      <p className="text-sm text-muted-foreground">{currentSong.artist?.slogan}</p>
                    </div>
                  </div>

                  {/* Style Tags */}
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                    {currentSong.style_tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    {currentSong.description}
                  </p>

                  {/* Current Lyric Line */}
                  <div className="glass-card p-4 rounded-xl mb-6">
                    <p className="text-foreground italic text-center">&quot;{getCurrentLyricLine()}&quot;</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Play className="w-4 h-4" />
                      {formatCount(currentSong.play_count)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {formatCount(currentSong.like_count)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {formatCount(currentSong.comment_count)}
                    </span>
                    <span>{formatDuration(currentSong.duration)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20">
              <ActionButton
                icon={Heart}
                count={currentSong.like_count + (likedSongs.has(currentSong.id) ? 1 : 0)}
                isActive={likedSongs.has(currentSong.id)}
                activeColor="text-red-500"
                onClick={toggleLike}
                label="点赞"
              />
              <ActionButton
                icon={MessageCircle}
                count={currentSong.comment_count}
                onClick={() => {}}
                label="评论"
              />
              <ActionButton
                icon={Star}
                count={currentSong.collect_count + (collectedSongs.has(currentSong.id) ? 1 : 0)}
                isActive={collectedSongs.has(currentSong.id)}
                activeColor="text-yellow-500"
                onClick={toggleCollect}
                label="收藏"
              />
              <ActionButton icon={Share2} onClick={() => {}} label="分享" />
            </div>

            {/* Bottom Navigation Hints */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
              {currentIndex > 0 && (
                <button
                  onClick={goPrev}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Music className="w-3 h-3" />
                <span>
                  {currentIndex + 1} / {songs.length}
                </span>
              </div>
              {currentIndex < songs.length - 1 && (
                <button
                  onClick={goNext}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Hidden audio element */}
        <audio ref={audioRef} src={currentSong.audio_url} />
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  count,
  isActive,
  activeColor,
  onClick,
  label,
}: {
  icon: React.ComponentType<{ className?: string; fill?: string }>;
  count?: number;
  isActive?: boolean;
  activeColor?: string;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 group"
      title={label}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-full glass-card flex items-center justify-center transition-all duration-200',
          'hover:scale-110 hover:bg-white/10',
          isActive && 'glow-gold'
        )}
      >
        <Icon
          className={cn(
            'w-5 h-5 transition-colors',
            isActive ? activeColor || 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
          )}
          fill={isActive ? 'currentColor' : 'none'}
        />
      </div>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">{formatCount(count)}</span>
      )}
    </button>
  );
}
