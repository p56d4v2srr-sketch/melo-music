import { useState } from 'react';

/**
 * 单选 + toggle 取消。
 * 初始 null；点已选 → null；点未选 → 切换。
 */
export function useToggleSelection<T extends string>(initial: T | null = null) {
  const [value, setValue] = useState<T | null>(initial);
  const toggle = (v: T) => setValue(cur => (cur === v ? null : v));
  return { value, toggle, setValue };
}
