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

export default function RegisterPage() {
  const router = useRouter();
  const { isLoading: isConfigLoading, error: configError } = useSupabaseConfig();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error('请填写所有字段');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('两次密码不一致');
      return;
    }

    if (password.length < 6) {
      toast.error('密码至少需要 6 个字符');
      return;
    }

    setIsLoading(true);
    try {
      const supabase = await getSupabaseBrowserClientWithRetry();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('该邮箱已注册');
        } else {
          toast.error('注册失败', { description: error.message });
        }
        return;
      }

      if (data.session) {
        // Auto-confirm enabled, logged in directly
        router.push('/');
        router.refresh();
      } else {
        toast.success('注册成功', { description: '请登录你的账号' });
        router.push('/login');
      }
    } catch (err) {
      console.error('Register error:', err);
      toast.error('注册失败，请稍后重试');
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
          <p className="text-muted-foreground mt-2">创建你的音乐创作空间</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="glass-card p-6 space-y-4">
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
                placeholder="至少 6 个字符"
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

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">确认密码</label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="再次输入密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-black/20 border-white/10"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full gradient-gold-purple hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                注册中...
              </>
            ) : (
              '注册'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            已有账号？{' '}
            <Link href="/login" className="text-amber-400 hover:underline">
              去登录
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
