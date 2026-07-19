'use client';

import { useState } from 'react';
import { Sliders, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

export interface VocalWeights {
  emotion: number;      // 情感表达 0-100
  technique: number;    // 演唱技巧 0-100
  breathiness: number;  // 气息感 0-100
  power: number;        // 力量感 0-100
  vibrato: number;      // 颤音 0-100
  clarity: number;      // 音色清晰度 0-100
}

const DEFAULT_WEIGHTS: VocalWeights = {
  emotion: 70,
  technique: 50,
  breathiness: 40,
  power: 60,
  vibrato: 30,
  clarity: 75,
};

const SLIDER_CONFIG: Array<{
  key: keyof VocalWeights;
  label: string;
  icon: string;
  desc: string;
  color: string;
}> = [
  { key: 'emotion', label: '情感表达', icon: '❤️', desc: '控制演唱的情感投入程度', color: 'from-rose-500 to-pink-500' },
  { key: 'technique', label: '演唱技巧', icon: '🎤', desc: '控制演唱技巧的展现程度', color: 'from-violet-500 to-purple-500' },
  { key: 'breathiness', label: '气息感', icon: '💨', desc: '控制气声/呼吸感的强度', color: 'from-cyan-500 to-blue-500' },
  { key: 'power', label: '力量感', icon: '⚡', desc: '控制演唱的力量和爆发力', color: 'from-amber-500 to-orange-500' },
  { key: 'vibrato', label: '颤音', icon: '〰️', desc: '控制颤音的使用程度', color: 'from-emerald-500 to-teal-500' },
  { key: 'clarity', label: '音色清晰度', icon: '✨', desc: '控制音色的清澈/沙哑程度', color: 'from-sky-500 to-indigo-500' },
];

interface VocalWeightSlidersProps {
  value?: VocalWeights;
  onChange?: (weights: VocalWeights) => void;
}

export function VocalWeightSliders({ value, onChange }: VocalWeightSlidersProps) {
  const [weights, setWeights] = useState<VocalWeights>(value || DEFAULT_WEIGHTS);
  const [expanded, setExpanded] = useState(false);

  const handleChange = (key: keyof VocalWeights, newValue: number) => {
    const newWeights = { ...weights, [key]: newValue };
    setWeights(newWeights);
    onChange?.(newWeights);
  };

  const handleReset = () => {
    setWeights(DEFAULT_WEIGHTS);
    onChange?.(DEFAULT_WEIGHTS);
  };

  // Show first 3 sliders when collapsed, all 6 when expanded
  const visibleSliders = expanded ? SLIDER_CONFIG : SLIDER_CONFIG.slice(0, 3);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sliders className="w-4 h-4 text-primary" />
          演唱权重
        </h3>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          title="重置为默认值"
        >
          <RotateCcw className="w-3 h-3" />
          重置
        </button>
      </div>

      <div className="space-y-3">
        {visibleSliders.map((config) => (
          <div key={config.key} className="group">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span>{config.icon}</span>
                <span>{config.label}</span>
              </label>
              <span className="text-xs font-mono text-foreground/80 min-w-[2.5rem] text-right">
                {weights[config.key]}%
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={weights[config.key]}
                onChange={(e) => handleChange(config.key, Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer slider-gold"
                title={config.desc}
              />
              {/* Colored progress indicator */}
              <div
                className={`absolute top-0 left-0 h-1.5 rounded-full bg-gradient-to-r ${config.color} opacity-60 pointer-events-none`}
                style={{ width: `${weights[config.key]}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Expand/Collapse toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-center w-full mt-3 pt-2 border-t border-white/5 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        {expanded ? (
          <>收起 <ChevronUp className="w-3 h-3 ml-1" /></>
        ) : (
          <>更多参数 ({SLIDER_CONFIG.length - 3}) <ChevronDown className="w-3 h-3 ml-1" /></>
        )}
      </button>
    </div>
  );
}

/** Convert VocalWeights to a prompt-friendly string */
export function weightsToPrompt(weights: VocalWeights): string {
  const parts: string[] = [];
  if (weights.emotion > 70) parts.push('情感丰富');
  if (weights.emotion < 30) parts.push('情感克制');
  if (weights.technique > 70) parts.push('技巧华丽');
  if (weights.breathiness > 60) parts.push('气声明显');
  if (weights.power > 70) parts.push('充满力量');
  if (weights.power < 30) parts.push('轻柔细腻');
  if (weights.vibrato > 60) parts.push('颤音丰富');
  if (weights.clarity > 70) parts.push('音色清澈');
  if (weights.clarity < 30) parts.push('音色沙哑');
  return parts.join('，');
}
