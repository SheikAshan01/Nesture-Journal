'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Maximize2,
  Split,
  ArrowLeft,
  Plus,
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

export default function VisualCustomizerStudio() {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [activeTab, setActiveTab] = useState<'packs' | 'palette' | 'categories' | 'presets'>('packs');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);


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
  const [showSavePresetModal, setShowSavePresetModal] = useState(false);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Drag-and-drop state for categories
  const [draggedCatIdx, setDraggedCatIdx] = useState<number | null>(null);

  // Load existing theme + listen for live resize messages from the preview iframe
  useEffect(() => {
    fetch('/api/theme')
      .then((res) => res.json())
      .then((data) => {
        if (data.theme) {
          setTheme((prev) => ({ ...prev, ...data.theme }));
        }
      })
      .catch((err) => console.error(err));

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NESTURE_CUSTOMIZER_RESIZE' && event.data?.partial) {
        setTheme((prev) => {
          const next = { ...prev, ...event.data.partial };
          applyThemeToDOM(next);
          try {
            localStorage.setItem('nesture_theme', JSON.stringify(next));
          } catch {}
          return next;
        });
        setHasChanges(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
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
  const handleSavePresetSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
    setShowSavePresetModal(false);
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
    <div className="h-screen bg-[#080C14] text-slate-100 flex flex-col overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER TOOLBAR: NO SIDEBAR, FULL-WINDOW IMMERSIVE STUDIO           */}
      {/* ========================================================================= */}
      <header className="bg-[#0E1420]/95 backdrop-blur-md border-b border-slate-800/90 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 shadow-2xl">
        {/* Left: Back / Exit & Studio Title */}
        <div className="flex items-center space-x-3">
          <Link
            href="/admin"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700/80 transition"
            title="Exit to Admin Dashboard"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Exit Studio</span>
          </Link>

          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shadow-inner">
              <Sparkles size={15} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif font-bold text-sm sm:text-base text-white tracking-tight leading-none">
                  Nesture Visual Studio
                </h1>
                {hasChanges && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold">
                    Unsaved
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                Drag any section border on the live canvas to resize
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Telemetry Pill (Read-only status of dragged values) */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Banner: <strong className="text-amber-300">{theme.heroHeight || '460px'}</strong></span>
          <span className="text-slate-600">|</span>
          <span>Layout: <strong className="text-cyan-300">{isFullWidth ? '12-Col Full' : '8-Col Split'}</strong></span>
          <span className="text-slate-600">|</span>
          <span>Grid: <strong className="text-emerald-300">{theme.insightsCardColumns || '2'}-Cols</strong></span>
        </div>

        {/* Right: Viewports & Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Device Viewport Switcher */}
          <div className="hidden md:flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-lg transition ${
                previewDevice === 'desktop' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View (100%)"
            >
              <Monitor size={14} />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('tablet')}
              className={`p-1.5 rounded-lg transition ${
                previewDevice === 'tablet' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet size={14} />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-lg transition ${
                previewDevice === 'mobile' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone size={14} />
            </button>
          </div>

          {/* Save as Preset Header Button */}
          <button
            type="button"
            onClick={() => setShowSavePresetModal(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-xl transition shadow-xs"
            title="Save current styling as a new named preset"
          >
            <Bookmark size={13} className="text-amber-400" />
            <span className="hidden sm:inline">Save as Preset</span>
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleResetDefaultsClick}
            className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-xl transition"
            title="Reset to factory default theme"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          {/* Publish to Live Website */}
          <button
            type="button"
            onClick={handlePublish}
            disabled={saving}
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-950/50 transition disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? 'Publishing...' : 'Publish to Live Website'}</span>
          </button>
        </div>
      </header>


      {/* Success Notification Alert */}
      {saveSuccess && (
        <div className="p-2.5 bg-emerald-950/90 border-b border-emerald-600/60 text-emerald-200 text-xs font-bold flex items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <CheckCircle size={15} className="text-emerald-400" />
            <span>All visual and layout adjustments published live! Live site is updated.</span>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-emerald-300 hover:text-white font-mono text-[11px]"
          >
            View Live Site &rarr;
          </a>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE: EXPANSIVE LIVE MIRROR (LEFT) + STUDIO CONTROLS (RIGHT)  */}
      {/* ========================================================================= */}
      <main className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-3.5 p-3.5 min-h-0 overflow-hidden">
        {/* LEFT / CENTER: EXPANSIVE LIVE WEBSITE MIRROR */}
        <section className="xl:col-span-9 flex flex-col bg-[#0E1420] rounded-2xl p-2.5 shadow-2xl border border-slate-800/90 min-h-0 flex-1">
          {/* Mirror Window Chrome Bar */}
          <div className="flex items-center justify-between pb-2 mb-2 px-1 border-b border-slate-800/80 text-slate-300 text-xs font-mono">
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>http://localhost:3000/</span>
                <span className="text-slate-600">|</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Interactive Mirror</span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => setIframeKey((k) => k + 1)}
                className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                title="Reload Live Preview"
              >
                <RefreshCw size={13} />
              </button>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                title="Open Live Website in New Tab"
              >
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* LIVE MIRROR CANVAS CONTAINER */}
          <div className="flex-1 flex flex-col items-center justify-start overflow-hidden bg-[#060910] rounded-xl p-1.5 border border-slate-800/60 relative min-h-0">
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
                transition: 'max-width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="rounded-xl overflow-hidden shadow-2xl bg-white border border-slate-700/50 flex flex-col relative flex-1"
            >
              {/* EMBEDDED REAL LIVE WEBSITE (IFRAME) */}
              <iframe
                key={iframeKey}
                src="/?customize=1"
                title="Live Website Mirror Preview"
                className="w-full h-full flex-1 border-0"
              />
            </div>
          </div>
        </section>

        {/* RIGHT: USER-FRIENDLY STUDIO CONTROLS DOCK (COLOR PACKS, PALETTE, CATEGORIES, PRESETS) */}
        <aside className="xl:col-span-3 flex flex-col space-y-3 bg-white text-slate-900 rounded-2xl p-3.5 shadow-2xl border border-slate-200/90 overflow-y-auto min-h-0">
          {/* Studio Dock Navigation Tabs */}
          <div className="grid grid-cols-4 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('packs')}
              className={`py-2 px-1 rounded-lg transition flex flex-col sm:flex-row items-center justify-center space-x-1 ${
                activeTab === 'packs'
                  ? 'bg-white text-emerald-700 shadow-xs'
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
                  ? 'bg-white text-emerald-700 shadow-xs'
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
                  ? 'bg-white text-emerald-700 shadow-xs'
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
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bookmark size={14} />
              <span>Presets</span>
            </button>
          </div>

          {/* TAB 1: CURATED COLOR PACKS */}
          {activeTab === 'packs' && (
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-serif font-bold text-sm text-slate-900">Curated Editorial Color Packs</h3>
                <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">1-Click Apply</span>
              </div>
              <p className="text-xs text-slate-500">
                Select an editorial color pack to instantly update headers, cards, buttons, charts, and badges.
              </p>

              <div className="space-y-2.5">
                {COLOR_PACKS.map((pack) => {
                  const isSelected = theme.colorPack === pack.id;
                  return (
                    <div
                      key={pack.id}
                      onClick={() => handlePackSelect(pack)}
                      className={`p-3.5 rounded-xl border-2 transition cursor-pointer relative group ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-400/20'
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
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                            <Check size={12} />
                          </div>
                        )}
                      </div>

                      {/* Swatches */}
                      <div className="flex items-center space-x-2 mt-2.5 pt-2.5 border-t border-slate-100">
                        <span className="text-[10px] font-mono text-slate-400">Swatches:</span>
                        <div className="flex items-center space-x-1.5">
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                            style={{ backgroundColor: pack.primary }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                            style={{ backgroundColor: pack.navy }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                            style={{ backgroundColor: pack.secondary }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                            style={{ backgroundColor: pack.accent }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                            style={{ backgroundColor: pack.background }}
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
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-serif font-bold text-sm text-slate-900">Fine-Tuned Palette Pickers</h3>
                <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">Hex Precision</span>
              </div>

              {/* Core Colors */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Core Brand Colors</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Primary Brand', key: 'primaryColor', val: theme.primaryColor },
                    { label: 'Secondary Dark', key: 'secondaryColor', val: theme.secondaryColor },
                    { label: 'Deep Navy', key: 'navyColor', val: theme.navyColor },
                    { label: 'Accent Highlight', key: 'accentColor', val: theme.accentColor },
                    { label: 'Background', key: 'backgroundColor', val: theme.backgroundColor },
                  ].map((item) => (
                    <div key={item.key} className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">{item.label}</label>
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="color"
                          value={item.val}
                          onChange={(e) => handleColorChange(item.key, e.target.value)}
                          className="w-6 h-6 rounded border border-slate-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={item.val}
                          onChange={(e) => handleColorChange(item.key, e.target.value)}
                          className="w-full text-xs font-mono uppercase bg-white border border-slate-200 px-1.5 py-0.5 rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Accent Colors */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Individual Category Accents
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(CATEGORY_NAMES).map(([slug, name]) => {
                    const color = getCategoryColor(slug, theme.categoryColors);
                    return (
                      <div key={slug} className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                        <label className="text-[10px] font-bold text-slate-700 block mb-1 truncate" title={name}>
                          {name}
                        </label>
                        <div className="flex items-center space-x-1.5">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => handleCategoryColorChange(slug, e.target.value)}
                            className="w-6 h-6 rounded border border-slate-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={color}
                            onChange={(e) => handleCategoryColorChange(slug, e.target.value)}
                            className="w-full text-[11px] font-mono uppercase bg-white border border-slate-200 px-1.5 py-0.5 rounded"
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
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-serif font-bold text-sm text-slate-900">Rearrange Category Order</h3>
                <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">Drag or Click &uarr;&darr;</span>
              </div>
              <p className="text-xs text-slate-500">
                Reorder categories with mouse drag or Up/Down arrows. Live ribbon and header update automatically.
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
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between transition cursor-grab"
                    >
                      <div className="flex items-center space-x-2">
                        <GripVertical size={15} className="text-slate-400" />
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
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
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === currentOrder.length - 1}
                          onClick={() => handleMoveCategory(idx, 'down')}
                          className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200"
                          title="Move Category Down"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: PRESETS (NO DUPLICATE COLOR PACKS - DISTINCT SAVED LAYOUTS) */}
          {activeTab === 'presets' && (
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-serif font-bold text-sm text-slate-900">Design Presets & Templates</h3>
                <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">Layout Presets</span>
              </div>
              <p className="text-xs text-slate-500">
                Full-site layout configurations and user-saved presets. Distinct from individual color packs.
              </p>

              {/* Save Current as New Preset Form */}
              <form onSubmit={handleSavePresetSubmit} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Save Current Design as Preset</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="e.g. Festival 2026 Edition"
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                  <button
                    type="submit"
                    disabled={!newPresetName.trim()}
                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    Save Preset
                  </button>
                </div>
              </form>

              {/* Preset Cards */}
              <div className="space-y-2.5">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/60 transition flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-serif font-bold text-sm text-slate-900">{preset.name}</span>
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              preset.badge === 'CUSTOM'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {preset.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{preset.tagline}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300"
                          style={{ backgroundColor: preset.primaryColor }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300"
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
                          className="px-3 py-1 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition"
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

          {/* ========================================================================= */}
          {/* BOTTOM DOCK ACTIONS: SAVE AS PRESET & PUBLISH (ALWAYS PROMINENT AT BOTTOM) */}
          {/* ========================================================================= */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <button
              type="button"
              onClick={() => setShowSavePresetModal(true)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition flex items-center justify-center space-x-2 shadow-xs"
            >
              <Bookmark size={14} className="text-amber-500" />
              <span>Save Current Design as Preset</span>
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={saving}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? 'Publishing Live...' : 'Publish to Live Website'}</span>
            </button>
          </div>
        </aside>
      </main>

      {/* ========================================================================= */}
      {/* MODAL: SAVE AS PRESET DIALOG POPUP                                        */}
      {/* ========================================================================= */}
      {showSavePresetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in text-slate-900">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2 text-slate-900">
              <Bookmark size={20} className="text-emerald-600" />
              <h3 className="font-serif font-bold text-lg">Save Configuration as Preset</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Save your current combination of layout (split/full width), hero banner height, corner radius, color
              pack, and category order as a reusable preset template.
            </p>

            <form onSubmit={handleSavePresetSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Preset Template Name</label>
                <input
                  type="text"
                  autoFocus
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="e.g. Festival 2026 Edition"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSavePresetModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPresetName.trim()}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs disabled:opacity-50"
                >
                  Save Preset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* UNIVERSAL CONFIRMATION MODAL                                              */}
      {/* ========================================================================= */}
      {confirmModal && confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in text-slate-900">
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
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                Confirm & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
