'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Filter,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { shareSong } from '@/lib/share';

export const dynamic = 'force-dynamic';

interface FeedSong {
  id: string;
  title: string;
  audioUrl: string;
  coverUrl: string | null;
  duration: number | null;
  playCount: number;
  likeCount: number;
  collectCount: number;
  commentCount: number;
  genre: string | null;
  tags: string[] | null;
  createdAt: string;
  userId: string | null;
  userNickname: string | null;
  userAvatar: string | null;
  isLiked?: boolean;
  isCollected?: boolean;
}

export default function DiscoverPage() {
  const { user } = useAuth();
  const [songs, setSongs] = useState<FeedSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [direction, setDirection] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentIndex];

  // 获取信息流
  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedGenre) params.set('genre', selectedGenre);
      
      const res = await fetch(`/api/feed?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setSongs(data.data.songs || []);
      }
    } catch (error) {
      console.error('获取信息流失败:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedGenre]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // 检查点赞/收藏状态
  useEffect(() => {
    if (!user || !currentSong) return;
    
    const checkStatus = async () => {
      try {
        const [likeRes, collectRes] = await Promise.all([
          fetch(`/api/interactions/like?songId=${currentSong.id}&userId=${user.id}`),
          fetch(`/api/interactions/collect?songId=${currentSong.id}&userId=${user.id}`),
        ]);
        
        const likeData = await likeRes.json();
        const collectData = await collectRes.json();
        
        setSongs(prev => prev.map((song, idx) => 
          idx === currentIndex 
            ? { ...song, isLiked: likeData.data?.liked, isCollected: collectData.data?.collected }
            : song
        ));
      } catch (error) {
        console.error('检查状态失败:', error);
      }
    };
    
    checkStatus();
  }, [currentIndex, currentSong, user]);

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
      if (e.deltaY > 30) goNext();
      else if (e.deltaY < -30) goPrev();
    },
    [goNext, goPrev]
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (diff > 50) goNext();
      else if (diff < -50) goPrev();
    },
    [goNext, goPrev]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleWheel, handleTouchStart, handleTouchEnd]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
    }
  }, [isPlaying, currentIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleLike = async () => {
    if (!user || !currentSong) {
      alert('请先登录');
      return;
    }
    
    try {
      const res = await fetch('/api/interactions/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId: currentSong.id, userId: user.id }),
      });
      const data = await res.json();
      
      if (data.success) {
        setSongs(prev => prev.map((song, idx) => 
          idx === currentIndex 
            ? { 
                ...song, 
                isLiked: data.data.liked,
                likeCount: data.data.liked ? song.likeCount + 1 : song.likeCount - 1
              }
            : song
        ));
      }
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleCollect = async () => {
    if (!user || !currentSong) {
      alert('请先登录');
      return;
    }
    
    try {
      const res = await fetch('/api/interactions/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId: currentSong.id, userId: user.id }),
      });
      const data = await res.json();
      
      if (data.success) {
        setSongs(prev => prev.map((song, idx) => 
          idx === currentIndex 
            ? { 
                ...song, 
                isCollected: data.data.collected,
                collectCount: data.data.collected ? song.collectCount + 1 : song.collectCount - 1
              }
            : song
        ));
      }
    } catch (error) {
      console.error('收藏失败:', error);
    }
  };

  const handleComment = async () => {
    if (!user || !currentSong || !commentText.trim()) return;
    
    try {
      const res = await fetch('/api/interactions/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          songId: currentSong.id, 
          userId: user.id, 
          content: commentText 
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        setSongs(prev => prev.map((song, idx) => 
          idx === currentIndex 
            ? { ...song, commentCount: song.commentCount + 1 }
            : song
        ));
        setCommentText('');
      }
    } catch (error) {
      console.error('评论失败:', error);
    }
  };

  const handleShare = () => {
    if (currentSong) {
      shareSong({
        id: currentSong.id,
        title: currentSong.title,
        coverUrl: currentSong.coverUrl || undefined,
      });
    }
  };

  const formatCount = (count: number) => {
    if (count >= 10000) return (count / 10000).toFixed(1) + 'w';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
  };

  const genres = ['流行', '摇滚', '电子', '嘻哈', 'R&B', '爵士', '古典', '民谣', '乡村', '金属'];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f3460] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">加载中...</p>
          </div>
        </div>
      </>
    );
  }

  if (songs.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f3460] flex items-center justify-center">
          <div className="text-center">
            <Music className="w-16 h-16 text-[#d4af37]/50 mx-auto mb-4" />
            <h2 className="text-xl text-white mb-2">暂无作品</h2>
            <p className="text-white/60 mb-4">还没有人发布歌曲，快去创作第一首吧！</p>
            <Button onClick={() => window.location.href = '/create'} className="bg-gradient-to-r from-[#d4af37] to-[#f59e0b]">
              去创作
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f3460] relative">
        {/* 筛选按钮 */}
        <div className="fixed top-20 left-4 z-40">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilter(!showFilter)}
            className="bg-black/50 border-white/20 text-white backdrop-blur-sm"
          >
            <Filter className="w-4 h-4 mr-1" />
            筛选
          </Button>
        </div>

        {/* 筛选面板 */}
        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed top-32 left-4 z-40 bg-black/80 backdrop-blur-lg rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">风格筛选</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilter(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 max-w-[200px]">
                <Badge
                  variant={selectedGenre === null ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer',
                    selectedGenre === null ? 'bg-[#d4af37]' : 'border-white/20 text-white/60'
                  )}
                  onClick={() => setSelectedGenre(null)}
                >
                  全部
                </Badge>
                {genres.map(genre => (
                  <Badge
                    key={genre}
                    variant={selectedGenre === genre ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer',
                      selectedGenre === genre ? 'bg-[#d4af37]' : 'border-white/20 text-white/60'
                    )}
                    onClick={() => setSelectedGenre(genre === selectedGenre ? null : genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 歌曲卡片容器 */}
        <div
          ref={containerRef}
          className="h-screen w-full overflow-hidden relative flex items-center justify-center"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ y: direction > 0 ? '100%' : '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: direction > 0 ? '-100%' : '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex items-center justify-center p-4"
            >
              {currentSong && (
                <div className="max-w-4xl w-full mx-auto grid md:grid-cols-2 gap-8 items-center">
                  {/* 封面 */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                    {currentSong.coverUrl ? (
                      <img src={currentSong.coverUrl} alt={currentSong.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#d4af37]/20 to-[#8b5cf6]/20 flex items-center justify-center">
                        <Music className="w-24 h-24 text-[#d4af37]/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* 播放按钮 */}
                    <button
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-white" fill="white" />
                        ) : (
                          <Play className="w-8 h-8 text-white ml-1" fill="white" />
                        )}
                      </div>
                    </button>

                    {/* 音频 */}
                    {currentSong.audioUrl && (
                      <audio
                        ref={audioRef}
                        src={currentSong.audioUrl}
                        onEnded={() => setIsPlaying(false)}
                      />
                    )}
                  </div>

                  {/* 信息 */}
                  <div className="space-y-4">
                    {/* 用户信息 */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f59e0b] flex items-center justify-center text-white font-bold">
                        {currentSong.userAvatar ? (
                          <img src={currentSong.userAvatar} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          currentSong.userNickname?.[0] || '?'
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{currentSong.userNickname || '匿名'}</p>
                        <p className="text-white/40 text-xs">
                          {new Date(currentSong.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* 歌曲信息 */}
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">{currentSong.title}</h1>
                      {currentSong.genre && (
                        <Badge className="bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30">
                          {currentSong.genre}
                        </Badge>
                      )}
                    </div>

                    {/* 标签 */}
                    {currentSong.tags && currentSong.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {currentSong.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="border-white/20 text-white/60">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* 互动按钮 */}
                    <div className="flex items-center gap-6 pt-4">
                      <button
                        onClick={handleLike}
                        className={cn(
                          'flex flex-col items-center gap-1 transition-all',
                          currentSong.isLiked ? 'text-red-500' : 'text-white/60 hover:text-white'
                        )}
                      >
                        <Heart className={cn('w-6 h-6', currentSong.isLiked && 'fill-current')} />
                        <span className="text-xs">{formatCount(currentSong.likeCount)}</span>
                      </button>

                      <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-all"
                      >
                        <MessageCircle className="w-6 h-6" />
                        <span className="text-xs">{formatCount(currentSong.commentCount)}</span>
                      </button>

                      <button
                        onClick={handleCollect}
                        className={cn(
                          'flex flex-col items-center gap-1 transition-all',
                          currentSong.isCollected ? 'text-[#d4af37]' : 'text-white/60 hover:text-white'
                        )}
                      >
                        <Star className={cn('w-6 h-6', currentSong.isCollected && 'fill-current')} />
                        <span className="text-xs">{formatCount(currentSong.collectCount)}</span>
                      </button>

                      <button
                        onClick={handleShare}
                        className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-all"
                      >
                        <Share2 className="w-6 h-6" />
                        <span className="text-xs">分享</span>
                      </button>
                    </div>

                    {/* 播放量 */}
                    <div className="flex items-center gap-2 text-white/40 text-sm pt-2">
                      <Play className="w-4 h-4" />
                      <span>{formatCount(currentSong.playCount)} 次播放</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 导航提示 */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
            {currentIndex > 0 && <ChevronUp className="w-6 h-6 animate-bounce" />}
            <span className="text-xs">滑动切换</span>
            {currentIndex < songs.length - 1 && <ChevronDown className="w-6 h-6 animate-bounce" />}
          </div>

          {/* 进度指示 */}
          <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
            {songs.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  'w-1 h-6 rounded-full transition-all',
                  idx === currentIndex ? 'bg-[#d4af37] h-8' : 'bg-white/20'
                )}
              />
            ))}
          </div>
        </div>

        {/* 评论面板 */}
        <AnimatePresence>
          {showComments && currentSong && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 h-[60vh] bg-black/95 backdrop-blur-lg rounded-t-2xl border-t border-white/10 z-50"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-medium">评论 ({currentSong.commentCount})</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowComments(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4 flex gap-2">
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="写下你的评论..."
                  className="bg-white/5 border-white/10 text-white"
                />
                <Button onClick={handleComment} className="bg-[#d4af37] hover:bg-[#d4af37]/80">
                  发送
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
