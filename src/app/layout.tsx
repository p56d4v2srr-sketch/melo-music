import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: 'SonicAI - AI 音乐创作工作站',
  description:
    '一站式 AI 音乐创作工具，用自然语言 + 精细控件生成专业质感音乐作品。支持 130+ 音乐风格、深度思考歌词创作、音色克隆。',
  keywords: [
    'AI 音乐',
    '音乐生成',
    'AI 作曲',
    '歌词创作',
    '音乐工作站',
    'Suno',
    'DeepSeek',
  ],
  authors: [{ name: 'SonicAI Team' }],
  openGraph: {
    title: 'SonicAI - AI 音乐创作工作站',
    description: '用自然语言生成专业质感音乐作品',
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
        {children}
      </body>
    </html>
  );
}
