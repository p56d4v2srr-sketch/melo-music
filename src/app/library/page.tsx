'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Music, Download, Share2, Heart, Play, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Work {
  id: string;
  title: string;
  styles: string[];
  description: string;
  createdAt: string;
  duration: string;
  audioUrl?: string;
  isFavorite: boolean;
}

// Demo data
const demoWorks: Work[] = [
  {
    id: '1',
    title: '深夜思念',
    styles: ['华语流行', '抒情'],
    description: '一首温暖的抒情歌曲，描述深夜思念一个人的心情',
    createdAt: '2024-01-15',
    duration: '3:45',
    isFavorite: true,
  },
  {
    id: '2',
    title: '城市漫步',
    styles: ['Lo-fi', 'Chillhop'],
    description: '轻松的Lo-fi节拍，适合在城市中漫步时聆听',
    createdAt: '2024-01-14',
    duration: '2:30',
    isFavorite: false,
  },
  {
    id: '3',
    title: '追梦人',
    styles: ['摇滚', '励志'],
    description: '激昂的摇滚歌曲，表达追逐梦想的坚持',
    createdAt: '2024-01-13',
    duration: '4:12',
    isFavorite: true,
  },
  {
    id: '4',
    title: '雨中漫步',
    styles: ['爵士', '浪漫'],
    description: '浪漫的爵士乐曲，雨天的最佳伴侣',
    createdAt: '2024-01-12',
    duration: '3:28',
    isFavorite: false,
  },
];

export default function LibraryPage() {
  const [works, setWorks] = useState<Work[]>(demoWorks);
  const [filter, setFilter] = useState<'all' | 'favorite'>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filteredWorks = filter === 'all' ? works : works.filter((w) => w.isFavorite);

  const toggleFavorite = (id: string) => {
    setWorks(works.map((w) => (w.id === id ? { ...w, isFavorite: !w.isFavorite } : w)));
  };

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  const handleDownload = (work: Work) => {
    if (work.audioUrl) {
      const link = document.createElement('a');
      link.href = work.audioUrl;
      link.download = `${work.title}.mp3`;
      link.click();
    } else {
      alert('音频文件不可用');
    }
  };

  const handleShare = async (work: Work) => {
    try {
      await navigator.clipboard.writeText(`SonicAI 作品：${work.title}`);
      alert('链接已复制到剪贴板');
    } catch {
      alert('复制失败');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">作品库</h1>
          <p className="text-muted-foreground">管理你创作的所有音乐作品</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm transition-all',
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10'
            )}
          >
            全部作品 ({works.length})
          </button>
          <button
            onClick={() => setFilter('favorite')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm transition-all',
              filter === 'favorite'
                ? 'bg-primary text-primary-foreground'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10'
            )}
          >
            我的收藏 ({works.filter((w) => w.isFavorite).length})
          </button>
        </div>

        {/* Works Grid */}
        {filteredWorks.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">暂无作品</p>
            <p className="text-sm text-muted-foreground mt-1">开始创作你的第一首歌曲吧</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorks.map((work) => (
              <div key={work.id} className="glass-card-hover p-4 group">
                {/* Cover */}
                <div className="relative aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mb-4 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Music className="w-16 h-16 text-white/20" />
                  </div>
                  <button
                    onClick={() => togglePlay(work.id)}
                    className={cn(
                      'absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity',
                      playingId === work.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    )}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                    </div>
                  </button>
                  {work.isFavorite && (
                    <div className="absolute top-2 right-2">
                      <Heart className="w-5 h-5 text-primary fill-primary" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="font-semibold mb-1 truncate">{work.title}</h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {work.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {work.styles.map((style) => (
                    <span
                      key={style}
                      className="text-xs px-2 py-0.5 bg-white/5 rounded-full"
                    >
                      {style}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{work.duration}</span>
                  <span>{work.createdAt}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                  <button
                    onClick={() => toggleFavorite(work.id)}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      work.isFavorite
                        ? 'text-primary hover:bg-primary/10'
                        : 'text-muted-foreground hover:bg-white/10'
                    )}
                  >
                    <Heart className={cn('w-4 h-4', work.isFavorite && 'fill-current')} />
                  </button>
                  <button
                    onClick={() => handleDownload(work)}
                    className="p-2 rounded-lg text-muted-foreground hover:bg-white/10 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare(work)}
                    className="p-2 rounded-lg text-muted-foreground hover:bg-white/10 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-muted-foreground hover:bg-white/10 transition-colors ml-auto">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
