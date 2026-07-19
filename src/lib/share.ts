'use client';

import { toast } from 'sonner';

export interface ShareData {
  title: string;
  text?: string;
  url: string;
  image?: string;
}

/**
 * 使用系统原生分享面板分享歌曲
 * 支持 iOS Safari 和所有主流手机浏览器
 * 桌面端降级为复制链接
 */
export async function shareSong(song: {
  id: string;
  title: string;
  coverUrl?: string;
  artistName?: string;
}): Promise<void> {
  const shareUrl = `${window.location.origin}/song/${song.id}`;
  const shareText = `🎵 我在 Melo Music 创作了一首歌：${song.title}，来听听看！`;

  await share({
    title: song.title,
    text: shareText,
    url: shareUrl,
    image: song.coverUrl,
  });
}

/**
 * 通用分享函数
 */
export async function share(data: ShareData): Promise<void> {
  const { title, text, url, image } = data;

  // 检查是否支持 Web Share API
  if (navigator.share) {
    try {
      const shareData: ShareData = {
        title,
        text: text || `来听听这首歌：${title}`,
        url,
      };

      // 注意：Web Share API Level 2 支持 files，但大多数浏览器不支持
      // 所以这里只传递基本的 title, text, url

      await navigator.share(shareData as globalThis.ShareData);
      // 分享成功，不显示 toast（用户已经完成了分享操作）
    } catch (error) {
      // 用户取消分享不显示错误
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Share failed:', error);
      // 分享失败时降级为复制链接
      await copyToClipboard(url);
    }
  } else {
    // 降级：复制链接
    await copyToClipboard(url);
  }
}

/**
 * 复制链接到剪贴板
 */
async function copyToClipboard(url: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(url);
    toast.success('链接已复制到剪贴板');
  } catch (error) {
    // 降级方案：创建临时 textarea 元素
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      toast.success('链接已复制到剪贴板');
    } catch (err) {
      toast.error('复制失败，请手动复制链接');
    }
    document.body.removeChild(textArea);
  }
}

/**
 * 检查是否支持 Web Share API
 */
export function canShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}
