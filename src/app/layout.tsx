import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { PlayerProvider } from '@/components/global-player';
import { Toaster } from '@/components/ui/sonner';
import { SupabaseConfigProvider } from '@/lib/supabase-config-inject';
import { AuthProvider } from '@/lib/auth-context';
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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Melo Music',
  },
  formatDetection: {
    telephone: false,
  },
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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0f',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body className={`antialiased`} suppressHydrationWarning>
        {isDev && <Inspector />}
        <SupabaseConfigProvider>
          <AuthProvider>
            <PlayerProvider>
              {children}
            </PlayerProvider>
          </AuthProvider>
        </SupabaseConfigProvider>
        <Toaster />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}

// Service Worker Registration Component
function ServiceWorkerRegistration() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').then(
                function(registration) {
                  console.log('[PWA] Service Worker registered with scope:', registration.scope);
                },
                function(error) {
                  console.log('[PWA] Service Worker registration failed:', error);
                }
              );
            });
          }
        `,
      }}
    />
  );
}
