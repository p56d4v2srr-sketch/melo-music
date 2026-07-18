/**
 * PuLe 歌曲状态查询接口（轮询用）
 * POST /api/pule-status
 * 
 * 入参：
 * - item_ids: string[] (1-10 个)
 * 
 * 返回：
 * - ok: true
 * - songs: PuleSong[]
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { queryPuleSongs, hasPuleKey } from '@/lib/pule';

// Zod schema for request validation
const querySchema = z.object({
  item_ids: z.array(z.string().min(1)).min(1, '至少需要 1 个 item_id').max(10, '最多 10 个 item_id'),
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
    const parseResult = querySchema.safeParse(body);
    
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return NextResponse.json(
        { ok: false, code: 'VALIDATION_ERROR', message: errors },
        { status: 400 }
      );
    }

    const { item_ids } = parseResult.data;

    // 调用 PuLe 查询 API
    const result = await queryPuleSongs(item_ids);

    return NextResponse.json({
      ok: true,
      songs: result.songs,
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[pule-status] Error:', error.message);

    let statusCode = 500;
    let code = 'INTERNAL_ERROR';
    
    if (error.message.includes('认证失败')) {
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
