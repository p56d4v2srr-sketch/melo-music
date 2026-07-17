import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { PlayerProvider } from '@/components/global-player';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Melo Music - 让每个人都能玩音乐',
  description:
    '一站式 AI 音乐创作与发现平台，用自然语言 + 精细控件生成专业质感音乐作品。支持 130+ 音乐风格、深度思考歌词创作、AI MV 生成、虚拟音乐人。',
  keywords: [
    'AI 音乐',
    '音乐生成',
    'AI 作曲',
    '歌词创作',
    'AI MV',
    '虚拟音乐人',
    'Melo Music',
    'Suno',
    'DeepSeek',
  ],
  authors: [{ name: 'Melo Music Team' }],
  openGraph: {
    title: 'Melo Music - 让每个人都能玩音乐',
    description: '用自然语言生成专业质感音乐作品，AI MV 一键生成',
    type: 'website',
    locale: 'zh_CN',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN" className="dark">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        <PlayerProvider>
          {children}
        </PlayerProvider>
        <Toaster />
      </body>
    </html>
  );
}
