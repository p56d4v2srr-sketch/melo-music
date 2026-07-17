import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { songId, userId, action } = body;

    if (!songId || !userId || !action) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    if (!['add', 'remove'].includes(action)) {
      return NextResponse.json(
        { error: '无效的操作类型' },
        { status: 400 }
      );
    }

    // In production, this would interact with Supabase
    // For demo, return success
    return NextResponse.json({
      success: true,
      message: action === 'add' ? '点赞成功' : '取消点赞',
      songId,
      userId,
      action,
    });
  } catch (error) {
    console.error('Like interaction error:', error);
    return NextResponse.json(
      { error: '操作失败' },
      { status: 500 }
    );
  }
}
