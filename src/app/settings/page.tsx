'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/lib/auth-context';
import { User, Mail, FileText, Save, Camera, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  avatar: string;
  bio: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const [formData, setFormData] = useState({
    nickname: '',
    avatar: '',
    bio: '',
  });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile', {
          headers: { 'x-user-id': user.id }
        });
        const data = await res.json();
        if (data.success && data.data) {
          setProfile(data.data);
          setFormData({
            nickname: data.data.nickname || '',
            avatar: data.data.avatar || '',
            bio: data.data.bio || '',
          });
        }
      } catch (error) {
        console.error('Fetch profile error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: '保存成功' });
        setProfile({ ...profile!, ...formData });
      } else {
        setMessage({ type: 'error', text: data.error || '保存失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
          <div className="text-center py-12">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">请先登录</p>
            <Link href="/login" className="text-primary hover:underline">
              去登录
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">个人设置</h1>

        {/* Message */}
        {message && (
          <div className={cn(
            'mb-6 p-4 rounded-xl',
            message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          )}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <label className="block text-sm font-medium text-foreground mb-4">
              头像
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={formData.avatar || '/default-avatar.png'}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, avatar: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="输入头像 URL"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  可以输入图片 URL 或点击头像上传
                </p>
              </div>
            </div>
          </div>

          {/* Nickname */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <label className="block text-sm font-medium text-foreground mb-2">
              <User className="w-4 h-4 inline mr-2" />
              昵称
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              placeholder="输入昵称"
              maxLength={50}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Bio */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <label className="block text-sm font-medium text-foreground mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              个人简介
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="介绍一下自己..."
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.bio.length}/500
            </p>
          </div>

          {/* Email (read-only) */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <label className="block text-sm font-medium text-foreground mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              邮箱
            </label>
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">
              邮箱不可修改
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                保存设置
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
