/**
 * 把任意错误值转成人类可读字符串
 * 处理场景：Error 实例、纯字符串、对象、undefined
 * 避免 `${err}` 模板拼接踩 [object Object] 的坑
 */
export function toErrMsg(err: unknown): string {
  if (err == null) return 'Unknown error';
  if (err instanceof Error) return err.message || err.name || 'Error';
  if (typeof err === 'string') return err;
  if (typeof err === 'object') {
    const anyErr = err as Record<string, unknown>;
    // 常见嵌套：{ error: { message: '...' } } / { error: '...' }
    if (typeof anyErr.message === 'string') return anyErr.message as string;
    if (typeof anyErr.error === 'string') return anyErr.error as string;
    if (anyErr.error && typeof anyErr.error === 'object') {
      const nested = anyErr.error as Record<string, unknown>;
      if (typeof nested.message === 'string') return nested.message as string;
    }
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }
  return String(err);
}

/**
 * 标准化错误响应 body（供 API route 使用）
 */
export function errBody(code: string, err: unknown, extra?: Record<string, unknown>) {
  return {
    ok: false as const,
    code,
    message: toErrMsg(err),
    ...extra,
  };
}
