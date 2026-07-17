'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Brain, Sparkles, ChevronDown, ChevronUp, Loader2, Music2 } from 'lucide-react';

interface DeepThinkingLyricsProps {
  onLyricsGenerated: (lyrics: string) => void;
}

interface LyricSection {
  type: 'verse' | 'chorus' | 'bridge' | 'outro' | 'pre-chorus' | 'intro';
  index: number;
  content: string;
}

export function DeepThinkingLyrics({ onLyricsGenerated }: DeepThinkingLyricsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('');
  const [mood, setMood] = useState('');
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  const [lyricSections, setLyricSections] = useState<LyricSection[]>([]);
  const [isDemo, setIsDemo] = useState(false);

  const styles = [
    { value: '流行', label: '流行' },
    { value: '民谣', label: '民谣' },
    { value: '电子', label: '电子' },
    { value: '摇滚', label: '摇滚' },
    { value: 'R&B', label: 'R&B' },
    { value: '说唱', label: '说唱' },
    { value: '国风', label: '国风' },
    { value: '自由发挥', label: '自由发挥' },
  ];

  const moods = [
    { value: '治愈', label: '治愈' },
    { value: '怀旧', label: '怀旧' },
    { value: '激昂', label: '激昂' },
    { value: '浪漫', label: '浪漫' },
    { value: '忧郁', label: '忧郁' },
    { value: '欢快', label: '欢快' },
    { value: '自由发挥', label: '自由发挥' },
  ];

  const handleGenerate = async () => {
    if (!description.trim()) {
      alert('请输入主题描述');
      return;
    }

    setIsGenerating(true);
    setGeneratedLyrics('');
    setLyricSections([]);
    setIsDemo(false);

    try {
      const response = await fetch('/api/generate-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          style: style || undefined,
          mood: mood || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('生成失败');
      }

      const data = await response.json();

      if (data.lyric) {
        setGeneratedLyrics(data.lyric);
        setLyricSections(data.sections || []);
        setIsDemo(data.is_demo || false);
      }
    } catch (error) {
      console.error('生成失败:', error);
      alert('歌词生成失败，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImport = () => {
    if (generatedLyrics) {
      onLyricsGenerated(generatedLyrics);
    }
  };

  const getSectionColor = (type: string) => {
    switch (type) {
      case 'verse':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'chorus':
        return 'bg-primary/10 border-primary/20 text-primary';
      case 'bridge':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      case 'outro':
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'pre-chorus':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
      case 'intro':
        return 'bg-pink-500/10 border-pink-500/20 text-pink-400';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  const getSectionLabel = (type: string) => {
    const labels: Record<string, string> = {
      verse: '主歌',
      chorus: '副歌',
      bridge: '桥段',
      outro: '尾声',
      'pre-chorus': '预副歌',
      intro: '前奏',
    };
    return labels[type] || type;
  };

  return (
    <div className="glass-card p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI 歌词创作
        </h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Description Input */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">主题描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例如：失恋后的释然，在雨后的街头漫步，回忆曾经的点点滴滴..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-20"
            />
          </div>

          {/* Style and Mood */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">曲风</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">自由发挥</option>
                {styles.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">情感基调</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">自由发挥</option>
                {moods.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={cn(
              'w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
              isGenerating
                ? 'bg-white/10 text-muted-foreground cursor-not-allowed'
                : 'gradient-gold-purple text-white hover:opacity-90 glow-gold'
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                AI 正在挥毫泼墨...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                开始创作
              </>
            )}
          </button>

          {/* Generated Lyrics */}
          {generatedLyrics && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">生成的歌词</p>
                  {isDemo && (
                    <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">
                      演示模式
                    </span>
                  )}
                </div>
                <button
                  onClick={handleImport}
                  className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  导入到编辑器
                </button>
              </div>

              {/* Structured Sections */}
              {lyricSections.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {lyricSections.map((section, i) => (
                    <div
                      key={i}
                      className={cn(
                        'p-3 rounded-lg border',
                        getSectionColor(section.type)
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Music2 className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          {getSectionLabel(section.type)} {section.index > 1 ? section.index : ''}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-white/5 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {generatedLyrics}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
