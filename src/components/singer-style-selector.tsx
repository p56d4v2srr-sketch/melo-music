'use client';

import { useState } from 'react';
import { singerStyles, type SingerStyle } from '@/lib/singer-styles';
import { cn } from '@/lib/utils';
import { Search, Check, User } from 'lucide-react';

interface SingerStyleSelectorProps {
  selectedSingers: string[];
  onSelectionChange: (singers: string[]) => void;
}

export function SingerStyleSelector({ selectedSingers, onSelectionChange }: SingerStyleSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState<SingerStyle['region'] | 'all'>('all');

  const toggleSinger = (singerId: string) => {
    if (selectedSingers.includes(singerId)) {
      onSelectionChange(selectedSingers.filter((id) => id !== singerId));
    } else {
      onSelectionChange([...selectedSingers, singerId]);
    }
  };

  const filteredSingers = singerStyles.filter((singer) => {
    const matchesSearch =
      !searchQuery ||
      singer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      singer.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      singer.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      singer.techniques.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRegion = filterRegion === 'all' || singer.region === filterRegion;

    return matchesSearch && matchesRegion;
  });

  const regions: { value: SingerStyle['region'] | 'all'; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'chinese', label: '华语' },
    { value: 'western', label: '欧美' },
    { value: 'korean', label: '韩国' },
    { value: 'japanese', label: '日本' },
  ];

  return (
    <div className="glass-card p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-primary">🎤</span>
        歌手风格
        {selectedSingers.length > 0 && (
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
            {selectedSingers.length}
          </span>
        )}
      </h3>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="搜索歌手、风格或技巧..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Region Filter */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {regions.map((region) => (
          <button
            key={region.value}
            onClick={() => setFilterRegion(region.value)}
            className={cn(
              'px-3 py-1 text-xs rounded-full transition-all',
              filterRegion === region.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10'
            )}
          >
            {region.label}
          </button>
        ))}
      </div>

      {/* Singer List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {filteredSingers.map((singer) => (
          <SingerCard
            key={singer.id}
            singer={singer}
            isSelected={selectedSingers.includes(singer.id)}
            onToggle={() => toggleSinger(singer.id)}
          />
        ))}
      </div>

      {/* Selected Tags */}
      {selectedSingers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-muted-foreground mb-2">已选歌手：</p>
          <div className="flex flex-wrap gap-2">
            {selectedSingers.map((id) => {
              const singer = singerStyles.find((s) => s.id === id);
              return singer ? (
                <span
                  key={id}
                  className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full flex items-center gap-1"
                >
                  {singer.name}
                  <button
                    onClick={() => toggleSinger(id)}
                    className="hover:text-destructive transition-colors"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface SingerCardProps {
  singer: SingerStyle;
  isSelected: boolean;
  onToggle: () => void;
}

function SingerCard({ singer, isSelected, onToggle }: SingerCardProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'w-full p-3 rounded-lg text-left transition-all',
        isSelected
          ? 'bg-primary/10 border border-primary/30 glow-gold'
          : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
            isSelected ? 'bg-primary/20' : 'bg-white/10'
          )}
        >
          <User className={cn('w-5 h-5', isSelected ? 'text-primary' : 'text-muted-foreground')} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{singer.name}</span>
            <span className="text-xs text-muted-foreground">{singer.nameEn}</span>
            {isSelected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {singer.tags.map((tag) => (
              <span key={tag} className="text-xs px-1.5 py-0.5 bg-white/5 rounded">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {singer.techniques.slice(0, 3).map((tech) => (
              <span key={tech} className="text-xs text-primary/70">
                #{tech}
              </span>
            ))}
            {singer.techniques.length > 3 && (
              <span className="text-xs text-muted-foreground">+{singer.techniques.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
