import { NextRequest, NextResponse } from 'next/server';
import { refundCredits } from '@/lib/credits';

/**
 * POST /api/credits/refund
 * 退还积分（生成失败时调用）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, songId, reason } = body;

    if (!provider) {
      return NextResponse.json(
        { success: false, error: '缺少 provider 参数' },
        { status: 400 }
      );
    }

    const result = refundCredits(provider, songId, reason);

    return NextResponse.json({
      success: true,
      data: {
        balance: result.balance,
        refunded: result.refunded,
      },
    });
  } catch (error) {
    console.error('[Credits API] Refund error:', error);
    return NextResponse.json(
      { success: false, error: '退还积分失败' },
      { status: 500 }
    );
  }
}
