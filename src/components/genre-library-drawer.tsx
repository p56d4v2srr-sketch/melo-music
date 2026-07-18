'use client';

import { useState, useMemo } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import { GENRES, type Genre } from '@/data/genres';

interface GenreLibraryDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedGenreIds: number[];
  onSelectionChange: (ids: number[]) => void;
  maxSelect?: number;
}

// Group genres by category
const GENRES_BY_CATEGORY = GENRES.reduce((acc, g) => {
  if (!acc[g.category]) acc[g.category] = [];
  acc[g.category].push(g);
  return acc;
}, {} as Record<string, Genre[]>);

const CATEGORIES = Object.keys(GENRES_BY_CATEGORY).sort();

export function GenreLibraryDrawer({
  open,
  onClose,
  selectedGenreIds,
  onSelectionChange,
  maxSelect = 5,
}: GenreLibraryDrawerProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredGenres = useMemo(() => {
    let genres = GENRES;
    if (activeCategory) {
      genres = genres.filter(g => g.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      genres = genres.filter(g =>
        g.nameZh.toLowerCase().includes(q) ||
        g.nameEn.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        (g.representative && g.representative.toLowerCase().includes(q))
      );
    }
    return genres;
  }, [search, activeCategory]);

  const handleToggle = (id: number) => {
    if (selectedGenreIds.includes(id)) {
      onSelectionChange(selectedGenreIds.filter(v => v !== id));
    } else if (selectedGenreIds.length < maxSelect) {
      onSelectionChange([...selectedGenreIds, id]);
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
            <h2 className="text-lg font-semibold text-white">曲风库</h2>
            <p className="text-xs text-white/50 mt-0.5">
              共 {GENRES.length} 种曲风 · 最多选 {maxSelect} 个
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
              placeholder="搜索曲风名称、标签..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/50"
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
                  ? 'bg-[#d4af37] text-white'
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
                    ? 'bg-[#d4af37] text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Selected indicator */}
        {selectedGenreIds.length > 0 && (
          <div className="px-6 py-2 border-b border-white/10 bg-[#d4af37]/5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#d4af37]">已选 {selectedGenreIds.length}/{maxSelect}:</span>
              {selectedGenreIds.map(id => {
                const g = GENRES.find(x => x.id === id);
                if (!g) return null;
                return (
                  <button
                    key={id}
                    onClick={() => handleToggle(id)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-xs hover:bg-[#d4af37]/30 transition-colors"
                  >
                    {g.nameZh}
                    <X className="w-3 h-3" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Genre grid */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {activeCategory ? (
            // Single category view
            <div>
              <h3 className="text-sm font-medium text-white/70 mb-3">{activeCategory}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredGenres.map(g => (
                  <GenreChip
                    key={g.id}
                    genre={g}
                    selected={selectedGenreIds.includes(g.id)}
                    disabled={!selectedGenreIds.includes(g.id) && selectedGenreIds.length >= maxSelect}
                    onToggle={() => handleToggle(g.id)}
                  />
                ))}
              </div>
              {filteredGenres.length === 0 && (
                <p className="text-center text-white/30 text-sm py-8">无匹配曲风</p>
              )}
            </div>
          ) : (
            // All categories view
            <div className="space-y-6">
              {CATEGORIES.map(cat => {
                const catGenres = search.trim()
                  ? GENRES_BY_CATEGORY[cat].filter(g => {
                      const q = search.toLowerCase();
                      return g.nameZh.toLowerCase().includes(q) ||
                        g.nameEn.toLowerCase().includes(q) ||
                        (g.oneLiner || '').toLowerCase().includes(q);
                    })
                  : GENRES_BY_CATEGORY[cat];

                if (catGenres.length === 0) return null;

                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-white/70">{cat}</h3>
                      <button
                        onClick={() => setActiveCategory(cat)}
                        className="text-xs text-[#d4af37] hover:text-[#d4af37]/80 flex items-center gap-1"
                      >
                        查看全部 <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {catGenres.slice(0, 9).map(g => (
                        <GenreChip
                          key={g.id}
                          genre={g}
                          selected={selectedGenreIds.includes(g.id)}
                          disabled={!selectedGenreIds.includes(g.id) && selectedGenreIds.length >= maxSelect}
                          onToggle={() => handleToggle(g.id)}
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
              已选 {selectedGenreIds.length} / {maxSelect}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#d4af37] text-white text-sm font-medium hover:bg-[#d4af37]/90 transition-colors"
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GenreChip({
  genre,
  selected,
  disabled,
  onToggle,
}: {
  genre: Genre;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`
        relative px-3 py-2 rounded-lg text-left transition-all duration-150 border
        ${selected
          ? 'bg-[#d4af37] text-white border-[#d4af37] ring-2 ring-[#d4af37]/30'
          : disabled
            ? 'bg-white/5 text-white/30 border-white/5 cursor-not-allowed'
            : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:border-white/20'
        }
      `}
    >
      <div className="text-xs font-medium truncate">{genre.nameZh}</div>
      <div className="text-[10px] text-white/40 truncate mt-0.5">{genre.nameEn}</div>
    </button>
  );
}
