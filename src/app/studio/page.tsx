'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { mockArtists, mockSongsWithArtists, mockNotifications, formatCount } from '@/lib/mock-data';
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
} from 'lucide-react';
import Link from 'next/link';

type TabType = 'dashboard' | 'messages' | 'fans' | 'playlists' | 'drafts' | 'settings';

const tabs = [
  { key: 'dashboard' as const, label: '数据仪表盘', icon: LayoutDashboard },
  { key: 'messages' as const, label: '私信中心', icon: MessageCircle },
  { key: 'fans' as const, label: '我的粉丝', icon: Users },
  { key: 'playlists' as const, label: '私人歌单', icon: ListMusic },
  { key: 'drafts' as const, label: '创作草稿', icon: FileText },
  { key: 'settings' as const, label: '订阅设置', icon: Bell },
];

// Mock dashboard data
const dashboardStats = {
  totalPlays: 5200000,
  totalLikes: 345000,
  totalCollects: 178000,
  totalComments: 23400,
  avgListenDuration: 187,
  monthlyListeners: 234000,
};

const weeklyData = [
  { day: '周一', plays: 45000, likes: 3200 },
  { day: '周二', plays: 52000, likes: 3800 },
  { day: '周三', plays: 48000, likes: 3500 },
  { day: '周四', plays: 61000, likes: 4200 },
  { day: '周五', plays: 78000, likes: 5600 },
  { day: '周六', plays: 92000, likes: 6800 },
  { day: '周日', plays: 85000, likes: 6200 },
];

// Mock drafts
const mockDrafts = [
  { id: 'draft-1', title: '未命名作品 1', updatedAt: '2024-03-20', style: 'electronic' },
  { id: 'draft-2', title: '深夜灵感', updatedAt: '2024-03-18', style: 'lo-fi' },
  { id: 'draft-3', title: '国风实验', updatedAt: '2024-03-15', style: 'chinese-style' },
];

// Mock playlists
const mockPlaylists = [
  { id: 'pl-1', title: '我的私藏', count: 23, coverUrl: mockSongsWithArtists[0].cover_url },
  { id: 'pl-2', title: '深夜聆听', count: 15, coverUrl: mockSongsWithArtists[1].cover_url },
  { id: 'pl-3', title: '工作 BGM', count: 42, coverUrl: mockSongsWithArtists[2].cover_url },
];

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const currentUser = mockArtists[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">我的创作空间</h1>
          <p className="text-muted-foreground">管理你的作品、数据和粉丝</p>
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
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'messages' && <MessagesTab />}
            {activeTab === 'fans' && <FansTab />}
            {activeTab === 'playlists' && <PlaylistsTab />}
            {activeTab === 'drafts' && <DraftsTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardTab() {
  const maxPlays = Math.max(...weeklyData.map((d) => d.plays));

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: '总播放', value: formatCount(dashboardStats.totalPlays), icon: Play, color: 'text-blue-400' },
          { label: '总点赞', value: formatCount(dashboardStats.totalLikes), icon: Heart, color: 'text-red-400' },
          { label: '总收藏', value: formatCount(dashboardStats.totalCollects), icon: Star, color: 'text-yellow-400' },
          { label: '总评论', value: formatCount(dashboardStats.totalComments), icon: MessageCircle, color: 'text-green-400' },
          { label: '月听众', value: formatCount(dashboardStats.monthlyListeners), icon: Users, color: 'text-purple-400' },
          { label: '平均收听时长', value: `${Math.floor(dashboardStats.avgListenDuration / 60)}:${(dashboardStats.avgListenDuration % 60).toString().padStart(2, '0')}`, icon: Clock, color: 'text-cyan-400' },
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
                  style={{ height: `${(data.plays / maxPlays) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Songs */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-bold text-foreground mb-4">最近作品</h3>
        <div className="space-y-3">
          {mockSongsWithArtists.slice(0, 5).map((song) => (
            <div key={song.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <img src={song.cover_url} alt={song.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                <p className="text-xs text-muted-foreground">{formatCount(song.play_count)} 播放</p>
              </div>
              <Link href={`/song/${song.id}`} className="text-xs text-primary hover:underline">
                查看详情
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessagesTab() {
  const messages = [
    { id: 'msg-1', from: mockArtists[1], content: '你的新歌太棒了！能合作一首吗？', time: '2小时前' },
    { id: 'msg-2', from: mockArtists[2], content: '想请教一下你的编曲技巧', time: '5小时前' },
    { id: 'msg-3', from: mockArtists[4], content: '感谢你的关注！', time: '1天前' },
  ];

  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-lg font-bold text-foreground mb-4">私信中心</h3>
      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
            <img src={msg.from.avatar} alt={msg.from.nickname} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{msg.from.nickname}</span>
                <span className="text-xs text-muted-foreground">{msg.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FansTab() {
  const fans = mockArtists.slice(0, 6);

  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-lg font-bold text-foreground mb-4">我的粉丝</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {fans.map((fan) => (
          <div key={fan.id} className="flex flex-col items-center p-4 rounded-lg hover:bg-white/5 transition-all">
            <img src={fan.avatar} alt={fan.nickname} className="w-16 h-16 rounded-full mb-2" />
            <p className="text-sm font-medium text-foreground">{fan.nickname}</p>
            <p className="text-xs text-muted-foreground">{formatCount(fan.follower_count)} 粉丝</p>
          </div>
        ))}
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {mockPlaylists.map((pl) => (
          <div key={pl.id} className="glass-card p-3 rounded-xl group cursor-pointer hover:bg-white/10 transition-all">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2">
              <img src={pl.coverUrl} alt={pl.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-foreground truncate">{pl.title}</p>
            <p className="text-xs text-muted-foreground">{pl.count} 首</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DraftsTab() {
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
      <div className="space-y-3">
        {mockDrafts.map((draft) => (
          <div key={draft.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
              <Music className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{draft.title}</p>
              <p className="text-xs text-muted-foreground">更新于 {draft.updatedAt}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
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
