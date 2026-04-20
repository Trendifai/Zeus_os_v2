'use client';

import { useState, useCallback } from 'react';

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  component?: string;
}

const DEFAULT_WINDOW: WindowState = {
  id: '',
  title: '',
  isOpen: false,
  isMinimized: false,
  isMaximized: false,
  position: { x: 100, y: 100 },
  size: { width: 600, height: 400 },
  zIndex: 100,
};

let windowCounter = 0;

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const openWindow = useCallback((title: string, component?: string) => {
    const id = `window-${++windowCounter}`;
    const newWindow: WindowState = {
      ...DEFAULT_WINDOW,
      id,
      title,
      isOpen: true,
      position: { x: 100 + windowCounter * 20, y: 100 + windowCounter * 20 },
      zIndex: windowCounter,
      component,
    };

    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(id);

    return id;
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveWindowId((current) => (current === id ? null : current));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w, i) => {
        if (w.id === id) {
          windowCounter++;
          return { ...w, zIndex: windowCounter };
        }
        return w;
      })
    );
    setActiveWindowId(id);
  }, []);

  const getActiveWindow = useCallback(() => {
    return windows.find((w) => w.id === activeWindowId) || null;
  }, [windows, activeWindowId]);

  return {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    getActiveWindow,
  };
}