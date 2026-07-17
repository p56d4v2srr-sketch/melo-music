import { NextRequest, NextResponse } from 'next/server';
import { hasAceDataKey, cloneVoice } from '@/lib/acedata';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { audioId, name } = body;

    if (!audioId) {
      return NextResponse.json(
        { error: '缺少音频 ID' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: '缺少音色名称' },
        { status: 400 }
      );
    }

    // 演示模式：无 AceData API Key 时返回演示数据
    if (!hasAceDataKey()) {
      return NextResponse.json({
        success: true,
        is_demo: true,
        persona_id: `persona-demo-${Date.now()}`,
        name,
        audioId,
        message: '音色克隆成功（演示模式）',
      });
    }

    // 调用 AceData 音色克隆 API
    const result = await cloneVoice(audioId, name);

    if (!result.success) {
      const error = result.error!;
      // 根据错误类型返回不同的 HTTP 状态
      if (error.code === 'invalid_key') {
        return NextResponse.json({ error: error.message, code: error.code }, { status: 401 });
      }
      if (error.code === 'insufficient_balance') {
        return NextResponse.json({ error: error.message, code: error.code }, { status: 402 });
      }
      if (error.code === 'rate_limit') {
        return NextResponse.json({ error: error.message, code: error.code }, { status: 429 });
      }
      return NextResponse.json({ error: error.message, code: error.code }, { status: 502 });
    }

    const data = result.data as { persona_id?: string } | undefined;
    const personaId = data?.persona_id;

    if (!personaId) {
      return NextResponse.json(
        { error: '音色克隆失败，未返回 persona_id', code: 'unknown' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      persona_id: personaId,
      name,
      audioId,
      message: '音色克隆成功',
    });
  } catch (error) {
    console.error('Voice cloning error:', error);
    return NextResponse.json(
      { error: '音色克隆失败，请稍后重试', code: 'unknown' },
      { status: 500 }
    );
  }
}
