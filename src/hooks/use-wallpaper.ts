'use client';

import { useState, useEffect, useCallback } from 'react';
import { WALLPAPER_SINGERS, getRandomPhoto, type SingerWallpaper } from '@/lib/wallpaper-singers';

interface UseWallpaperOptions {
  selectedSinger?: SingerWallpaper | null;
  vocalGender?: 'male' | 'female' | null;
  intervalMs?: number; // 默认 60 分钟
}

interface UseWallpaperReturn {
  currentPhoto: { url: string; singerId: string } | null;
  fade: boolean;
  refresh: () => void;
}

const DEFAULT_INTERVAL = 60 * 60 * 1000; // 60 分钟
const FADE_DURATION = 1500; // 1.5 秒淡入淡出

export function useWallpaper(options: UseWallpaperOptions = {}): UseWallpaperReturn {
  const { selectedSinger, vocalGender, intervalMs = DEFAULT_INTERVAL } = options;
  
  const [currentPhoto, setCurrentPhoto] = useState<{ url: string; singerId: string } | null>(null);
  const [previousPhoto, setPreviousPhoto] = useState<string | null>(null);
  const [fade, setFade] = useState(false);
  const [lastPhotoUrl, setLastPhotoUrl] = useState<string | null>(null);

  // 选择下一张背景图
  const pickNextPhoto = useCallback(() => {
    // 如果已选定歌手，优先使用该歌手的写真
    if (selectedSinger) {
      const singerPhotos = WALLPAPER_SINGERS.find(s => s.id === selectedSinger.id);
      if (singerPhotos && singerPhotos.photos.length > 0) {
        const photos = singerPhotos.photos.filter(p => p !== lastPhotoUrl);
        if (photos.length > 0) {
          const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
          return { url: randomPhoto, singerId: selectedSinger.id };
        }
      }
    }

    // 根据人声性别选择
    const gender = vocalGender || undefined;
    const photo = getRandomPhoto(gender);
    
    // 避免重复
    if (photo.url === lastPhotoUrl && WALLPAPER_SINGERS.length > 1) {
      return getRandomPhoto(gender);
    }
    
    return photo;
  }, [selectedSinger, vocalGender, lastPhotoUrl]);

  // 切换背景图（带淡入淡出）
  const switchPhoto = useCallback(() => {
    const nextPhoto = pickNextPhoto();
    if (!nextPhoto) return;

    // 开始淡出
    setFade(true);
    
    setTimeout(() => {
      setPreviousPhoto(currentPhoto?.url || null);
      setCurrentPhoto(nextPhoto);
      setLastPhotoUrl(nextPhoto.url);
      
      // 淡入新图片
      setTimeout(() => {
        setFade(false);
      }, 50);
    }, FADE_DURATION);
  }, [pickNextPhoto, currentPhoto]);

  // 初始化和定时轮换
  useEffect(() => {
    // 初始化：随机选一张
    const initialPhoto = pickNextPhoto();
    setCurrentPhoto(initialPhoto);
    setLastPhotoUrl(initialPhoto.url);

    // 定时轮换
    const timer = setInterval(() => {
      switchPhoto();
    }, intervalMs);

    return () => clearInterval(timer);
  }, []); // 只在挂载时执行一次

  // 当选中歌手变化时，立即切换
  useEffect(() => {
    if (selectedSinger) {
      switchPhoto();
    }
  }, [selectedSinger?.id]);

  return {
    currentPhoto,
    fade,
    refresh: switchPhoto,
  };
}
