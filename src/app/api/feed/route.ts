import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/feed - 获取发现页信息流
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const genre = searchParams.get('genre');
    const mood = searchParams.get('mood');
    const offset = (page - 1) * limit;

    const client = getSupabaseClient();

    // Build query
    let query = client
      .from('songs')
      .select('id, title, audio_url, cover_url, duration, play_count, like_count, collect_count, comment_count, style_tags, mood, created_at, artist_id, users!songs_artist_id_users_id_fk(nickname, avatar)', { count: 'exact' })
      .eq('is_published', true)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (mood) {
      query = query.eq('mood', mood);
    }

    const { data, error, count } = await query;
    if (error) throw new Error(`查询失败: ${error.message}`);

    // Filter by genre from style_tags (jsonb)
    let songs = (data || []) as any[];
    if (genre) {
      songs = songs.filter(s => {
        const tags = s.style_tags as string[] | null;
        return tags?.includes(genre);
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        songs: songs.map(s => ({
          id: s.id,
          title: s.title,
          audioUrl: s.audio_url,
          coverUrl: s.cover_url,
          duration: s.duration,
          playCount: s.play_count,
          likeCount: s.like_count,
          collectCount: s.collect_count,
          commentCount: s.comment_count,
          tags: s.style_tags,
          mood: s.mood,
          createdAt: s.created_at,
          userId: s.artist_id,
          userNickname: s.users?.nickname || '匿名',
          userAvatar: s.users?.avatar || null,
        })),
        total: count || 0,
        page,
        limit,
        hasMore: offset + songs.length < (count || 0),
      },
    });
  } catch (error) {
    console.error('获取信息流失败:', error);
    return NextResponse.json(
      { success: false, error: '获取信息流失败' },
      { status: 500 }
    );
  }
}
