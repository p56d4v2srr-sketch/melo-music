import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // like, comment, follow, mention
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const client = getSupabaseClient();

    let query = client
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) {
      query = query.eq('type', type);
    }

    const { data: notifications, error } = await query;

    if (error) {
      console.error('Notifications error:', error);
      return NextResponse.json(
        { success: false, error: '获取通知失败' },
        { status: 500 }
      );
    }

    // Get unread count
    const { count: unreadCount } = await client
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    return NextResponse.json({
      success: true,
      data: {
        notifications: notifications || [],
        unreadCount: unreadCount || 0
      }
    });
  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json(
      { success: false, error: '获取通知失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, fromUserId, songId, commentId, content } = body;

    if (!type || !fromUserId) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        from_user_id: fromUserId,
        song_id: songId,
        comment_id: commentId,
        content,
        is_read: false
      })
      .select()
      .single();

    if (error) {
      console.error('Create notification error:', error);
      return NextResponse.json(
        { success: false, error: '创建通知失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json(
      { success: false, error: '创建通知失败' },
      { status: 500 }
    );
  }
}

// Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationIds, markAllRead } = body;

    const client = getSupabaseClient();

    if (markAllRead) {
      await client
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
    } else if (notificationIds && notificationIds.length > 0) {
      await client
        .from('notifications')
        .update({ is_read: true })
        .in('id', notificationIds)
        .eq('user_id', userId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    return NextResponse.json(
      { success: false, error: '操作失败' },
      { status: 500 }
    );
  }
}
