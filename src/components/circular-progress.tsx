'use client';

import { motion } from 'framer-motion';
import { Music, Sparkles } from 'lucide-react';

interface CircularProgressProps {
  progress: number; // 0-100
  stage?: string;
  size?: number;
}

const STAGES = [
  { threshold: 0, label: '准备中...', icon: '🎵' },
  { threshold: 20, label: '作词...', icon: '📝' },
  { threshold: 40, label: '编曲...', icon: '🎹' },
  { threshold: 60, label: '混音...', icon: '🎚️' },
  { threshold: 80, label: '即将完成...', icon: '✨' },
];

export function CircularProgress({ progress, stage, size = 200 }: CircularProgressProps) {
  const currentStage = STAGES.filter(s => progress >= s.threshold).pop() || STAGES[0];
  const displayStage = stage || currentStage.label;
  
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212, 168, 67, 0.2) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 
              ? 'linear-gradient(135deg, #D4A843, #7B61FF)' 
              : 'linear-gradient(135deg, #7B61FF, #D4A843)',
          }}
          animate={{
            x: [0, Math.cos(i * Math.PI / 4) * 60, 0],
            y: [0, Math.sin(i * Math.PI / 4) * 60, 0],
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.25,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* SVG Circle */}
      <svg
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4A843" />
            <stop offset="100%" stopColor="#7B61FF" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="relative flex flex-col items-center justify-center z-10">
        {/* Icon */}
        <motion.div
          className="text-4xl mb-2"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {currentStage.icon}
        </motion.div>

        {/* Progress percentage */}
        <motion.span
          className="text-3xl font-bold bg-gradient-to-r from-[#D4A843] to-[#7B61FF] bg-clip-text text-transparent"
          key={Math.round(progress)}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {Math.round(progress)}%
        </motion.span>

        {/* Stage label */}
        <motion.span
          className="text-sm text-white/60 mt-1"
          key={displayStage}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {displayStage}
        </motion.span>
      </div>

      {/* Floating music notes */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={`note-${i}`}
          className="absolute text-[#D4A843]/40"
          style={{
            left: `${20 + i * 20}%`,
            top: '50%',
          }}
          animate={{
            y: [-20, -80, -20],
            opacity: [0, 1, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.75,
            ease: 'easeInOut',
          }}
        >
          <Music className="w-4 h-4" />
        </motion.div>
      ))}
    </div>
  );
}

// Generation progress overlay
interface GenerationOverlayProps {
  progress: number;
  stage?: string;
}

export function GenerationOverlay({ progress, stage }: GenerationOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2a] via-[#0a0a1a] to-[#0a1a2a]" />
      
      {/* Animated background waves */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-32 opacity-20"
            style={{
              background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? '#D4A843' : '#7B61FF'}, transparent)`,
              top: `${20 + i * 15}%`,
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <CircularProgress progress={progress} stage={stage} size={240} />
        
        <motion.div
          className="mt-8 flex items-center gap-2 text-white/60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Sparkles className="w-4 h-4 text-[#D4A843]" />
          <span className="text-sm">AI 正在为您创作音乐...</span>
          <Sparkles className="w-4 h-4 text-[#7B61FF]" />
        </motion.div>
      </div>
    </motion.div>
  );
}
