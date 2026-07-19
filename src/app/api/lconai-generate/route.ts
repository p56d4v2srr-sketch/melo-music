/**
 * 智创聚合 (LCONAI) 音乐生成接口
 * POST /api/lconai-generate
 * 
 * 入参：
 * - mode: 'prompt' | 'custom' 必填
 * - prompt?: string (prompt 模式)
 * - title?: string (custom 模式)
 * - lyrics?: string (custom 模式)
 * - tags?: string (custom 模式)
 * - instrumental?: boolean
 * - mv?: string 模型版本，默认 chirp-v5
 * 
 * 返回：
 * - ok: true
 * - provider: "lconai"
 * - task_id: string
 * - songs: LconaiSong[]（如果任务已完成）
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { submitLconaiMusic, fetchLconaiTask, LconaiApiError } from '@/lib/lconai';
import { sanitizeLyrics } from '@/lib/lyrics-sanitizer';
import { LCONAI_VERSIONS, DEFAULT_LCONAI_VERSION } from '@/lib/constants';

// Zod schema for validation
const generateSchema = z.object({
  mode: z.enum(['prompt', 'custom']),
  prompt: z.string().min(1).max(500).optional(),
  title: z.string().max(80).optional(),
  lyrics: z.string().max(5000).optional(),
  tags: z.string().max(1000).optional(),
  instrumental: z.boolean().optional(),
  mv: z.string().optional(),
  version: z.string().optional(),
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
    
    const { mode, prompt, title, lyrics, tags, instrumental, mv, version } = parsed;
    
    // Version whitelist validation
    let effectiveMv = mv || version;
    if (version) {
      const validVersion = LCONAI_VERSIONS.find(v => v.value === version);
      if (validVersion) {
        effectiveMv = version;
      } else {
        console.warn(`[lconai-generate] Invalid version '${version}', falling back to default '${DEFAULT_LCONAI_VERSION}'`);
        effectiveMv = DEFAULT_LCONAI_VERSION;
      }
    } else if (!effectiveMv) {
      effectiveMv = DEFAULT_LCONAI_VERSION;
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
    
    // 中文歌词自动识别
    let finalTags = tags || '';
    const hasChinese = /[\u4e00-\u9fa5]/.test((sanitizedLyrics || '') + (prompt || ''));
    if (hasChinese) {
      finalTags = (finalTags ? finalTags + ', ' : '') + 'mandarin vocal, chinese pronunciation';
      console.log('[lconai-generate] Chinese content detected, appended mandarin vocal tags');
    }

    // Submit to LCONAI
    const submitResult = await submitLconaiMusic({
      mode,
      prompt,
      title,
      lyrics: sanitizedLyrics,
      tags: finalTags,
      instrumental,
      mv: effectiveMv,
    });
    
    const taskId = submitResult.data;
    console.log(`[lconai-generate] Task submitted: ${taskId}`);
    
    // Poll for results (max 5 minutes, every 10 seconds)
    const maxPolls = 30;
    const pollInterval = 10000;
    let songs: Array<Record<string, unknown>> = [];
    let taskStatus = 'pending';
    
    for (let i = 0; i < maxPolls; i++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      
      try {
        const fetchResult = await fetchLconaiTask(taskId);
        const clips = fetchResult.clips || fetchResult.songs || [];
        
        // Check if all clips are complete
        const allComplete = clips.length > 0 && clips.every(
          (c) => c.status === 'complete' || c.audio_url
        );
        
        if (allComplete) {
          songs = clips as Array<Record<string, unknown>>;
          taskStatus = 'succeeded';
          break;
        }
        
        // Check for failure
        const anyFailed = clips.some(
          (c) => c.status === 'error' || c.error_message
        );
        if (anyFailed) {
          taskStatus = 'failed';
          songs = clips as Array<Record<string, unknown>>;
          break;
        }
        
        taskStatus = 'processing';
      } catch (pollError) {
        console.error(`[lconai-generate] Poll error (attempt ${i + 1}):`, pollError);
        // Continue polling on transient errors
      }
    }
    
    if (taskStatus === 'pending' || taskStatus === 'processing') {
      // Timeout - return task_id for client-side polling
      return NextResponse.json({
        ok: true,
        provider: 'lconai',
        task_id: taskId,
        status: 'processing',
        message: '任务仍在处理中，请稍后查询',
        lyricsSanitize,
      });
    }
    
    return NextResponse.json({
      ok: true,
      provider: 'lconai',
      task_id: taskId,
      status: taskStatus,
      songs,
      lyricsSanitize,
    });
  } catch (error) {
    console.error('[lconai-generate] Error:', error);
    
    if (error instanceof LconaiApiError) {
      const status = error.statusCode;
      const errorType = error.code === 'INVALID_KEY' ? 'invalid_key'
        : error.code === 'QUOTA_EXCEEDED' ? 'quota_exceeded'
        : error.code === 'TIMEOUT' ? 'timeout'
        : 'unknown';
      
      return NextResponse.json(
        { 
          ok: false, 
          code: error.code, 
          error: error.message,
          error_type: errorType,
          suggestion: error.code === 'QUOTA_EXCEEDED' 
            ? '请联系管理员充值智创聚合账户' 
            : error.code === 'INVALID_KEY'
            ? '请检查 LCONAI_API_KEY 环境变量'
            : '请稍后重试',
        },
        { status }
      );
    }
    
    return NextResponse.json(
      { ok: false, code: 'INTERNAL_ERROR', message: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/lconai-generate?task_id=xxx
 * 查询任务状态
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('task_id');
    
    if (!taskId) {
      return NextResponse.json(
        { ok: false, code: 'VALIDATION_ERROR', message: '缺少 task_id 参数' },
        { status: 400 }
      );
    }
    
    const fetchResult = await fetchLconaiTask(taskId);
    const clips = fetchResult.clips || fetchResult.songs || [];
    
    const allComplete = clips.length > 0 && clips.every(
      (c) => c.status === 'complete' || c.audio_url
    );
    const anyFailed = clips.some(
      (c) => c.status === 'error' || c.error_message
    );
    
    const status = allComplete ? 'succeeded' : anyFailed ? 'failed' : 'processing';
    
    return NextResponse.json({
      ok: true,
      provider: 'lconai',
      task_id: taskId,
      status,
      songs: clips,
    });
  } catch (error) {
    console.error('[lconai-generate] Query error:', error);
    
    if (error instanceof LconaiApiError) {
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
