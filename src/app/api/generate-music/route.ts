import { NextRequest, NextResponse } from 'next/server';
import { hasAceDataKey, generateMusic, type MusicResult } from '@/lib/acedata';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { styles, singers, description, lyrics, voiceId, title, duration } = body;

    // Validate input
    if (!styles || styles.length === 0) {
      return NextResponse.json(
        { error: '请至少选择一个音乐风格' },
        { status: 400 }
      );
    }

    if (!description && !lyrics) {
      return NextResponse.json(
        { error: '请输入描述词或歌词' },
        { status: 400 }
      );
    }

    // 演示模式：无 AceData API Key 时返回演示数据
    if (!hasAceDataKey()) {
      return NextResponse.json({
        is_demo: true,
        taskId: `demo-task-${Date.now()}`,
        audioUrl: '/demo-music.mp3',
        imageUrl: '/demo-cover.jpg',
        message: '演示模式：AceData API 未配置，返回示例数据',
      });
    }

    // 构建 prompt
    const prompt = buildPrompt(styles, singers, description);

    // 调用 AceData Suno API
    const result = await generateMusic({
      prompt,
      lyric: lyrics || undefined,
      style: styles.join(', '),
      title: title || undefined,
      custom: !!lyrics,
      instrumental: !lyrics && !description,
      persona_id: voiceId || undefined,
      wait: false, // 异步模式，前端轮询
    });

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

    const taskId = result.task_id;
    const data = result.data as { task_id?: string; data?: MusicResult[] } | undefined;

    // 如果同步返回了结果（wait: true 模式）
    if (data?.data && data.data.length > 0) {
      const music = data.data[0];
      return NextResponse.json({
        taskId: taskId || data.task_id,
        audioUrl: music.audio_url,
        imageUrl: music.image_url,
        duration: music.duration,
        lyric: music.lyric,
        title: music.title,
      });
    }

    // 异步模式：返回 task_id，前端轮询
    return NextResponse.json({
      taskId: taskId,
      status: 'pending',
      message: '音乐生成任务已提交，请轮询任务状态',
    });
  } catch (error) {
    console.error('Music generation error:', error);
    return NextResponse.json(
      { error: '音乐生成失败，请稍后重试', code: 'unknown' },
      { status: 500 }
    );
  }
}

function buildPrompt(
  styles: string[],
  singers: string[],
  description: string
): string {
  const parts: string[] = [];

  // Add styles
  if (styles.length > 0) {
    parts.push(`Style: ${styles.join(', ')}`);
  }

  // Add singer techniques
  if (singers.length > 0) {
    parts.push(`Vocal style inspired by: ${singers.join(', ')}`);
  }

  // Add description
  if (description) {
    parts.push(description);
  }

  return parts.join('\n');
}
