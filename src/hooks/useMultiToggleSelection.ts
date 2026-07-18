import { useState } from 'react';

/**
 * 多选 + toggle。可设 max 上限（超过上限静默拒绝新增）。
 */
export function useMultiToggleSelection<T extends string>(max: number = Infinity) {
  const [values, setValues] = useState<T[]>([]);
  const toggle = (v: T) => setValues(cur => {
    if (cur.includes(v)) return cur.filter(x => x !== v);
    if (cur.length >= max) return cur; // 达上限静默拒绝
    return [...cur, v];
  });
  const clear = () => setValues([]);
  return { values, toggle, setValues, clear };
}
