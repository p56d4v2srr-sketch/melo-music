import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// POST /api/interactions/follow - 关注/取消关注
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { followerId, followingId } = body;

    if (!followerId || !followingId) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    if (followerId === followingId) {
      return NextResponse.json(
        { success: false, error: '不能关注自己' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // Check if already following
    const { data: existing, error: checkError } = await client
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();
    if (checkError) throw new Error(`查询失败: ${checkError.message}`);

    if (existing) {
      // Unfollow
      const { error: deleteError } = await client
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);
      if (deleteError) throw new Error(`取消关注失败: ${deleteError.message}`);

      return NextResponse.json({ success: true, data: { followed: false } });
    } else {
      // Follow
      const { error: insertError } = await client
        .from('follows')
        .insert({ follower_id: followerId, following_id: followingId });
      if (insertError) throw new Error(`关注失败: ${insertError.message}`);

      return NextResponse.json({ success: true, data: { followed: true } });
    }
  } catch (error) {
    console.error('关注操作失败:', error);
    return NextResponse.json(
      { success: false, error: '关注操作失败' },
      { status: 500 }
    );
  }
}

// GET /api/interactions/follow - 检查是否已关注 / 获取粉丝列表 / 获取关注列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'check' | 'followers' | 'following'
    const userId = searchParams.get('userId');
    const targetId = searchParams.get('targetId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '缺少用户ID' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    if (type === 'check' && targetId) {
      const { data, error } = await client
        .from('follows')
        .select('id')
        .eq('follower_id', userId)
        .eq('following_id', targetId)
        .maybeSingle();
      if (error) throw new Error(`查询失败: ${error.message}`);

      return NextResponse.json({
        success: true,
        data: { followed: !!data },
      });
    }

    if (type === 'followers') {
      const { data, error } = await client
        .from('follows')
        .select('follower_id, users!follows_follower_id_users_id_fk(id, nickname, avatar, bio, follower_count)')
        .eq('following_id', userId);
      if (error) throw new Error(`获取粉丝列表失败: ${error.message}`);

      const followers = (data || []).map((f: any) => f.users).filter(Boolean);
      return NextResponse.json({ success: true, data: { followers } });
    }

    if (type === 'following') {
      const { data, error } = await client
        .from('follows')
        .select('following_id, users!follows_following_id_users_id_fk(id, nickname, avatar, bio, follower_count)')
        .eq('follower_id', userId);
      if (error) throw new Error(`获取关注列表失败: ${error.message}`);

      const following = (data || []).map((f: any) => f.users).filter(Boolean);
      return NextResponse.json({ success: true, data: { following } });
    }

    return NextResponse.json(
      { success: false, error: '无效的请求类型' },
      { status: 400 }
    );
  } catch (error) {
    console.error('查询关注状态失败:', error);
    return NextResponse.json(
      { success: false, error: '查询关注状态失败' },
      { status: 500 }
    );
  }
}
