import { NextRequest, NextResponse } from 'next/server';
import { deepseekChat, parseLyricSections, LYRICS_SYSTEM_PROMPT, type DeepSeekError } from '@/lib/deepseek';

/**
 * 歌词生成 API
 * 主力使用 DeepSeek deepseek-chat 生成中文歌词
 * 无 API Key 或调用失败时返回演示数据
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, style, mood } = body;

    // 演示模式：无 DeepSeek API Key 时返回演示数据
    if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY.trim() === '') {
      const demoLyric = generateDemoLyrics(description || '一首关于生活的歌曲');
      const sections = parseLyricSections(demoLyric);
      
      return NextResponse.json({
        lyric: demoLyric,
        sections,
        is_demo: true,
      });
    }

    // 调用 DeepSeek API 生成歌词
    try {
      const userPrompt = buildUserPrompt(description, style, mood);
      
      const response = await deepseekChat({
        messages: [
          { role: 'system', content: LYRICS_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.9,
        max_tokens: 2048,
      });

      const rawLyric = response.choices[0]?.message?.content?.trim() || '';
      
      if (!rawLyric) {
        throw new Error('DeepSeek 返回空内容');
      }

      // 解析歌词区块
      const sections = parseLyricSections(rawLyric);

      return NextResponse.json({
        lyric: rawLyric,
        sections,
        is_demo: false,
        model: 'deepseek-chat',
        usage: response.usage,
      });
    } catch (error) {
      // DeepSeek 调用失败，记录日志并返回演示数据兜底
      const err = error as DeepSeekError;
      console.error('DeepSeek lyrics generation failed:', {
        code: err.code,
        message: err.message,
      });

      // 返回演示数据兜底
      const demoLyric = generateDemoLyrics(description || '一首关于生活的歌曲');
      const sections = parseLyricSections(demoLyric);
      
      return NextResponse.json({
        lyric: demoLyric,
        sections,
        is_demo: true,
        error: {
          code: err.code || 'unknown',
          message: err.message || 'DeepSeek 调用失败，已切换到演示数据',
        },
      });
    }
  } catch (error) {
    console.error('Lyrics generation error:', error);
    
    // 最终兜底：返回演示数据
    const demoLyric = generateDemoLyrics('一首关于生活的歌曲');
    const sections = parseLyricSections(demoLyric);
    
    return NextResponse.json({
      lyric: demoLyric,
      sections,
      is_demo: true,
      error: {
        code: 'unknown',
        message: '歌词生成失败，已切换到演示数据',
      },
    });
  }
}

/**
 * 构建用户 Prompt
 */
function buildUserPrompt(description: string, style?: string, mood?: string): string {
  return `主题描述：${description || '一首关于生活的歌曲'}
曲风：${style || '自由发挥'}
情感基调：${mood || '自由发挥'}

请创作歌词。`;
}

/**
 * 生成演示歌词
 */
function generateDemoLyrics(description: string): string {
  const theme = description || '生活';
  
  return `[Verse 1]
${theme}的故事在心中酝酿
每一个音符都是情感的延伸
时光流转，记忆如电影放映
那些珍贵的瞬间，永远铭刻在心

[Chorus]
让音乐带我们飞翔
穿越时空的界限
在这旋律中找到答案
让心灵得到解放

[Verse 2]
Words flow like a river
情感在音符中跳跃
每一个音节都是心跳
每一段旋律都是思念

[Chorus]
让音乐带我们飞翔
穿越时空的界限
在这旋律中找到答案
让心灵得到解放

[Bridge]
当世界变得安静
当星空开始闪烁
我们闭上眼睛
感受这片刻的永恒

[Outro]
当最后一个音符落下
我们知道，这只是一个开始
音乐的力量，永远不会消失`;
}
