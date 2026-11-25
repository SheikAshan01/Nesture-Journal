'use client';

import React, { useEffect, useState } from 'react';
import { MoveVertical, MoveHorizontal } from 'lucide-react';
import { DEFAULT_THEME } from '@/lib/theme';
import { applyThemeToDOM } from '@/components/common/ThemeProvider';

export function useIsCustomizerMode(): boolean {
  const [isCust, setIsCust] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const check = () => {
        const params = new URLSearchParams(window.location.search);
        setIsCust(params.get('customize') === '1');
      };
      check();
    }
  }, []);

  return isCust;
}

export function broadcastCustomizerResize(partial: Partial<typeof DEFAULT_THEME>) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('nesture_theme');
    const current = raw ? { ...DEFAULT_THEME, ...JSON.parse(raw) } : { ...DEFAULT_THEME };
    const next = { ...current, ...partial };
    localStorage.setItem('nesture_theme', JSON.stringify(next));
    applyThemeToDOM(next);
    window.dispatchEvent(new CustomEvent('nesture_theme_change', { detail: next }));
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'NESTURE_CUSTOMIZER_RESIZE', partial }, '*');
    }
  } catch {}
}

interface CustomizerSectionHandlesProps {
  badgeText: string;
  bottomLabel: string;
  sideLabel?: string;
  onVerticalDrag?: (deltaY: number) => void;
  onHorizontalDrag?: (deltaX: number) => void;
  onHorizontalClick?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export default function CustomizerSectionHandles({
  badgeText,
  bottomLabel,
  sideLabel,
  onVerticalDrag,
  onHorizontalDrag,
  onHorizontalClick,
  onDragStart,
  onDragEnd,
}: CustomizerSectionHandlesProps) {
  const isCustomizer = useIsCustomizerMode();
  const [activeAxis, setActiveAxis] = useState<'v' | 'h' | null>(null);

  if (!isCustomizer) return null;

  const startDrag = (e: React.MouseEvent, axis: 'v' | 'h') => {
    e.preventDefault();
    e.stopPropagation();
    setActiveAxis(axis);
    onDragStart?.();
    const prevSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';

    const startX = e.screenX;
    const startY = e.screenY;
    let moved = false;

    const handleMove = (mv: MouseEvent) => {
      const dx = mv.screenX - startX;
      const dy = mv.screenY - startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
      if (axis === 'v' && onVerticalDrag) {
        onVerticalDrag(dy);
      } else if (axis === 'h' && onHorizontalDrag) {
        onHorizontalDrag(dx);
      }
    };

    const handleUp = () => {
      setActiveAxis(null);
      document.body.style.userSelect = prevSelect;
      if (!moved && axis === 'h' && onHorizontalClick) {
        onHorizontalClick();
      }
      onDragEnd?.();
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('blur', handleUp);
      try {
        if (window.parent && window.parent !== window) {
          window.parent.removeEventListener('mousemove', handleMove);
          window.parent.removeEventListener('mouseup', handleUp);
        }
      } catch {}
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('blur', handleUp);
    try {
      if (window.parent && window.parent !== window) {
        window.parent.addEventListener('mousemove', handleMove);
        window.parent.addEventListener('mouseup', handleUp);
      }
    } catch {}
  };

  return (
    <>
      {/* Subtle Amber Studio Outline */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-[inherit] border-2 transition-colors z-20 ${
          activeAxis ? 'border-amber-400 shadow-[0_0_0_2px_rgba(245,158,11,0.25)]' : 'border-amber-500/70'
        }`}
      />

      {/* Top-Right Dimension Badge (Image 4 Style) */}
      <div className="pointer-events-none absolute top-2.5 right-2.5 z-30 px-2.5 py-1 rounded-md bg-slate-900/90 text-emerald-300 border border-slate-700/80 text-[10px] font-mono font-bold shadow-md backdrop-blur-xs">
        {badgeText}
      </div>

      {/* Bottom-Border Vertical Resize Handle (Image 4 Style) */}
      {onVerticalDrag && (
        <div
          onMouseDown={(e) => startDrag(e, 'v')}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          title="Click & drag vertically with mouse to resize height"
          className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-30 cursor-ns-resize select-none"
        >
          <div className="px-3.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full text-[11px] font-mono font-bold shadow-lg flex items-center space-x-1.5 border-2 border-amber-200 hover:scale-105 transition-transform whitespace-nowrap">
            <MoveVertical size={12} />
            <span>{bottomLabel}</span>
          </div>
        </div>
      )}

      {/* Right-Border Horizontal Resize Handle */}
      {onHorizontalDrag && (
        <div
          onMouseDown={(e) => startDrag(e, 'h')}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          title="Click & drag horizontally with mouse to resize width / columns"
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-30 cursor-ew-resize select-none"
        >
          <div className="px-2 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full text-[10px] font-mono font-bold shadow-lg flex items-center space-x-1 border-2 border-amber-200 hover:scale-105 transition-transform whitespace-nowrap">
            <MoveHorizontal size={12} />
            {sideLabel && <span className="hidden sm:inline">{sideLabel}</span>}
          </div>
        </div>
      )}
    </>
  );
}
