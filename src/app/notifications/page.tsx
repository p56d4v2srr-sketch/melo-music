'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/lib/auth-context';
import { Heart, MessageCircle, UserPlus, AtSign, Bell, Check, CheckCheck } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  from_user_id: string;
  song_id?: string;
  comment_id?: string;
  content?: string;
  is_read: boolean;
  created_at: string;
  from_user?: {
    id: string;
    nickname: string;
    avatar: string;
  };
  song?: {
    id: string;
    title: string;
    cover_url: string;
  };
}

const notificationTypes = [
  { value: 'all', label: '全部' },
  { value: 'like', label: '点赞', icon: Heart },
  { value: 'comment', label: '评论', icon: MessageCircle },
  { value: 'follow', label: '关注', icon: UserPlus },
  { value: 'mention', label: '@提及', icon: AtSign },
];

export default function NotificationsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const typeParam = filter !== 'all' ? `&type=${filter}` : '';
        const res = await fetch(`/api/notifications${typeParam}`, {
          headers: { 'x-user-id': user.id }
        });
        const data = await res.json();
        if (data.success) {
          setNotifications(data.data.notifications || []);
          setUnreadCount(data.data.unreadCount || 0);
        }
      } catch (error) {
        console.error('Fetch notifications error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user, filter]);

  const handleMarkAllRead = async () => {
    if (!user) return;
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({ markAllRead: true })
      });
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Mark all read error:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case 'comment': return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow': return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'mention': return <AtSign className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return `赞了你的作品${notification.song ? `「${notification.song.title}」` : ''}`;
      case 'comment':
        return notification.content || '评论了你的作品';
      case 'follow':
        return '关注了你';
      case 'mention':
        return `在评论中@了你`;
      default:
        return notification.content || '';
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">请先登录查看通知</p>
            <Link href="/login" className="text-primary hover:underline">
              去登录
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">通知</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">{unreadCount} 条未读</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              全部已读
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {notificationTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                filter === type.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10'
              )}
            >
              {type.icon && <type.icon className="w-4 h-4" />}
              {type.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Notifications List */}
        {!loading && (
          <div className="space-y-2">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={cn(
                  'flex items-start gap-4 p-4 rounded-xl transition-colors',
                  notification.is_read ? 'bg-card' : 'bg-primary/5 border border-primary/20'
                )}
              >
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <Link href={`/artist/${notification.from_user_id}`} className="flex-shrink-0">
                      <img
                        src={notification.from_user?.avatar || '/default-avatar.png'}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground">
                        <Link href={`/artist/${notification.from_user_id}`} className="font-medium hover:text-primary">
                          {notification.from_user?.nickname || '未知用户'}
                        </Link>
                        {' '}{getNotificationText(notification)}
                      </p>
                      {notification.song && (
                        <Link
                          href={`/song/${notification.song.id}`}
                          className="inline-flex items-center gap-2 mt-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <img
                            src={notification.song.cover_url}
                            alt={notification.song.title}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <span className="text-sm text-muted-foreground truncate">
                            {notification.song.title}
                          </span>
                        </Link>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Read indicator */}
                {!notification.is_read && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                )}
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">暂无通知</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
