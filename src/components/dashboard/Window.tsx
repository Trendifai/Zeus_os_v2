'use client';

import { useRef, useState, MouseEvent, ReactNode } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onDrag: (position: { x: number; y: number }) => void;
  children: ReactNode;
}

export default function Window({
  id,
  title,
  position,
  size,
  zIndex,
  isMinimized,
  isMaximized,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onDrag,
  children,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    onFocus();
    setIsDragging(true);
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleResizeStart = (e: MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  if (isMinimized) return null;

  return (
    <div
      className="absolute bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden"
      style={{
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? '100%' : size.height,
        zIndex,
      }}
      onMouseDown={onFocus}
    >
      <div
        className="h-8 bg-zinc-800/80 border-b border-zinc-700 flex items-center justify-between px-3 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <span className="text-xs text-zinc-300 font-medium">{title}</span>
        <div className="flex items-center gap-1 window-controls">
          <button
            onClick={onMinimize}
            className="p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 rounded"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={onMaximize}
            className="p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 rounded"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-700 rounded"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="relative h-[calc(100%-2rem)] overflow-auto">
        {children}
      </div>
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize hover:bg-amber-400/30"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
}