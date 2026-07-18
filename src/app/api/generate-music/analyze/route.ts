import { NextResponse } from 'next/server';
import { analyzeLyrics } from '@/lib/lyrics-sanitizer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/generate-music/analyze
 * 分析歌词中的方括号标签
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lyrics } = body;

    if (!lyrics || typeof lyrics !== 'string') {
      return NextResponse.json(
        { error: 'lyrics 参数缺失或类型错误' },
        { status: 400 }
      );
    }

    const analysis = analyzeLyrics(lyrics);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('[analyze] Error:', error);
    return NextResponse.json(
      { error: '分析失败', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
