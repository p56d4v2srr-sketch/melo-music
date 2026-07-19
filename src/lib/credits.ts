/**
 * 积分计费系统
 * 
 * 当前使用 localStorage 存储，后续可迁移到 Supabase
 * 
 * 积分消耗规则（按 API 实际成本，自用平台不加利润）：
 * - PuLe v4.5: 免费（0积分）
 * - Suno v3.5/v4: 1积分/次（每次生成2首）
 * - Suno v4.5: 2积分/次
 * - Suno v5: 3积分/次
 * - Suno v5.5: 5积分/次
 * - MiniMax 2.0: 1积分/次
 * - MiniMax 3.0 / 01: 3积分/次
 * - 智创聚合系列: 与对应 Suno 版本同价
 * 
 * 新用户注册赠送 50 积分
 */

// 各模型积分消耗配置
export const CREDIT_COSTS: Record<string, number> = {
  // PuLe - 免费
  pule: 0,
  // Suno 各版本
  'chirp-v3-5': 1,
  'chirp-v4': 1,
  'chirp-v4-5': 2,
  'chirp-v5': 3,
  'chirp-v5-5': 5,
  'suno-v3.5': 1,
  'suno-v4': 1,
  'suno-v4.5': 2,
  'suno-v5': 3,
  'suno-v5.5': 5,
  suno: 1, // 默认 Suno 版本
  // MiniMax 各版本
  'music-2.0': 1,
  'music-2.5': 3,
  'minimax-2.0': 1,
  'minimax-2.5': 3,
  'minimax-3.0': 3,
  'minimax-01': 3,
  minimax: 1, // 默认 MiniMax 版本
  // 智创聚合 - 与对应 Suno 版本同价
  'lconai-v3.5': 1,
  'lconai-v4': 1,
  'lconai-v4.5': 2,
  'lconai-v5': 3,
  'lconai-v5.5': 5,
  lconai: 1, // 默认智创聚合版本
};

// 新用户赠送积分
export const INITIAL_CREDITS = 50;

// 积分记录类型
export interface CreditRecord {
  id: string;
  userId: string;
  amount: number;
  type: 'grant' | 'consume' | 'refund';
  provider?: string;
  songId?: string;
  description: string;
  createdAt: number;
}

// 用户积分数据
export interface UserCredits {
  userId: string;
  balance: number;
  totalGranted: number;
  totalConsumed: number;
  totalRefunded: number;
}

// 获取用户 ID（简单实现，后续可接入认证系统）
function getUserId(): string {
  if (typeof window === 'undefined') return 'server';
  
  let userId = localStorage.getItem('melo_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('melo_user_id', userId);
  }
  return userId;
}

// 获取用户积分数据
export function getUserCredits(): UserCredits {
  if (typeof window === 'undefined') {
    return {
      userId: 'server',
      balance: INITIAL_CREDITS,
      totalGranted: INITIAL_CREDITS,
      totalConsumed: 0,
      totalRefunded: 0,
    };
  }
  
  const userId = getUserId();
  const stored = localStorage.getItem(`melo_credits_${userId}`);
  
  if (!stored) {
    // 新用户，赠送初始积分
    const newCredits: UserCredits = {
      userId,
      balance: INITIAL_CREDITS,
      totalGranted: INITIAL_CREDITS,
      totalConsumed: 0,
      totalRefunded: 0,
    };
    localStorage.setItem(`melo_credits_${userId}`, JSON.stringify(newCredits));
    
    // 记录赠送
    addCreditRecord({
      userId,
      amount: INITIAL_CREDITS,
      type: 'grant',
      description: '新用户注册赠送',
    });
    
    return newCredits;
  }
  
  return JSON.parse(stored);
}

// 保存用户积分数据
function saveUserCredits(credits: UserCredits): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`melo_credits_${credits.userId}`, JSON.stringify(credits));
}

// 添加积分记录
function addCreditRecord(record: Omit<CreditRecord, 'id' | 'createdAt'>): void {
  if (typeof window === 'undefined') return;
  
  const records = getCreditRecords();
  const newRecord: CreditRecord = {
    ...record,
    id: `cr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: Date.now(),
  };
  records.unshift(newRecord);
  
  // 只保留最近 100 条记录
  if (records.length > 100) {
    records.length = 100;
  }
  
  localStorage.setItem('melo_credit_records', JSON.stringify(records));
}

// 获取积分记录
export function getCreditRecords(userId?: string): CreditRecord[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('melo_credit_records');
  if (!stored) return [];
  
  const records: CreditRecord[] = JSON.parse(stored);
  if (userId) {
    return records.filter(r => r.userId === userId);
  }
  return records;
}

// 检查积分是否充足
export function checkCredits(provider: string): { success: boolean; balance: number; required: number } {
  const credits = getUserCredits();
  const required = CREDIT_COSTS[provider] || 5;
  
  return {
    success: credits.balance >= required,
    balance: credits.balance,
    required,
  };
}

// 扣减积分（生成前调用）
export function consumeCredits(provider: string, songId?: string): { success: boolean; balance: number; message: string } {
  const credits = getUserCredits();
  const amount = CREDIT_COSTS[provider] || 5;
  
  if (credits.balance < amount) {
    return {
      success: false,
      balance: credits.balance,
      message: `积分不足，需要 ${amount} 积分，当前余额 ${credits.balance} 积分`,
    };
  }
  
  credits.balance -= amount;
  credits.totalConsumed += amount;
  saveUserCredits(credits);
  
  addCreditRecord({
    userId: credits.userId,
    amount: -amount,
    type: 'consume',
    provider,
    songId,
    description: `使用 ${provider} 生成音乐`,
  });
  
  return {
    success: true,
    balance: credits.balance,
    message: `已扣减 ${amount} 积分`,
  };
}

// 退还积分（生成失败时调用）
export function refundCredits(provider: string, songId?: string, reason?: string): { success: boolean; balance: number; refunded: number } {
  const credits = getUserCredits();
  const amount = CREDIT_COSTS[provider] || 5;
  
  credits.balance += amount;
  credits.totalRefunded += amount;
  saveUserCredits(credits);
  
  addCreditRecord({
    userId: credits.userId,
    amount,
    type: 'refund',
    provider,
    songId,
    description: reason || `生成失败，退还积分`,
  });
  
  return {
    success: true,
    balance: credits.balance,
    refunded: amount,
  };
}

// 获取模型消耗积分
export function getCreditsCost(provider: string): number {
  return CREDIT_COSTS[provider] || 5;
}
