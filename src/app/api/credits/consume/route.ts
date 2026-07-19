import { NextRequest, NextResponse } from 'next/server';
import { checkCredits, consumeCredits } from '@/lib/credits';

/**
 * POST /api/credits/consume
 * 扣减积分（生成前调用）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, songId, checkOnly = false } = body;

    if (!provider) {
      return NextResponse.json(
        { success: false, error: '缺少 provider 参数' },
        { status: 400 }
      );
    }

    // 仅检查积分是否充足
    if (checkOnly) {
      const check = checkCredits(provider);
      return NextResponse.json({
        success: true,
        data: {
          sufficient: check.success,
          balance: check.balance,
          required: check.required,
        },
      });
    }

    // 扣减积分
    const result = consumeCredits(provider, songId);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.message,
        data: { balance: result.balance },
      }, { status: 402 }); // 402 Payment Required
    }

    return NextResponse.json({
      success: true,
      data: {
        balance: result.balance,
        message: result.message,
      },
    });
  } catch (error) {
    console.error('[Credits API] Consume error:', error);
    return NextResponse.json(
      { success: false, error: '扣减积分失败' },
      { status: 500 }
    );
  }
}
