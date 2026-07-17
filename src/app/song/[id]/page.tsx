'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { mockSongsWithArtists, formatCount, formatDuration } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import {
  Play,
  Pause,
  Heart,
  MessageCircle,
  Star,
  Share2,
  Download,
  Sparkles,
  Brain,
  ChevronDown,
  ChevronUp,
  Quote,
  Music,
} from 'lucide-react';
import Link from 'next/link';

interface AnalysisResult {
  lyricsAnalysis: {
    line: string;
    interpretation: string;
    imagery: string[];
    emotion: string;
    rhetoric: string;
  }[];
  overallAnalysis: {
    theme: string;
    structure: string;
    artistry: string;
    context: string;
    highlights: string[];
  };
  ratings: {
    melody: number;
    arrangement: number;
    lyrics: number;
    performance: number;
    emotion: number;
    overall: number;
    summary: string;
  };
}

const mockAnalysis: AnalysisResult = {
  lyricsAnalysis: [
    {
      line: '漫步在星河之间',
      interpretation:
        '开篇即以宏大的宇宙意象展开，将听者带入一个超越现实的浪漫空间。星河象征着无限可能与梦想，漫步其中体现了创作者对自由的向往。',
      imagery: ['星河', '漫步', '宇宙'],
      emotion: '自由、浪漫',
      rhetoric: '夸张、意象叠加',
    },
    {
      line: '看流星划过天际线',
      interpretation:
        '流星作为转瞬即逝的美好象征，暗示珍惜当下的主题。天际线的意象创造了视觉上的壮美感，与电子音乐的宏大编曲相呼应。',
      imagery: ['流星', '天际线'],
      emotion: '惊叹、珍惜',
      rhetoric: '象征、对比',
    },
    {
      line: '银河的光洒满肩',
      interpretation:
        '将宏大的宇宙景象拉近到个人体验，"洒满肩"的触感描写让抽象的星河变得可感可触。体现了AI音乐创作中科技与人文的融合。',
      imagery: ['银河', '光', '肩'],
      emotion: '温暖、被包围',
      rhetoric: '通感、拟人',
    },
  ],
  overallAnalysis: {
    theme: '探索与自由 — 在宇宙尺度下寻找个人的位置与意义',
    structure:
      '采用 Verse-Chorus 经典结构，Verse 部分以叙事性意象铺陈，Chorus 部分升华情感，形成从具象到抽象的情感递进。',
    artistry:
      '巧妙运用宇宙意象群（星河、流星、银河）构建统一的意象系统，避免了意象堆砌的常见问题。语言简洁而富有画面感，适合电子音乐的氛围营造。',
    context:
      '创作于 AI 音乐创作蓬勃发展的 2024 年，反映了新一代音乐人对科技与艺术融合的思考。星河意象的选择也暗喻了 AI 创作的无限可能性。',
    highlights: [
      '"星河漫步 不问归途" — 核心主题句，简洁有力',
      '"每一步都是新的领悟" — 哲理性的升华',
      '整体意象统一，避免了碎片化',
    ],
  },
  ratings: {
    melody: 8.5,
    arrangement: 9.0,
    lyrics: 8.0,
    performance: 7.5,
    emotion: 8.8,
    overall: 8.4,
    summary: '直击人心的氛围电子，编曲制作精良，星河意象贯穿始终，副歌旋律记忆点极强。',
  },
};

export default function SongDetailPage() {
  const params = useParams();
  const songId = params.id as string;

  const song = mockSongsWithArtists.find((s) => s.id === songId) || mockSongsWithArtists[0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isCollected, setIsCollected] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleAnalyze = () => {
    if (analysis) {
      setShowAnalysis(!showAnalysis);
      return;
    }

    setIsAnalyzing(true);
    setShowAnalysis(true);

    // Simulate AI analysis with streaming effect
    setTimeout(() => {
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const lyricsLines = song.lyrics
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('['));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Song Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Cover */}
          <div className="relative group flex-shrink-0">
            <div className="w-64 h-64 lg:w-72 lg:h-72 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20">
              <img
                src={song.cover_url}
                alt={song.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-3">
              {song.title}
            </h1>

            {/* Artist */}
            <Link
              href={`/artist/${song.artist?.id}`}
              className="flex items-center gap-3 mb-4 group"
            >
              <img
                src={song.artist?.avatar}
                alt={song.artist?.nickname}
                className="w-10 h-10 rounded-full border-2 border-primary/50"
              />
              <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                {song.artist?.nickname}
              </span>
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {song.style_tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6">{song.description}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-gold-purple text-white hover:opacity-90 glow-gold transition-all"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isPlaying ? '暂停' : '播放'}
              </button>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  'p-3 rounded-xl glass-card transition-all',
                  isLiked ? 'text-red-500 glow-red' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => setIsCollected(!isCollected)}
                className={cn(
                  'p-3 rounded-xl glass-card transition-all',
                  isCollected
                    ? 'text-yellow-500 glow-yellow'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Star className="w-5 h-5" fill={isCollected ? 'currentColor' : 'none'} />
              </button>
              <button className="p-3 rounded-xl glass-card text-muted-foreground hover:text-foreground transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-xl glass-card text-muted-foreground hover:text-foreground transition-all">
                <Download className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Play className="w-4 h-4" />
                {formatCount(song.play_count)}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {formatCount(song.like_count + (isLiked ? 1 : 0))}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {formatCount(song.collect_count + (isCollected ? 1 : 0))}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {formatCount(song.comment_count)}
              </span>
              <span>{formatDuration(song.duration)}</span>
            </div>
          </div>
        </div>

        {/* Lyrics & Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lyrics */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Music className="w-5 h-5 text-primary" />
                歌词
              </h2>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  isAnalyzing
                    ? 'bg-primary/20 text-primary cursor-wait'
                    : 'glass-card text-primary hover:bg-primary/10'
                )}
              >
                {isAnalyzing ? (
                  <>
                    <Brain className="w-4 h-4 animate-pulse" />
                    AI 分析中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {showAnalysis ? '收起分析' : 'AI 深度分析'}
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2">
              {lyricsLines.map((line, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedLine(selectedLine === index ? null : index)}
                  className={cn(
                    'block w-full text-left p-2 rounded-lg transition-all text-sm',
                    selectedLine === index
                      ? 'bg-primary/10 text-primary border-l-2 border-primary'
                      : 'text-foreground hover:bg-white/5'
                  )}
                >
                  {line}
                </button>
              ))}
            </div>

            {/* Line Analysis Popup */}
            {selectedLine !== null && analysis && analysis.lyricsAnalysis[selectedLine] && (
              <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Quote className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">单句解读</span>
                </div>
                <p className="text-sm text-foreground mb-3">
                  {analysis.lyricsAnalysis[selectedLine].interpretation}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-white/5 text-muted-foreground">
                    情感: {analysis.lyricsAnalysis[selectedLine].emotion}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-white/5 text-muted-foreground">
                    修辞: {analysis.lyricsAnalysis[selectedLine].rhetoric}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* AI Analysis */}
          {showAnalysis && (
            <div className="glass-card p-6 rounded-2xl">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-primary/30 animate-ping" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">AI 正在深度分析...</p>
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-4 bg-primary rounded-full wave-animation"
                        style={{
                          height: `${20 + Math.sin(i * 0.8) * 30 + 30}%`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : analysis ? (
                <div className="space-y-6">
                  {/* Ratings Radar */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      多维度评分
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'melody', label: '旋律创作', value: analysis.ratings.melody },
                        { key: 'arrangement', label: '编曲制作', value: analysis.ratings.arrangement },
                        { key: 'lyrics', label: '歌词创作', value: analysis.ratings.lyrics },
                        { key: 'performance', label: '演唱表达', value: analysis.ratings.performance },
                        { key: 'emotion', label: '情感共鸣', value: analysis.ratings.emotion },
                        { key: 'overall', label: '综合评分', value: analysis.ratings.overall },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground w-16">{item.label}</span>
                          <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full rounded-full gradient-gold-purple transition-all duration-1000"
                              style={{ width: `${(item.value / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-primary w-8">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-foreground italic p-3 rounded-lg bg-primary/5">
                      &quot;{analysis.ratings.summary}&quot;
                    </p>
                  </div>

                  {/* Overall Analysis */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-3">整首深度解读</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'theme', label: '主题内核', content: analysis.overallAnalysis.theme },
                        { key: 'structure', label: '段落结构', content: analysis.overallAnalysis.structure },
                        { key: 'artistry', label: '艺术手法', content: analysis.overallAnalysis.artistry },
                        { key: 'context', label: '文化语境', content: analysis.overallAnalysis.context },
                      ].map((item) => (
                        <div key={item.key} className="glass-card p-3 rounded-lg">
                          <button
                            onClick={() =>
                              setExpandedSection(
                                expandedSection === item.key ? null : item.key
                              )
                            }
                            className="w-full flex items-center justify-between"
                          >
                            <span className="text-sm font-medium text-primary">{item.label}</span>
                            {expandedSection === item.key ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                          {expandedSection === item.key && (
                            <p className="mt-2 text-sm text-muted-foreground">{item.content}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div>
                    <h3 className="text-sm font-medium text-primary mb-2">亮点标注</h3>
                    <ul className="space-y-2">
                      {analysis.overallAnalysis.highlights.map((highlight, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-foreground"
                        >
                          <Star className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
