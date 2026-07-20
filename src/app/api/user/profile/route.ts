import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

/**
 * GET /api/user/profile
 * 获取用户资料
 */
export async function GET(request: NextRequest) {
  try {
    const authUserId = request.headers.get('x-auth-user-id');
    if (!authUserId) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      );
    }

    const client = getSupabaseClient();
    if (!client) {
      return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 503 });
    }
    const { data, error } = await client
      .from('user_profiles')
      .select('*')
      .eq('auth_user_id', authUserId)
      .maybeSingle();

    if (error) throw new Error(`查询失败: ${error.message}`);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[User Profile API] Error:', error);
    return NextResponse.json(
      { success: false, error: '获取用户资料失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/profile
 * 创建或更新用户资料
 */
export async function POST(request: NextRequest) {
  try {
    const authUserId = request.headers.get('x-auth-user-id');
    if (!authUserId) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const client = getSupabaseClient();
    if (!client) {
      return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 503 });
    }

    // Check if profile exists
    const { data: existing } = await client
      .from('user_profiles')
      .select('id')
      .eq('auth_user_id', authUserId)
      .maybeSingle();

    let result;
    if (existing) {
      // Update existing profile
      const { data, error } = await client
        .from('user_profiles')
        .update({
          ...body,
          updated_at: new Date().toISOString(),
        })
        .eq('auth_user_id', authUserId)
        .select()
        .single();

      if (error) throw new Error(`更新失败: ${error.message}`);
      result = data;
    } else {
      // Create new profile
      const { data, error } = await client
        .from('user_profiles')
        .insert({
          auth_user_id: authUserId,
          ...body,
        })
        .select()
        .single();

      if (error) throw new Error(`创建失败: ${error.message}`);
      result = data;
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[User Profile API] Error:', error);
    return NextResponse.json(
      { success: false, error: '保存用户资料失败' },
      { status: 500 }
    );
  }
}
