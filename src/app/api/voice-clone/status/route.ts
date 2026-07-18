import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

const PUYUE_API_KEY = process.env.PUYUE_API_KEY || '';
const PUYUE_API_BASE = process.env.PUYUE_API_BASE || 'https://api.yourmusic.fun';

/**
 * GET /api/voice-clone/status?task_id=xxx
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
