import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getAuthenticatedUser, getAuthenticatedUserFromHeader, debugCookies } from '@/lib/server-auth';

// POST /api/songs/publish - 发布歌曲到发现页
export async function POST(request: NextRequest) {
  try {
    // Debug: Log all cookies
    const allCookies = await debugCookies();
    console.log('[Publish] Cookies:', allCookies.map(c => c.name));
    
    const body = await request.json();
    const { title, audioUrl, coverUrl, tags, lyrics, duration, mood } = body;

    if (!title || !audioUrl) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数（title, audioUrl）' },
        { status: 400 }
      );
    }

    // Try to get user from Authorization header first, then from cookie
    const authHeader = request.headers.get('authorization');
    console.log('[Publish] Auth header present:', !!authHeader);
    
    let userId: string | null = null;
    
    if (authHeader) {
      console.log('[Publish] Trying header auth...');
      const { user, error } = await getAuthenticatedUserFromHeader(authHeader);
      if (error || !user) {
        console.log('[Publish] Header auth failed:', error);
        return NextResponse.json(
          { success: false, error: error || '未登录' },
          { status: 401 }
        );
      }
      console.log('[Publish] Header auth success, user:', user.id);
      userId = user.id;
    } else {
      console.log('[Publish] Trying cookie auth...');
      const { user, error } = await getAuthenticatedUser();
      if (error || !user) {
        console.log('[Publish] Cookie auth failed:', error);
        return NextResponse.json(
          { success: false, error: error || '未登录，请先登录' },
          { status: 401 }
        );
      }
      console.log('[Publish] Cookie auth success, user:', user.id);
      userId = user.id;
    }

    const client = getSupabaseClient();
    if (!client) {
      return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 503 });
    }

    const { data, error } = await client
      .from('songs')
      .insert({
        title,
        audio_url: audioUrl,
        cover_url: coverUrl || null,
        style_tags: tags || null,
        lyrics: lyrics || null,
        duration: duration || 0,
        artist_id: userId,
        is_published: true,
        is_public: true,
        mood: mood || null,
      })
      .select()
      .single();
    
    if (error) {
      console.error('[Publish] Supabase error:', error);
      throw new Error(`发布歌曲失败: ${error.message}`);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('发布歌曲失败:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '发布歌曲失败' },
      { status: 500 }
    );
  }
}
