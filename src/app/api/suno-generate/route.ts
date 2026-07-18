import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateSuno, SunoApiError } from '@/lib/suno';
import { sanitizeLyrics } from '@/lib/lyrics-sanitizer';
import { SUNO_VERSIONS, DEFAULT_SUNO_VERSION } from '@/lib/constants';

// Zod schema for validation
const generateSchema = z.object({
  mode: z.enum(['prompt', 'custom']),
  prompt: z.string().min(1).max(500).optional(),
  title: z.string().max(80).optional(),
  lyrics: z.string().max(5000).optional(),
  tags: z.string().max(1000).optional(),
  instrumental: z.boolean().optional(),
  model: z.string().optional(),
  version: z.string().optional(),
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
    
    const { mode, prompt, title, lyrics, tags, instrumental, model, version, negative_tags, vocal_gender, style_weight, weirdness_constraint } = parsed;
    
    // Version whitelist validation
    let effectiveModel = model;
    if (version) {
      const validVersion = SUNO_VERSIONS.find(v => v.value === version);
      if (validVersion) {
        effectiveModel = version;
      } else {
        console.warn(`[suno-generate] Invalid version '${version}', falling back to default '${DEFAULT_SUNO_VERSION}'`);
        effectiveModel = DEFAULT_SUNO_VERSION;
      }
    } else if (!effectiveModel) {
      effectiveModel = DEFAULT_SUNO_VERSION;
    }
    
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
    let sanitizedLyrics = lyrics;
    if (mode === 'custom' && lyrics?.trim()) {
      const sanitizeResult = sanitizeLyrics(lyrics);
      sanitizedLyrics = sanitizeResult.cleaned;
      lyricsSanitize = {
        bracketTags: sanitizeResult.bracketTags,
        structureTagCount: sanitizeResult.structureTagCount,
        totalLines: sanitizeResult.totalLines,
      };
      
      // 非纯乐器模式，净化后歌词为空则报错
      if (!instrumental && !sanitizedLyrics.trim()) {
        return NextResponse.json(
          { ok: false, code: 'EMPTY_LYRICS', message: '歌词净化后为空，请提供有效歌词或勾选纯乐器' },
          { status: 400 }
        );
      }
    } else if (mode === 'custom' && !instrumental && !lyrics?.trim()) {
      return NextResponse.json(
        { ok: false, code: 'EMPTY_LYRICS', message: '需要提供歌词或勾选纯乐器' },
        { status: 400 }
      );
    }
    
    // 中文歌词自动识别：检测歌词或描述中是否含中文，若是则追加 mandarin vocal 标签
    let finalTags = tags || '';
    const hasChinese = /[\u4e00-\u9fa5]/.test((sanitizedLyrics || '') + (prompt || ''));
    if (hasChinese) {
      finalTags = (finalTags ? finalTags + ', ' : '') + 'mandarin vocal, chinese pronunciation, cross-cultural fusion, global music elements';
      console.log('[suno-generate] Chinese content detected, appended mandarin vocal tags');
    }

    // Call Suno API
    const result = await generateSuno({
      mode,
      prompt,
      title,
      lyrics: sanitizedLyrics,  // 使用净化后的歌词
      tags: finalTags,
      instrumental,
      model: effectiveModel,
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
