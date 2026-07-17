import { NextRequest, NextResponse } from 'next/server';
import { deepseekChat, ANALYZE_SYSTEM_PROMPT, type DeepSeekError } from '@/lib/deepseek';

/**
 * 歌词深度分析 API
 * 使用 DeepSeek 对歌词做多维度评价打分
 * 无 API Key 或调用失败时返回演示数据
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lyric, title } = body;

    if (!lyric || typeof lyric !== 'string') {
      return NextResponse.json({
        error: {
          code: 'invalid_request',
          message: '缺少歌词内容',
        },
      }, { status: 400 });
    }

    // 演示模式：无 DeepSeek API Key 时返回演示数据
    if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY.trim() === '') {
      return NextResponse.json({
        analysis: generateDemoAnalysis(),
        is_demo: true,
      });
    }

    // 调用 DeepSeek API 分析歌词
    try {
      const userPrompt = buildUserPrompt(lyric, title);
      
      const response = await deepseekChat({
        messages: [
          { role: 'system', content: ANALYZE_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.6,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      });

      const rawContent = response.choices[0]?.message?.content?.trim() || '';
      
      if (!rawContent) {
        throw new Error('DeepSeek 返回空内容');
      }

      // 解析 JSON 响应
      let analysis: LyricAnalysis;
      try {
        analysis = JSON.parse(rawContent);
      } catch {
        // 尝试提取 JSON（可能被 markdown 包裹）
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('无法解析 DeepSeek 返回的 JSON');
        }
      }

      // 验证必要字段
      if (!analysis.scores || typeof analysis.scores !== 'object') {
        throw new Error('分析结果缺少评分字段');
      }

      return NextResponse.json({
        analysis,
        is_demo: false,
        model: 'deepseek-chat',
        usage: response.usage,
      });
    } catch (error) {
      // DeepSeek 调用失败，记录日志并返回演示数据兜底
      const err = error as DeepSeekError;
      console.error('DeepSeek lyrics analysis failed:', {
        code: err.code,
        message: err.message,
      });

      // 返回演示数据兜底
      return NextResponse.json({
        analysis: generateDemoAnalysis(),
        is_demo: true,
        error: {
          code: err.code || 'unknown',
          message: err.message || 'DeepSeek 调用失败，已切换到演示数据',
        },
      });
    }
  } catch (error) {
    console.error('Lyrics analysis error:', error);
    
    // 最终兜底：返回演示数据
    return NextResponse.json({
      analysis: generateDemoAnalysis(),
      is_demo: true,
      error: {
        code: 'unknown',
        message: '歌词分析失败，已切换到演示数据',
      },
    });
  }
}

/**
 * 歌词分析结果类型
 */
interface LyricAnalysis {
  theme: string;
  emotion_arc: string;
  imagery_highlights: string[];
  rhyme_evaluation: string;
  scores: {
    theme: number;
    emotion: number;
    imagery: number;
    rhyme: number;
    overall: number;
  };
  one_line_verdict: string;
}

/**
 * 构建用户 Prompt
 */
function buildUserPrompt(lyric: string, title?: string): string {
  return `歌曲标题：${title || '未命名'}

歌词内容：
${lyric}

请分析并输出 JSON。`;
}

/**
 * 生成演示分析数据
 */
function generateDemoAnalysis(): LyricAnalysis {
  return {
    theme: '这首歌词以音乐为主题，探讨了音乐对心灵的治愈力量。通过飞翔、穿越时空等意象，表达了音乐能够超越现实束缚、带来精神自由的核心理念。歌词从个人的情感体验出发，最终升华到对音乐永恒力量的赞美。',
    emotion_arc: '情感走向从开篇的温柔回忆（Verse 1）逐渐升温，到副歌部分达到情感高潮，展现出对自由的渴望。第二段 Verse 转入细腻的情感表达，Bridge 部分营造出静谧永恒的氛围，最后 Outro 以哲思收尾，情感从热烈回归深沉。',
    imagery_highlights: [
      '音符如河流般流淌',
      '穿越时空的界限',
      '星空闪烁的永恒瞬间',
    ],
    rhyme_evaluation: '韵脚设计较为规整，主要采用"ang/an"韵，如"酿、伸、映、心"形成呼应。副歌部分"翔、限、案、放"押韵流畅，增强了可唱性。整体节奏感良好，适合流行曲风的演绎。',
    scores: {
      theme: 78,
      emotion: 82,
      imagery: 75,
      rhyme: 72,
      overall: 76,
    },
    one_line_verdict: '一首充满正能量的抒情佳作，旋律感强，副歌记忆点突出，适合流行曲风演绎。',
  };
}
