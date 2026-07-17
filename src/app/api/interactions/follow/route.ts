import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { followerId, followingId, action } = body;

    if (!followerId || !followingId || !action) {
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

    return NextResponse.json({
      success: true,
      message: action === 'add' ? '关注成功' : '取消关注',
      followerId,
      followingId,
      action,
    });
  } catch (error) {
    console.error('Follow interaction error:', error);
    return NextResponse.json(
      { error: '操作失败' },
      { status: 500 }
    );
  }
}
