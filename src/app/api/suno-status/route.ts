import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { querySunoSongs, SunoApiError } from '@/lib/suno';

// Zod schema for validation
const statusSchema = z.object({
  song_ids: z.array(z.string()).min(1).max(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate with zod
    let parsed;
    try {
      parsed = statusSchema.parse(body);
    } catch (zodError) {
      if (zodError instanceof z.ZodError) {
        const errors = zodError.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return NextResponse.json(
          { ok: false, code: 'VALIDATION_ERROR', message: `参数校验失败: ${errors}` },
          { status: 400 }
        );
      }
      throw zodError;
    }
    
    const { song_ids } = parsed;
    
    // Query Suno API
    const songs = await querySunoSongs(song_ids);
    
    return NextResponse.json({
      ok: true,
      songs,
    });
  } catch (error) {
    console.error('[suno-status] Error:', error);
    
    if (error instanceof SunoApiError) {
      return NextResponse.json(
        { ok: false, code: error.code, message: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { ok: false, code: 'INTERNAL_ERROR', message: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}
