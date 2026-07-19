import { NextRequest, NextResponse } from 'next/server';
import { getUserCredits, getCreditsCost } from '@/lib/credits';

/**
 * GET /api/credits/balance
 * 查询用户积分余额
 */
export async function GET(request: NextRequest) {
  try {
    const credits = getUserCredits();
    const provider = request.nextUrl.searchParams.get('provider');
    
    return NextResponse.json({
      success: true,
      data: {
        balance: credits.balance,
        totalGranted: credits.totalGranted,
        totalConsumed: credits.totalConsumed,
        totalRefunded: credits.totalRefunded,
        cost: provider ? getCreditsCost(provider) : undefined,
      },
    });
  } catch (error) {
    console.error('[Credits API] Error:', error);
    return NextResponse.json(
      { success: false, error: '查询积分失败' },
      { status: 500 }
    );
  }
}
