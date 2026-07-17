import { NextRequest } from 'next/server';
import { hasAceDataKey, generateLyrics } from '@/lib/acedata';

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const body = await request.json();
        const { theme, structure, language, rhymeScheme, description } = body;

        // 演示模式：无 AceData API Key 时返回演示数据
        if (!hasAceDataKey()) {
          const demoLyrics = generateDemoLyrics(theme, structure);
          
          // Simulate streaming
          const steps = [
            { step: '主题解构', content: `分析主题"${theme}"的核心情感和意象` },
            { step: '意象搜集', content: '收集与主题相关的意象和场景' },
            { step: '段落结构', content: `采用${structure}结构安排歌词` },
            { step: '韵脚规划', content: `使用${rhymeScheme}韵脚方案` },
            { step: '逐段创作', content: '开始创作歌词内容' },
            { step: '通篇润色', content: '优化歌词的流畅度和表现力' },
          ];

          for (const step of steps) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'step', ...step })}\n\n`)
            );
            await new Promise((resolve) => setTimeout(resolve, 500));
          }

          // Stream lyrics character by character
          for (const char of demoLyrics) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'lyrics', content: char })}\n\n`)
            );
            await new Promise((resolve) => setTimeout(resolve, 20));
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'done', is_demo: true })}\n\n`)
          );
          controller.close();
          return;
        }

        // 尝试调用 AceData 歌词生成 API
        let acedataLyricsFailed = false;
        let acedataLyrics = '';

        try {
          const prompt = description || theme || '一首关于生活的歌曲';
          const result = await generateLyrics(prompt);

          if (result.success && result.data?.lyric) {
            acedataLyrics = result.data.lyric;
            
            // 流式输出 AceData 返回的歌词
            const steps = [
              { step: '主题解构', content: `分析主题"${theme}"的核心情感和意象` },
              { step: '意象搜集', content: '收集与主题相关的意象和场景' },
              { step: '段落结构', content: `采用${structure}结构安排歌词` },
            ];

            for (const step of steps) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'step', ...step })}\n\n`)
              );
              await new Promise((resolve) => setTimeout(resolve, 300));
            }

            // Stream lyrics character by character
            for (const char of acedataLyrics) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'lyrics', content: char })}\n\n`)
              );
              await new Promise((resolve) => setTimeout(resolve, 15));
            }

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
            );
            controller.close();
            return;
          } else {
            acedataLyricsFailed = true;
          }
        } catch {
          acedataLyricsFailed = true;
        }

        // TODO: DeepSeek fallback - 当 AceData 歌词 API 失败时，使用 DeepSeek
        // if (process.env.DEEPSEEK_API_KEY && acedataLyricsFailed) {
        //   // 调用 DeepSeek API 生成歌词
        // }

        // 最终兜底：使用演示数据
        if (acedataLyricsFailed) {
          const demoLyrics = generateDemoLyrics(theme, structure);
          
          const steps = [
            { step: '主题解构', content: `分析主题"${theme}"的核心情感和意象` },
            { step: '意象搜集', content: '收集与主题相关的意象和场景' },
            { step: '段落结构', content: `采用${structure}结构安排歌词` },
            { step: '韵脚规划', content: `使用${rhymeScheme}韵脚方案` },
            { step: '逐段创作', content: '开始创作歌词内容' },
            { step: '通篇润色', content: '优化歌词的流畅度和表现力' },
          ];

          for (const step of steps) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'step', ...step })}\n\n`)
            );
            await new Promise((resolve) => setTimeout(resolve, 500));
          }

          for (const char of demoLyrics) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'lyrics', content: char })}\n\n`)
            );
            await new Promise((resolve) => setTimeout(resolve, 20));
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'done', is_demo: true })}\n\n`)
          );
          controller.close();
          return;
        }

        // 调用 DeepSeek API with streaming (保留原有逻辑)
        const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
        if (!deepseekApiKey) {
          throw new Error('No API key available');
        }

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${deepseekApiKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-reasoner',
            messages: [
              {
                role: 'system',
                content: '你是一位专业的歌词创作人，擅长用深度思考的方式创作富有情感和意境的歌词。',
              },
              {
                role: 'user',
                content: buildLyricsPrompt(theme, structure, language, rhymeScheme),
              },
            ],
            stream: true,
          }),
        });

        if (!response.ok) {
          throw new Error(`DeepSeek API error: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('无法读取响应流');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
                );
                controller.close();
                return;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || '';
                
                if (content) {
                  // Check if it's a thinking step
                  if (content.includes('【') && content.includes('】')) {
                    const stepMatch = content.match(/【(.+?)】(.+)/);
                    if (stepMatch) {
                      controller.enqueue(
                        encoder.encode(
                          `data: ${JSON.stringify({
                            type: 'step',
                            step: stepMatch[1],
                            content: stepMatch[2],
                          })}\n\n`
                        )
                      );
                    }
                  } else {
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ type: 'lyrics', content })}\n\n`
                      )
                    );
                  }
                }
              } catch {
                // Ignore parse errors
              }
            }
          }
        }

        controller.close();
      } catch (error) {
        console.error('Lyrics generation error:', error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'error', message: '歌词生成失败' })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

function buildLyricsPrompt(
  theme: string,
  structure: string,
  language: string,
  rhymeScheme: string
): string {
  const structureMap: Record<string, string> = {
    'verse-chorus': '主歌-副歌结构（Verse 1, Chorus, Verse 2, Chorus）',
    'verse-chorus-bridge': '主歌-副歌-桥段结构（Verse 1, Chorus, Verse 2, Bridge, Chorus）',
    'aab': 'AAB结构（A段, A段, B段）',
    'free': '自由结构',
  };

  const languageMap: Record<string, string> = {
    chinese: '中文',
    english: '英文',
    mixed: '中英混合',
  };

  return `请为一首关于"${theme}"的歌曲创作歌词。

要求：
- 结构：${structureMap[structure] || structure}
- 语言：${languageMap[language] || language}
- 韵脚：${rhymeScheme}

请用深度思考的方式，按照以下步骤创作：
【主题解构】分析主题的核心情感和意象
【意象搜集】收集相关的意象和场景
【段落结构】规划歌曲结构
【韵脚规划】设计韵脚方案
【逐段创作】开始创作歌词
【通篇润色】优化歌词

请直接输出歌词内容，使用结构标签如 [Verse 1]、[Chorus] 等。`;
}

function generateDemoLyrics(theme: string, structure: string): string {
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

[Outro]
当最后一个音符落下
我们知道，这只是一个开始
音乐的力量，永远不会消失`;
}
