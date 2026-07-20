import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// POST /api/interactions/comment - 发表评论
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { songId, userId, content, parentId } = body;

    if (!songId || !userId || !content) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    if (!client) {
      return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 503 });
    }

    const { data, error } = await client
      .from('comments')
      .insert({
        song_id: songId,
        user_id: userId,
        content,
        parent_id: parentId || null,
      })
      .select()
      .single();
    if (error) throw new Error(`发表评论失败: ${error.message}`);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('发表评论失败:', error);
    return NextResponse.json(
      { success: false, error: '发表评论失败' },
      { status: 500 }
    );
  }
}

// GET /api/interactions/comment - 获取评论列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const songId = searchParams.get('songId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    if (!songId) {
      return NextResponse.json(
        { success: false, error: '缺少歌曲ID' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    if (!client) {
      return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 503 });
    }

    const { data, error, count } = await client
      .from('comments')
      .select('id, content, parent_id, like_count, created_at, user_id, users!comments_user_id_users_id_fk(nickname, avatar)', { count: 'exact' })
      .eq('song_id', songId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw new Error(`获取评论失败: ${error.message}`);

    return NextResponse.json({
      success: true,
      data: {
        comments: (data || []).map((c: any) => ({
          id: c.id,
          content: c.content,
          parentId: c.parent_id,
          likeCount: c.like_count,
          createdAt: c.created_at,
          userId: c.user_id,
          userNickname: c.users?.nickname || '匿名',
          userAvatar: c.users?.avatar || null,
        })),
        total: count || 0,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('获取评论列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取评论列表失败' },
      { status: 500 }
    );
  }
}
