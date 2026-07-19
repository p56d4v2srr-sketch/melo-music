'use client'

import { WALLPAPER_SINGERS, getRandomPhoto } from '@/lib/wallpaper-singers'
import { useState, useEffect, useCallback } from 'react'

interface SingerWallpaperProps {
  selectedSingerId?: string
  vocalGender?: 'male' | 'female'
  image?: string  // 外部传入的图片 URL（优先级最高）
  fade?: boolean  // 是否显示淡入淡出效果
}

const FADE_DURATION = 1500 // 1.5 秒淡入淡出
const ROTATE_INTERVAL = 60 * 60 * 1000 // 60 分钟

export function SingerWallpaper({ selectedSingerId, vocalGender, image: externalImage, fade: externalFade }: SingerWallpaperProps) {
  const [bgImage, setBgImage] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [lastPhotoUrl, setLastPhotoUrl] = useState<string | null>(null)

  // 如果外部传入了 image，直接使用
  const displayImage = externalImage || bgImage
  const displayFade = externalFade !== undefined ? externalFade : isTransitioning

  // 选择下一张背景图
  const pickNextPhoto = useCallback(() => {
    // 如果外部传入了 image，不需要自动选择
    if (externalImage) return

    // 如果已选定歌手，优先使用该歌手的写真
    if (selectedSingerId) {
      const singerPhotos = WALLPAPER_SINGERS.find(s => s.id === selectedSingerId)
      if (singerPhotos && singerPhotos.photos.length > 0) {
        const photos = singerPhotos.photos.filter(p => p !== lastPhotoUrl)
        if (photos.length > 0) {
          const randomPhoto = photos[Math.floor(Math.random() * photos.length)]
          return randomPhoto
        }
      }
    }

    // 根据人声性别筛选
    const availableSingers = WALLPAPER_SINGERS.filter(s => {
      if (vocalGender === 'male') return s.gender === 'male'
      if (vocalGender === 'female') return s.gender === 'female'
      return true
    })

    // 从可用歌手中随机选择一张写真
    if (availableSingers.length > 0) {
      const allPhotos = availableSingers.flatMap(s => s.photos.filter(p => p !== lastPhotoUrl))
      if (allPhotos.length > 0) {
        return allPhotos[Math.floor(Math.random() * allPhotos.length)]
      }
    }

    // 兜底：从所有歌手中随机选择
    const allPhotos = WALLPAPER_SINGERS.flatMap(s => s.photos)
    return allPhotos[Math.floor(Math.random() * allPhotos.length)]
  }, [selectedSingerId, vocalGender, lastPhotoUrl, externalImage])

  // 切换背景图（带淡入淡出）
  const transitionToNext = useCallback(() => {
    const nextPhoto = pickNextPhoto()
    if (!nextPhoto || nextPhoto === bgImage) return

    setIsTransitioning(true)
    
    // 淡出
    setTimeout(() => {
      setBgImage(nextPhoto)
      setLastPhotoUrl(nextPhoto)
      
      // 淡入
      setTimeout(() => {
        setIsTransitioning(false)
      }, 100)
    }, FADE_DURATION / 2)
  }, [pickNextPhoto, bgImage])

  // 进入页面时随机选一张
  useEffect(() => {
    if (externalImage) return  // 外部传入 image 时不自动选择
    
    const initialPhoto = pickNextPhoto()
    if (initialPhoto) {
      setBgImage(initialPhoto)
      setLastPhotoUrl(initialPhoto)
    }
  }, [pickNextPhoto, externalImage])

  // 每 60 分钟自动轮换
  useEffect(() => {
    if (externalImage) return  // 外部传入 image 时不自动轮换
    
    const timer = setInterval(() => {
      transitionToNext()
    }, ROTATE_INTERVAL)

    return () => clearInterval(timer)
  }, [transitionToNext, externalImage])

  // 当选定的歌手变化时，立即切换
  useEffect(() => {
    if (externalImage) return
    if (selectedSingerId) {
      transitionToNext()
    }
  }, [selectedSingerId, transitionToNext, externalImage])

  if (!displayImage) return null

  return (
    <div 
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      {/* 背景图 */}
      <div
        className="absolute inset-0 bg-center bg-cover transition-opacity ease-in-out"
        style={{
          backgroundImage: `url(${displayImage})`,
          opacity: displayFade ? 0 : 0.15,
          transitionDuration: `${FADE_DURATION}ms`,
        }}
      />
      
      {/* 暗色遮罩 - 确保文字清晰可读 */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(10, 10, 15, 0.85) 0%, rgba(10, 10, 15, 0.7) 50%, rgba(10, 10, 15, 0.9) 100%)',
        }}
      />
    </div>
  )
}
