import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// POST /api/interactions/collect - 收藏/取消收藏
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

    // Check if already collected
    const { data: existing, error: checkError } = await client
      .from('collects')
      .select('id')
      .eq('song_id', songId)
      .eq('user_id', userId)
      .maybeSingle();
    if (checkError) throw new Error(`查询失败: ${checkError.message}`);

    if (existing) {
      // Uncollect
      const { error: deleteError } = await client
        .from('collects')
        .delete()
        .eq('song_id', songId)
        .eq('user_id', userId);
      if (deleteError) throw new Error(`取消收藏失败: ${deleteError.message}`);

      return NextResponse.json({ success: true, data: { collected: false } });
    } else {
      // Collect
      const { error: insertError } = await client
        .from('collects')
        .insert({ song_id: songId, user_id: userId });
      if (insertError) throw new Error(`收藏失败: ${insertError.message}`);

      return NextResponse.json({ success: true, data: { collected: true } });
    }
  } catch (error) {
    console.error('收藏操作失败:', error);
    return NextResponse.json(
      { success: false, error: '收藏操作失败' },
      { status: 500 }
    );
  }
}

// GET /api/interactions/collect - 检查是否已收藏
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
      .from('collects')
      .select('id')
      .eq('song_id', songId)
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new Error(`查询失败: ${error.message}`);

    return NextResponse.json({
      success: true,
      data: { collected: !!data },
    });
  } catch (error) {
    console.error('查询收藏状态失败:', error);
    return NextResponse.json(
      { success: false, error: '查询收藏状态失败' },
      { status: 500 }
    );
  }
}
