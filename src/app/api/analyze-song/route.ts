import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { songId, lyrics } = body;

    if (!songId) {
      return NextResponse.json(
        { error: '缺少 songId 参数' },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;

    // If no API key, return mock analysis
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        demo: true,
        analysis: {
          lyricsAnalysis: [
            {
              line: '漫步在星河之间',
              interpretation: '开篇即以宏大的宇宙意象展开，将听者带入一个超越现实的浪漫空间。星河象征着无限可能与梦想，漫步其中体现了创作者对自由的向往。',
              imagery: ['星河', '漫步', '宇宙'],
              emotion: '自由、浪漫',
              rhetoric: '夸张、意象叠加',
            },
            {
              line: '看流星划过天际线',
              interpretation: '流星作为转瞬即逝的美好象征，暗示珍惜当下的主题。天际线的意象创造了视觉上的壮美感。',
              imagery: ['流星', '天际线'],
              emotion: '惊叹、珍惜',
              rhetoric: '象征、对比',
            },
          ],
          overallAnalysis: {
            theme: '探索与自由 — 在宇宙尺度下寻找个人的位置与意义',
            structure: '采用 Verse-Chorus 经典结构，Verse 部分以叙事性意象铺陈，Chorus 部分升华情感。',
            artistry: '巧妙运用宇宙意象群构建统一的意象系统，语言简洁而富有画面感。',
            context: '创作于 AI 音乐创作蓬勃发展的 2024 年，反映了新一代音乐人对科技与艺术融合的思考。',
            highlights: [
              '"星河漫步 不问归途" — 核心主题句，简洁有力',
              '"每一步都是新的领悟" — 哲理性的升华',
              '整体意象统一，避免了碎片化',
            ],
          },
          ratings: {
            melody: 8.5,
            arrangement: 9.0,
            lyrics: 8.0,
            performance: 7.5,
            emotion: 8.8,
            overall: 8.4,
            summary: '直击人心的氛围电子，编曲制作精良，星河意象贯穿始终，副歌旋律记忆点极强。',
          },
        },
      });
    }

    // Real DeepSeek API call with streaming
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Step 1: Send thinking steps
          const steps = ['主题解构', '意象分析', '修辞手法识别', '情感维度评估', '综合评分'];
          for (const step of steps) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'step', step, content: `正在${step}...`})}\n\n`)
            );
            await new Promise((resolve) => setTimeout(resolve, 300));
          }

          // Step 2: Call DeepSeek API
          const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: 'deepseek-reasoner',
              messages: [
                {
                  role: 'system',
                  content: '你是一位专业的音乐评论家和歌词分析师。请对提供的歌词进行深度分析，包括：1. 逐句解读（意象、情感、修辞）2. 整体分析（主题、结构、艺术手法、文化语境）3. 多维度评分（旋律、编曲、歌词、演唱、情感共鸣，每项0-10分）。请以JSON格式返回分析结果。',
                },
                {
                  role: 'user',
                  content: `请分析以下歌词：\n\n${lyrics || '漫步在星河之间\n看流星划过天际线\n银河的光洒满肩\n这一刻时间都停歇\n\n星河漫步 不问归途\n每一步都是新的领悟\n星光闪烁 照亮前路\n在这宇宙 我不孤独'}`,
                },
              ],
              stream: true,
            }),
          });

          if (!response.ok) {
            throw new Error('DeepSeek API 调用失败');
          }

          const reader = response.body?.getReader();
          if (!reader) throw new Error('无法读取响应流');

          let fullContent = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

            for (const line of lines) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';
                fullContent += content;

                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'content', content })}\n\n`)
                );
              } catch {
                // Skip invalid JSON
              }
            }
          }

          // Send done signal
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'done', analysis: fullContent })}\n\n`)
          );
        } catch (error) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'error', error: '分析失败' })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Song analysis error:', error);
    return NextResponse.json(
      { error: '分析失败' },
      { status: 500 }
    );
  }
}
