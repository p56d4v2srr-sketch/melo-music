import { NextRequest, NextResponse } from 'next/server';
import { hasAceDataKey, getTaskStatus, type TaskStatus } from '@/lib/acedata';

// 简单的内存缓存，缓存最近 5 分钟的任务结果
const taskCache = new Map<string, { data: TaskStatus; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟

function getCachedTask(taskId: string): TaskStatus | null {
  const cached = taskCache.get(taskId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  taskCache.delete(taskId);
  return null;
}

function setCachedTask(taskId: string, data: TaskStatus): void {
  taskCache.set(taskId, { data, timestamp: Date.now() });
  
  // 清理过期缓存
  const now = Date.now();
  for (const [key, value] of taskCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      taskCache.delete(key);
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ task_id: string }> }
) {
  try {
    const { task_id } = await params;
    const type = request.nextUrl.searchParams.get('type') || 'music';

    if (!task_id) {
      return NextResponse.json(
        { error: '缺少任务 ID' },
        { status: 400 }
      );
    }

    // 演示模式：无 AceData API Key 时返回演示数据
    if (!hasAceDataKey()) {
      return NextResponse.json({
        success: true,
        is_demo: true,
        data: {
          status: 'complete',
          progress: 100,
          data: {
            audio_url: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
            image_url: 'https://picsum.photos/seed/melo-demo/512/512',
            duration: 180,
            title: '演示歌曲',
          },
        },
        message: '任务完成（演示模式）',
      });
    }

    // 检查缓存
    const cached = getCachedTask(task_id);
    if (cached) {
      return NextResponse.json({
        success: true,
        cached: true,
        data: cached,
      });
    }

    // 调用 AceData 任务状态查询 API
    const result = await getTaskStatus(task_id, type as 'music' | 'mv');

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

    const taskData = result.data!;

    // 缓存结果（只缓存已完成或失败的任务）
    if (taskData.status === 'complete' || taskData.status === 'failed') {
      setCachedTask(task_id, taskData);
    }

    return NextResponse.json({
      success: true,
      data: taskData,
    });
  } catch (error) {
    console.error('Task status error:', error);
    return NextResponse.json(
      { error: '查询任务状态失败', code: 'unknown' },
      { status: 500 }
    );
  }
}
