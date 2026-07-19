'use client';

import { useState, useMemo } from 'react';
import { X, Search, Mic2 } from 'lucide-react';
import { ARTISTS, ARTISTS_BY_CATEGORY, getArtistsByGenre, type Artist } from '@/data/artists';

interface ArtistLibraryDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedArtistIds: number[];
  onSelectionChange: (ids: number[]) => void;
  maxSelect?: number;
}

const CATEGORIES = Object.keys(ARTISTS_BY_CATEGORY);

export function ArtistLibraryDrawer({
  open,
  onClose,
  selectedArtistIds,
  onSelectionChange,
  maxSelect = 3,
}: ArtistLibraryDrawerProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filterGenreId, setFilterGenreId] = useState<number | null>(null);

  const filteredArtists = useMemo(() => {
    let artists = ARTISTS;
    if (activeCategory) {
      artists = artists.filter(a => a.category === activeCategory);
    }
    if (filterGenreId !== null) {
      artists = artists.filter(a => a.genres.includes(filterGenreId));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      artists = artists.filter(a =>
        a.name_zh.toLowerCase().includes(q) ||
        a.name_en.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return artists;
  }, [search, activeCategory, filterGenreId]);

  const handleToggle = (id: number) => {
    if (selectedArtistIds.includes(id)) {
      onSelectionChange(selectedArtistIds.filter(v => v !== id));
    } else if (selectedArtistIds.length < maxSelect) {
      onSelectionChange([...selectedArtistIds, id]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-2xl bg-[#0a0a0f] border-l border-white/10 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Mic2 className="w-5 h-5 text-[#8b5cf6]" />
              歌手库
            </h2>
            <p className="text-xs text-white/50 mt-0.5">
              共 {ARTISTS.length} 位歌手 · 最多选 {maxSelect} 个
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="搜索歌手名称、标签..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]/50"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="px-6 py-2 border-b border-white/10 overflow-x-auto scrollbar-thin">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === null
                  ? 'bg-[#8b5cf6] text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              全部
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#8b5cf6] text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {cat} ({ARTISTS_BY_CATEGORY[cat]?.length || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Selected indicator */}
        {selectedArtistIds.length > 0 && (
          <div className="px-6 py-2 border-b border-white/10 bg-[#8b5cf6]/5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#8b5cf6]">已选 {selectedArtistIds.length}/{maxSelect}:</span>
              {selectedArtistIds.map(id => {
                const a = ARTISTS.find(x => x.id === id);
                if (!a) return null;
                return (
                  <button
                    key={id}
                    onClick={() => handleToggle(id)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6] text-xs hover:bg-[#8b5cf6]/30 transition-colors"
                  >
                    {a.name_zh}
                    <X className="w-3 h-3" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Artist list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {activeCategory ? (
            <div>
              <h3 className="text-sm font-medium text-white/70 mb-3">{activeCategory}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredArtists.map((a, index) => (
                  <ArtistCard
                    key={`${a.id}-${a.category}-${index}`}
                    artist={a}
                    selected={selectedArtistIds.includes(a.id)}
                    disabled={!selectedArtistIds.includes(a.id) && selectedArtistIds.length >= maxSelect}
                    onToggle={() => handleToggle(a.id)}
                  />
                ))}
              </div>
              {filteredArtists.length === 0 && (
                <p className="text-center text-white/30 text-sm py-8">无匹配歌手</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {CATEGORIES.map(cat => {
                const catArtists = search.trim()
                  ? (ARTISTS_BY_CATEGORY[cat] || []).filter(a => {
                      const q = search.toLowerCase();
                      return a.name_zh.toLowerCase().includes(q) ||
                        a.name_en.toLowerCase().includes(q) ||
                        a.tags.some(t => t.toLowerCase().includes(q));
                    })
                  : (ARTISTS_BY_CATEGORY[cat] || []);

                if (catArtists.length === 0) return null;

                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-white/70">{cat}</h3>
                      <button
                        onClick={() => setActiveCategory(cat)}
                        className="text-xs text-[#8b5cf6] hover:text-[#8b5cf6]/80"
                      >
                        查看全部 ({catArtists.length})
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {catArtists.slice(0, 6).map((a, index) => (
                        <ArtistCard
                          key={`${a.id}-${a.category}-${index}`}
                          artist={a}
                          selected={selectedArtistIds.includes(a.id)}
                          disabled={!selectedArtistIds.includes(a.id) && selectedArtistIds.length >= maxSelect}
                          onToggle={() => handleToggle(a.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0a0a0f]">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/40">
              已选 {selectedArtistIds.length} / {maxSelect}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#8b5cf6] text-white text-sm font-medium hover:bg-[#8b5cf6]/90 transition-colors"
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArtistCard({
  artist,
  selected,
  disabled,
  onToggle,
}: {
  artist: Artist;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`
        relative px-3 py-2.5 rounded-lg text-left transition-all duration-150 border
        ${selected
          ? 'bg-[#8b5cf6] text-white border-[#8b5cf6] ring-2 ring-[#8b5cf6]/30'
          : disabled
            ? 'bg-white/5 text-white/30 border-white/5 cursor-not-allowed'
            : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:border-white/20'
        }
      `}
    >
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium truncate">{artist.name_zh}</div>
        <div className="text-[10px] text-white/40 truncate">{artist.name_en}</div>
      </div>
      <div className="flex items-center gap-1 mt-1 flex-wrap">
        {artist.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className={`text-[10px] px-1.5 py-0.5 rounded ${
              selected ? 'bg-white/20 text-white/80' : 'bg-white/10 text-white/50'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
