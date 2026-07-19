import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// POST /api/interactions/like - 点赞/取消点赞
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { songId, userId } = body;

    if (!songId || !userId) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // Check if already liked
    const { data: existing, error: checkError } = await client
      .from('likes')
      .select('id')
      .eq('song_id', songId)
      .eq('user_id', userId)
      .maybeSingle();
    if (checkError) throw new Error(`查询失败: ${checkError.message}`);

    if (existing) {
      // Unlike
      const { error: deleteError } = await client
        .from('likes')
        .delete()
        .eq('song_id', songId)
        .eq('user_id', userId);
      if (deleteError) throw new Error(`取消点赞失败: ${deleteError.message}`);

      await client
        .from('songs')
        .update({ like_count: 0 }) // Will be handled by RPC or trigger
        .eq('id', songId);

      return NextResponse.json({ success: true, data: { liked: false } });
    } else {
      // Like
      const { error: insertError } = await client
        .from('likes')
        .insert({ song_id: songId, user_id: userId });
      if (insertError) throw new Error(`点赞失败: ${insertError.message}`);

      return NextResponse.json({ success: true, data: { liked: true } });
    }
  } catch (error) {
    console.error('点赞操作失败:', error);
    return NextResponse.json(
      { success: false, error: '点赞操作失败' },
      { status: 500 }
    );
  }
}

// GET /api/interactions/like - 检查是否已点赞
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const songId = searchParams.get('songId');
    const userId = searchParams.get('userId');

    if (!songId || !userId) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('likes')
      .select('id')
      .eq('song_id', songId)
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new Error(`查询失败: ${error.message}`);

    return NextResponse.json({
      success: true,
      data: { liked: !!data },
    });
  } catch (error) {
    console.error('查询点赞状态失败:', error);
    return NextResponse.json(
      { success: false, error: '查询点赞状态失败' },
      { status: 500 }
    );
  }
}
