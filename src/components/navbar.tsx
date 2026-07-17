'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, Library, Mic2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: '创作', icon: Music },
  { href: '/library', label: '作品库', icon: Library },
  { href: '/voices', label: '我的音色', icon: Mic2 },
  { href: '/settings', label: '设置', icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-gold-purple flex items-center justify-center group-hover:scale-110 transition-transform">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient-gold">SonicAI</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-white/10 text-primary glow-gold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
