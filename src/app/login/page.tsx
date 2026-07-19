'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Music, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSupabaseConfig } from '@/lib/supabase-config-inject';
import { getSupabaseBrowserClientWithRetry } from '@/lib/supabase-browser';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { isLoading: isConfigLoading, error: configError } = useSupabaseConfig();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('请填写邮箱和密码');
      return;
    }

    setIsLoading(true);
    try {
      const supabase = await getSupabaseBrowserClientWithRetry();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('邮箱或密码错误');
        } else {
          toast.error('登录失败', { description: error.message });
        }
        return;
      }

      if (data.session) {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  if (isConfigLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  if (configError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-red-400 mb-2">配置加载失败</p>
          <p className="text-sm text-muted-foreground">{configError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-gold-purple mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gradient-gold">Melo Music</h1>
          <p className="text-muted-foreground mt-2">登录你的音乐创作空间</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="glass-card p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">邮箱</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/20 border-white/10"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">密码</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/20 border-white/10 pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gradient-gold-purple hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                登录中...
              </>
            ) : (
              '登录'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            还没有账号？{' '}
            <Link href="/register" className="text-amber-400 hover:underline">
              去注册
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
