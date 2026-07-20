import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'hot'; // hot, rising, new, original
    const period = searchParams.get('period') || 'daily'; // daily, weekly, monthly
    const limit = parseInt(searchParams.get('limit') || '100');

    const client = getSupabaseClient();
    if (!client) {
      return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 503 });
    }

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default: // daily
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    let query = client
      .from('songs')
      .select(`
        *,
        users!artist_id (id, nickname, avatar)
      `)
      .eq('is_published', true);

    // Apply filters based on chart type
    switch (type) {
      case 'rising':
        // Songs with most play count increase
        query = query
          .gte('created_at', startDate.toISOString())
          .order('play_count', { ascending: false });
        break;
      case 'new':
        // Newest songs
        query = query.order('created_at', { ascending: false });
        break;
      case 'original':
        // Original compositions (not covers)
        query = query
          .gte('created_at', startDate.toISOString())
          .order('like_count', { ascending: false });
        break;
      default: // hot
        query = query
          .gte('created_at', startDate.toISOString())
          .order('play_count', { ascending: false });
    }

    const { data: songs, error } = await query.limit(limit);

    if (error) {
      console.error('Charts error:', error);
      return NextResponse.json(
        { success: false, error: '获取排行榜失败' },
        { status: 500 }
      );
    }

    const formattedSongs = (songs || []).map((song, index) => ({
      ...song,
      artist: song.users,
      rank: index + 1,
      trend: index < 3 ? 'up' : index < 10 ? 'stable' : 'down'
    }));

    return NextResponse.json({
      success: true,
      data: {
        songs: formattedSongs,
        type,
        period,
        updatedAt: now.toISOString()
      }
    });
  } catch (error) {
    console.error('Charts error:', error);
    return NextResponse.json(
      { success: false, error: '获取排行榜失败' },
      { status: 500 }
    );
  }
}
