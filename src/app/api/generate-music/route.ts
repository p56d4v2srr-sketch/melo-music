import { NextRequest, NextResponse } from 'next/server';
import { hasAceDataKey } from '@/lib/acedata';
import { getMusicProvider } from '@/lib/music-provider';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { styles, singers, description, lyrics, voiceId, title, duration, language, vocal_type, mood, is_public, cover_url, cover_source, model_version = 'v5' } = body;

    // 诊断 log：确认 Key 在运行时是否可读
    console.log('[generate-music] ACEDATA_API_KEY present:', !!process.env.ACEDATA_API_KEY, 'len:', process.env.ACEDATA_API_KEY?.length ?? 0);
    console.log('[generate-music] model_version:', model_version);

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
        provider: 'demo',
        model_version, // 保留用户选择的版本
        actual_model: 'demo',
        taskId: `demo-task-${Date.now()}`,
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
        imageUrl: 'https://picsum.photos/seed/melo-demo/512/512',
        title: title || '演示歌曲',
        language: language || 'zh',
        vocal_type: vocal_type || 'female',
        mood: mood || null,
        is_public: is_public !== false,
        cover_url: cover_url || null,
        cover_source: cover_source || 'ai',
        message: `演示模式：demo 未配置，返回示例数据`,
      });
    }

    // 构建 prompt
    const prompt = buildPrompt(styles, singers, description, language, vocal_type, mood);

    // Determine if instrumental mode
    const isInstrumental = vocal_type === 'instrumental';

    // Map vocal_type to provider vocal_gender
    const vocalGender = vocal_type === 'male' ? 'male' as const : vocal_type === 'female' ? 'female' as const : 'auto' as const;

    // 调用 provider 生成音乐
    const provider = getMusicProvider();
    console.log('[generate-music] Provider selected:', provider.name, 'MUSIC_PROVIDER:', process.env.MUSIC_PROVIDER);
    const result = await provider.generate({
      prompt,
      lyric: isInstrumental ? undefined : (lyrics || undefined),
      style: styles.join(', '),
      title: title || undefined,
      model_version,
      custom_mode: !!lyrics,
      instrumental: isInstrumental || (!lyrics && !description),
      vocal_gender: vocalGender,
      duration,
    });

    // 如果生成失败
    if (result.status === 'failed') {
      const errorData = result.data as { error?: string } | undefined;
      const errorMessage = errorData?.error || '音乐生成失败';
      console.error('[generate-music] Provider error:', errorMessage);
      
      return NextResponse.json({ 
        ok: false, 
        error_type: 'provider_error', 
        message: errorMessage, 
        suggestion: '请稍后重试或检查网络连接',
        provider: result.provider,
        model_version,
      }, { status: 502 });
    }

    // 成功返回
    // 兼容两种格式：data 直接是数组，或 data 是包含 data 数组的对象
    let songsArray: Array<{ audio_url?: string; image_url?: string; duration?: number; lyric?: string; title?: string }> = [];
    
    if (Array.isArray(result.data)) {
      songsArray = result.data;
    } else if (result.data && typeof result.data === 'object') {
      const responseData = result.data as { data?: Array<{ audio_url?: string; image_url?: string; duration?: number; lyric?: string; title?: string }> };
      if (Array.isArray(responseData.data)) {
        songsArray = responseData.data;
      }
    }

    // 如果同步返回了结果
    if (songsArray.length > 0) {
      const music = songsArray[0];
      return NextResponse.json({
        taskId: result.task_id,
        provider: result.provider,
        model_version: result.model_version,
        actual_model: result.actual_model,
        warning: result.warning,
        audioUrl: music.audio_url,
        imageUrl: cover_url || music.image_url,
        duration: music.duration,
        lyric: music.lyric,
        title: music.title,
        language: language || 'zh',
        vocal_type: vocal_type || 'female',
        mood: mood || null,
        is_public: is_public !== false,
        cover_url: cover_url || music.image_url || null,
        cover_source: cover_source || 'ai',
      });
    }

    // 异步模式：返回 task_id，前端轮询
    return NextResponse.json({
      taskId: result.task_id,
      status: result.status,
      provider: result.provider,
      model_version: result.model_version,
      actual_model: result.actual_model,
      warning: result.warning,
      language: language || 'zh',
      vocal_type: vocal_type || 'female',
      mood: mood || null,
      is_public: is_public !== false,
      cover_url: cover_url || null,
      cover_source: cover_source || 'ai',
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
  description: string,
  language?: string,
  vocalType?: string,
  mood?: string
): string {
  const parts: string[] = [];

  // Add language description
  const langMap: Record<string, string> = {
    'zh': 'Chinese lyrics',
    'en': 'English lyrics',
    'ja': 'Japanese lyrics',
    'zh-en': 'Bilingual Chinese-English lyrics',
    'zh-ja': 'Bilingual Chinese-Japanese lyrics',
  };
  if (language && langMap[language]) {
    parts.push(langMap[language]);
  }

  // Add vocal type description
  const vocalMap: Record<string, string> = {
    'male': 'male vocal',
    'female': 'female vocal',
    'chorus': 'chorus vocals',
  };
  if (vocalType && vocalMap[vocalType]) {
    parts.push(vocalMap[vocalType]);
  }

  // Add mood description
  const moodMap: Record<string, string> = {
    'happy': 'happy',
    'sad': 'sad',
    'passionate': 'passionate',
    'affectionate': 'affectionate',
    'healing': 'healing',
    'mysterious': 'mysterious',
    'intense': 'intense',
    'calm': 'calm',
  };
  if (mood && moodMap[mood]) {
    parts.push(`Mood: ${moodMap[mood]}`);
  }

  // Add styles
  if (styles && styles.length > 0) {
    parts.push(`Style: ${styles.join(', ')}`);
  }

  // Add singer techniques
  if (singers && singers.length > 0) {
    parts.push(`Vocal style inspired by: ${singers.join(', ')}`);
  }

  // Add description
  if (description) {
    parts.push(description);
  }

  return parts.join('\n');
}
