'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import {
  mockSongsWithArtists,
  mockArtists,
  formatCount,
  formatDuration,
  getChartRanking,
  getArtistRanking,
} from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import {
  Flame,
  TrendingUp,
  Sparkles,
  Gem,
  Play,
  Heart,
  Clock,
  Music,
  Users,
} from 'lucide-react';
import Link from 'next/link';

type SongChartType = 'hot' | 'rising' | 'new' | 'original';

const songChartTabs = [
  { key: 'hot' as const, label: '热门榜', icon: Flame, color: 'from-red-500 to-orange-500' },
  { key: 'rising' as const, label: '飙升榜', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
  { key: 'new' as const, label: '新歌榜', icon: Sparkles, color: 'from-blue-500 to-cyan-500' },
  { key: 'original' as const, label: '原创榜', icon: Gem, color: 'from-purple-500 to-pink-500' },
];

const medalColors = [
  'from-yellow-400 to-yellow-600', // Gold
  'from-gray-300 to-gray-500', // Silver
  'from-amber-600 to-amber-800', // Bronze
];

export default function ChartsPage() {
  const [activeTab, setActiveTab] = useState<'songs' | 'artists'>('songs');
  const [chartType, setChartType] = useState<SongChartType>('hot');

  const rankedSongs = getChartRanking(mockSongsWithArtists, chartType);
  const rankedArtists = getArtistRanking(mockArtists);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">排行榜</h1>
          <p className="text-muted-foreground">发现最热门的音乐和创作者</p>
        </div>

        {/* Tab Switch */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('songs')}
            className={cn(
              'px-6 py-3 rounded-xl font-medium transition-all',
              activeTab === 'songs'
                ? 'gradient-gold-purple text-white glow-gold'
                : 'glass-card text-muted-foreground hover:text-foreground'
            )}
          >
            <Music className="w-4 h-4 inline mr-2" />
            歌曲排行
          </button>
          <button
            onClick={() => setActiveTab('artists')}
            className={cn(
              'px-6 py-3 rounded-xl font-medium transition-all',
              activeTab === 'artists'
                ? 'gradient-gold-purple text-white glow-gold'
                : 'glass-card text-muted-foreground hover:text-foreground'
            )}
          >
            <Users className="w-4 h-4 inline mr-2" />
            音乐人排行
          </button>
        </div>

        {activeTab === 'songs' ? (
          <>
            {/* Chart Type Tabs */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
              {songChartTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setChartType(tab.key)}
                    className={cn(
                      'flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all',
                      chartType === tab.key
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : 'glass-card text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Song Rankings */}
            <div className="space-y-3">
              {rankedSongs.map((song, index) => (
                <Link
                  key={song.id}
                  href={`/song/${song.id}`}
                  className="block"
                >
                  <div
                    className={cn(
                      'glass-card p-4 flex items-center gap-4 transition-all hover:bg-white/10 group',
                      index < 3 && 'border-l-4',
                      index === 0 && 'border-l-yellow-400',
                      index === 1 && 'border-l-gray-400',
                      index === 2 && 'border-l-amber-600'
                    )}
                  >
                    {/* Rank */}
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg',
                        index < 3
                          ? `bg-gradient-to-br ${medalColors[index]} text-white`
                          : 'bg-white/5 text-muted-foreground'
                      )}
                    >
                      {index + 1}
                    </div>

                    {/* Cover */}
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={song.cover_url}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {song.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {song.artist?.nickname}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Play className="w-3.5 h-3.5" />
                        {formatCount(song.play_count)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {formatCount(song.like_count)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(song.duration)}
                      </span>
                    </div>

                    {/* Style Tags */}
                    <div className="hidden lg:flex items-center gap-2">
                      {song.style_tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs rounded-full bg-white/5 border border-white/10 text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          /* Artist Rankings */
          <div className="space-y-3">
            {rankedArtists.map((artist, index) => (
              <Link
                key={artist.id}
                href={`/artist/${artist.id}`}
                className="block"
              >
                <div
                  className={cn(
                    'glass-card p-4 flex items-center gap-4 transition-all hover:bg-white/10 group',
                    index < 3 && 'border-l-4',
                    index === 0 && 'border-l-yellow-400',
                    index === 1 && 'border-l-gray-400',
                    index === 2 && 'border-l-amber-600'
                  )}
                >
                  {/* Rank */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg',
                      index < 3
                        ? `bg-gradient-to-br ${medalColors[index]} text-white`
                        : 'bg-white/5 text-muted-foreground'
                    )}
                  >
                    {index + 1}
                  </div>

                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/10">
                    <img
                      src={artist.avatar}
                      alt={artist.nickname}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {artist.nickname}
                      </h3>
                      {artist.is_ai_artist && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-primary to-accent text-white">
                          AI
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{artist.slogan}</p>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {formatCount(artist.follower_count)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Music className="w-3.5 h-3.5" />
                      {artist.song_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Play className="w-3.5 h-3.5" />
                      {formatCount(artist.total_play_count)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
