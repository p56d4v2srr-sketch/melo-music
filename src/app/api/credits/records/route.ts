import { NextResponse } from 'next/server';
import { getCreditRecords } from '@/lib/credits';

/**
 * GET /api/credits/records
 * 获取积分记录
 */
export async function GET() {
  try {
    const records = getCreditRecords();

    return NextResponse.json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error('[Credits API] Records error:', error);
    return NextResponse.json(
      { success: false, error: '获取记录失败' },
      { status: 500 }
    );
  }
}
