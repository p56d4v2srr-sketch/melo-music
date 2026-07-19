'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Music,
  MessageCircle,
  Users,
  ListMusic,
  FileText,
  Bell,
  TrendingUp,
  Play,
  Heart,
  Star,
  Clock,
  Plus,
  Edit,
  Trash2,
  Loader2,
  LogIn,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatCount } from '@/lib/mock-data';

type TabType = 'dashboard' | 'messages' | 'fans' | 'playlists' | 'drafts' | 'settings';

const tabs = [
  { key: 'dashboard' as const, label: '数据仪表盘', icon: LayoutDashboard },
  { key: 'messages' as const, label: '私信中心', icon: MessageCircle },
  { key: 'fans' as const, label: '我的粉丝', icon: Users },
  { key: 'playlists' as const, label: '私人歌单', icon: ListMusic },
  { key: 'drafts' as const, label: '创作草稿', icon: FileText },
  { key: 'settings' as const, label: '订阅设置', icon: Bell },
];

interface Draft {
  id: string;
  title: string;
  description?: string;
  lyrics?: string;
  styles?: string[];
  audio_url?: string;
  cover_url?: string;
  provider?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

interface DashboardStats {
  totalPlays: number;
  totalLikes: number;
  totalCollects: number;
  totalComments: number;
  monthlyListeners: number;
}

export default function StudioPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPlays: 0,
    totalLikes: 0,
    totalCollects: 0,
    totalComments: 0,
    monthlyListeners: 0,
  });
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch drafts and stats when user is logged in
  useEffect(() => {
    if (!user) {
      setIsLoadingData(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch drafts
        const draftsRes = await fetch('/api/drafts', {
          headers: { 'x-user-id': user.id },
        });
        const draftsData = await draftsRes.json();
        if (draftsData.success) {
          setDrafts(draftsData.data);
        }

        // Fetch user stats (mock for now, can be connected to real data later)
        // In production, this would query the database for user's songs stats
        setStats({
          totalPlays: 0,
          totalLikes: 0,
          totalCollects: 0,
          totalComments: 0,
          monthlyListeners: 0,
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  // Show loading state while checking auth
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  // Show login prompt if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-20 h-20 rounded-full gradient-gold-purple flex items-center justify-center mb-6">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gradient-gold mb-2">登录你的创作空间</h1>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              登录后可以管理你的作品、查看数据、与粉丝互动
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => router.push('/login')}
                className="gradient-gold-purple hover:opacity-90"
              >
                登录
              </Button>
              <Button
                onClick={() => router.push('/register')}
                variant="outline"
                className="border-white/20 hover:bg-white/5"
              >
                注册
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">我的创作空间</h1>
          <p className="text-muted-foreground">
            欢迎回来，{user.user_metadata?.full_name || user.email?.split('@')[0] || '创作者'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="glass-card p-4 rounded-xl space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all',
                      activeTab === tab.key
                        ? 'bg-white/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-9">
            {isLoadingData ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && <DashboardTab stats={stats} />}
                {activeTab === 'messages' && <MessagesTab />}
                {activeTab === 'fans' && <FansTab />}
                {activeTab === 'playlists' && <PlaylistsTab />}
                {activeTab === 'drafts' && (
                  <DraftsTab
                    drafts={drafts}
                    userId={user.id}
                    onRefresh={() => {
                      fetch('/api/drafts', { headers: { 'x-user-id': user.id } })
                        .then(res => res.json())
                        .then(data => {
                          if (data.success) setDrafts(data.data);
                        });
                    }}
                  />
                )}
                {activeTab === 'settings' && <SettingsTab />}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardTab({ stats }: { stats: DashboardStats }) {
  const weeklyData = [
    { day: '周一', plays: 0, likes: 0 },
    { day: '周二', plays: 0, likes: 0 },
    { day: '周三', plays: 0, likes: 0 },
    { day: '周四', plays: 0, likes: 0 },
    { day: '周五', plays: 0, likes: 0 },
    { day: '周六', plays: 0, likes: 0 },
    { day: '周日', plays: 0, likes: 0 },
  ];

  const maxPlays = Math.max(...weeklyData.map((d) => d.plays), 1);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: '总播放', value: formatCount(stats.totalPlays), icon: Play, color: 'text-blue-400' },
          { label: '总点赞', value: formatCount(stats.totalLikes), icon: Heart, color: 'text-red-400' },
          { label: '总收藏', value: formatCount(stats.totalCollects), icon: Star, color: 'text-yellow-400' },
          { label: '总评论', value: formatCount(stats.totalComments), icon: MessageCircle, color: 'text-green-400' },
          { label: '月听众', value: formatCount(stats.monthlyListeners), icon: Users, color: 'text-purple-400' },
          { label: '作品数', value: '0', icon: Music, color: 'text-cyan-400' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn('w-4 h-4', stat.color)} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Weekly Chart */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          本周趋势
        </h3>
        <div className="flex items-end gap-2 h-40">
          {weeklyData.map((data) => (
            <div key={data.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full relative flex-1 flex items-end">
                <div
                  className="w-full rounded-t-lg gradient-gold-purple opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${Math.max((data.plays / maxPlays) * 100, 2)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{data.day}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center mt-4">
          发布你的第一首作品后，这里将显示播放趋势
        </p>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-bold text-foreground mb-4">快速开始</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/create"
            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
          >
            <div className="w-10 h-10 rounded-lg gradient-gold-purple flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">创作新作品</p>
              <p className="text-xs text-muted-foreground">使用 AI 生成你的音乐</p>
            </div>
          </Link>
          <Link
            href="/library"
            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <ListMusic className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">浏览作品库</p>
              <p className="text-xs text-muted-foreground">发现更多音乐灵感</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function MessagesTab() {
  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-lg font-bold text-foreground mb-4">私信中心</h3>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageCircle className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">暂无私信</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          当你收到其他用户的私信时，会显示在这里
        </p>
      </div>
    </div>
  );
}

function FansTab() {
  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-lg font-bold text-foreground mb-4">我的粉丝</h3>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">暂无粉丝</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          发布作品后，粉丝会出现在这里
        </p>
      </div>
    </div>
  );
}

function PlaylistsTab() {
  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">私人歌单</h3>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-primary hover:bg-primary/10 transition-all">
          <Plus className="w-4 h-4" />
          新建歌单
        </button>
      </div>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ListMusic className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">暂无歌单</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          创建你的第一个私人歌单
        </p>
      </div>
    </div>
  );
}

function DraftsTab({
  drafts,
  userId,
  onRefresh,
}: {
  drafts: Draft[];
  userId: string;
  onRefresh: () => void;
}) {
  const handleDelete = async (draftId: string) => {
    if (!confirm('确定要删除这个草稿吗？')) return;

    try {
      const res = await fetch(`/api/drafts/${draftId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId },
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">创作草稿</h3>
        <Link
          href="/create"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm gradient-gold-purple text-white hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          新建作品
        </Link>
      </div>

      {drafts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">暂无草稿</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            开始创作你的第一首 AI 音乐
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft) => (
            <div key={draft.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                {draft.cover_url ? (
                  <img src={draft.cover_url} alt={draft.title} className="w-full h-full rounded-lg object-cover" />
                ) : (
                  <Music className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{draft.title}</p>
                <p className="text-xs text-muted-foreground">
                  更新于 {new Date(draft.updated_at || draft.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/create?draft=${draft.id}`}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(draft.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-lg font-bold text-foreground mb-4">订阅通知设置</h3>
      <div className="space-y-4">
        {[
          { label: '新评论通知', description: '当有人评论你的作品时' },
          { label: '新粉丝通知', description: '当有人关注你时' },
          { label: '点赞通知', description: '当有人点赞你的作品时' },
          { label: '@提及通知', description: '当有人在评论中提及你时' },
          { label: '系统通知', description: '平台公告和更新' },
        ].map((setting) => (
          <div key={setting.label} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all">
            <div>
              <p className="text-sm font-medium text-foreground">{setting.label}</p>
              <p className="text-xs text-muted-foreground">{setting.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
