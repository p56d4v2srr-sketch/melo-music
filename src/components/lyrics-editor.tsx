'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FileText, Wand2 } from 'lucide-react';

interface LyricsEditorProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  onImportFromAI?: (lyrics: string) => void;
}

const structureTags = [
  { label: '[Verse 1]', description: '主歌第一段' },
  { label: '[Verse 2]', description: '主歌第二段' },
  { label: '[Pre-Chorus]', description: '副歌前过渡' },
  { label: '[Chorus]', description: '副歌' },
  { label: '[Bridge]', description: '桥段' },
  { label: '[Outro]', description: '结尾' },
  { label: '[Hook]', description: '记忆点' },
];

export function LyricsEditor({
  value,
  onChange,
  maxLength = 5000,
  onImportFromAI,
}: LyricsEditorProps) {
  const [showTags, setShowTags] = useState(false);
  const isOverLimit = value.length > maxLength;

  const insertTag = (tag: string) => {
    const newText = value ? `${value}\n\n${tag}` : tag;
    onChange(newText);
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-primary">📝</span>
          歌词
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTags(!showTags)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            结构标签
          </button>
          {onImportFromAI && (
            <>
              <span className="text-xs text-muted-foreground">|</span>
              <button
                onClick={() => onImportFromAI('')}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Wand2 className="w-3.5 h-3.5" />
                AI 创作
              </button>
            </>
          )}
        </div>
      </div>

      {/* Structure Tags */}
      {showTags && (
        <div className="mb-3 p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">点击插入结构标签：</p>
          <div className="flex flex-wrap gap-2">
            {structureTags.map((tag) => (
              <button
                key={tag.label}
                onClick={() => insertTag(tag.label)}
                className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
                title={tag.description}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="在这里输入或粘贴歌词...&#10;&#10;支持结构标签：&#10;[Verse 1]&#10;你的歌词内容...&#10;&#10;[Chorus]&#10;副歌歌词..."
          className={cn(
            'w-full h-64 px-4 py-3 bg-white/5 border rounded-lg text-sm resize-none font-mono',
            'placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all',
            isOverLimit
              ? 'border-destructive focus:ring-destructive/50'
              : 'border-white/10 focus:ring-primary/50'
          )}
        />
        <div
          className={cn(
            'absolute bottom-3 right-3 text-xs',
            isOverLimit ? 'text-destructive' : 'text-muted-foreground'
          )}
        >
          {value.length} / {maxLength}
        </div>
      </div>

      {isOverLimit && (
        <p className="text-xs text-destructive mt-2">
          歌词已超过 {maxLength} 字符限制，请精简内容
        </p>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onChange('')}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          清空
        </button>
        <span className="text-xs text-muted-foreground">|</span>
        <button
          onClick={() => {
            const sampleLyrics = `[Verse 1]
城市的灯光渐渐亮起
我独自走在熟悉的街
回忆像电影在脑海放映
那些关于你的点点滴滴

[Pre-Chorus]
时间带走了很多
却带不走对你的思念

[Chorus]
如果还能重来一次
我会紧紧握住你的手
不让爱从指缝溜走
让这份感情到永久`;
            onChange(sampleLyrics);
          }}
          className="text-xs text-primary hover:text-primary/80 transition-colors"
        >
          示例歌词
        </button>
      </div>
    </div>
  );
}
