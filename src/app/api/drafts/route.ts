import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getAuthenticatedUser, getAuthenticatedUserFromHeader, debugCookies } from '@/lib/server-auth';

/**
 * GET /api/drafts
 * 获取用户草稿列表
 */
export async function GET(request: NextRequest) {
  try {
    // Debug: Log all cookies
    const allCookies = await debugCookies();
    console.log('[Drafts GET] Cookies:', allCookies.map(c => c.name));
    
    // Try to get user from Authorization header first, then from cookie
    const authHeader = request.headers.get('authorization');
    console.log('[Drafts GET] Auth header present:', !!authHeader);
    
    let userId: string | null = null;
    
    if (authHeader) {
      console.log('[Drafts GET] Trying header auth...');
      const { user, error } = await getAuthenticatedUserFromHeader(authHeader);
      if (error || !user) {
        console.log('[Drafts GET] Header auth failed:', error);
        return NextResponse.json(
          { success: false, error: error || '未登录' },
          { status: 401 }
        );
      }
      console.log('[Drafts GET] Header auth success, user:', user.id);
      userId = user.id;
    } else {
      console.log('[Drafts GET] Trying cookie auth...');
      const { user, error } = await getAuthenticatedUser();
      if (error || !user) {
        console.log('[Drafts GET] Cookie auth failed:', error);
        return NextResponse.json(
          { success: false, error: error || '未登录，请先登录' },
          { status: 401 }
        );
      }
      console.log('[Drafts GET] Cookie auth success, user:', user.id);
      userId = user.id;
    }

    const client = getSupabaseClient();
    if (!client) {
      return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 503 });
    }
    const { data, error } = await client
      .from('drafts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Drafts] Supabase error:', error);
      throw new Error(`查询失败: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error('[Drafts API] Error:', error);
    return NextResponse.json(
      { success: false, error: '获取草稿列表失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/drafts
 * 创建新草稿
 */
export async function POST(request: NextRequest) {
  try {
    // Try to get user from Authorization header first, then from cookie
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const { user, error } = await getAuthenticatedUserFromHeader(authHeader);
      if (error || !user) {
        return NextResponse.json(
          { success: false, error: error || '未登录' },
          { status: 401 }
        );
      }
      userId = user.id;
    } else {
      const { user, error } = await getAuthenticatedUser();
      if (error || !user) {
        return NextResponse.json(
          { success: false, error: error || '未登录，请先登录' },
          { status: 401 }
        );
      }
      userId = user.id;
    }

    const body = await request.json();
    const client = getSupabaseClient();
    if (!client) {
      return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 503 });
    }

    const { data, error } = await client
      .from('drafts')
      .insert({
        user_id: userId,
        title: body.title || '未命名作品',
        description: body.description,
        lyrics: body.lyrics,
        styles: body.styles,
        singers: body.singers,
        audio_url: body.audioUrl,
        cover_url: body.coverUrl,
        provider: body.provider,
        model_version: body.modelVersion,
        status: body.status || 'draft',
      })
      .select()
      .single();

    if (error) {
      console.error('[Drafts Create] Supabase error:', error);
      throw new Error(`创建失败: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[Drafts API] Create error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '创建草稿失败' },
      { status: 500 }
    );
  }
}
