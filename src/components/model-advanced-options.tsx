'use client';

import { useState } from 'react';
import { ChevronDown, Music, Mic, Tag, User, Sparkles, Upload, Lock } from 'lucide-react';

interface ModelAdvancedOptionsProps {
  provider: string;
  songName: string;
  onSongNameChange: (value: string) => void;
  lyrics: string;
  onLyricsChange: (value: string) => void;
  styleOfMusic: string;
  onStyleOfMusicChange: (value: string) => void;
  gender: string;
  onGenderChange: (value: string) => void;
  timbres: string[];
  onTimbresChange: (value: string) => void;
}

// 人声性别选项
const VOCAL_GENDERS = [
  { value: 'male', label: '男声', icon: '👨' },
  { value: 'female', label: '女声', icon: '👩' },
  { value: 'duet', label: '男女对唱', icon: '👥' },
  { value: 'instrumental', label: '纯乐器', icon: '🎹' },
];

// 音色标签（最多选3个）
const TIMBRE_TAGS = [
  { value: 'soft', label: '柔美', icon: '🌸' },
  { value: 'raspy', label: '沙哑', icon: '🔥' },
  { value: 'bright', label: '清亮', icon: '✨' },
  { value: 'deep', label: '低沉', icon: '🌑' },
  { value: 'opera', label: '戏腔', icon: '🎭' },
  { value: 'child', label: '童声', icon: '👼' },
  { value: 'ethereal', label: '空灵', icon: '🌊' },
  { value: 'magnetic', label: '磁性', icon: '🎤' },
  { value: 'lazy', label: '慵懒', icon: '💫' },
  { value: 'sweet', label: '甜美', icon: '🍬' },
  { value: 'high', label: '高亢', icon: '🔊' },
  { value: 'whisper', label: '呢喃', icon: '🕯️' },
];

// 歌词标签
const LYRICS_TAGS = [
  { tag: '[Chorus]', label: '副歌', color: 'amber' },
  { tag: '[Catchy Hook]', label: '洗脑Hook', color: 'pink' },
  { tag: '[Catchy Melody]', label: '抓耳旋律', color: 'purple' },
  { tag: '[Emotional]', label: '情感爆发', color: 'red' },
  { tag: '[Strong Beat]', label: '强节奏', color: 'blue' },
  { tag: '[Verse]', label: '主歌', color: 'green' },
  { tag: '[Bridge]', label: '桥段', color: 'cyan' },
  { tag: '[Outro]', label: '结尾', color: 'orange' },
  { tag: '[Intro]', label: '前奏', color: 'teal' },
  { tag: '[Rap]', label: '说唱', color: 'indigo' },
  { tag: '[High Note]', label: '高音', color: 'rose' },
  { tag: '[Harmony]', label: '和声', color: 'violet' },
];

// 风格标签
const STYLE_TAGS = [
  { tag: 'Acoustic', label: '原声', color: 'amber' },
  { tag: 'Ambient', label: '氛围', color: 'cyan' },
  { tag: 'Blues', label: '蓝调', color: 'blue' },
  { tag: 'Chill', label: '放松', color: 'teal' },
  { tag: 'Cinematic', label: '电影感', color: 'purple' },
  { tag: 'Country', label: '乡村', color: 'green' },
  { tag: 'Dance', label: '舞曲', color: 'pink' },
  { tag: 'Electronic', label: '电子', color: 'indigo' },
  { tag: 'Folk', label: '民谣', color: 'emerald' },
  { tag: 'Funk', label: '放克', color: 'orange' },
  { tag: 'Hip Hop', label: '嘻哈', color: 'red' },
  { tag: 'Jazz', label: '爵士', color: 'violet' },
  { tag: 'Latin', label: '拉丁', color: 'rose' },
  { tag: 'Metal', label: '金属', color: 'slate' },
  { tag: 'Pop', label: '流行', color: 'fuchsia' },
  { tag: 'R&B', label: 'R&B', color: 'sky' },
  { tag: 'Rock', label: '摇滚', color: 'red' },
  { tag: 'Soul', label: '灵魂', color: 'amber' },
  { tag: 'Reggae', label: '雷鬼', color: 'lime' },
  { tag: 'Classical', label: '古典', color: 'stone' },
];

const colorClasses: Record<string, { active: string; hover: string }> = {
  amber: { active: 'bg-amber-500/20 text-amber-300 border-amber-500/50', hover: 'hover:border-amber-500/30' },
  pink: { active: 'bg-pink-500/20 text-pink-300 border-pink-500/50', hover: 'hover:border-pink-500/30' },
  purple: { active: 'bg-purple-500/20 text-purple-300 border-purple-500/50', hover: 'hover:border-purple-500/30' },
  red: { active: 'bg-red-500/20 text-red-300 border-red-500/50', hover: 'hover:border-red-500/30' },
  blue: { active: 'bg-blue-500/20 text-blue-300 border-blue-500/50', hover: 'hover:border-blue-500/30' },
  green: { active: 'bg-green-500/20 text-green-300 border-green-500/50', hover: 'hover:border-green-500/30' },
  cyan: { active: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50', hover: 'hover:border-cyan-500/30' },
  orange: { active: 'bg-orange-500/20 text-orange-300 border-orange-500/50', hover: 'hover:border-orange-500/30' },
  teal: { active: 'bg-teal-500/20 text-teal-300 border-teal-500/50', hover: 'hover:border-teal-500/30' },
  indigo: { active: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50', hover: 'hover:border-indigo-500/30' },
  rose: { active: 'bg-rose-500/20 text-rose-300 border-rose-500/50', hover: 'hover:border-rose-500/30' },
  violet: { active: 'bg-violet-500/20 text-violet-300 border-violet-500/50', hover: 'hover:border-violet-500/30' },
  emerald: { active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50', hover: 'hover:border-emerald-500/30' },
  fuchsia: { active: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/50', hover: 'hover:border-fuchsia-500/30' },
  sky: { active: 'bg-sky-500/20 text-sky-300 border-sky-500/50', hover: 'hover:border-sky-500/30' },
  slate: { active: 'bg-slate-500/20 text-slate-300 border-slate-500/50', hover: 'hover:border-slate-500/30' },
  lime: { active: 'bg-lime-500/20 text-lime-300 border-lime-500/50', hover: 'hover:border-lime-500/30' },
  stone: { active: 'bg-stone-500/20 text-stone-300 border-stone-500/50', hover: 'hover:border-stone-500/30' },
};

export function ModelAdvancedOptions({
  provider,
  songName,
  onSongNameChange,
  lyrics,
  onLyricsChange,
  styleOfMusic,
  onStyleOfMusicChange,
  gender,
  onGenderChange,
  timbres,
  onTimbresChange,
}: ModelAdvancedOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const insertLyricsTag = (tag: string) => {
    const newLyrics = lyrics ? `${lyrics}\n${tag}` : tag;
    onLyricsChange(newLyrics);
  };

  const insertStyleTag = (tag: string) => {
    const newStyle = styleOfMusic ? `${styleOfMusic}, ${tag}` : tag;
    onStyleOfMusicChange(newStyle);
  };

  const toggleTimbre = (value: string) => {
    // 如果已选中，取消选中；如果未选中且未满3个，选中
    if (timbres.includes(value)) {
      onTimbresChange(value);
    } else if (timbres.length < 3) {
      onTimbresChange(value);
    }
  };

  const hasConfig = songName || lyrics || styleOfMusic || gender || timbres.length > 0;

  return (
    <div className="mb-6">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
      >
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
        <span>高级选项</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground/60">
          {provider.toUpperCase()}
        </span>
        {hasConfig && (
          <span className="ml-auto px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 text-[10px]">
            已配置
          </span>
        )}
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className="mt-3 space-y-5 pl-4 border-l border-white/10">
          {/* Vocal Gender - Single Select */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <User className="w-3.5 h-3.5" />
              人声性别
            </label>
            <div className="grid grid-cols-4 gap-2">
              {VOCAL_GENDERS.map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => onGenderChange(gender === value ? '' : value)}
                  className={`px-3 py-2 rounded-lg text-xs border transition-all flex items-center justify-center gap-1.5 ${
                    gender === value
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-white/5 text-muted-foreground border-white/10 hover:border-white/30'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Timbre Tags - Multi Select (max 3) */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              音色标签
              <span className="text-muted-foreground/50">（最多选 3 个）</span>
              {timbres.length > 0 && (
                <span className="ml-auto text-amber-400">{timbres.length}/3</span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {TIMBRE_TAGS.map(({ value, label, icon }) => {
                const isSelected = timbres.includes(value);
                const isDisabled = !isSelected && timbres.length >= 3;
                return (
                  <button
                    key={value}
                    onClick={() => !isDisabled && toggleTimbre(value)}
                    disabled={isDisabled}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                        : isDisabled
                        ? 'bg-white/3 text-muted-foreground/30 border-white/5 cursor-not-allowed'
                        : 'bg-white/5 text-muted-foreground border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice Library - Coming Soon */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5 opacity-60">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <Lock className="w-4 h-4 text-muted-foreground/50" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">我的音色库</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-muted-foreground/60">Coming Soon</span>
              </div>
              <p className="text-[10px] text-muted-foreground/50 mt-0.5">保存和管理您的专属音色</p>
            </div>
          </div>

          {/* Upload Voice - Coming Soon */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5 opacity-60">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <Upload className="w-4 h-4 text-muted-foreground/50" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">上传我的声音</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-muted-foreground/60">Coming Soon</span>
              </div>
              <p className="text-[10px] text-muted-foreground/50 mt-0.5">上传音频样本，克隆您的专属音色</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/5 pt-4">
            <p className="text-[10px] text-muted-foreground/40 mb-3">更多创作选项</p>
          </div>

          {/* Song Name */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <Music className="w-3.5 h-3.5" />
              歌曲名称
              <span className="text-muted-foreground/50">（Song Name）</span>
            </label>
            <input
              type="text"
              value={songName}
              onChange={(e) => onSongNameChange(e.target.value)}
              placeholder="输入歌曲名称..."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-amber-400/50 transition-colors"
            />
          </div>

          {/* Lyrics */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <Mic className="w-3.5 h-3.5" />
              歌词
              <span className="text-muted-foreground/50">（Lyrics）</span>
            </label>
            <textarea
              value={lyrics}
              onChange={(e) => onLyricsChange(e.target.value)}
              placeholder="输入歌词，支持标签如 [Chorus] [Verse]..."
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-amber-400/50 transition-colors resize-none"
            />
            {/* Lyrics Tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {LYRICS_TAGS.map(({ tag, label, color }) => (
                <button
                  key={tag}
                  onClick={() => insertLyricsTag(tag)}
                  className={`px-2 py-0.5 rounded text-[10px] border transition-all ${colorClasses[color]?.hover} ${
                    lyrics.includes(tag) ? colorClasses[color]?.active : 'bg-white/5 text-muted-foreground border-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Style of Music */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <Tag className="w-3.5 h-3.5" />
              风格描述
              <span className="text-muted-foreground/50">（Style of Music）</span>
            </label>
            <input
              type="text"
              value={styleOfMusic}
              onChange={(e) => onStyleOfMusicChange(e.target.value)}
              placeholder="描述音乐风格，如 Pop, Acoustic, Emotional..."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-amber-400/50 transition-colors"
            />
            {/* Style Tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {STYLE_TAGS.map(({ tag, label, color }) => (
                <button
                  key={tag}
                  onClick={() => insertStyleTag(tag)}
                  className={`px-2 py-0.5 rounded text-[10px] border transition-all ${colorClasses[color]?.hover} ${
                    styleOfMusic.includes(tag) ? colorClasses[color]?.active : 'bg-white/5 text-muted-foreground border-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
