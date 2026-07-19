'use client';

import { motion } from 'framer-motion';
import { Check, Star, Clock, Sparkles } from 'lucide-react';

export interface ModelCard {
  id: string;
  name: string;
  version: string;
  quality: number; // 1-5 stars
  estimatedTime: string;
  badge?: string;
  gradient: string;
  description?: string;
}

interface ModelSelectionCardProps {
  model: ModelCard;
  isSelected: boolean;
  onClick: () => void;
}

export function ModelSelectionCard({ model, isSelected, onClick }: ModelSelectionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center p-4 rounded-xl
        transition-all duration-300 min-w-[120px]
        ${isSelected 
          ? 'bg-gradient-to-br from-[#D4A843]/20 to-[#7B61FF]/20 shadow-lg shadow-[#D4A843]/20' 
          : 'bg-white/5 hover:bg-white/10'}
        border-2
        ${isSelected 
          ? 'border-transparent' 
          : 'border-white/10 hover:border-white/20'}
      `}
      style={isSelected ? {
        borderImage: 'linear-gradient(135deg, #D4A843, #7B61FF) 1',
        borderImageSlice: 1,
      } : undefined}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Gradient border for selected state */}
      {isSelected && (
        <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-br from-[#D4A843] to-[#7B61FF] -z-10">
          <div className="absolute inset-[2px] rounded-[10px] bg-[#0a0a0f]" />
        </div>
      )}

      {/* Badge */}
      {model.badge && (
        <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-[#D4A843] to-[#7B61FF] text-white">
          {model.badge}
        </span>
      )}

      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br from-[#D4A843] to-[#7B61FF] flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
      )}

      {/* Model name */}
      <span className={`text-sm font-bold mb-1 ${isSelected ? 'text-[#D4A843]' : 'text-white'}`}>
        {model.name}
      </span>

      {/* Version */}
      <span className="text-xs text-white/50 mb-2">
        {model.version}
      </span>

      {/* Quality stars */}
      <div className="flex items-center gap-0.5 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < model.quality 
                ? 'text-[#D4A843] fill-[#D4A843]' 
                : 'text-white/20'
            }`}
          />
        ))}
      </div>

      {/* Estimated time */}
      <div className="flex items-center gap-1 text-xs text-white/40">
        <Clock className="w-3 h-3" />
        <span>{model.estimatedTime}</span>
      </div>

      {/* Sparkle effect for selected */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4A843]/10 via-transparent to-[#7B61FF]/10" />
        </motion.div>
      )}
    </motion.button>
  );
}

// Model data
export const MODEL_CARDS: ModelCard[] = [
  {
    id: 'minimax-2.0',
    name: 'MiniMax',
    version: 'v2.0',
    quality: 3,
    estimatedTime: '~30s',
    gradient: 'from-blue-500 to-cyan-500',
    description: '快速生成，适合demo',
  },
  {
    id: 'minimax-3.0',
    name: 'MiniMax',
    version: 'v3.0 / 01',
    quality: 4,
    estimatedTime: '~45s',
    gradient: 'from-blue-600 to-indigo-600',
    description: '高质量，专业级',
  },
  {
    id: 'pule',
    name: 'PuLe',
    version: 'v4.5',
    quality: 4,
    estimatedTime: '~40s',
    gradient: 'from-green-500 to-emerald-500',
    badge: '免费',
    description: '免费高质量生成',
  },
  {
    id: 'suno-3.5',
    name: 'Suno',
    version: 'v3.5',
    quality: 3,
    estimatedTime: '~60s',
    gradient: 'from-orange-500 to-red-500',
    description: '经典版本',
  },
  {
    id: 'suno-4',
    name: 'Suno',
    version: 'v4',
    quality: 4,
    estimatedTime: '~60s',
    gradient: 'from-orange-600 to-red-600',
    description: '音质提升',
  },
  {
    id: 'suno-4.5',
    name: 'Suno',
    version: 'v4.5',
    quality: 5,
    estimatedTime: '~90s',
    gradient: 'from-orange-500 to-pink-500',
    badge: '推荐',
    description: '专业级音质',
  },
  {
    id: 'suno-5',
    name: 'Suno',
    version: 'v5',
    quality: 5,
    estimatedTime: '~120s',
    gradient: 'from-purple-500 to-pink-500',
    badge: '最新',
    description: '顶级音质',
  },
  {
    id: 'lconai',
    name: '智创聚合',
    version: '多模型',
    quality: 5,
    estimatedTime: '~90s',
    gradient: 'from-violet-500 to-fuchsia-500',
    description: '聚合多平台',
  },
];
