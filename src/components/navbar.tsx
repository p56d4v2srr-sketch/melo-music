'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Music, 
  Library, 
  Compass, 
  Flame,
  User, 
  Bell, 
  Mic2, 
  Settings, 
  Search,
  LogOut,
  MoreHorizontal,
  Disc3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

// 5 core icons for top navigation
const coreNavItems = [
  { href: '/', label: '发现', icon: Compass },
  { href: '/hot', label: '热搜', icon: Flame },
  { href: '/create', label: '创作', icon: Music, isPrimary: true },
  { href: '/library', label: '作品库', icon: Disc3 },
  { href: '/studio', label: '我的', icon: User },
];

// Secondary features moved to "More" menu
const secondaryItems = [
  { href: '/search', label: '搜索', icon: Search },
  { href: '/voices', label: '音色克隆', icon: Mic2 },
  { href: '/notifications', label: '通知', icon: Bell },
  { href: '/settings', label: '设置', icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    router.push('/login');
  };

  return (
    <>
      {/* Top navigation bar - always visible */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 rounded-lg gradient-gold-purple flex items-center justify-center group-hover:scale-110 transition-transform">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gradient-gold hidden sm:inline">Melo Music</span>
            </Link>

            {/* Core Navigation - 5 icons, horizontal layout */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
              {coreNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isPrimary = item.isPrimary;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex flex-col items-center gap-0.5 sm:gap-1 transition-all duration-200 group relative px-2 sm:px-3 py-1',
                      isPrimary && 'scale-105 sm:scale-110'
                    )}
                    title={item.label}
                  >
                    <div className={cn(
                      'relative p-1.5 sm:p-2 rounded-full transition-all',
                      isActive 
                        ? 'bg-primary/20' 
                        : isPrimary 
                          ? 'bg-primary/10' 
                          : 'hover:bg-white/5'
                    )}>
                      <Icon className={cn(
                        'transition-colors',
                        isPrimary ? 'w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8' : 'w-5 h-5 sm:w-6 sm:h-6',
                        isActive || isPrimary
                          ? 'text-primary' 
                          : 'text-muted-foreground group-hover:text-foreground'
                      )} />
                      {isPrimary && (
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-gentle" />
                      )}
                    </div>
                    <span className={cn(
                      'text-[10px] sm:text-xs',
                      isActive || isPrimary ? 'text-primary font-medium' : 'text-muted-foreground'
                    )}>
                      {item.label}
                    </span>
                    {/* Active indicator dot */}
                    {isActive && (
                      <div className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side - More menu + User */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* More menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                  title="更多"
                >
                  <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                
                {showMoreMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowMoreMenu(false)} 
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 glass-card rounded-lg border border-white/10 shadow-lg z-50">
                      <div className="p-1">
                        {secondaryItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                              onClick={() => setShowMoreMenu(false)}
                            >
                              <Icon className="w-4 h-4" />
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full gradient-gold-purple flex items-center justify-center">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="hidden lg:inline text-sm max-w-[100px] truncate">
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || '用户'}
                    </span>
                  </button>
                  
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowUserMenu(false)} 
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 glass-card rounded-lg border border-white/10 shadow-lg z-50">
                        <div className="p-3 border-b border-white/10">
                          <p className="text-sm font-medium truncate">{user.email}</p>
                        </div>
                        <div className="p-1">
                          <Link
                            href="/studio"
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User className="w-4 h-4" />
                            我的空间
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings className="w-4 h-4" />
                            设置
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            退出登录
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs sm:text-sm font-medium"
                >
                  登录
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for top navigation */}
      <div className="h-14 sm:h-16" />
    </>
  );
}
