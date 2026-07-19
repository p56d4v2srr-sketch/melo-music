'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, X, Check, User, Music2 } from 'lucide-react';

interface SingerRecommendation {
  id: string;
  name: string;
  nameEn: string;
  reason: string;
  matchScore: number;
}

interface GenreRecommendation {
  id: string;
  name: string;
  nameEn: string;
  parentId: string;
  parentName: string;
  reason: string;
  matchScore: number;
}

interface AIRecommendation {
  singers: SingerRecommendation[];
  genres: GenreRecommendation[];
  emotions: string[];
  themes: string[];
}

interface AIRecommendationCardProps {
  lyrics?: string;
  description?: string;
  songName?: string;
  onApplySinger?: (singerId: string) => void;
  onApplyGenre?: (genreId: string, parentId: string) => void;
  onApplyAll?: (singerId: string, genreId: string, parentId: string) => void;
}

export function AIRecommendationCard({
  lyrics,
  description,
  songName,
  onApplySinger,
  onApplyGenre,
  onApplyAll,
}: AIRecommendationCardProps) {
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSinger, setSelectedSinger] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const fetchRecommendation = useCallback(async () => {
    if (!lyrics && !description && !songName) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics, description, songName }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRecommendation(data.data);
        setIsVisible(true);
      } else {
        setError(data.error || '推荐失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('AI match error:', err);
    } finally {
      setLoading(false);
    }
  }, [lyrics, description, songName]);

  // Auto-fetch when content changes (with debounce)
  useEffect(() => {
    const hasContent = lyrics || description || songName;
    if (!hasContent) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      fetchRecommendation();
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [lyrics, description, songName, fetchRecommendation]);

  const handleRefresh = () => {
    fetchRecommendation();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setRecommendation(null);
  };

  const handleSelectSinger = (singerId: string) => {
    setSelectedSinger(singerId);
    onApplySinger?.(singerId);
  };

  const handleSelectGenre = (genreId: string, parentId: string) => {
    setSelectedGenre(genreId);
    onApplyGenre?.(genreId, parentId);
  };

  const handleApplyAll = () => {
    if (selectedSinger && selectedGenre && recommendation) {
      const genre = recommendation.genres.find(g => g.id === selectedGenre);
      if (genre) {
        onApplyAll?.(selectedSinger, selectedGenre, genre.parentId);
      }
    }
  };

  if (!isVisible || !recommendation) {
    if (loading) {
      return (
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin">
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-sm text-purple-300">AI 正在分析您的创作...</span>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-sm font-medium text-purple-200">
              AI 智能推荐
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="h-7 w-7 p-0 text-purple-400 hover:text-purple-300"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-7 w-7 p-0 text-purple-400 hover:text-purple-300"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        {/* Emotion tags */}
        {recommendation.emotions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {recommendation.emotions.map((emotion) => (
              <Badge
                key={emotion}
                variant="secondary"
                className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs"
              >
                {emotion}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Singer recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-pink-400" />
            <span className="text-xs font-medium text-pink-300">推荐歌手</span>
          </div>
          <div className="space-y-2">
            {recommendation.singers.map((singer) => (
              <div
                key={singer.id}
                className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                  selectedSinger === singer.id
                    ? 'bg-pink-500/20 border-pink-500/50'
                    : 'bg-black/20 border-white/5 hover:border-pink-500/30'
                }`}
                onClick={() => handleSelectSinger(singer.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">
                      {singer.name}
                    </span>
                    <span className="text-xs text-white/40">{singer.nameEn}</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-pink-500/30 text-pink-400"
                    >
                      {Math.round(singer.matchScore * 100)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5 truncate">
                    {singer.reason}
                  </p>
                </div>
                {selectedSinger === singer.id && (
                  <Check className="h-4 w-4 text-pink-400 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Genre recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Music2 className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-300">推荐曲风</span>
          </div>
          <div className="space-y-2">
            {recommendation.genres.map((genre) => (
              <div
                key={genre.id}
                className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                  selectedGenre === genre.id
                    ? 'bg-cyan-500/20 border-cyan-500/50'
                    : 'bg-black/20 border-white/5 hover:border-cyan-500/30'
                }`}
                onClick={() => handleSelectGenre(genre.id, genre.parentId)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">{genre.parentName}</span>
                    <span className="text-white/20">/</span>
                    <span className="text-sm font-medium text-white truncate">
                      {genre.name}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-cyan-500/30 text-cyan-400"
                    >
                      {Math.round(genre.matchScore * 100)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5 truncate">
                    {genre.reason}
                  </p>
                </div>
                {selectedGenre === genre.id && (
                  <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Apply all button */}
        {selectedSinger && selectedGenre && (
          <Button
            onClick={handleApplyAll}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Check className="h-4 w-4 mr-2" />
            一键采用推荐
          </Button>
        )}

        {error && (
          <p className="text-xs text-red-400 text-center">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}
