'use client';

import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { Navbar } from '@/components/navbar';
import { MusicStyleSelector } from '@/components/music-style-selector';
import { SingerStyleSelector } from '@/components/singer-style-selector';
import { DescriptionInput } from '@/components/description-input';
import { LyricsEditor } from '@/components/lyrics-editor';
import { VoiceUpload, type VoiceFile } from '@/components/voice-upload';
import { MusicPlayer } from '@/components/music-player';
import { DeepThinkingLyrics } from '@/components/deep-thinking-lyrics';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, AlertTriangle, Library, Mic2, Languages } from 'lucide-react';
import { analyzeLyrics, type SanitizeResult } from '@/lib/lyrics-sanitizer';
import { useToggleSelection } from '@/hooks/useToggleSelection';
import { useMultiToggleSelection } from '@/hooks/useMultiToggleSelection';
import { SELECTION_STYLES } from '@/lib/ui-tokens';
import { GenreLibraryDrawer } from '@/components/genre-library-drawer';
import { ArtistLibraryDrawer } from '@/components/artist-library-drawer';
import { VocalWeightSliders, weightsToPrompt, type VocalWeights } from '@/components/vocal-weight-sliders';
import { ModelAdvancedOptions } from '@/components/model-advanced-options';
import { GENRES } from '@/data/genres';
import { ARTISTS, getArtistById } from '@/data/artists';

// Provider tab 定义（顶层切换）
const PROVIDER_TABS = [
  { key: 'minimax', name: 'MiniMax · 快', subtitle: '~2min · 免费 · music-2.5', enabled: true },
  { key: 'pule', name: 'PuLe · 精品', subtitle: '~90s · ¥0.3/首 · 5min · 时间戳歌词', enabled: true },
  { key: 'suno', name: 'Suno · 全球 v5.5', subtitle: '~60-90s · 2 首供选 · 流式播放 · 内核覆盖中外全曲风元素', enabled: true },
  { key: 'lconai', name: '智创聚合', subtitle: 'Suno V3.5/V4/V5 · 独立通道', enabled: true },
];

// 模型系列 tab 定义
const MODEL_TABS = [
  { key: 'minimax', name: 'MiniMax（海螺音乐）', enabled: true, badge: '推荐' },
  { key: 'suno', name: 'Suno', enabled: true, badge: null },
  { key: 'mureka', name: 'Mureka', enabled: true, badge: null },
  { key: 'acestep', name: 'ACE-Step', enabled: true, badge: 'NEW' },
  { key: 'voice-clone', name: '音色克隆', enabled: true, badge: null },
];

// Suno 版本定义 - 使用 constants.ts 中的上游探测结果
import { SUNO_VERSIONS as SUNO_VERSION_DATA, DEFAULT_SUNO_VERSION, MAX_TIMBRE_CHIP_SELECTED, PULE_MODEL, LCONAI_VERSIONS as LCONAI_VERSION_DATA, DEFAULT_LCONAI_VERSION } from '@/lib/constants';
import { VOCAL_TIMBRES } from '@/data/vocal-timbres';

const SUNO_VERSIONS = SUNO_VERSION_DATA.map(v => ({
  key: v.value,
  name: v.label,
  desc: v.desc,
  credits: '5 积分 / 2 首',
  badge: v.value === DEFAULT_SUNO_VERSION ? '默认' : null,
}));

// LCONAI (智创聚合) 版本定义
const LCONAI_VERSIONS = LCONAI_VERSION_DATA.map(v => ({
  key: v.value,
  name: v.label,
  desc: v.desc,
  credits: '按量计费',
  badge: v.value === DEFAULT_LCONAI_VERSION ? '默认' : null,
}));

// MiniMax 版本定义
const MINIMAX_VERSIONS = [
  { key: 'music-2.0', name: 'MiniMax music-2.0', desc: '经典款 · ~18s · 同步WAV无损', credits: '免费', badge: null },
  { key: 'music-2.5', name: 'MiniMax music-2.5', desc: '最新版 · ~2min · 同步WAV无损 · 推荐', credits: '免费', badge: '推荐' },
];

export default function CreatePage() {
  // ========== Provider state (useToggleSelection) ==========
  const provider = useToggleSelection<'minimax' | 'pule' | 'suno' | 'lconai'>();
  
  // ========== MiniMax sub-model (useToggleSelection, 必选组) ==========
  const miniMaxModel = useToggleSelection<'music-2.0' | 'music-2.5'>('music-2.5');
  
  // ========== PuLe sub-model (useToggleSelection, 必选组) ==========
  const puleModel = useToggleSelection<string>(PULE_MODEL);
  
  // ========== Suno version (useToggleSelection, 必选组) ==========
  const sunoVersion = useToggleSelection<string>(DEFAULT_SUNO_VERSION);
  
  // ========== LCONAI version (useToggleSelection, 必选组) ==========
  const lconaiVersion = useToggleSelection<string>(DEFAULT_LCONAI_VERSION);
  
  // ========== Suno vocal gender (useToggleSelection, 可选组) ==========
  const gender = useToggleSelection<'male' | 'female' | 'duet' | 'instrumental'>();
  
  // ========== Suno timbre chips (useMultiToggleSelection, 可选组, max 3) ==========
  const timbres = useMultiToggleSelection<string>(MAX_TIMBRE_CHIP_SELECTED);
  
  // ========== Suno advanced options panel ==========
  const [sunoAdvancedOpen, setSunoAdvancedOpen] = useState(false);

  // ========== Model-specific advanced options (Song Name, Lyrics, Style) ==========
  const [songName, setSongName] = useState('');
  const [advancedLyrics, setAdvancedLyrics] = useState('');
  const [styleOfMusic, setStyleOfMusic] = useState('');

  // ========== Genre & Artist Library Drawers ==========
  const [genreDrawerOpen, setGenreDrawerOpen] = useState(false);
  const [artistDrawerOpen, setArtistDrawerOpen] = useState(false);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [selectedArtistIds, setSelectedArtistIds] = useState<number[]>([]);
  
  // ========== Suno-specific state ==========
  const [sunoMode, setSunoMode] = useState<'prompt' | 'custom'>('custom');
  const [sunoSongIds, setSunoSongIds] = useState<string[]>([]);
  const [sunoSongs, setSunoSongs] = useState<Array<{
    id: string;
    status: 'pending' | 'processing' | 'succeeded' | 'failed' | string;
    title?: string;
    audio_url?: string;
    image_url?: string;
    lyric?: string;
    tags?: string;
    duration?: number;
    model_name?: string;
  }>>([]);
  const [sunoPollingStatus, setSunoPollingStatus] = useState<'idle' | 'submitted' | 'polling' | 'succeeded' | 'failed'>('idle');
  const [sunoPollingMessage, setSunoPollingMessage] = useState('');
  // Suno prompt mode input
  const [sunoPrompt, setSunoPrompt] = useState('');
  // Suno custom mode tags
  const [sunoTags, setSunoTags] = useState('');
  
  // ========== Legacy state (kept for compatibility) ==========
  const [songTitle, setSongTitle] = useState('');
  const [songDuration, setSongDuration] = useState(300); // 默认 5 分钟（300秒）
  const [language, setLanguage] = useState('zh');
  const [vocalType, setVocalType] = useState('female');
  const [mood, setMood] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [coverSource, setCoverSource] = useState<'ai' | 'upload'>('ai');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedSingers, setSelectedSingers] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [uploadedVoices, setUploadedVoices] = useState<VoiceFile[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string>();
  const [lyricsAnalysis, setLyricsAnalysis] = useState<SanitizeResult>({
    cleaned: '',
    bracketTags: [],
    structureTagCount: 0,
    totalLines: 0,
  });

  // ========== Vocal Weight Sliders ==========
  const [vocalWeights, setVocalWeights] = useState<VocalWeights | null>(null);
  
  // ========== Lyrics Translation ==========
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedLyrics, setTranslatedLyrics] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  const handleTranslateLyrics = async (targetLang: string) => {
    if (!lyrics.trim()) {
      toast.error('请先输入歌词');
      return;
    }
    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics, targetLang }),
      });
      const data = await res.json();
      if (data.success) {
        setTranslatedLyrics(data.data.translated);
        setShowTranslation(true);
        toast.success('翻译完成');
      } else {
        toast.error(data.error || '翻译失败');
      }
    } catch {
      toast.error('翻译请求失败');
    } finally {
      setIsTranslating(false);
    }
  };

  // PuLe-specific state
  const [puleItemIds, setPuleItemIds] = useState<string[]>([]);
  const [puleSongs, setPuleSongs] = useState<Array<{
    item_id: string;
    status: 'running' | 'main_succeeded' | 'succeeded' | 'part_failed' | 'failed';
    audio_url?: string;
    audio_hi_url?: string;
    streamAudioUrl?: string;
    lyrics?: string;
    duration?: number;
  }>>([]);
  const [pulePollingStatus, setPulePollingStatus] = useState<'idle' | 'submitted' | 'polling' | 'succeeded' | 'failed'>('idle');
  const [pulePollingMessage, setPulePollingMessage] = useState('');

  // Auto-analyze lyrics when they change
  useEffect(() => {
    const result = analyzeLyrics(lyrics);
    setLyricsAnalysis(result);
  }, [lyrics]);

  // PuLe polling logic
  useEffect(() => {
    if (pulePollingStatus !== 'polling' || puleItemIds.length === 0) return;

    let pollTimer: NodeJS.Timeout;
    let startTime = Date.now();
    const POLL_INTERVAL = 2000; // 2s
    const POLL_TIMEOUT = 300000; // 5min
    const INITIAL_DELAY = 20000; // 20s before first poll

    const poll = async () => {
      const elapsed = Date.now() - startTime;
      
      // Check timeout
      if (elapsed > POLL_TIMEOUT) {
        setPulePollingStatus('failed');
        setPulePollingMessage('生成超时，请重试');
        toast.error('PuLe 生成超时', { description: '已超过 5 分钟，请重试' });
        return;
      }

      try {
        const res = await fetch('/api/pule-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item_ids: puleItemIds }),
        });

        const data = await res.json();

        if (!data.ok) {
          throw new Error(data.message || '查询失败');
        }

        setPuleSongs(data.songs);

        // Check status of all songs
        const allSucceeded = data.songs.every((s: { status: string }) => s.status === 'succeeded');
        const anyMainSucceeded = data.songs.some((s: { status: string }) => s.status === 'main_succeeded' || s.status === 'succeeded');
        const anyFailed = data.songs.some((s: { status: string }) => s.status === 'failed' || s.status === 'part_failed');

        if (allSucceeded) {
          setPulePollingStatus('succeeded');
          setPulePollingMessage('高清版生成完成');
          // Use the first succeeded song's audio_url
          const succeededSong = data.songs.find((s: { status: string }) => s.status === 'succeeded');
          if (succeededSong?.audio_url) {
            setGeneratedAudioUrl(succeededSong.audio_url);
          }
          toast.success('PuLe 生成完成', { description: '高清版已就绪' });
        } else if (anyMainSucceeded && !anyFailed) {
          // Stream version available, HD still generating
          setPulePollingMessage('流式播放可用，高清版生成中...');
          const streamSong = data.songs.find((s: { status: string }) => s.status === 'main_succeeded' || s.status === 'succeeded');
          if (streamSong?.streamAudioUrl && !generatedAudioUrl) {
            setGeneratedAudioUrl(streamSong.streamAudioUrl);
            toast.info('流式版本已就绪', { description: '高清版仍在生成中...' });
          }
          // Continue polling
          pollTimer = setTimeout(poll, POLL_INTERVAL);
        } else if (anyFailed) {
          setPulePollingStatus('failed');
          setPulePollingMessage('生成失败');
          toast.error('PuLe 生成失败', { description: '部分歌曲生成失败，请重试' });
        } else {
          // Still running, continue polling
          const runningCount = data.songs.filter((s: { status: string }) => s.status === 'running').length;
          setPulePollingMessage(`生成中...（${data.songs.length - runningCount}/${data.songs.length} 完成）`);
          pollTimer = setTimeout(poll, POLL_INTERVAL);
        }
      } catch (err) {
        console.error('[PuLe] Poll error:', err);
        // Continue polling on transient errors
        pollTimer = setTimeout(poll, POLL_INTERVAL);
      }
    };

    // Initial delay before first poll
    const initialTimer = setTimeout(poll, INITIAL_DELAY);
    setPulePollingMessage('已提交任务，等待 20 秒后开始查询...');

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(pollTimer);
    };
  }, [pulePollingStatus, puleItemIds, generatedAudioUrl]);

  // Suno polling logic
  useEffect(() => {
    if (sunoPollingStatus !== 'polling' || sunoSongIds.length === 0) return;

    let pollTimer: NodeJS.Timeout;
    let startTime = Date.now();
    const POLL_INTERVAL = 3000; // 3s
    const POLL_TIMEOUT = 300000; // 5min
    const INITIAL_DELAY = 20000; // 20s before first poll

    const poll = async () => {
      const elapsed = Date.now() - startTime;
      
      // Check timeout
      if (elapsed > POLL_TIMEOUT) {
        setSunoPollingStatus('failed');
        setSunoPollingMessage('生成超时，请重试');
        toast.error('Suno 生成超时', { description: '已超过 5 分钟，请重试' });
        return;
      }

      try {
        const res = await fetch('/api/suno-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ song_ids: sunoSongIds }),
        });

        const data = await res.json();

        if (!data.ok) {
          throw new Error(data.message || '查询失败');
        }

        setSunoSongs(data.songs);

        // Check status of all songs
        const allSucceeded = data.songs.every((s: { status: string }) => s.status === 'succeeded');
        const allDone = data.songs.every((s: { status: string }) => 
          s.status === 'succeeded' || s.status === 'failed'
        );
        const anyProcessing = data.songs.some((s: { status: string }) => 
          s.status === 'processing' || s.status === 'succeeded'
        );
        const anyFailed = data.songs.some((s: { status: string }) => s.status === 'failed');

        if (allSucceeded) {
          setSunoPollingStatus('succeeded');
          setSunoPollingMessage('全部生成完成');
          // Use the first succeeded song's audio_url
          const succeededSong = data.songs.find((s: { status: string }) => s.status === 'succeeded');
          if (succeededSong?.audio_url) {
            setGeneratedAudioUrl(succeededSong.audio_url);
          }
          toast.success('Suno 生成完成', { description: `${data.songs.length} 首歌曲已就绪` });
        } else if (allDone) {
          // Some succeeded, some failed
          setSunoPollingStatus('succeeded');
          const successCount = data.songs.filter((s: { status: string }) => s.status === 'succeeded').length;
          setSunoPollingMessage(`${successCount}/${data.songs.length} 首成功`);
          const succeededSong = data.songs.find((s: { status: string }) => s.status === 'succeeded');
          if (succeededSong?.audio_url) {
            setGeneratedAudioUrl(succeededSong.audio_url);
          }
          toast.warning('部分歌曲生成失败', { description: `${successCount} 首成功，${data.songs.length - successCount} 首失败` });
        } else if (anyProcessing && !anyFailed) {
          // Processing available, continue polling
          const processingCount = data.songs.filter((s: { status: string }) => s.status === 'processing').length;
          const succeededCount = data.songs.filter((s: { status: string }) => s.status === 'succeeded').length;
          setSunoPollingMessage(`生成中...（${succeededCount} 完成, ${processingCount} 处理中）`);
          
          // If we have a processing song with audio_url, use it for streaming
          const processingSong = data.songs.find((s: { status: string; audio_url?: string }) => s.status === 'processing' && s.audio_url);
          if (processingSong?.audio_url && !generatedAudioUrl) {
            setGeneratedAudioUrl(processingSong.audio_url);
          }
          
          pollTimer = setTimeout(poll, POLL_INTERVAL);
        } else if (anyFailed) {
          setSunoPollingStatus('failed');
          setSunoPollingMessage('生成失败');
          toast.error('Suno 生成失败', { description: '部分歌曲生成失败，请重试' });
        } else {
          // Still pending, continue polling
          setSunoPollingMessage('任务排队中...');
          pollTimer = setTimeout(poll, POLL_INTERVAL);
        }
      } catch (err) {
        console.error('[Suno] Poll error:', err);
        // Continue polling on transient errors
        pollTimer = setTimeout(poll, POLL_INTERVAL);
      }
    };

    // Initial delay before first poll
    const initialTimer = setTimeout(poll, INITIAL_DELAY);
    setSunoPollingMessage('已提交任务，等待 20 秒后开始查询...');

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(pollTimer);
    };
  }, [sunoPollingStatus, sunoSongIds, generatedAudioUrl]);

  const handleModelTabClick = (tabKey: string) => {
    const tab = MODEL_TABS.find(t => t.key === tabKey);
    if (!tab?.enabled) {
      toast.info('敬请期待', { description: `${tab?.name} 即将上线` });
      return;
    }
    provider.toggle(tabKey as 'minimax' | 'pule' | 'suno');
  };

  const handleGenerate = async () => {
    if (!provider.value) {
      toast.error('请先选择一个模型');
      return;
    }

    if (selectedStyles.length === 0) {
      toast.error('请至少选择一个音乐风格');
      return;
    }

    if (!description.trim() && !lyrics.trim()) {
      toast.error('请输入描述词或歌词');
      return;
    }

    // Route to PuLe if selected
    if (provider.value === 'pule') {
      return handleGeneratePule();
    }

    // Route to Suno if selected
    if (provider.value === 'suno') {
      return handleGenerateSuno();
    }

    // Route to LCONAI (智创聚合) if selected
    if (provider.value === 'lconai') {
      return handleGenerateLconai();
    }

    // MiniMax flow (existing logic)
    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedAudioUrl(undefined);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: songTitle,
          duration: songDuration,
          language,
          vocal_type: vocalType,
          mood: mood || undefined,
          is_public: isPublic,
          cover_source: coverSource,
          cover_url: coverUrl || undefined,
          styles: selectedStyles,
          singers: selectedSingers,
          description,
          lyrics,
          voiceId: selectedVoice,
          model_version: miniMaxModel.value,
        }),
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (!response.ok) {
        // Structured error from backend
        const errorType = data.error_type || 'unknown';
        const message = data.error || data.message || '生成失败';
        const suggestion = data.suggestion || '请稍后重试';
        
        if (errorType === 'invalid_key') {
          toast.error('API Key 无效', { description: suggestion });
        } else if (errorType === 'quota_exceeded') {
          toast.error('额度不足', { description: suggestion });
        } else if (errorType === 'rate_limit') {
          toast.error('请求频率超限', { description: suggestion });
        } else {
          toast.error(message, { description: suggestion });
        }
        return;
      }

      // Success - handle demo mode
      if (data.is_demo) {
        toast.success('演示模式', { description: data.message || '当前为演示模式，配置 API Key 后可生成真实音乐' });
      } else {
        // 读取歌词标签信息
        const sanitizeInfo = data.lyricsSanitize || data.lyrics_analysis;
        const bracketTagCount = sanitizeInfo?.structureTagCount ?? sanitizeInfo?.bracketTags?.length ?? 0;
        const toastDesc = bracketTagCount > 0
          ? `已识别 ${bracketTagCount} 处方括号标签，原样保留`
          : undefined;
        toast.success('音乐生成成功', { description: toastDesc });
      }

      // Show warning if provider returned one (e.g., version downgrade)
      if (data.warning) {
        toast.info(data.warning);
      }
      
      setGenerationProgress(100);
      setGeneratedAudioUrl(data.audioUrl);
    } catch (error) {
      console.error('生成失败:', error);
      toast.error('音乐生成失败', { description: '网络异常，请检查网络连接后重试' });
    } finally {
      setIsGenerating(false);
    }
  };

  // PuLe generate handler
  const handleGeneratePule = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedAudioUrl(undefined);
    setPuleSongs([]);
    setPuleItemIds([]);
    setPulePollingStatus('idle');
    setPulePollingMessage('');

    try {
      // Build prompt from styles and description
      const prompt = [
        description,
        selectedStyles.length > 0 ? `风格：${selectedStyles.join(', ')}` : '',
        vocalType === 'male' ? '男声' : vocalType === 'female' ? '女声' : '',
        mood ? `情绪：${mood}` : '',
      ].filter(Boolean).join('，');

      const response = await fetch('/api/pule-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt || '温暖治愈的中文流行',
          lyrics: lyrics || undefined,
          instrumental: vocalType === 'instrumental',
          // V5.8: 使用实测有效的 model 字面串
          model: puleModel.value || 'TemPolor v4.5',
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        const code = data.code || 'UNKNOWN';
        const message = data.message || '生成失败';
        
        if (code === 'INSUFFICIENT_BALANCE') {
          toast.error('PuLe 余额不足', { description: '请联系管理员充值' });
        } else if (code === 'AUTH_ERROR') {
          toast.error('PuLe 认证失败', { description: 'API Key 无效' });
        } else if (code === 'EMPTY_LYRICS') {
          toast.error('歌词为空', { description: '非纯音乐模式必须提供歌词' });
        } else {
          toast.error('PuLe 生成失败', { description: message });
        }
        setIsGenerating(false);
        return;
      }

      // Success - got item_ids
      setPuleItemIds(data.item_ids);
      setPulePollingStatus('polling');
      setGenerationProgress(10);
      
      const sanitizeInfo = data.lyricsSanitize;
      const bracketTagCount = sanitizeInfo?.structureTagCount ?? sanitizeInfo?.bracketTags?.length ?? 0;
      const toastDesc = bracketTagCount > 0
        ? `已提交 ${data.item_ids.length} 首，保留 ${bracketTagCount} 处标签`
        : `已提交 ${data.item_ids.length} 首`;
      toast.success('PuLe 任务已提交', { description: toastDesc });

    } catch (error) {
      console.error('[PuLe] Generate error:', error);
      toast.error('PuLe 生成失败', { description: '网络异常，请检查网络连接后重试' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Suno generate handler
  const handleGenerateSuno = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedAudioUrl(undefined);
    setSunoSongs([]);
    setSunoSongIds([]);
    setSunoPollingStatus('idle');
    setSunoPollingMessage('');

    try {
      const isCustomMode = sunoMode === 'custom';
      
      // Build request body
      const body: Record<string, unknown> = {
        mode: sunoMode,
        version: sunoVersion.value || DEFAULT_SUNO_VERSION,
        instrumental: gender.value === 'instrumental' || vocalType === 'instrumental',
      };

      // Vocal gender (only pass if explicitly selected and not instrumental/duet)
      if (gender.value === 'male' || gender.value === 'female') {
        body.vocal_gender = gender.value;
      }

      if (isCustomMode) {
        // Custom mode: title + tags + lyrics
        body.title = songTitle || 'Untitled Melo';
        // Build tags: base styles + duet tag + timbre tags
        const tagParts: string[] = [];
        if (selectedStyles.length > 0) tagParts.push(selectedStyles.join(', '));
        else tagParts.push('pop, chinese');
        if (gender.value === 'duet') tagParts.push('male & female duet');
        if (timbres.values.length > 0) tagParts.push(timbres.values.join(', '));
        body.tags = tagParts.join(', ');
        body.lyrics = lyrics || undefined;
      } else {
        // Prompt mode: just prompt
        const promptParts: string[] = [];
        if (description) promptParts.push(description);
        if (selectedStyles.length > 0) promptParts.push(`风格：${selectedStyles.join(', ')}`);
        if (gender.value === 'male' || vocalType === 'male') promptParts.push('男声');
        else if (gender.value === 'female' || vocalType === 'female') promptParts.push('女声');
        else if (gender.value === 'duet') promptParts.push('男女对唱');
        if (mood) promptParts.push(`情绪：${mood}`);
        if (timbres.values.length > 0) promptParts.push(`音色：${timbres.values.join(', ')}`);
        const prompt = promptParts.filter(Boolean).join('，');
        body.prompt = prompt || '温暖治愈的中文流行';
      }

      const response = await fetch('/api/suno-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!data.ok) {
        const code = data.code || 'UNKNOWN';
        const message = data.message || '生成失败';
        
        if (code === 'INSUFFICIENT_BALANCE') {
          toast.error('Suno 余额不足', { description: '请去 https://api.yourmusic.fun/dashboard 充值' });
        } else if (code === 'AUTH_ERROR') {
          toast.error('Suno 认证失败', { description: 'API Key 无效' });
        } else if (code === 'EMPTY_LYRICS') {
          toast.error('歌词为空', { description: '非纯音乐模式必须提供歌词' });
        } else {
          toast.error('Suno 生成失败', { description: message });
        }
        setIsGenerating(false);
        return;
      }

      // Success - got songs
      const songs = data.songs || [];
      setSunoSongs(songs);
      setSunoSongIds(songs.map((s: { id: string }) => s.id));
      setSunoPollingStatus('polling');
      setGenerationProgress(10);
      
      const sanitizeInfo = data.lyricsSanitize;
      const bracketTagCount = sanitizeInfo?.structureTagCount ?? sanitizeInfo?.bracketTags?.length ?? 0;
      const toastDesc = bracketTagCount > 0
        ? `已提交 ${songs.length} 首，保留 ${bracketTagCount} 处标签`
        : `已提交 ${songs.length} 首`;
      toast.success('Suno 任务已提交', { description: toastDesc });

    } catch (error) {
      console.error('[Suno] Generate error:', error);
      const errMsg = error instanceof Error
        ? error.message
        : (typeof error === 'string' ? error : JSON.stringify(error));
      toast.error('Suno 生成失败', { description: errMsg || '网络异常，请检查网络连接后重试' });
    } finally {
      setIsGenerating(false);
    }
  };

  // LCONAI (智创聚合) generate handler
  const handleGenerateLconai = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedAudioUrl(undefined);

    try {
      const isCustomMode = sunoMode === 'custom';
      
      // Build request body
      const body: Record<string, unknown> = {
        mode: sunoMode,
        mv: lconaiVersion.value || DEFAULT_LCONAI_VERSION,
        instrumental: gender.value === 'instrumental' || vocalType === 'instrumental',
      };

      if (isCustomMode) {
        // Custom mode: title + tags + lyrics
        body.title = songTitle || 'Untitled Melo';
        const tagParts: string[] = [];
        if (selectedStyles.length > 0) tagParts.push(selectedStyles.join(', '));
        else tagParts.push('pop, chinese');
        if (gender.value === 'duet') tagParts.push('male & female duet');
        body.tags = tagParts.join(', ');
        body.lyrics = lyrics || undefined;
      } else {
        // Prompt mode
        const promptParts: string[] = [];
        if (description) promptParts.push(description);
        if (selectedStyles.length > 0) promptParts.push(`风格：${selectedStyles.join(', ')}`);
        if (gender.value === 'male' || vocalType === 'male') promptParts.push('男声');
        else if (gender.value === 'female' || vocalType === 'female') promptParts.push('女声');
        else if (gender.value === 'duet') promptParts.push('男女对唱');
        if (mood) promptParts.push(`情绪：${mood}`);
        body.prompt = promptParts.filter(Boolean).join('，') || '温暖治愈的中文流行';
      }

      const response = await fetch('/api/lconai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!data.ok) {
        const code = data.code || 'UNKNOWN';
        const message = data.message || data.error || '生成失败';
        
        if (code === 'QUOTA_EXCEEDED') {
          toast.error('智创聚合余额不足', { description: '请联系管理员充值' });
        } else if (code === 'INVALID_KEY') {
          toast.error('智创聚合认证失败', { description: 'API Key 无效' });
        } else if (code === 'EMPTY_LYRICS') {
          toast.error('歌词为空', { description: '非纯音乐模式必须提供歌词' });
        } else {
          toast.error('智创聚合生成失败', { description: message });
        }
        setIsGenerating(false);
        return;
      }

      // Success
      const songs = data.songs || [];
      const sanitizeInfo = data.lyricsSanitize;
      const bracketTagCount = sanitizeInfo?.structureTagCount ?? sanitizeInfo?.bracketTags?.length ?? 0;
      const toastDesc = bracketTagCount > 0
        ? `已生成 ${songs.length} 首，保留 ${bracketTagCount} 处标签`
        : `已生成 ${songs.length} 首`;
      toast.success('智创聚合生成成功', { description: toastDesc });
      
      setGenerationProgress(100);
      if (songs.length > 0 && songs[0].audio_url) {
        setGeneratedAudioUrl(songs[0].audio_url);
      }

    } catch (error) {
      console.error('[LCONAI] Generate error:', error);
      const errMsg = error instanceof Error
        ? error.message
        : (typeof error === 'string' ? error : JSON.stringify(error));
      toast.error('智创聚合生成失败', { description: errMsg || '网络异常，请检查网络连接后重试' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVoiceUpload = (voice: VoiceFile) => {
    setUploadedVoices([...uploadedVoices, voice]);
  };

  const handleVoiceRemove = (id: string) => {
    setUploadedVoices(uploadedVoices.filter((v) => v.id !== id));
    if (selectedVoice === id) {
      setSelectedVoice(undefined);
    }
  };

  const handleLyricsFromAI = (aiLyrics: string) => {
    setLyrics(aiLyrics);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">
            AI 音乐创作
          </h1>
          <p className="text-muted-foreground">
            选择风格、描述情绪，让 AI 为你创作独一无二的音乐作品
          </p>
        </div>

        {/* Provider Tabs (Top Level) */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            {PROVIDER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  if (tab.enabled) {
                    provider.toggle(tab.key as 'minimax' | 'pule' | 'suno');
                  }
                }}
                className={`
                  relative flex-1 max-w-xs px-5 py-3 rounded-xl transition-all text-left
                  ${!tab.enabled ? SELECTION_STYLES.disabled : 'cursor-pointer'}
                  ${provider.value === tab.key && tab.enabled
                    ? SELECTION_STYLES.selected
                    : SELECTION_STYLES.unselected
                  }
                `}
              >
                <h3 className={`text-sm font-bold mb-0.5 ${provider.value === tab.key ? 'text-amber-400' : 'text-foreground'}`}>
                  {tab.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {tab.subtitle}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Model Series Tabs (only show for MiniMax provider) */}
        {provider.value === 'minimax' && (
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {MODEL_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  if (tab.enabled) {
                    miniMaxModel.toggle(tab.key as 'music-2.0');
                  }
                }}
                className={`
                  relative px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${!tab.enabled ? SELECTION_STYLES.disabled : 'cursor-pointer'}
                  ${miniMaxModel.value === tab.key && tab.enabled
                    ? SELECTION_STYLES.selected
                    : SELECTION_STYLES.unselected
                  }
                `}
              >
                {tab.name}
                {tab.badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/10 text-muted-foreground border border-white/10">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        )}

        {/* Suno Version Cards (only show when Suno tab is active) */}
        {provider.value === 'suno' && (
          <div className="mb-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {SUNO_VERSIONS.map((version) => (
                <button
                  key={version.key}
                  onClick={() => sunoVersion.toggle(version.key as typeof SUNO_VERSIONS[number]['key'])}
                  className={`
                    relative flex-shrink-0 w-48 p-4 rounded-xl transition-all text-left
                    ${sunoVersion.value === version.key
                      ? SELECTION_STYLES.selected
                      : SELECTION_STYLES.unselected
                    }
                  `}
                >
                  {/* Badge */}
                  {version.badge && (
                    <span className={`
                      absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold
                      ${version.badge === 'NEW' 
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black' 
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }
                    `}>
                      {version.badge}
                    </span>
                  )}
                  
                  {/* Version Name */}
                  <h3 className={`text-sm font-bold mb-1 ${sunoVersion.value === version.key ? 'text-amber-400' : 'text-foreground'}`}>
                    {version.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {version.desc}
                  </p>
                  
                  {/* Credits */}
                  <span className="text-[10px] text-muted-foreground/70">
                    {version.credits}
                  </span>
                </button>
              ))}
            </div>
            {/* Suno 全球提示小字 */}
            <p className="text-[11px] text-muted-foreground/60 mt-2">
              🌍 Suno 全球 —— 支持中英文混唱、跨曲风融合、覆盖中外所有曲风元素
            </p>
          </div>
        )}

        {/* Universal Advanced Options for ALL models */}
        <div className="mb-6">
          <ModelAdvancedOptions
            provider={provider.value || 'minimax'}
            songName={songName}
            onSongNameChange={setSongName}
            lyrics={advancedLyrics}
            onLyricsChange={setAdvancedLyrics}
            styleOfMusic={styleOfMusic}
            onStyleOfMusicChange={setStyleOfMusic}
          />
        </div>

        {/* Suno-specific Advanced Options (only show when Suno tab is active) */}
        {provider.value === 'suno' && (
          <div className="mb-6 space-y-4">
            {/* Collapsible Suno-specific Options */}
            <button
              onClick={() => setSunoAdvancedOpen(!sunoAdvancedOpen)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className={`transition-transform ${sunoAdvancedOpen ? 'rotate-90' : ''}`}>▶</span>
              Suno 专属选项
              {(gender.value || timbres.values.length > 0) && (
                <span className="px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 text-[10px]">
                  已配置
                </span>
              )}
            </button>

            {sunoAdvancedOpen && (
              <div className="space-y-4 pl-4 border-l border-white/10">
                {/* Vocal Gender Selector */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">人声性别</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'male' as const, emoji: '👨', label: '男声' },
                      { value: 'female' as const, emoji: '👩', label: '女声' },
                      { value: 'duet' as const, emoji: '👥', label: '男女对唱' },
                      { value: 'instrumental' as const, emoji: '🎼', label: '纯乐器' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => gender.toggle(opt.value)}
                        className={`
                          px-3 py-1.5 rounded-lg text-sm transition-all
                          ${gender.value === opt.value
                            ? 'bg-amber-400/20 text-amber-400 border border-amber-400/50'
                            : 'bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10'
                          }
                        `}
                      >
                        {opt.emoji} {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timbre Chips */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    音色标签
                    <span className="ml-2 text-muted-foreground/50">（最多选 {MAX_TIMBRE_CHIP_SELECTED} 个）</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {VOCAL_TIMBRES.map((timb) => {
                      const isSelected = timbres.values.includes(timb.tag);
                      const isDisabled = !isSelected && timbres.values.length >= MAX_TIMBRE_CHIP_SELECTED;
                      return (
                        <button
                          key={timb.tag}
                          onClick={() => {
                            if (isSelected) {
                              timbres.toggle(timb.tag);
                            } else if (!isDisabled) {
                              timbres.toggle(timb.tag);
                            }
                          }}
                          disabled={isDisabled}
                          className={`
                            px-3 py-1.5 rounded-lg text-sm transition-all
                            ${isSelected
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                              : isDisabled
                                ? 'bg-white/5 text-muted-foreground/30 border border-white/5 cursor-not-allowed'
                                : 'bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10'
                            }
                          `}
                        >
                          {timb.emoji} {timb.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Coming Soon: Persona + Voice Clone */}
                <div className="flex gap-3 pt-2">
                  <button
                    disabled
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-white/5 text-muted-foreground/50 border border-white/10 cursor-not-allowed"
                  >
                    🎵 我的音色库
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">Coming Soon</span>
                  </button>
                  <button
                    disabled
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-white/5 text-muted-foreground/50 border border-white/10 cursor-not-allowed"
                  >
                    🎙️ 上传我的声音
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">Coming Soon</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LCONAI (智创聚合) Version Cards (only show when LCONAI tab is active) */}
        {provider.value === 'lconai' && (
          <div className="mb-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {LCONAI_VERSIONS.map((version) => (
                <button
                  key={version.key}
                  onClick={() => lconaiVersion.toggle(version.key as typeof LCONAI_VERSIONS[number]['key'])}
                  className={`
                    relative flex-shrink-0 w-48 p-4 rounded-xl transition-all text-left
                    ${lconaiVersion.value === version.key
                      ? SELECTION_STYLES.selected
                      : SELECTION_STYLES.unselected
                    }
                  `}
                >
                  {/* Badge */}
                  {version.badge && (
                    <span className={`
                      absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold
                      bg-purple-500/20 text-purple-300 border border-purple-500/30
                    `}>
                      {version.badge}
                    </span>
                  )}
                  
                  {/* Version Name */}
                  <h3 className={`text-sm font-bold mb-1 ${lconaiVersion.value === version.key ? 'text-amber-400' : 'text-foreground'}`}>
                    {version.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {version.desc}
                  </p>
                  
                  {/* Credits */}
                  <span className="text-[10px] text-muted-foreground/70">
                    {version.credits}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground/60 mt-2">
              🌐 智创聚合 —— Suno V3.5/V4/V5 全系列，独立通道，与 PuYue Suno 互不影响
            </p>
          </div>
        )}

        {/* MiniMax Version Cards (only show when MiniMax tab is active) */}
        {provider.value === 'minimax' && (
          <div className="mb-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {MINIMAX_VERSIONS.map((version) => (
                <button
                  key={version.key}
                  onClick={() => miniMaxModel.toggle(version.key as 'music-2.0' | 'music-2.5')}
                  className={`
                    relative flex-shrink-0 w-64 p-4 rounded-xl transition-all text-left
                    ${miniMaxModel.value === version.key
                      ? 'border-2 border-amber-400 bg-amber-400/5 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                      : 'border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }
                  `}
                >
                  {/* Badge */}
                  {version.badge && (
                    <span className={`
                      absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold
                      bg-gradient-to-r from-amber-400 to-orange-500 text-black
                    `}>
                      {version.badge}
                    </span>
                  )}
                  
                  {/* Version Name */}
                  <h3 className={`text-sm font-bold mb-1 ${miniMaxModel.value === version.key ? 'text-amber-400' : 'text-foreground'}`}>
                    {version.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {version.desc}
                  </p>
                  
                  {/* Credits */}
                  <span className="text-[10px] text-muted-foreground/70">
                    {version.credits}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hint when no provider selected */}
        {!provider.value && (
          <div className="mb-6 text-center py-8 glass-card rounded-xl">
            <p className="text-lg text-muted-foreground">👆 请先选择一个模型</p>
            <p className="text-sm text-muted-foreground/60 mt-2">点击上方 Provider 卡片开始创作</p>
          </div>
        )}

        {/* Three Column Layout */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${!provider.value ? 'opacity-40 pointer-events-none select-none' : ''}`}>
          {/* Left Column - Parameters */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <MusicStyleSelector
                selectedStyles={selectedStyles}
                onSelectionChange={setSelectedStyles}
              />
              <button
                onClick={() => setGenreDrawerOpen(true)}
                className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs bg-gradient-to-r from-amber-400/10 to-purple-500/10 text-amber-400 border border-amber-400/30 hover:border-amber-400/50 transition-all"
              >
                <Library className="w-3.5 h-3.5" />
                打开曲风库
                {selectedGenreIds.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-400/20 text-[10px]">
                    已选 {selectedGenreIds.length}
                  </span>
                )}
              </button>
            </div>
            <div>
              <SingerStyleSelector
                selectedSingers={selectedSingers}
                onSelectionChange={setSelectedSingers}
              />
              <button
                onClick={() => setArtistDrawerOpen(true)}
                className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs bg-gradient-to-r from-purple-500/10 to-amber-400/10 text-purple-300 border border-purple-500/30 hover:border-purple-500/50 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                打开歌手库
                {selectedArtistIds.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded bg-purple-500/20 text-[10px]">
                    已选 {selectedArtistIds.length}
                  </span>
                )}
              </button>
            </div>
            <VoiceUpload
              uploadedVoices={uploadedVoices}
              onUpload={handleVoiceUpload}
              onRemove={handleVoiceRemove}
              selectedVoice={selectedVoice}
              onSelectVoice={setSelectedVoice}
            />
          </div>

          {/* Middle Column - Creation */}
          <div className="lg:col-span-5 space-y-6">
            {/* Song Title Input */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-foreground">
                  歌曲名称
                </label>
                <span className="text-xs text-muted-foreground">
                  {songTitle.length}/20
                </span>
              </div>
              <input
                type="text"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                maxLength={20}
                placeholder="请为你的歌曲起个名字"
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            {/* Song Duration Slider */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-foreground">
                  歌曲时长
                </label>
                <span className="text-sm font-mono text-primary">
                  {Math.floor(songDuration / 60)}:{(songDuration % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <input
                type="range"
                min={240}
                max={480}
                step={30}
                value={songDuration}
                onChange={(e) => setSongDuration(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-gold"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>4:00</span>
                <span>6:00</span>
                <span>8:00</span>
              </div>
            </div>
            <DescriptionInput value={description} onChange={setDescription} />
            <LyricsEditor
              value={lyrics}
              onChange={setLyrics}
              onImportFromAI={handleLyricsFromAI}
            />
            
            {/* Lyrics Analysis Bar - shows bracket tag info */}
            {lyricsAnalysis.structureTagCount > 0 && (
              <div className="glass-card p-3 border-l-2 border-amber-400/60 bg-amber-500/5">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-amber-200/90 leading-relaxed">
                      ✅ 识别到 {lyricsAnalysis.structureTagCount} 处方括号标签，将原样保留供 AI 创作参考
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {lyricsAnalysis.bracketTags
                        .slice(0, 8)
                        .map((tag, i) => (
                          <span
                            key={i}
                            className="inline-block px-1.5 py-0.5 text-[10px] font-mono bg-amber-400/10 text-amber-300 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      {lyricsAnalysis.structureTagCount > 8 && (
                        <span className="inline-block px-1.5 py-0.5 text-[10px] text-amber-400/60">
                          +{lyricsAnalysis.structureTagCount - 8}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <DeepThinkingLyrics onLyricsGenerated={handleLyricsFromAI} />
            
            {/* Vocal Weight Sliders */}
            <VocalWeightSliders 
              value={vocalWeights || undefined}
              onChange={setVocalWeights}
            />
            
            {/* Lyrics Translation */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Languages className="w-4 h-4 text-primary" />
                  歌词翻译
                </h3>
                {showTranslation && (
                  <button
                    onClick={() => setShowTranslation(!showTranslation)}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showTranslation ? '隐藏翻译' : '显示翻译'}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTranslateLyrics('en')}
                  disabled={isTranslating || !lyrics.trim()}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <span>🇺🇸</span>}
                  翻译成英文
                </button>
                <button
                  onClick={() => handleTranslateLyrics('ja')}
                  disabled={isTranslating || !lyrics.trim()}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <span>🇯🇵</span>}
                  翻译成日文
                </button>
                <button
                  onClick={() => handleTranslateLyrics('ko')}
                  disabled={isTranslating || !lyrics.trim()}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <span>🇰🇷</span>}
                  翻译成韩文
                </button>
              </div>
              {showTranslation && translatedLyrics && (
                <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/5">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                    {translatedLyrics}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(translatedLyrics);
                      toast.success('翻译已复制');
                    }}
                    className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    复制翻译
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Result */}
          <div className="lg:col-span-4 space-y-6">
            <MusicPlayer
              audioUrl={generatedAudioUrl}
              candidates={
                provider.value === 'pule' && puleSongs.length > 0
                  ? puleSongs.filter(s => s.audio_url).map((s, i) => ({ 
                      url: s.audio_url!, 
                      label: `第 ${i + 1} 首`,
                      hqUrl: s.audio_hi_url || undefined,
                    }))
                  : provider.value === 'suno' && sunoSongs.length > 0
                    ? sunoSongs.filter(s => s.audio_url).map((s, i) => ({ url: s.audio_url!, label: `第 ${i + 1} 首` }))
                    : undefined
              }
              title={songTitle || undefined}
              provider={provider.value || undefined}
              isGenerating={isGenerating}
              generationProgress={generationProgress}
            />

            {/* PuLe Status Display */}
            {provider.value === 'pule' && pulePollingStatus !== 'idle' && (
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  {pulePollingStatus === 'polling' && (
                    <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                  )}
                  {pulePollingStatus === 'succeeded' && (
                    <span className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                    </span>
                  )}
                  {pulePollingStatus === 'failed' && (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {pulePollingStatus === 'polling' && '生成中'}
                    {pulePollingStatus === 'succeeded' && '生成完成'}
                    {pulePollingStatus === 'failed' && '生成失败'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {pulePollingMessage}
                </p>
                
                {/* Song status list */}
                {puleSongs.length > 0 && (
                  <div className="space-y-2">
                    {puleSongs.map((song) => (
                      <div key={song.item_id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <span className="text-xs text-muted-foreground font-mono">
                          {song.item_id.slice(0, 8)}...
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          song.status === 'succeeded' ? 'bg-green-500/20 text-green-400' :
                          song.status === 'main_succeeded' ? 'bg-amber-500/20 text-amber-400' :
                          song.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {song.status === 'succeeded' ? '高清完成' :
                           song.status === 'main_succeeded' ? '流式可用' :
                           song.status === 'running' ? '生成中' :
                           '失败'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Suno Status Display */}
            {provider.value === 'suno' && sunoPollingStatus !== 'idle' && (
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  {sunoPollingStatus === 'polling' && (
                    <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                  )}
                  {sunoPollingStatus === 'succeeded' && (
                    <span className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                    </span>
                  )}
                  {sunoPollingStatus === 'failed' && (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {sunoPollingStatus === 'polling' && '生成中'}
                    {sunoPollingStatus === 'succeeded' && '生成完成'}
                    {sunoPollingStatus === 'failed' && '生成失败'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {sunoPollingMessage}
                </p>
                
                {/* Song status cards */}
                {sunoSongs.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sunoSongs.map((song, idx) => (
                      <div key={song.id || idx} className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground truncate">
                            {song.title || `歌曲 ${idx + 1}`}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            song.status === 'succeeded' ? 'bg-green-500/20 text-green-400' :
                            song.status === 'processing' ? 'bg-amber-500/20 text-amber-400' :
                            song.status === 'pending' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {song.status === 'succeeded' ? '完成' :
                             song.status === 'processing' ? '处理中' :
                             song.status === 'pending' ? '等待中' :
                             '失败'}
                          </span>
                        </div>
                        {song.audio_url && (
                          <audio 
                            key={song.audio_url}
                            controls 
                            className="w-full h-8"
                            src={song.audio_url}
                          />
                        )}
                        {song.duration && (
                          <p className="text-xs text-muted-foreground mt-1">
                            时长: {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !provider.value}
              className="w-full py-6 text-lg font-semibold gradient-gold-purple hover:opacity-90 glow-gold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  生成音乐
                </>
              )}
            </Button>

            {/* Tips */}
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold mb-2">💡 创作提示</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 选择 2-3 个风格可以创造独特的融合效果</li>
                <li>• 描述词越详细，生成效果越精准</li>
                <li>• 使用 AI 深度思考功能创作高质量歌词</li>
                <li>• 上传音色可以克隆特定的声音特质</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Genre Library Drawer */}
      <GenreLibraryDrawer
        open={genreDrawerOpen}
        onClose={() => setGenreDrawerOpen(false)}
        selectedGenreIds={selectedGenreIds}
        onSelectionChange={setSelectedGenreIds}
        description={description}
        artistIds={selectedArtistIds}
      />

      {/* Artist Library Drawer */}
      <ArtistLibraryDrawer
        open={artistDrawerOpen}
        onClose={() => setArtistDrawerOpen(false)}
        selectedArtistIds={selectedArtistIds}
        onSelectionChange={setSelectedArtistIds}
      />
    </div>
  );
}
