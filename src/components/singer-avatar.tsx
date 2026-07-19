'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface SingerAvatarProps {
  name: string;
  imageUrl?: string;
  size?: number;
  isSelected?: boolean;
  gender?: 'male' | 'female' | 'unknown';
}

// Generate gradient based on name
function getGradient(name: string, gender?: 'male' | 'female' | 'unknown'): string {
  // Male singers: blue-purple tones
  // Female singers: pink-gold tones
  // Unknown: mixed gradient
  const gradients = {
    male: [
      'from-blue-500 to-purple-600',
      'from-indigo-500 to-blue-600',
      'from-purple-500 to-indigo-600',
      'from-cyan-500 to-blue-600',
    ],
    female: [
      'from-pink-500 to-rose-500',
      'from-amber-400 to-pink-500',
      'from-rose-400 to-fuchsia-500',
      'from-yellow-400 to-orange-500',
    ],
    unknown: [
      'from-violet-500 to-fuchsia-500',
      'from-purple-500 to-pink-500',
      'from-indigo-500 to-purple-500',
      'from-blue-500 to-violet-500',
    ],
  };

  const genderKey = gender || 'unknown';
  const options = gradients[genderKey];
  const index = name.charCodeAt(0) % options.length;
  return options[index];
}

// Get initials from name
function getInitials(name: string): string {
  // For Chinese names, use first character
  if (/[\u4e00-\u9fa5]/.test(name)) {
    return name.charAt(0);
  }
  // For English names, use first letter of each word (max 2)
  const words = name.split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

export function SingerAvatar({ 
  name, 
  imageUrl, 
  size = 48, 
  isSelected = false,
  gender 
}: SingerAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = imageUrl && !imageError;
  const gradient = getGradient(name, gender);
  const initials = getInitials(name);

  return (
    <motion.div
      className={`
        relative rounded-full overflow-hidden flex-shrink-0
        ${isSelected ? 'ring-2 ring-[#D4A843] ring-offset-2 ring-offset-[#0a0a0f]' : ''}
      `}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={isSelected ? { scale: 1.05 } : { scale: 1 }}
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <span className="text-white font-bold" style={{ fontSize: size * 0.4 }}>
            {initials}
          </span>
        </div>
      )}

      {/* Selected glow effect */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: '0 0 20px rgba(212, 168, 67, 0.5)',
          }}
          animate={{
            boxShadow: [
              '0 0 10px rgba(212, 168, 67, 0.3)',
              '0 0 20px rgba(212, 168, 67, 0.5)',
              '0 0 10px rgba(212, 168, 67, 0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  );
}

// Singer card with avatar and name
interface SingerCardProps {
  name: string;
  nameEn?: string;
  imageUrl?: string;
  isSelected?: boolean;
  onClick?: () => void;
  gender?: 'male' | 'female' | 'unknown';
  tags?: string[];
}

export function SingerCard({ 
  name, 
  nameEn, 
  imageUrl, 
  isSelected = false, 
  onClick,
  gender,
  tags = []
}: SingerCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        flex flex-col items-center gap-2 p-3 rounded-xl
        transition-all duration-200
        ${isSelected 
          ? 'bg-gradient-to-br from-[#D4A843]/20 to-[#7B61FF]/20' 
          : 'bg-white/5 hover:bg-white/10'}
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <SingerAvatar
        name={name}
        imageUrl={imageUrl}
        size={48}
        isSelected={isSelected}
        gender={gender}
      />
      
      <div className="text-center">
        <div className={`text-sm font-medium truncate max-w-[80px] ${isSelected ? 'text-[#D4A843]' : 'text-white'}`}>
          {name}
        </div>
        {nameEn && (
          <div className="text-xs text-white/40 truncate max-w-[80px]">
            {nameEn}
          </div>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center">
          {tags.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 text-[10px] rounded-full bg-white/10 text-white/60"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.button>
  );
}
