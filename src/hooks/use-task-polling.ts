'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type TaskStatusType = 'pending' | 'processing' | 'complete' | 'failed';

export interface TaskStatusData {
  status: TaskStatusType;
  progress?: number;
  data?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
  };
}

export interface UseTaskPollingOptions {
  interval?: number; // 轮询间隔，默认 3 秒
  maxAttempts?: number; // 最大轮询次数，默认 60 次（3 分钟）
  enabled?: boolean; // 是否启用轮询
}

export interface UseTaskPollingResult {
  status: TaskStatusType;
  progress: number;
  data: Record<string, unknown> | null;
  error: { code: string; message: string } | null;
  isLoading: boolean;
  startPolling: (taskId: string, type?: 'music' | 'mv') => void;
  stopPolling: () => void;
  reset: () => void;
}

export function useTaskPolling(options: UseTaskPollingOptions = {}): UseTaskPollingResult {
  const { interval = 3000, maxAttempts = 60, enabled = true } = options;
  
  const [status, setStatus] = useState<TaskStatusType>('pending');
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const taskIdRef = useRef<string | null>(null);
  const taskTypeRef = useRef<'music' | 'mv'>('music');
  const attemptsRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsLoading(false);
  }, []);

  const pollTaskStatus = useCallback(async () => {
    if (!taskIdRef.current) return;

    attemptsRef.current += 1;

    // 超过最大轮询次数
    if (attemptsRef.current > maxAttempts) {
      stopPolling();
      setStatus('failed');
      setError({
        code: 'timeout',
        message: '任务处理超时，请稍后重试',
      });
      return;
    }

    try {
      const response = await fetch(`/api/task-status/${taskIdRef.current}?type=${taskTypeRef.current}`);
      const result = await response.json();

      if (!result.success) {
        stopPolling();
        setStatus('failed');
        setError({
          code: result.code || 'unknown',
          message: result.error || '查询任务状态失败',
        });
        return;
      }

      const taskData = result.data as TaskStatusData;
      setStatus(taskData.status);
      setProgress(taskData.progress || 0);
      
      if (taskData.data) {
        setData(taskData.data);
      }

      if (taskData.error) {
        setError(taskData.error);
      }

      // 任务完成或失败，停止轮询
      if (taskData.status === 'complete' || taskData.status === 'failed') {
        stopPolling();
      }
    } catch (err) {
      console.error('Poll task status error:', err);
      // 网络错误时继续轮询，不立即失败
    }
  }, [maxAttempts, stopPolling]);

  const startPolling = useCallback((taskId: string, type: 'music' | 'mv' = 'music') => {
    if (!enabled) return;

    taskIdRef.current = taskId;
    taskTypeRef.current = type;
    attemptsRef.current = 0;
    setStatus('pending');
    setProgress(0);
    setData(null);
    setError(null);
    setIsLoading(true);

    // 立即执行一次
    pollTaskStatus();

    // 开始定时轮询
    intervalRef.current = setInterval(pollTaskStatus, interval);
  }, [enabled, interval, pollTaskStatus]);

  const reset = useCallback(() => {
    stopPolling();
    taskIdRef.current = null;
    attemptsRef.current = 0;
    setStatus('pending');
    setProgress(0);
    setData(null);
    setError(null);
  }, [stopPolling]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    status,
    progress,
    data,
    error,
    isLoading,
    startPolling,
    stopPolling,
    reset,
  };
}

// 错误消息映射
export function getErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    invalid_key: 'AceData Token 无效或权限不足，请检查 API 配置',
    insufficient_balance: 'AceData 账户额度不足，请到 platform.acedata.cloud 充值',
    rate_limit: '请求频率超限，请稍后再试',
    server_error: '服务异常，请稍后重试',
    timeout: '任务处理超时，请稍后重试',
    unknown: '发生未知错误，请稍后重试',
  };
  
  return errorMessages[code] || errorMessages.unknown;
}
