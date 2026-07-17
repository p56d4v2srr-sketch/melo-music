'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { mockNotifications, formatCount } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import {
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  Bell,
  Check,
  CheckCheck,
  Filter,
} from 'lucide-react';
import Link from 'next/link';

type FilterType = 'all' | 'like' | 'comment' | 'follow' | 'mention';

const filters = [
  { key: 'all' as const, label: '全部', icon: Bell },
  { key: 'like' as const, label: '点赞', icon: Heart },
  { key: 'comment' as const, label: '评论', icon: MessageCircle },
  { key: 'follow' as const, label: '新粉丝', icon: UserPlus },
  { key: 'mention' as const, label: '@提及', icon: AtSign },
];

const notificationIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  mention: AtSign,
};

const notificationColors: Record<string, string> = {
  like: 'bg-red-500/20 text-red-400',
  comment: 'bg-blue-500/20 text-blue-400',
  follow: 'bg-purple-500/20 text-purple-400',
  mention: 'bg-green-500/20 text-green-400',
};

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const filteredNotifications =
    activeFilter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === activeFilter);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient-gold mb-2">通知中心</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} 条未读通知` : '暂无未读通知'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-primary hover:bg-primary/10 transition-all"
            >
              <CheckCheck className="w-4 h-4" />
              全部已读
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const count =
              filter.key === 'all'
                ? notifications.length
                : notifications.filter((n) => n.type === filter.key).length;
            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all',
                  activeFilter === filter.key
                    ? 'gradient-gold-purple text-white glow-gold'
                    : 'glass-card text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                {filter.label}
                {count > 0 && (
                  <span className="px-1.5 py-0.5 text-xs rounded-full bg-white/20">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="glass-card p-12 rounded-xl text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">暂无通知</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = notificationIcons[notification.type] || Bell;
              const colorClass = notificationColors[notification.type] || 'bg-white/10 text-muted-foreground';

              return (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    'glass-card p-4 flex items-start gap-4 transition-all cursor-pointer hover:bg-white/10',
                    !notification.is_read && 'border-l-2 border-primary bg-primary/5'
                  )}
                >
                  {/* Icon */}
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', colorClass)}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {notification.from_user && (
                        <img
                          src={notification.from_user.avatar}
                          alt={notification.from_user.nickname}
                          className="w-5 h-5 rounded-full"
                        />
                      )}
                      <span className="text-sm font-medium text-foreground">
                        {notification.from_user?.nickname || '系统'}
                      </span>
                      {!notification.is_read && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.created_at).toLocaleDateString('zh-CN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Action */}
                  {!notification.is_read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
