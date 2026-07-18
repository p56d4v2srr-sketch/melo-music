/**
 * PuLe 音乐生成提交接口
 * POST /api/pule-generate
 * 
 * 入参：
 * - prompt: string (1-2000) 必填
 * - lyrics?: string 可选
 * - instrumental?: boolean 可选
 * - model?: string 可选，默认 "TemPolor v4.6"（注意大小写和空格）
 * 
 * 返回：
 * - ok: true
 * - provider: "pule"
 * - item_ids: string[]
 * - lyricsSanitize: { removedCount, removedSamples }
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generatePule, hasPuleKey } from '@/lib/pule';
import { sanitizeLyrics } from '@/lib/lyrics-sanitizer';

// Zod schema for request validation
const generateSchema = z.object({
  prompt: z.string().min(1, 'prompt 不能为空').max(2000, 'prompt 最多 2000 字符'),
  lyrics: z.string().max(5000).optional(),
  instrumental: z.boolean().optional().default(false),
  model: z.string().optional().default('TemPolor v4.6'),  // 注意：大小写和空格敏感
});

export async function POST(request: NextRequest) {
  try {
    // 检查 API Key
    if (!hasPuleKey()) {
      return NextResponse.json(
        { ok: false, code: 'CONFIG_ERROR', message: 'PuLe API Key 未配置' },
        { status: 500 }
      );
    }

    // 解析并校验请求体
    const body = await request.json();
    const parseResult = generateSchema.safeParse(body);
    
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return NextResponse.json(
        { ok: false, code: 'VALIDATION_ERROR', message: errors },
        { status: 400 }
      );
    }

    const { prompt, lyrics, instrumental, model } = parseResult.data;

    // 歌词净化
    let sanitizedLyrics = lyrics || '';
    let removedCount = 0;
    let removedSamples: string[] = [];

    if (lyrics) {
      const sanitizeResult = sanitizeLyrics(lyrics);
      sanitizedLyrics = sanitizeResult.sanitized;
      removedCount = sanitizeResult.removedCount;
      removedSamples = sanitizeResult.removedSamples;
      
      console.log('[pule-generate] Lyrics sanitized:', {
        original_length: lyrics.length,
        sanitized_length: sanitizedLyrics.length,
        removedCount,
      });
    }

    // 兜底检查
    if (instrumental) {
      // instrumental 模式下，如果歌词净化后为空，不传 lyrics
      if (sanitizedLyrics.trim() === '') {
        sanitizedLyrics = '';
        console.log('[pule-generate] Instrumental mode with empty lyrics, proceeding without lyrics');
      }
    } else {
      // 非 instrumental 模式，歌词不能为空
      if (sanitizedLyrics.trim() === '') {
        return NextResponse.json(
          { ok: false, code: 'EMPTY_LYRICS', message: '歌词净化后为空，请提供有效歌词或选择纯音乐模式' },
          { status: 400 }
        );
      }
    }

    // 调用 PuLe API
    const result = await generatePule({
      prompt,
      model,
      lyrics: instrumental ? undefined : sanitizedLyrics,
      instrumental,
    });

    return NextResponse.json({
      ok: true,
      provider: 'pule',
      item_ids: result.item_ids,
      lyricsSanitize: {
        removedCount,
        removedSamples,
      },
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[pule-generate] Error:', error.message);

    // 根据错误类型返回不同的状态码
    let statusCode = 500;
    let code = 'INTERNAL_ERROR';
    
    if (error.message.includes('余额不足')) {
      statusCode = 402;
      code = 'INSUFFICIENT_BALANCE';
    } else if (error.message.includes('认证失败')) {
      statusCode = 401;
      code = 'AUTH_ERROR';
    } else if (error.message.includes('超时')) {
      statusCode = 504;
      code = 'TIMEOUT';
    }

    return NextResponse.json(
      { ok: false, code, message: error.message },
      { status: statusCode }
    );
  }
}
