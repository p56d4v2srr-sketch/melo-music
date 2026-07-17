import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { styles, singers, description, lyrics, voiceId } = body;

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

    // Check for Suno API key
    const sunoApiKey = process.env.SUNO_API_KEY;
    
    if (!sunoApiKey) {
      // Return demo audio if no API key configured
      return NextResponse.json({
        audioUrl: '/demo-music.mp3',
        message: '演示模式：Suno API 未配置，返回示例音频',
      });
    }

    // Build prompt
    const prompt = buildPrompt(styles, singers, description, lyrics);

    // Call Suno API
    const response = await fetch('https://api.sunoapi.org/v1/music/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sunoApiKey}`,
      },
      body: JSON.stringify({
        prompt,
        lyrics: lyrics || undefined,
        voice_id: voiceId || undefined,
      }),
    });

    if (!response.ok) {
      throw new Error(`Suno API error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      audioUrl: data.audio_url,
      taskId: data.task_id,
    });
  } catch (error) {
    console.error('Music generation error:', error);
    return NextResponse.json(
      { error: '音乐生成失败，请稍后重试' },
      { status: 500 }
    );
  }
}

function buildPrompt(
  styles: string[],
  singers: string[],
  description: string,
  lyrics: string
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
