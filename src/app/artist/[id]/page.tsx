'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { mockArtists, mockSongsWithArtists, formatCount } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import {
  Play,
  Heart,
  MessageCircle,
  Star,
  Music,
  Users,
  UserPlus,
  UserCheck,
  Grid,
  List,
  Award,
} from 'lucide-react';
import Link from 'next/link';

export default function ArtistProfilePage() {
  const params = useParams();
  const artistId = params.id as string;

  const artist = mockArtists.find((a) => a.id === artistId) || mockArtists[0];
  const artistSongs = mockSongsWithArtists.filter((s) => s.artist_id === artist.id);
  const topSongs = [...artistSongs].sort((a, b) => b.play_count - a.play_count).slice(0, 3);

  const [isFollowing, setIsFollowing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16 pb-8">
        {/* Hero Banner */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-accent/10 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.15),transparent_70%)]" />

          {/* Decorative elements */}
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-32 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        </div>

        {/* Profile Info */}
        <div className="relative -mt-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="glass-card p-6 sm:p-8 rounded-2xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-background shadow-xl">
                  <img
                    src={artist.avatar}
                    alt={artist.nickname}
                    className="w-full h-full object-cover"
                  />
                </div>
                {artist.is_ai_artist && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 text-xs rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium">
                    AI 音乐人
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  {artist.nickname}
                </h1>
                <p className="text-primary font-medium mb-2">{artist.slogan}</p>
                <p className="text-sm text-muted-foreground max-w-lg">{artist.bio}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={cn(
                    'flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all',
                    isFollowing
                      ? 'glass-card text-muted-foreground hover:text-foreground'
                      : 'gradient-gold-purple text-white hover:opacity-90 glow-gold'
                  )}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      已关注
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      关注
                    </>
                  )}
                </button>
                <button className="px-4 py-2.5 rounded-xl glass-card text-muted-foreground hover:text-foreground transition-all">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{formatCount(artist.follower_count)}</p>
                <p className="text-sm text-muted-foreground">粉丝</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{formatCount(artist.following_count)}</p>
                <p className="text-sm text-muted-foreground">关注</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{artist.song_count}</p>
                <p className="text-sm text-muted-foreground">作品</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{formatCount(artist.total_play_count)}</p>
                <p className="text-sm text-muted-foreground">总播放</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mt-8">
          {/* Top 3 Songs */}
          {topSongs.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                代表作
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {topSongs.map((song, index) => (
                  <Link
                    key={song.id}
                    href={`/song/${song.id}`}
                    className="glass-card p-4 group hover:bg-white/10 transition-all"
                  >
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3">
                      <img
                        src={song.cover_url}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-white text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground truncate">{song.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        {formatCount(song.play_count)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {formatCount(song.like_count)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* All Songs */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Music className="w-5 h-5 text-primary" />
                全部作品
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    viewMode === 'grid' ? 'bg-white/10 text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    viewMode === 'list' ? 'bg-white/10 text-primary' : 'text-muted-foreground'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {artistSongs.map((song) => (
                  <Link
                    key={song.id}
                    href={`/song/${song.id}`}
                    className="glass-card p-3 group hover:bg-white/10 transition-all"
                  >
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2">
                      <img
                        src={song.cover_url}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="font-medium text-foreground text-sm truncate">{song.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatCount(song.play_count)} 播放
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {artistSongs.map((song) => (
                  <Link
                    key={song.id}
                    href={`/song/${song.id}`}
                    className="glass-card p-3 flex items-center gap-3 group hover:bg-white/10 transition-all"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={song.cover_url}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
                        {song.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{formatCount(song.play_count)} 播放</span>
                        <span>{formatCount(song.like_count)} 点赞</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {song.style_tags.slice(0, 1).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs rounded-full bg-white/5 border border-white/10 text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
