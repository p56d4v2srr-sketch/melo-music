'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Loader2, X, Award, Quote, Tag } from 'lucide-react';

interface LyricAnalysisProps {
  lyric: string;
  title?: string;
  onClose: () => void;
}

interface LyricAnalysisResult {
  theme: string;
  emotion_arc: string;
  imagery_highlights: string[];
  rhyme_evaluation: string;
  scores: {
    theme: number;
    emotion: number;
    imagery: number;
    rhyme: number;
    overall: number;
  };
  one_line_verdict: string;
}

export function LyricAnalysis({ lyric, title, onClose }: LyricAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<LyricAnalysisResult | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);
    setError(null);

    try {
      const response = await fetch('/api/analyze-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyric, title }),
      });

      if (!response.ok) {
        throw new Error('分析失败');
      }

      const data = await response.json();

      if (data.analysis) {
        setAnalysis(data.analysis);
        setIsDemo(data.is_demo || false);
      }
    } catch (err) {
      console.error('分析失败:', err);
      setError('歌词分析失败，请稍后重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            歌词深度分析
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Analyze Button */}
          {!analysis && !isAnalyzing && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                AI 将从主题、情感、意象、韵律四个维度深度分析这首歌词
              </p>
              <button
                onClick={handleAnalyze}
                className="px-6 py-3 gradient-gold-purple text-white rounded-lg font-medium hover:opacity-90 glow-gold transition-opacity"
              >
                开始分析
              </button>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">AI 正在深度分析歌词...</p>
              <p className="text-xs text-muted-foreground mt-2">
                正在解读主题、分析情感走向、评价意象与韵律
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
              <p className="text-red-400">{error}</p>
              <button
                onClick={handleAnalyze}
                className="mt-3 px-4 py-2 text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                重试
              </button>
            </div>
          )}

          {/* Analysis Result */}
          {analysis && (
            <div className="space-y-6">
              {/* Demo Badge */}
              {isDemo && (
                <div className="flex items-center justify-center">
                  <span className="px-3 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">
                    演示模式 - 配置 DEEPSEEK_API_KEY 获取真实分析
                  </span>
                </div>
              )}

              {/* Overall Score */}
              <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="w-6 h-6 text-primary" />
                  <span className="text-sm text-muted-foreground">综合评分</span>
                </div>
                <div className={cn('text-5xl font-bold', getScoreColor(analysis.scores.overall))}>
                  {analysis.scores.overall}
                </div>
                <p className="text-sm text-muted-foreground mt-2">/ 100</p>
              </div>

              {/* One Line Verdict */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-start gap-3">
                  <Quote className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-lg italic text-foreground/90">
                    {analysis.one_line_verdict}
                  </p>
                </div>
              </div>

              {/* Dimension Scores */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'theme', label: '主题深度', score: analysis.scores.theme },
                  { key: 'emotion', label: '情感表达', score: analysis.scores.emotion },
                  { key: 'imagery', label: '意象画面', score: analysis.scores.imagery },
                  { key: 'rhyme', label: '韵律节奏', score: analysis.scores.rhyme },
                ].map((dim) => (
                  <div
                    key={dim.key}
                    className="p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">{dim.label}</span>
                      <span className={cn('text-sm font-bold', getScoreColor(dim.score))}>
                        {dim.score}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', getScoreBarColor(dim.score))}
                        style={{ width: `${dim.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Theme Analysis */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  主题解读
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {analysis.theme}
                </p>
              </div>

              {/* Emotion Arc */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  情感走向
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {analysis.emotion_arc}
                </p>
              </div>

              {/* Imagery Highlights */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" />
                  意象亮点
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.imagery_highlights.map((highlight, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rhyme Evaluation */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  韵律评价
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {analysis.rhyme_evaluation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
