import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';
export const maxDuration = 30;

const PUYUE_API_KEY = process.env.PUYUE_API_KEY || '';
const PUYUE_API_BASE = process.env.PUYUE_API_BASE || 'https://api.yourmusic.fun';

/**
 * POST /api/voice-clone/train
 * Start voice model training using 谱乐 AI API
 * Requires public audio URLs (from upload step)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const schema = z.object({
      voice_model_name: z.string().min(1).max(64),
      voice_urls: z.array(z.string().url()).min(1).max(10),
    });

    const parseResult = schema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { voice_model_name, voice_urls } = parseResult.data;

    if (!PUYUE_API_KEY) {
      return NextResponse.json(
        { error: 'PUYUE_API_KEY not configured' },
        { status: 500 }
      );
    }

    console.log('[VoiceClone] Starting training:', { voice_model_name, voice_urls_count: voice_urls.length });

    // Call 谱乐 AI voice model training API
    const response = await fetch(`${PUYUE_API_BASE}/v1/voice-models/train`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PUYUE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        voice_model_name,
        voice_urls,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[VoiceClone] Training API error:', data);
      return NextResponse.json(
        { error: 'Voice model training failed', details: data },
        { status: response.status }
      );
    }

    console.log('[VoiceClone] Training started:', data);

    return NextResponse.json({
      success: true,
      task_id: data.task_id,
      message: data.message || 'Voice model training started. This may take 30 minutes to 24 hours.',
    });
  } catch (error) {
    console.error('[VoiceClone] Train error:', error);
    return NextResponse.json(
      { error: 'Training request failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/voice-clone/train?task_id=xxx
 * Check voice model training status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const task_id = searchParams.get('task_id');

    if (!task_id) {
      return NextResponse.json(
        { error: 'task_id is required' },
        { status: 400 }
      );
    }

    if (!PUYUE_API_KEY) {
      return NextResponse.json(
        { error: 'PUYUE_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Call 谱乐 AI voice model training status API
    const response = await fetch(`${PUYUE_API_BASE}/v1/voice-models/train/${task_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PUYUE_API_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[VoiceClone] Status API error:', data);
      return NextResponse.json(
        { error: 'Failed to get training status', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error('[VoiceClone] Status error:', error);
    return NextResponse.json(
      { error: 'Status check failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
