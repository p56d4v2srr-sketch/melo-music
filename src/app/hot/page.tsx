'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { mockHotSearch } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Search, Flame, Music, Users, Palette, Tag, TrendingUp, Clock } from 'lucide-react';

type CategoryType = 'all' | 'song' | 'artist' | 'style' | 'topic';

const categories = [
  { key: 'all' as const, label: '全部', icon: Flame },
  { key: 'song' as const, label: '歌曲', icon: Music },
  { key: 'artist' as const, label: '歌手', icon: Users },
  { key: 'style' as const, label: '风格', icon: Palette },
  { key: 'topic' as const, label: '话题', icon: Tag },
];

const categoryColors: Record<string, string> = {
  song: 'from-blue-500 to-cyan-500',
  artist: 'from-purple-500 to-pink-500',
  style: 'from-green-500 to-emerald-500',
  topic: 'from-orange-500 to-red-500',
};

const categoryLabels: Record<string, string> = {
  song: '歌曲',
  artist: '歌手',
  style: '风格',
  topic: '话题',
};

// Mock search history
const searchHistory = ['Lo-fi 学习', 'AI 音乐', 'Synthwave', '国风', '说唱'];

// Mock suggestions
const suggestions = ['AI 音乐创作教程', 'Lo-fi 学习音乐', 'Synthwave 制作', '国风电子', '说唱技巧'];

export default function HotSearchPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredHotSearch =
    activeCategory === 'all'
      ? mockHotSearch
      : mockHotSearch.filter((item) => item.category === activeCategory);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-gold mb-2 flex items-center gap-3">
            <Flame className="w-8 h-8 text-red-500" />
            热搜榜
          </h1>
          <p className="text-muted-foreground">发现当下最热门的音乐话题</p>
        </div>

        {/* Search Box */}
        <div className="relative mb-8">
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="flex items-center px-4 py-3">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="搜索歌曲、歌手、风格..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden z-50">
              {searchHistory.length > 0 && (
                <div className="p-3 border-b border-white/10">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    历史搜索
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((item) => (
                      <button
                        key={item}
                        onClick={() => setSearchQuery(item)}
                        className="px-3 py-1 text-xs rounded-full bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-3">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  推荐搜索
                </p>
                {suggestions
                  .filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSearchQuery(item);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-white/5 rounded-lg transition-all"
                    >
                      {item}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all',
                  activeCategory === cat.key
                    ? 'gradient-gold-purple text-white glow-gold'
                    : 'glass-card text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Hot Search List */}
        <div className="space-y-2">
          {filteredHotSearch.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                'glass-card p-4 flex items-center gap-4 transition-all hover:bg-white/10 group cursor-pointer',
                index < 3 && 'border-l-4',
                index === 0 && 'border-l-red-500',
                index === 1 && 'border-l-orange-500',
                index === 2 && 'border-l-yellow-500'
              )}
            >
              {/* Rank */}
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm',
                  index < 3
                    ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white'
                    : 'bg-white/5 text-muted-foreground'
                )}
              >
                {index + 1}
              </div>

              {/* Keyword */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {item.keyword}
                  </span>
                  {index < 3 && (
                    <span className="px-1.5 py-0.5 text-xs rounded bg-red-500/20 text-red-400 font-medium">
                      热
                    </span>
                  )}
                </div>
              </div>

              {/* Category Badge */}
              <span
                className={cn(
                  'px-2 py-0.5 text-xs rounded-full bg-gradient-to-r text-white',
                  categoryColors[item.category]
                )}
              >
                {categoryLabels[item.category]}
              </span>

              {/* Score */}
              <span className="text-sm text-muted-foreground">
                {(item.score / 100).toFixed(0)}万
              </span>
            </div>
          ))}
        </div>

        {/* Marquee Effect */}
        <div className="mt-8 glass-card p-4 rounded-xl overflow-hidden">
          <div className="flex items-center gap-4 animate-marquee">
            {mockHotSearch.slice(0, 10).map((item, index) => (
              <span key={item.id} className="flex items-center gap-2 whitespace-nowrap">
                {index > 0 && <span className="text-white/20">|</span>}
                <span className="text-sm text-muted-foreground">{item.keyword}</span>
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
