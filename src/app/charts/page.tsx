'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { TrendingUp, Zap, Clock, Music2, Play, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Song {
  id: string;
  title: string;
  cover_url: string;
  play_count: number;
  like_count: number;
  duration?: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
  artist?: {
    id: string;
    nickname: string;
    avatar: string;
  };
}

const chartTypes = [
  { value: 'hot', label: '热门榜', icon: TrendingUp },
  { value: 'rising', label: '飙升榜', icon: Zap },
  { value: 'new', label: '新歌榜', icon: Clock },
  { value: 'original', label: '原创榜', icon: Music2 },
];

const periods = [
  { value: 'daily', label: '日榜' },
  { value: 'weekly', label: '周榜' },
  { value: 'monthly', label: '月榜' },
];

export default function ChartsPage() {
  const [chartType, setChartType] = useState('hot');
  const [period, setPeriod] = useState('daily');
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/charts?type=${chartType}&period=${period}&limit=100`);
        const data = await res.json();
        if (data.success) {
          setSongs(data.data.songs || []);
        }
      } catch (error) {
        console.error('Fetch charts error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharts();
  }, [chartType, period]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '-';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">排行榜</h1>
          <p className="text-muted-foreground">发现最热门的音乐作品</p>
        </div>

        {/* Chart Type Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {chartTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setChartType(type.value)}
              className={cn(
                'flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all',
                chartType === type.value
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-card border border-border text-muted-foreground hover:bg-accent'
              )}
            >
              <type.icon className="w-5 h-5" />
              {type.label}
            </button>
          ))}
        </div>

        {/* Period Tabs */}
        <div className="flex gap-2 mb-8">
          {periods.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                period === p.value
                  ? 'bg-white/10 text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Songs List */}
        {!loading && (
          <div className="space-y-2">
            {songs.map((song, index) => (
              <Link
                key={song.id}
                href={`/song/${song.id}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-accent transition-all group"
              >
                {/* Rank */}
                <div className={cn(
                  'w-8 text-center font-bold text-2xl',
                  getRankColor(song.rank)
                )}>
                  {song.rank}
                </div>

                {/* Cover */}
                <div className="relative flex-shrink-0">
                  <img
                    src={song.cover_url}
                    alt={song.title}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">{song.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {song.artist?.nickname || '未知歌手'}
                  </p>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="text-right">
                    <div className="font-medium text-foreground">{song.play_count.toLocaleString()}</div>
                    <div className="text-xs">播放</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">{song.like_count.toLocaleString()}</div>
                    <div className="text-xs">点赞</div>
                  </div>
                </div>

                {/* Trend */}
                <div className={cn(
                  'w-8 text-center text-lg',
                  song.trend === 'up' ? 'text-green-500' : song.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                )}>
                  {getTrendIcon(song.trend)}
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}

            {songs.length === 0 && (
              <div className="text-center py-12">
                <Music2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">暂无数据</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
