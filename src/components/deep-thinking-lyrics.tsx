'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Brain, Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface DeepThinkingLyricsProps {
  onLyricsGenerated: (lyrics: string) => void;
}

interface ThinkingStep {
  step: string;
  content: string;
  status: 'pending' | 'processing' | 'completed';
}

export function DeepThinkingLyrics({ onLyricsGenerated }: DeepThinkingLyricsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState('');
  const [structure, setStructure] = useState('verse-chorus');
  const [language, setLanguage] = useState('chinese');
  const [rhymeScheme, setRhymeScheme] = useState('aabb');
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [generatedLyrics, setGeneratedLyrics] = useState('');

  const structures = [
    { value: 'verse-chorus', label: '主歌-副歌' },
    { value: 'verse-chorus-bridge', label: '主歌-副歌-桥段' },
    { value: 'aab', label: 'AAB 结构' },
    { value: 'free', label: '自由结构' },
  ];

  const languages = [
    { value: 'chinese', label: '中文' },
    { value: 'english', label: '英文' },
    { value: 'mixed', label: '中英混合' },
  ];

  const rhymeSchemes = [
    { value: 'aabb', label: 'AABB' },
    { value: 'abab', label: 'ABAB' },
    { value: 'abcb', label: 'ABCB' },
    { value: 'free', label: '自由韵脚' },
  ];

  const handleGenerate = async () => {
    if (!theme.trim()) {
      alert('请输入创作主题');
      return;
    }

    setIsGenerating(true);
    setGeneratedLyrics('');
    setThinkingSteps([
      { step: '主题解构', content: '', status: 'processing' },
      { step: '意象搜集', content: '', status: 'pending' },
      { step: '段落结构', content: '', status: 'pending' },
      { step: '韵脚规划', content: '', status: 'pending' },
      { step: '逐段创作', content: '', status: 'pending' },
      { step: '通篇润色', content: '', status: 'pending' },
    ]);

    try {
      const response = await fetch('/api/generate-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          structure,
          language,
          rhymeScheme,
        }),
      });

      if (!response.ok) {
        throw new Error('生成失败');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('无法读取响应流');

      let currentStep = 0;
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'step') {
                setThinkingSteps((prev) =>
                  prev.map((step, i) =>
                    i === currentStep
                      ? { ...step, status: 'completed', content: data.content }
                      : i === currentStep + 1
                      ? { ...step, status: 'processing' }
                      : step
                  )
                );
                currentStep++;
              } else if (data.type === 'lyrics') {
                setGeneratedLyrics((prev) => prev + data.content);
              } else if (data.type === 'done') {
                setThinkingSteps((prev) =>
                  prev.map((step, i) =>
                    i === currentStep ? { ...step, status: 'completed' } : step
                  )
                );
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
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

  return (
    <div className="glass-card p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          深度思考歌词创作
        </h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Theme Input */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">创作主题</label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="例如：失恋后的释然、追逐梦想的坚持、深夜的孤独..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">歌曲结构</label>
              <select
                value={structure}
                onChange={(e) => setStructure(e.target.value)}
                className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {structures.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">语言</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {languages.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">韵脚方案</label>
              <select
                value={rhymeScheme}
                onChange={(e) => setRhymeScheme(e.target.value)}
                className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {rhymeSchemes.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
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
                深度思考中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                开始创作
              </>
            )}
          </button>

          {/* Thinking Process */}
          {thinkingSteps.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">思考过程：</p>
              {thinkingSteps.map((step, i) => (
                <div
                  key={i}
                  className={cn(
                    'p-3 rounded-lg text-sm transition-all',
                    step.status === 'completed' && 'bg-primary/10 border border-primary/20',
                    step.status === 'processing' && 'bg-white/5 border border-white/10',
                    step.status === 'pending' && 'bg-white/5 opacity-50'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {step.status === 'completed' && (
                      <span className="text-primary">✓</span>
                    )}
                    {step.status === 'processing' && (
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    )}
                    <span className="font-medium">{step.step}</span>
                  </div>
                  {step.content && (
                    <p className="text-xs text-muted-foreground mt-1">{step.content}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Generated Lyrics */}
          {generatedLyrics && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">生成的歌词：</p>
                <button
                  onClick={handleImport}
                  className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  导入到编辑器
                </button>
              </div>
              <div className="p-4 bg-white/5 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                {generatedLyrics}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
