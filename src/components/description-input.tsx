'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Lightbulb } from 'lucide-react';

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

const promptTemplates = [
  { label: '情绪', example: '忧郁的、充满希望的、激昂的、温柔的' },
  { label: '场景', example: '深夜独处、海边日落、城市街头、雨中漫步' },
  { label: '乐器', example: '钢琴主导、吉他伴奏、电子合成器、弦乐编曲' },
  { label: '节奏', example: '缓慢抒情、中速律动、快节奏舞曲、自由节拍' },
  { label: '混音', example: '温暖复古、现代清晰、空间感强、紧凑有力' },
];

export function DescriptionInput({ value, onChange, maxLength = 1500 }: DescriptionInputProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const isOverLimit = value.length > maxLength;

  const handleTemplateClick = (template: { label: string; example: string }) => {
    const newText = value ? `${value}，${template.example}` : template.example;
    onChange(newText);
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-primary">✨</span>
          描述词
        </h3>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          模板提示
        </button>
      </div>

      {/* Templates */}
      {showTemplates && (
        <div className="mb-3 p-3 bg-white/5 rounded-lg space-y-2">
          {promptTemplates.map((template) => (
            <div key={template.label} className="flex items-start gap-2">
              <span className="text-xs text-primary font-medium min-w-[40px]">
                {template.label}
              </span>
              <button
                onClick={() => handleTemplateClick(template)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors text-left flex-1"
              >
                {template.example}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="描述你想要的音乐风格、情绪、场景、乐器配置等..."
          className={cn(
            'w-full h-40 px-4 py-3 bg-white/5 border rounded-lg text-sm resize-none',
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
          描述词已超过 {maxLength} 字符限制，请精简内容
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
            const examples = [
              '一首温暖的抒情歌曲，钢琴伴奏，描述深夜思念一个人的心情',
              '充满活力的电子舞曲，强烈的节拍，适合派对氛围',
              '忧郁的独立民谣，吉他弹唱，讲述城市中的孤独与迷茫',
              '激昂的摇滚歌曲，电吉他solo，表达不屈的斗志',
            ];
            onChange(examples[Math.floor(Math.random() * examples.length)]);
          }}
          className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          随机示例
        </button>
      </div>
    </div>
  );
}
