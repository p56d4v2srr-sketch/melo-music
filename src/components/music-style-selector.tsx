'use client';

import { useState } from 'react';
import { musicStyles, type MusicStyle, type SubStyle } from '@/lib/music-styles';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';

interface MusicStyleSelectorProps {
  selectedStyles: string[];
  onSelectionChange: (styles: string[]) => void;
}

export function MusicStyleSelector({ selectedStyles, onSelectionChange }: MusicStyleSelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['pop']));
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubStyle = (subStyleId: string) => {
    if (selectedStyles.includes(subStyleId)) {
      onSelectionChange(selectedStyles.filter((id) => id !== subStyleId));
    } else {
      onSelectionChange([...selectedStyles, subStyleId]);
    }
  };

  const filteredStyles = searchQuery
    ? musicStyles
        .map((style) => ({
          ...style,
          subStyles: style.subStyles.filter(
            (sub) =>
              sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              sub.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
              sub.artists?.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()))
          ),
        }))
        .filter((style) => style.subStyles.length > 0)
    : musicStyles;

  return (
    <div className="glass-card p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-primary">🎵</span>
        音乐风格
        {selectedStyles.length > 0 && (
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
            {selectedStyles.length}
          </span>
        )}
      </h3>

      {/* Search */}
      <input
        type="text"
        placeholder="搜索风格或艺人..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 mb-4 bg-white/5 border border-white/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      />

      {/* Style Categories */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
        {filteredStyles.map((style) => (
          <StyleCategory
            key={style.id}
            style={style}
            isExpanded={expandedCategories.has(style.id)}
            selectedStyles={selectedStyles}
            onToggleCategory={() => toggleCategory(style.id)}
            onToggleSubStyle={toggleSubStyle}
          />
        ))}
      </div>

      {/* Selected Tags */}
      {selectedStyles.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-muted-foreground mb-2">已选风格：</p>
          <div className="flex flex-wrap gap-2">
            {selectedStyles.map((id) => {
              const subStyle = musicStyles
                .flatMap((s) => s.subStyles)
                .find((s) => s.id === id);
              return subStyle ? (
                <span
                  key={id}
                  className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full flex items-center gap-1"
                >
                  {subStyle.name}
                  <button
                    onClick={() => toggleSubStyle(id)}
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

interface StyleCategoryProps {
  style: MusicStyle;
  isExpanded: boolean;
  selectedStyles: string[];
  onToggleCategory: () => void;
  onToggleSubStyle: (id: string) => void;
}

function StyleCategory({
  style,
  isExpanded,
  selectedStyles,
  onToggleCategory,
  onToggleSubStyle,
}: StyleCategoryProps) {
  const selectedCount = style.subStyles.filter((s) => selectedStyles.includes(s.id)).length;

  return (
    <div className="rounded-lg overflow-hidden">
      <button
        onClick={onToggleCategory}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 text-left transition-all',
          'hover:bg-white/5',
          selectedCount > 0 && 'bg-white/5'
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{style.icon}</span>
          <span className="font-medium">{style.name}</span>
          <span className="text-xs text-muted-foreground">({style.nameEn})</span>
          {selectedCount > 0 && (
            <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
              {selectedCount}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-3 pb-2 space-y-1">
          {style.subStyles.map((subStyle) => (
            <SubStyleItem
              key={subStyle.id}
              subStyle={subStyle}
              isSelected={selectedStyles.includes(subStyle.id)}
              onToggle={() => onToggleSubStyle(subStyle.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface SubStyleItemProps {
  subStyle: SubStyle;
  isSelected: boolean;
  onToggle: () => void;
}

function SubStyleItem({ subStyle, isSelected, onToggle }: SubStyleItemProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-all',
        isSelected
          ? 'bg-primary/10 border border-primary/30'
          : 'hover:bg-white/5 border border-transparent'
      )}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{subStyle.name}</span>
          <span className="text-xs text-muted-foreground">{subStyle.nameEn}</span>
        </div>
        {subStyle.artists && subStyle.artists.length > 0 && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {subStyle.artists.slice(0, 3).join('、')}
            {subStyle.artists.length > 3 && ` 等${subStyle.artists.length}位艺人`}
          </p>
        )}
      </div>
      <div
        className={cn(
          'w-4 h-4 rounded border flex items-center justify-center transition-all',
          isSelected ? 'bg-primary border-primary' : 'border-white/20'
        )}
      >
        {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
      </div>
    </button>
  );
}
