'use client';

import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Palette,
  Sliders,
  Sparkles,
  Save,
  CheckCircle,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  RefreshCw,
  Layers,
  Bookmark,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Trash2,
  Check,
  AlertTriangle,
  MoveVertical,
  MoveHorizontal,
  Maximize2,
  Split,
  Square,
  Columns,
  Eye,
} from 'lucide-react';
import {
  DEFAULT_THEME,
  BUILTIN_PRESETS,
  ThemePreset,
  getCategoryColor,
} from '@/lib/theme';
import { applyThemeToDOM } from '@/components/common/ThemeProvider';

interface ColorPack {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  navy: string;
  accent: string;
  background: string;
  surface: string;
  tag: string;
}

const COLOR_PACKS: ColorPack[] = [
  {
    id: 'emerald',
    name: 'Emerald Heritage',
    description: 'Classic authoritative real estate editorial styling.',
    primary: '#008F5A',
    secondary: '#006B45',
    navy: '#071B2B',
    accent: '#059669',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    tag: 'DEFAULT EDITORIAL',
  },
  {
    id: 'luxury_midnight',
    name: 'Luxury Midnight',
    description: 'Ultra-luxury high-end properties & global penthouses.',
    primary: '#D97706',
    secondary: '#B45309',
    navy: '#0B132B',
    accent: '#F59E0B',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    tag: 'ULTRA LUXURY',
  },
  {
    id: 'crimson',
    name: 'Wall Street Crimson',
    description: 'Dynamic markets, REIT investments & breaking financial scoops.',
    primary: '#DC2626',
    secondary: '#991B1B',
    navy: '#111827',
    accent: '#EF4444',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    tag: 'FINANCIAL SCOOPS',
  },
  {
    id: 'proptech',
    name: 'PropTech Modern Cyan',
    description: 'Smart cities, AI proptech & architectural technology.',
    primary: '#0284C7',
    secondary: '#0369A1',
    navy: '#0F172A',
    accent: '#38BDF8',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    tag: 'PROPTECH & AI',
  },
  {
    id: 'indigo',
    name: 'Royal Indigo Editorial',
    description: 'Institutional research, macroeconomic policy & data.',
    primary: '#4F46E5',
    secondary: '#3730A3',
    navy: '#1E1B4B',
    accent: '#6366F1',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    tag: 'INSTITUTIONAL',
  },
  {
    id: 'monochrome',
    name: 'Minimalist Monochrome',
    description: 'Timeless Swiss typographic layout with high contrast.',
    primary: '#18181B',
    secondary: '#27272A',
    navy: '#09090B',
    accent: '#52525B',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    tag: 'SWISS MONOCHROME',
  },
];

const CATEGORY_NAMES: Record<string, string> = {
  residential: 'Residential Housing',
  commercial: 'Commercial Real Estate',
  international: 'Global Markets & Penthouses',
  finance: 'Finance & Mortgage Rates',
  legal: 'Legal & RERA Regulations',
  'realty-tech': 'RealtyTech & PropTech AI',
  development: 'Infrastructure & Development',
  general: 'General Editorial Intelligence',
};

export default function VisualCustomizerPage() {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [screenMode, setScreenMode] = useState<'split' | 'screen1' | 'screen2'>('split');
  const [activeTab, setActiveTab] = useState<'packs' | 'palette' | 'categories' | 'presets'>('packs');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);

  // Mouse Drag-to-Resize State
  const [isDragging, setIsDragging] = useState(false);
  const [dragFeedback, setDragFeedback] = useState<{ label: string; value: string } | null>(null);

  // Presets State
  const [presets, setPresets] = useState<ThemePreset[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nesture_custom_presets');
        if (saved) {
          const parsed = JSON.parse(saved);
          return [...BUILTIN_PRESETS, ...parsed];
        }
      } catch {}
    }
    return BUILTIN_PRESETS;
  });
  const [newPresetName, setNewPresetName] = useState('');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Drag-and-drop state for categories
  const [draggedCatIdx, setDraggedCatIdx] = useState<number | null>(null);

  // Load existing theme
  useEffect(() => {
    fetch('/api/theme')
      .then((res) => res.json())
      .then((data) => {
        if (data.theme) {
          setTheme((prev) => ({ ...prev, ...data.theme }));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Broadcast theme update to local DOM, localStorage, and BroadcastChannel
  const broadcastTheme = (newTheme: typeof DEFAULT_THEME) => {
    applyThemeToDOM(newTheme);
    try {
      localStorage.setItem('nesture_theme', JSON.stringify(newTheme));
      const channel = new BroadcastChannel('nesture_theme_channel');
      channel.postMessage({ type: 'THEME_UPDATE', theme: newTheme });
      channel.close();
    } catch {}
  };

  // Interactive Mouse Drag-to-Resize on canvas elements
  const startMouseDragResize = (
    e: React.MouseEvent,
    target: 'heroHeight' | 'heroWidth' | 'sideCardHeight' | 'thumbnailWidth',
    initialNum: number,
    minVal: number,
    maxVal: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (target === 'heroHeight') {
        const deltaY = moveEvent.clientY - startY;
        const newHeight = Math.max(minVal, Math.min(maxVal, initialNum + deltaY));
        setDragFeedback({ label: 'Hero Banner Height', value: `${newHeight}px` });
        setTheme((prev) => {
          const next = { ...prev, heroHeight: `${newHeight}px` };
          broadcastTheme(next);
          return next;
        });
        setHasChanges(true);
      } else if (target === 'heroWidth') {
        const deltaX = moveEvent.clientX - startX;
        const isFull = deltaX > 50;
        const widthMode = isFull ? 'full' : 'split';
        setDragFeedback({
          label: 'Banner Layout Width',
          value: isFull ? '12-Col Full Width (Reflowed Below)' : '8-Col Split Hero Banner',
        });
        setTheme((prev) => {
          const next = { ...prev, heroWidth: widthMode as 'split' | 'full' };
          broadcastTheme(next);
          return next;
        });
        setHasChanges(true);
      } else if (target === 'sideCardHeight') {
        const deltaY = moveEvent.clientY - startY;
        const newHeight = Math.max(minVal, Math.min(maxVal, initialNum + deltaY));
        setDragFeedback({ label: 'Side Card Height', value: `${newHeight}px` });
        setTheme((prev) => {
          const next = { ...prev, sideCardHeight: `${newHeight}px` };
          broadcastTheme(next);
          return next;
        });
        setHasChanges(true);
      } else if (target === 'thumbnailWidth') {
        const deltaX = moveEvent.clientX - startX;
        const newWidth = Math.max(minVal, Math.min(maxVal, initialNum + deltaX));
        setDragFeedback({ label: 'Thumbnail Photo Width', value: `${newWidth}px` });
        setTheme((prev) => {
          const next = { ...prev, sideCardThumbnailWidth: `${newWidth}px` };
          broadcastTheme(next);
          return next;
        });
        setHasChanges(true);
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
      setTimeout(() => setDragFeedback(null), 1200);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Color Pack Selector
  const handlePackSelect = (pack: ColorPack) => {
    const nextTheme = {
      ...theme,
      colorPack: pack.id,
      primaryColor: pack.primary,
      secondaryColor: pack.secondary,
      navyColor: pack.navy,
      accentColor: pack.accent,
      backgroundColor: pack.background,
      surfaceColor: pack.surface,
    };
    setTheme(nextTheme);
    broadcastTheme(nextTheme);
    setHasChanges(true);
  };

  // Color Change Handler
  const handleColorChange = (key: string, value: string) => {
    const nextTheme = { ...theme, [key]: value, colorPack: 'custom' };
    setTheme(nextTheme);
    broadcastTheme(nextTheme);
    setHasChanges(true);
  };

  // Category Color Change
  const handleCategoryColorChange = (catSlug: string, color: string) => {
    const nextTheme = {
      ...theme,
      categoryColors: {
        ...theme.categoryColors,
        [catSlug]: color,
      },
    };
    setTheme(nextTheme);
    broadcastTheme(nextTheme);
    setHasChanges(true);
  };

  // Category Reorder Handler (Move Up/Down)
  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const currentOrder = [...(theme.categoryOrder || DEFAULT_THEME.categoryOrder)];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    const temp = currentOrder[index];
    currentOrder[index] = currentOrder[targetIndex];
    currentOrder[targetIndex] = temp;

    const nextTheme = {
      ...theme,
      categoryOrder: currentOrder,
    };
    setTheme(nextTheme);
    broadcastTheme(nextTheme);
    setHasChanges(true);
  };

  // Save Current as New Preset
  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;

    const newPreset: ThemePreset = {
      id: `custom-${Date.now()}`,
      name: newPresetName.trim(),
      tagline: 'Custom user-saved layout & color configuration.',
      badge: 'CUSTOM',
      primaryColor: theme.primaryColor,
      navyColor: theme.navyColor,
      theme: { ...theme },
    };

    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);

    if (typeof window !== 'undefined') {
      const customOnly = updatedPresets.filter((p) => p.id.startsWith('custom-'));
      localStorage.setItem('nesture_custom_presets', JSON.stringify(customOnly));
    }

    setNewPresetName('');
    alert(`Preset "${newPreset.name}" successfully saved to your template library!`);
  };

  // Delete Custom Preset
  const handleDeletePreset = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete preset "${name}"?`)) {
      const updated = presets.filter((p) => p.id !== id);
      setPresets(updated);
      if (typeof window !== 'undefined') {
        const customOnly = updated.filter((p) => p.id.startsWith('custom-'));
        localStorage.setItem('nesture_custom_presets', JSON.stringify(customOnly));
      }
    }
  };

  // Apply Preset with Confirmation Modal
  const handleApplyPresetClick = (preset: ThemePreset) => {
    setConfirmModal({
      open: true,
      title: `Apply "${preset.name}" Design Template?`,
      message: `Are you sure you want to apply the "${preset.name}" design template? All colors, banner sizing, and category order will update immediately.`,
      onConfirm: () => {
        const nextTheme = {
          ...theme,
          ...preset.theme,
        };
        setTheme(nextTheme);
        broadcastTheme(nextTheme);
        setHasChanges(true);
        setConfirmModal(null);
      },
    });
  };

  // Reset Confirmation
  const handleResetDefaultsClick = () => {
    setConfirmModal({
      open: true,
      title: 'Reset to Factory Default Template?',
      message:
        'Are you sure you want to restore the factory default Emerald Journal editorial theme? All unsaved customizations will be reset.',
      onConfirm: () => {
        setTheme(DEFAULT_THEME);
        broadcastTheme(DEFAULT_THEME);
        setHasChanges(true);
        setConfirmModal(null);
      },
    });
  };

  // Publish changes to database and live website
  const handlePublish = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      broadcastTheme(theme);

      const res = await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setHasChanges(false);
        setIframeKey((prev) => prev + 1);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        alert('Failed to publish changes to live site.');
      }
    } catch {
      alert('Network error while publishing theme.');
    } finally {
      setSaving(false);
    }
  };

  const currentOrder = theme.categoryOrder || DEFAULT_THEME.categoryOrder;
  const isFullWidth = theme.heroWidth === 'full';
  const heroBannerHeight = parseInt(theme.heroHeight || '460px', 10);

  return (
    <AdminLayout>
      <div className={`flex flex-col h-full space-y-4 ${isDragging ? 'select-none' : ''}`}>
        {/* TOP ACTION BAR WITH SCREEN MODE SWITCHER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white p-4 rounded-2xl border border-editorialBorder shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-brand font-bold text-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-brand uppercase tracking-wider">
                <span>Interactive Visual Customizer Studio</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-600 font-semibold">2-Screen Mode & Drag Sizing</span>
              </div>
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-editorialText-primary tracking-tight mt-0.5">
                Live Theme & Interactive Mouse-Drag Sizing Engine
              </h1>
            </div>
          </div>

          {/* SCREEN SWITCHER BUTTONS (Screen 1 vs Screen 2 vs Dual Split) */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setScreenMode('screen1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                screenMode === 'screen1'
                  ? 'bg-emerald-brand text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Screen 1: Full-width live canvas with mouse drag handles"
            >
              <Monitor size={14} />
              <span>Screen 1: Big Live Canvas (Mouse Drag)</span>
            </button>

            <button
              type="button"
              onClick={() => setScreenMode('screen2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                screenMode === 'screen2'
                  ? 'bg-emerald-brand text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Screen 2: Dedicated Color Packs, Palette & Preset Controls"
            >
              <Palette size={14} />
              <span>Screen 2: Studio Design Controls</span>
            </button>

            <button
              type="button"
              onClick={() => setScreenMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                screenMode === 'split'
                  ? 'bg-emerald-brand text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Dual Screen Split View: Canvas + Controls Side-by-Side"
            >
              <Columns size={14} />
              <span>Dual Split View</span>
            </button>
          </div>

          {/* RESET & PUBLISH ACTIONS */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {hasChanges && (
              <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-medium animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Unpublished Changes</span>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetDefaultsClick}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              title="Reset all settings to default"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={saving}
              className="inline-flex items-center space-x-2 px-5 py-2 text-xs font-bold text-white bg-emerald-brand hover:bg-emerald-deep rounded-xl shadow-xs transition btn-press disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? 'Publishing...' : 'Publish to Live Website'}</span>
            </button>
          </div>
        </div>

        {/* ACTIVE MOUSE DRAG FEEDBACK FLOATING NOTIFICATION */}
        {dragFeedback && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white border-2 border-emerald-400 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-3 animate-fade-in">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Mouse Drag Active:
            </span>
            <span className="text-xs font-bold text-white">
              {dragFeedback.label} &rarr; <span className="text-emerald-300 font-mono">{dragFeedback.value}</span>
            </span>
          </div>
        )}

        {/* Success Alert */}
        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-deep text-xs font-bold rounded-xl flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} />
              <span>All visual and layout adjustments published live! Live site is updated.</span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-emerald-700 hover:text-emerald-900 font-mono text-[11px]"
            >
              View Live Site &rarr;
            </a>
          </div>
        )}

        {/* MAIN STUDIO CONTAINER */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1 min-h-0">
          {/* ========================================================================= */}
          {/* SCREEN 1: LIVE WEBSITE MIRROR & INTERACTIVE MOUSE DRAG SIZING CANVAS     */}
          {/* ========================================================================= */}
          <div
            className={`${
              screenMode === 'screen1'
                ? 'xl:col-span-12'
                : screenMode === 'screen2'
                ? 'hidden'
                : 'xl:col-span-8'
            } flex flex-col bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-800 min-h-[720px] flex-1 transition-all duration-300`}
          >
            {/* Top Chrome Window Header */}
            <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-300 gap-2">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700/80 text-xs font-mono text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>http://localhost:3000/</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">
                    Screen 1: Live Interactive Canvas
                  </span>
                </div>
              </div>

              {/* Viewport switchers & Device Toggles */}
              <div className="flex items-center space-x-2">
                {/* Reload Preview */}
                <button
                  type="button"
                  onClick={() => setIframeKey((k) => k + 1)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                  title="Reload Live Preview"
                >
                  <RefreshCw size={14} />
                </button>

                {/* Device Viewport Switcher */}
                <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded transition ${
                      previewDevice === 'desktop'
                        ? 'bg-emerald-brand text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Desktop View (100%)"
                  >
                    <Monitor size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-1.5 rounded transition ${
                      previewDevice === 'tablet'
                        ? 'bg-emerald-brand text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Tablet View (768px)"
                  >
                    <Tablet size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded transition ${
                      previewDevice === 'mobile'
                        ? 'bg-emerald-brand text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Mobile View (375px)"
                  >
                    <Smartphone size={14} />
                  </button>
                </div>

                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                  title="Open Live Website in New Tab"
                >
                  <ExternalLink size={14} />
                </a>

                {screenMode !== 'screen1' && (
                  <button
                    type="button"
                    onClick={() => setScreenMode('screen1')}
                    className="p-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition"
                    title="Maximize to 100% Big Screen"
                  >
                    <Maximize2 size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* SCREEN 1 FLOATING INTERACTIVE QUICK CONTROLS TOOLBAR */}
            <div className="mb-3 p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {/* Split vs Full Width Banner Layout Toggle */}
                <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 px-1 uppercase">Layout:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = { ...theme, heroWidth: 'split' as const };
                      setTheme(next);
                      broadcastTheme(next);
                      setHasChanges(true);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center space-x-1 ${
                      !isFullWidth ? 'bg-emerald-brand text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Split size={12} />
                    <span>Split (8-Col)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = { ...theme, heroWidth: 'full' as const };
                      setTheme(next);
                      broadcastTheme(next);
                      setHasChanges(true);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center space-x-1 ${
                      isFullWidth ? 'bg-emerald-brand text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Maximize2 size={12} />
                    <span>Full Width (12-Col)</span>
                  </button>
                </div>

                {/* Banner Height Quick Presets */}
                <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 px-1 uppercase">Banner Height:</span>
                  {['380px', '460px', '540px'].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => {
                        const next = { ...theme, heroHeight: h };
                        setTheme(next);
                        broadcastTheme(next);
                        setHasChanges(true);
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition ${
                        theme.heroHeight === h ? 'bg-emerald-brand text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>

                {/* Corner Rounding Quick Presets */}
                <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 px-1 uppercase">Radius:</span>
                  {[
                    { label: 'Sharp', val: '0px' },
                    { label: 'Subtle', val: '8px' },
                    { label: 'Modern', val: '14px' },
                    { label: 'Pill', val: '22px' },
                  ].map((r) => (
                    <button
                      key={r.label}
                      type="button"
                      onClick={() => {
                        const next = { ...theme, borderRadius: r.val };
                        setTheme(next);
                        broadcastTheme(next);
                        setHasChanges(true);
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                        theme.borderRadius === r.val ? 'bg-emerald-brand text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jump to Screen 2 Shortcut Button */}
              {screenMode !== 'screen2' && (
                <button
                  type="button"
                  onClick={() => setScreenMode('screen2')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 font-bold rounded-lg border border-slate-700 flex items-center space-x-1.5 text-xs transition"
                >
                  <Palette size={13} />
                  <span>Open Screen 2 Controls &rarr;</span>
                </button>
              )}
            </div>

            {/* LIVE CANVAS & INTERACTIVE MOUSE DRAG CONTAINER */}
            <div className="flex-1 flex flex-col items-center justify-start overflow-hidden bg-slate-950/60 rounded-xl p-2 sm:p-3 border border-slate-800/80 relative">
              <div
                style={{
                  maxWidth:
                    previewDevice === 'desktop'
                      ? '100%'
                      : previewDevice === 'tablet'
                      ? '768px'
                      : '375px',
                  width: '100%',
                  height: '100%',
                  minHeight: '750px',
                  transition: 'max-width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="rounded-xl overflow-hidden shadow-2xl bg-white border border-slate-700/50 flex flex-col relative"
              >
                {/* DIRECT ON-CANVAS INTERACTIVE MOUSE DRAG OVERLAY LAYER */}
                {/* 1. HERO BANNER BOTTOM DRAG HANDLE (Height Adjustment with Mouse) */}
                <div
                  onMouseDown={(e) => startMouseDragResize(e, 'heroHeight', heroBannerHeight, 280, 650)}
                  className="absolute left-6 right-6 z-30 flex items-center justify-center cursor-ns-resize group"
                  style={{ top: `${Math.min(heroBannerHeight + 110, 650)}px` }}
                  title="Click & Drag vertically with mouse to resize Hero Banner Height"
                >
                  <div className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full text-xs font-mono font-bold shadow-xl flex items-center space-x-2 border-2 border-amber-300 group-hover:scale-105 transition-all">
                    <MoveVertical size={13} className="animate-bounce" />
                    <span>↕ Drag with mouse to resize banner height ({theme.heroHeight || '460px'})</span>
                  </div>
                </div>

                {/* 2. HERO BANNER SIDE DRAG HANDLE (Width Split Adjustment with Mouse) */}
                <div
                  onMouseDown={(e) => startMouseDragResize(e, 'heroWidth', 0, 0, 0)}
                  className="absolute z-30 cursor-ew-resize group"
                  style={{
                    top: '220px',
                    left: isFullWidth ? '92%' : '63%',
                    transition: 'left 0.3s ease',
                  }}
                  title="Click & Drag horizontally with mouse to expand banner to 12-col full width or restore 8-col split"
                >
                  <div className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-2xl flex items-center space-x-1.5 border-2 border-cyan-300 group-hover:scale-110 transition-all">
                    <MoveHorizontal size={14} />
                    <span className="hidden sm:inline">↔ Side Drag ({isFullWidth ? '12-Col Full' : '8-Col Split'})</span>
                  </div>
                </div>

                {/* EMBEDDED REAL LIVE WEBSITE MIRROR (IFRAME) */}
                <iframe
                  key={iframeKey}
                  src="/"
                  title="Live Website Mirror Preview"
                  className={`w-full flex-1 min-h-[750px] border-0 ${isDragging ? 'pointer-events-none' : ''}`}
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SCREEN 2: DEDICATED FULL-WIDTH DESIGN & PRESET STUDIO CONTROLS            */}
          {/* ========================================================================= */}
          <div
            className={`${
              screenMode === 'screen2'
                ? 'xl:col-span-12'
                : screenMode === 'screen1'
                ? 'hidden'
                : 'xl:col-span-4'
            } flex flex-col space-y-4 transition-all duration-300`}
          >
            {/* Header when Screen 2 is full-width */}
            {screenMode === 'screen2' && (
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-editorialBorder shadow-xs">
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-brand uppercase">
                    Screen 2: Dedicated Control Studio
                  </div>
                  <h2 className="font-serif font-bold text-xl text-editorialText-primary">
                    Color Packs, Custom Palette, Categories & Preset Engine
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setScreenMode('screen1')}
                  className="px-4 py-2 bg-emerald-brand text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-deep flex items-center space-x-1.5 transition"
                >
                  <Monitor size={14} />
                  <span>Switch to Screen 1: Live Canvas & Mouse Drag &rarr;</span>
                </button>
              </div>
            )}

            {/* DOCK NAVIGATION TABS */}
            <div className="grid grid-cols-4 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('packs')}
                className={`py-2 px-1 rounded-lg transition flex flex-col sm:flex-row items-center justify-center space-x-1 ${
                  activeTab === 'packs'
                    ? 'bg-white text-emerald-brand shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Palette size={14} />
                <span>Color Packs</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('palette')}
                className={`py-2 px-1 rounded-lg transition flex flex-col sm:flex-row items-center justify-center space-x-1 ${
                  activeTab === 'palette'
                    ? 'bg-white text-emerald-brand shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders size={14} />
                <span>Palette</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('categories')}
                className={`py-2 px-1 rounded-lg transition flex flex-col sm:flex-row items-center justify-center space-x-1 ${
                  activeTab === 'categories'
                    ? 'bg-white text-emerald-brand shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers size={14} />
                <span>Categories</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`py-2 px-1 rounded-lg transition flex flex-col sm:flex-row items-center justify-center space-x-1 ${
                  activeTab === 'presets'
                    ? 'bg-white text-emerald-brand shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bookmark size={14} />
                <span>Presets</span>
              </button>
            </div>

            {/* TAB 1: CURATED COLOR PACKS */}
            {activeTab === 'packs' && (
              <div className="bg-white p-5 rounded-2xl border border-editorialBorder shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-serif font-bold text-base text-editorialText-primary">
                    Curated Editorial Color Packs
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-emerald-brand uppercase tracking-wider">
                    1-Click Apply
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Select a color pack to instantly re-theme all headers, cards, buttons, charts, and badges across your
                  live site.
                </p>

                <div
                  className={`grid ${
                    screenMode === 'screen2' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                  } gap-3`}
                >
                  {COLOR_PACKS.map((pack) => {
                    const isSelected = theme.colorPack === pack.id;
                    return (
                      <div
                        key={pack.id}
                        onClick={() => handlePackSelect(pack)}
                        className={`p-4 rounded-xl border-2 transition cursor-pointer relative group ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/30 shadow-md ring-2 ring-emerald-400/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-serif font-bold text-sm text-slate-900">{pack.name}</span>
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                                {pack.tag}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{pack.description}</p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-xs">
                              <Check size={12} />
                            </div>
                          )}
                        </div>

                        {/* Swatches */}
                        <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-slate-100">
                          <span className="text-[10px] font-mono text-slate-400">Swatches:</span>
                          <div className="flex items-center space-x-1.5">
                            <span
                              className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                              style={{ backgroundColor: pack.primary }}
                              title={`Primary: ${pack.primary}`}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                              style={{ backgroundColor: pack.navy }}
                              title={`Navy: ${pack.navy}`}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                              style={{ backgroundColor: pack.secondary }}
                              title={`Secondary: ${pack.secondary}`}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                              style={{ backgroundColor: pack.accent }}
                              title={`Accent: ${pack.accent}`}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                              style={{ backgroundColor: pack.background }}
                              title={`Background: ${pack.background}`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: GRANULAR CUSTOM PALETTE */}
            {activeTab === 'palette' && (
              <div className="bg-white p-5 rounded-2xl border border-editorialBorder shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-serif font-bold text-base text-editorialText-primary">
                    Fine-Tuned Palette Pickers
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-emerald-brand uppercase tracking-wider">
                    Hex Precision
                  </span>
                </div>

                {/* Core Brand Colors */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    Core Editorial Colors
                  </h4>
                  <div
                    className={`grid ${
                      screenMode === 'screen2' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2'
                    } gap-2.5`}
                  >
                    {[
                      { label: 'Primary Brand', key: 'primaryColor', val: theme.primaryColor },
                      { label: 'Secondary Dark', key: 'secondaryColor', val: theme.secondaryColor },
                      { label: 'Deep Editorial Navy', key: 'navyColor', val: theme.navyColor },
                      { label: 'Highlight Accent', key: 'accentColor', val: theme.accentColor },
                      { label: 'Site Background', key: 'backgroundColor', val: theme.backgroundColor },
                    ].map((item) => (
                      <div key={item.key} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">{item.label}</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={item.val}
                            onChange={(e) => handleColorChange(item.key, e.target.value)}
                            className="w-7 h-7 rounded border border-slate-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={item.val}
                            onChange={(e) => handleColorChange(item.key, e.target.value)}
                            className="w-full text-xs font-mono uppercase bg-white border border-slate-200 px-2 py-1 rounded"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Category Accent Colors */}
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    Individual Category Badges & Accents
                  </h4>
                  <div
                    className={`grid ${
                      screenMode === 'screen2' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2'
                    } gap-2.5`}
                  >
                    {Object.entries(CATEGORY_NAMES).map(([slug, name]) => {
                      const color = getCategoryColor(slug, theme.categoryColors);
                      return (
                        <div key={slug} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                          <label className="text-[11px] font-bold text-slate-700 block mb-1 truncate" title={name}>
                            {name}
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={color}
                              onChange={(e) => handleCategoryColorChange(slug, e.target.value)}
                              className="w-7 h-7 rounded border border-slate-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={color}
                              onChange={(e) => handleCategoryColorChange(slug, e.target.value)}
                              className="w-full text-xs font-mono uppercase bg-white border border-slate-200 px-2 py-1 rounded"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CATEGORY DRAG & DROP REORDERING */}
            {activeTab === 'categories' && (
              <div className="bg-white p-5 rounded-2xl border border-editorialBorder shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-serif font-bold text-base text-editorialText-primary">
                    Rearrange Category Order
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-emerald-brand uppercase tracking-wider">
                    Drag or Click &uarr;&darr;
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Reorder categories by clicking the Up/Down arrows or dragging. The live site ribbon and header will
                  reflect this exact sequence.
                </p>

                <div className="space-y-2">
                  {currentOrder.map((slug, idx) => {
                    const name = CATEGORY_NAMES[slug] || slug;
                    const color = getCategoryColor(slug, theme.categoryColors);
                    return (
                      <div
                        key={slug}
                        draggable
                        onDragStart={() => setDraggedCatIdx(idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (draggedCatIdx === null || draggedCatIdx === idx) return;
                          const newOrder = [...currentOrder];
                          const [removed] = newOrder.splice(draggedCatIdx, 1);
                          newOrder.splice(idx, 0, removed);
                          const next = { ...theme, categoryOrder: newOrder };
                          setTheme(next);
                          broadcastTheme(next);
                          setHasChanges(true);
                          setDraggedCatIdx(null);
                        }}
                        className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between transition cursor-grab"
                      >
                        <div className="flex items-center space-x-2.5">
                          <GripVertical size={16} className="text-slate-400" />
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs font-bold text-slate-800">
                            #{idx + 1}. {name}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveCategory(idx, 'up')}
                            className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200"
                            title="Move Category Up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === currentOrder.length - 1}
                            onClick={() => handleMoveCategory(idx, 'down')}
                            className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200"
                            title="Move Category Down"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: PRESETS & TEMPLATES ENGINE */}
            {activeTab === 'presets' && (
              <div className="bg-white p-5 rounded-2xl border border-editorialBorder shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-serif font-bold text-base text-editorialText-primary">
                    Design Presets & Templates
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-emerald-brand uppercase tracking-wider">
                    Instant Styling
                  </span>
                </div>

                {/* Save Current as New Preset Form */}
                <form onSubmit={handleSavePreset} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Save Current Configuration as Preset</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newPresetName}
                      onChange={(e) => setNewPresetName(e.target.value)}
                      placeholder="e.g. Festival 2026 Edition"
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-emerald-brand"
                    />
                    <button
                      type="submit"
                      disabled={!newPresetName.trim()}
                      className="px-3 py-1.5 bg-emerald-brand text-white text-xs font-bold rounded-lg hover:bg-emerald-deep transition disabled:opacity-50"
                    >
                      Save Preset
                    </button>
                  </div>
                </form>

                {/* Preset List */}
                <div
                  className={`grid ${
                    screenMode === 'screen2' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                  } gap-3`}
                >
                  {presets.map((preset) => (
                    <div
                      key={preset.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/50 transition flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-sm text-slate-900">{preset.name}</span>
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              preset.badge === 'DEFAULT'
                                ? 'bg-emerald-100 text-emerald-800'
                                : preset.badge === 'CUSTOM'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {preset.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{preset.tagline}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300"
                            style={{ backgroundColor: preset.primaryColor }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300"
                            style={{ backgroundColor: preset.navyColor }}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          {preset.id.startsWith('custom-') && (
                            <button
                              type="button"
                              onClick={() => handleDeletePreset(preset.id, preset.name)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Delete custom preset"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleApplyPresetClick(preset)}
                            className="px-3 py-1 bg-slate-900 hover:bg-emerald-brand text-white text-xs font-bold rounded-lg transition"
                          >
                            Apply Template
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* UNIVERSAL CONFIRMATION MODAL */}
        {confirmModal && confirmModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center space-x-3 text-amber-600">
                <AlertTriangle size={24} />
                <h3 className="font-serif font-bold text-lg text-slate-900">{confirmModal.title}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{confirmModal.message}</p>
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-brand hover:bg-emerald-deep rounded-xl shadow-xs"
                >
                  Confirm & Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
