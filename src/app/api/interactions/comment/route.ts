import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { songId, userId, content, parentId } = body;

    if (!songId || !userId || !content) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // In production, this would insert into Supabase
    return NextResponse.json({
      success: true,
      message: '评论成功',
      comment: {
        id: `comment-${Date.now()}`,
        songId,
        userId,
        content,
        parentId: parentId || null,
        likeCount: 0,
        isPinned: false,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Comment interaction error:', error);
    return NextResponse.json(
      { error: '评论失败' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const songId = searchParams.get('songId');

    if (!songId) {
      return NextResponse.json(
        { error: '缺少 songId 参数' },
        { status: 400 }
      );
    }

    // Mock comments for demo
    return NextResponse.json({
      success: true,
      comments: [
        {
          id: 'comment-1',
          songId,
          userId: 'artist-2',
          content: '太棒了！这首歌真的很有感染力 🎵',
          likeCount: 234,
          isPinned: true,
          createdAt: '2024-01-16T08:00:00Z',
          user: { nickname: '深夜调频', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop' },
        },
        {
          id: 'comment-2',
          songId,
          userId: 'artist-3',
          content: '编曲做得很精致，循环了好多遍',
          likeCount: 89,
          isPinned: false,
          createdAt: '2024-01-16T10:00:00Z',
          user: { nickname: '赛博诗人', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
        },
      ],
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: '获取评论失败' },
      { status: 500 }
    );
  }
}
