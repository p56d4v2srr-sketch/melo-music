/**
 * Mureka AI Music Provider (昆仑万维)
 * 
 * ⚠️ PENDING: Mureka API 尚未公开接入
 * - 官网：https://mureka.ai / https://mureka.cn
 * - API 文档：未找到公开文档（api.mureka.ai / open.mureka.ai 均返回 404）
 * - 模型：V9 / O2（据公开信息）
 * - 环境变量：MUREKA_API_KEY（预留，待 API 文档确认后配置）
 * 
 * TODO: 待 Mureka 开放 API 后实现：
 * 1. 确认 API endpoint 和鉴权方式
 * 2. 实现 generate() 和 queryTask() 方法
 * 3. 在 music-provider.ts 工厂中注册
 * 4. 在 create 页面 UI 中启用 Mureka 卡片
 */

import type { MusicProvider, GenerateParams, GenerateResult, ProviderTaskStatus } from './music-provider';

export function hasMurekaKey(): boolean {
  return !!process.env.MUREKA_API_KEY;
}

export class MurekaProvider implements MusicProvider {
  name = 'mureka';

  async generate(_params: GenerateParams): Promise<GenerateResult> {
    return {
      task_id: '',
      status: 'failed',
      provider: this.name,
      model_version: _params.model_version,
      actual_model: 'mureka-v9',
      data: { error: 'Mureka API 尚未接入，待官方开放 API 文档后实现' },
    };
  }

  async queryTask(_taskId: string): Promise<ProviderTaskStatus> {
    return {
      task_id: _taskId,
      status: 'failed',
      provider: this.name,
      error: 'Mureka API 尚未接入',
    };
  }
}
