'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Search, Music, User, Tag, X, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Song {
  id: string;
  title: string;
  cover_url: string;
  play_count: number;
  like_count: number;
  style_tags: string[];
  artist?: {
    id: string;
    nickname: string;
    avatar: string;
  };
}

interface Artist {
  id: string;
  nickname: string;
  avatar: string;
  bio: string;
  followers_count: number;
}

const hotSearches = ['电子', '流行', '摇滚', '说唱', 'R&B', '民谣', '爵士', '古典', '治愈', '浪漫'];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<'all' | 'songs' | 'artists' | 'genres'>('all');
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async (searchQuery: string, type: string) => {
    if (!searchQuery.trim()) {
      setSongs([]);
      setArtists([]);
      setGenres([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${type}`);
      const data = await res.json();
      if (data.success) {
        setSongs(data.data.songs || []);
        setArtists(data.data.artists || []);
        setGenres(data.data.genres || []);
        setHasSearched(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, searchType);
    }
  }, [initialQuery, performSearch, searchType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
    performSearch(query, searchType);
  };

  const handleHotSearch = (tag: string) => {
    setQuery(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
    performSearch(tag, searchType);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索歌曲、歌手、风格..."
              className="w-full pl-12 pr-12 py-4 bg-card border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setSongs([]); setArtists([]); setGenres([]); setHasSearched(false); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </form>

        {/* Search Type Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { value: 'all', label: '全部' },
            { value: 'songs', label: '歌曲' },
            { value: 'artists', label: '歌手' },
            { value: 'genres', label: '风格' },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => { setSearchType(tab.value as any); performSearch(query, tab.value); }}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                searchType === tab.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Hot Searches */}
        {!hasSearched && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              热门搜索
            </h3>
            <div className="flex flex-wrap gap-2">
              {hotSearches.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleHotSearch(tag)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-border rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && (
          <>
            {/* Songs */}
            {(searchType === 'all' || searchType === 'songs') && songs.length > 0 && (
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5 text-primary" />
                  歌曲
                </h3>
                <div className="space-y-2">
                  {songs.map(song => (
                    <Link
                      key={song.id}
                      href={`/song/${song.id}`}
                      className="flex items-center gap-4 p-3 rounded-xl bg-card hover:bg-accent transition-colors group"
                    >
                      <img
                        src={song.cover_url}
                        alt={song.title}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{song.title}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {song.artist?.nickname || '未知歌手'}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {song.play_count.toLocaleString()} 播放
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Artists */}
            {(searchType === 'all' || searchType === 'artists') && artists.length > 0 && (
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  歌手
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {artists.map(artist => (
                    <Link
                      key={artist.id}
                      href={`/artist/${artist.id}`}
                      className="flex flex-col items-center p-4 rounded-xl bg-card hover:bg-accent transition-colors"
                    >
                      <img
                        src={artist.avatar}
                        alt={artist.nickname}
                        className="w-20 h-20 rounded-full object-cover mb-3"
                      />
                      <h4 className="font-medium text-foreground truncate w-full text-center">{artist.nickname}</h4>
                      <p className="text-sm text-muted-foreground">{artist.followers_count || 0} 粉丝</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Genres */}
            {(searchType === 'all' || searchType === 'genres') && genres.length > 0 && (
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  风格
                </h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => handleHotSearch(genre)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-border rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      #{genre}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {songs.length === 0 && artists.length === 0 && genres.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">未找到相关结果</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
