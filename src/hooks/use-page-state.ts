'use client';

import { useEffect, useCallback, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * 保存和恢复页面滚动位置
 */
export function useScrollRestoration(key: string) {
  const pathname = usePathname();
  const scrollKey = `scroll_${key}`;
  const isRestored = useRef(false);

  // 保存滚动位置
  useEffect(() => {
    const handleScroll = () => {
      if (isRestored.current) {
        sessionStorage.setItem(scrollKey, String(window.scrollY));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollKey]);

  // 恢复滚动位置
  useEffect(() => {
    const savedScroll = sessionStorage.getItem(scrollKey);
    if (savedScroll) {
      // 等待页面渲染完成
      const timer = setTimeout(() => {
        window.scrollTo(0, Number(savedScroll));
        isRestored.current = true;
      }, 100);
      return () => clearTimeout(timer);
    }
    isRestored.current = true;
  }, [scrollKey, pathname]);

  // 清除保存的滚动位置
  const clearScrollPosition = useCallback(() => {
    sessionStorage.removeItem(scrollKey);
  }, [scrollKey]);

  return { clearScrollPosition };
}

/**
 * 保存和恢复 Tab 状态到 URL
 */
export function useTabState(defaultTab: string) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentTab = searchParams.get('tab') || defaultTab;

  const setTab = useCallback((tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    window.history.pushState(null, '', `${pathname}?${params.toString()}`);
  }, [searchParams, pathname]);

  return { currentTab, setTab };
}

/**
 * 保存和恢复筛选状态到 sessionStorage
 */
export function useFilterState<T>(key: string, defaultValue: T) {
  const storageKey = `filter_${key}`;

  const getFilter = useCallback((): T => {
    if (typeof window === 'undefined') return defaultValue;
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved) as T;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  }, [storageKey, defaultValue]);

  const setFilter = useCallback((value: T) => {
    sessionStorage.setItem(storageKey, JSON.stringify(value));
  }, [storageKey]);

  const clearFilter = useCallback(() => {
    sessionStorage.removeItem(storageKey);
  }, [storageKey]);

  return { filter: getFilter(), setFilter, clearFilter, getFilter };
}

/**
 * 页面离开前保存状态
 */
export function usePageState(key: string, state: Record<string, unknown>) {
  const storageKey = `page_state_${key}`;

  // 保存状态
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem(storageKey, JSON.stringify(state));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [storageKey, state]);

  // 获取保存的状态
  const getSavedState = useCallback((): Record<string, unknown> | null => {
    if (typeof window === 'undefined') return null;
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  }, [storageKey]);

  // 清除保存的状态
  const clearState = useCallback(() => {
    sessionStorage.removeItem(storageKey);
  }, [storageKey]);

  return { getSavedState, clearState };
}
