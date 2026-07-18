import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateSuno, SunoApiError } from '@/lib/suno';
import { sanitizeLyrics } from '@/lib/lyrics-sanitizer';

// Zod schema for validation
const generateSchema = z.object({
  mode: z.enum(['prompt', 'custom']),
  prompt: z.string().min(1).max(500).optional(),
  title: z.string().max(80).optional(),
  lyrics: z.string().max(5000).optional(),
  tags: z.string().max(1000).optional(),
  instrumental: z.boolean().optional(),
  model: z.string().optional(),
  negative_tags: z.string().max(1000).optional(),
  vocal_gender: z.enum(['male', 'female']).optional(),
  style_weight: z.number().min(0).max(1).optional(),
  weirdness_constraint: z.number().min(0).max(1).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate with zod
    let parsed;
    try {
      parsed = generateSchema.parse(body);
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
    
    const { mode, prompt, title, lyrics, tags, instrumental, model, negative_tags, vocal_gender, style_weight, weirdness_constraint } = parsed;
    
    // Mode-specific validation
    if (mode === 'prompt' && !prompt?.trim()) {
      return NextResponse.json(
        { ok: false, code: 'VALIDATION_ERROR', message: 'prompt 模式必须提供 prompt 参数' },
        { status: 400 }
      );
    }
    
    if (mode === 'custom' && !tags?.trim()) {
      return NextResponse.json(
        { ok: false, code: 'VALIDATION_ERROR', message: 'custom 模式必须提供 tags 参数（风格标签）' },
        { status: 400 }
      );
    }
    
    // 歌词净化（custom 模式）
    let lyricsSanitize = undefined;
    if (mode === 'custom' && lyrics?.trim()) {
      const sanitizeResult = sanitizeLyrics(lyrics);
      lyricsSanitize = {
        removedCount: sanitizeResult.removedCount,
        removedSamples: sanitizeResult.removedSamples,
      };
      
      // 非纯乐器模式，净化后歌词为空则报错
      if (!instrumental && !sanitizeResult.sanitized.trim()) {
        return NextResponse.json(
          { ok: false, code: 'VALIDATION_ERROR', message: '歌词净化后为空，请提供有效歌词或勾选纯乐器' },
          { status: 400 }
        );
      }
    } else if (mode === 'custom' && !instrumental && !lyrics?.trim()) {
      return NextResponse.json(
        { ok: false, code: 'VALIDATION_ERROR', message: '需要提供歌词或勾选纯乐器' },
        { status: 400 }
      );
    }
    
    // Call Suno API
    const result = await generateSuno({
      mode,
      prompt,
      title,
      lyrics,
      tags,
      instrumental,
      model,
      negative_tags,
      vocal_gender,
      style_weight,
      weirdness_constraint,
    });
    
    return NextResponse.json({
      ok: true,
      provider: 'suno',
      task_id: result.task_id,
      songs: result.songs,
      lyricsSanitize,
    });
  } catch (error) {
    console.error('[suno-generate] Error:', error);
    
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
