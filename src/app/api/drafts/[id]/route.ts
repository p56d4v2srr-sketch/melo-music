import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

/**
 * GET /api/drafts/[id]
 * 获取单个草稿
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('drafts')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw new Error(`查询失败: ${error.message}`);

    if (!data) {
      return NextResponse.json(
        { success: false, error: '草稿不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[Drafts API] Get error:', error);
    return NextResponse.json(
      { success: false, error: '获取草稿失败' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/drafts/[id]
 * 更新草稿
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('drafts')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(`更新失败: ${error.message}`);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[Drafts API] Update error:', error);
    return NextResponse.json(
      { success: false, error: '更新草稿失败' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/drafts/[id]
 * 删除草稿
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const client = getSupabaseClient();
    const { error } = await client
      .from('drafts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new Error(`删除失败: ${error.message}`);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('[Drafts API] Delete error:', error);
    return NextResponse.json(
      { success: false, error: '删除草稿失败' },
      { status: 500 }
    );
  }
}
