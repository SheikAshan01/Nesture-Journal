'use client';

import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Palette,
  Sliders,
  Layout,
  Layers,
  Sparkles,
  Save,
  CheckCircle,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  Maximize2,
  Columns,
  Grid,
  MoveVertical,
  Type,
  Square,
  ChevronsUpDown,
} from 'lucide-react';
import { DEFAULT_THEME } from '@/lib/theme';
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

type SelectedSection = 'banner' | 'sideCards' | 'insights' | 'market' | 'radius';

export default function VisualCustomizerPage() {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [activeTab, setActiveTab] = useState<'packs' | 'palette' | 'layout'>('layout');
  const [activeSubSection, setActiveSubSection] = useState<SelectedSection>('banner');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleSelectPack = (pack: ColorPack) => {
    setTheme((prev) => {
      const next = {
        ...prev,
        colorPack: pack.id,
        primaryColor: pack.primary,
        secondaryColor: pack.secondary,
        navyColor: pack.navy,
        accentColor: pack.accent,
        backgroundColor: pack.background,
        surfaceColor: pack.surface,
      };
      applyThemeToDOM(next);
      return next;
    });
    setHasChanges(true);
  };

  const handleColorChange = (key: string, value: string) => {
    setTheme((prev) => {
      const next = {
        ...prev,
        [key]: value,
        colorPack: 'custom',
      };
      applyThemeToDOM(next);
      return next;
    });
    setHasChanges(true);
  };

  const handleCategoryColorChange = (category: string, value: string) => {
    setTheme((prev) => ({
      ...prev,
      categoryColors: {
        ...prev.categoryColors,
        [category]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleLayoutChange = (key: string, value: any) => {
    setTheme((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSectionToggle = (sectionKey: string) => {
    setTheme((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: !prev.sections[sectionKey as keyof typeof prev.sections],
      },
    }));
    setHasChanges(true);
  };

  // Interactive Mouse Drag-to-Resize handler
  const startMouseDragResize = (
    property: 'heroHeight' | 'sideCardHeight' | 'marketWidgetHeight' | 'insightsCardImageHeight',
    min: number,
    max: number,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    const startY = e.clientY;
    const initialVal = parseInt(theme[property] || '460', 10);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newVal = Math.max(min, Math.min(max, initialVal + deltaY));
      setTheme((prev) => ({
        ...prev,
        [property]: `${newVal}px`,
      }));
      setHasChanges(true);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all theme and sizing settings to factory default?')) {
      setTheme(DEFAULT_THEME);
      setHasChanges(true);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      // 1. Immediately apply to local DOM and broadcast to all browser tabs
      applyThemeToDOM(theme);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('nesture_theme', JSON.stringify(theme));
          window.dispatchEvent(new CustomEvent('nesture_theme_change', { detail: theme }));
          const bc = new BroadcastChannel('nesture_theme_channel');
          bc.postMessage(theme);
          bc.close();
        } catch {}
      }

      // 2. Persist to PostgreSQL database
      const res = await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setHasChanges(false);
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

  const heroHeightNum = parseInt(theme.heroHeight || '460', 10);
  const sideCardHeightNum = parseInt(theme.sideCardHeight || '85', 10);
  const sideCardThumbNum = parseInt(theme.sideCardThumbnailWidth || '96', 10);
  const insightsImgHeightNum = parseInt(theme.insightsCardImageHeight || '180', 10);
  const marketHeightNum = parseInt(theme.marketWidgetHeight || '404', 10);
  const borderRadiusNum = parseInt(theme.borderRadius || '14', 10);

  return (
    <AdminLayout>
      <div className={`flex flex-col h-full space-y-4 ${isDragging ? 'select-none' : ''}`}>
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-editorialBorder shadow-xs">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-brand uppercase tracking-wider">
              <Sparkles size={14} />
              <span>Interactive Visual Customizer Studio</span>
            </div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-editorialText-primary tracking-tight mt-0.5">
              Live Theme & Mouse-Drag Sizing Engine
            </h1>
            <p className="text-xs text-editorialText-secondary">
              Drag mouse on canvas or use sliders to resize each content element individually in real time.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition btn-press"
            >
              <RotateCcw size={14} />
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

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-deep text-xs font-bold rounded-xl flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} />
              <span>All visual and layout adjustments published live! Live site is updated.</span>
            </div>
            <a href="/" target="_blank" className="underline flex items-center space-x-1">
              <span>View Live Website</span>
              <ExternalLink size={12} />
            </a>
          </div>
        )}

        {/* Main Studio: 2 Columns (Controls on Left, Live Preview on Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1 min-h-0">
          {/* LEFT: Figma-Style Controls Sidebar (5 Cols on XL) */}
          <div className="xl:col-span-5 flex flex-col space-y-4">
            {/* Control Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('layout')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-bold rounded-lg transition btn-press ${
                  activeTab === 'layout'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layout size={14} />
                <span>Mouse Drag & Sizing</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('packs')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-bold rounded-lg transition btn-press ${
                  activeTab === 'packs'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Palette size={14} />
                <span>Color Packs</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('palette')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-bold rounded-lg transition btn-press ${
                  activeTab === 'palette'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders size={14} />
                <span>Custom Palette</span>
              </button>
            </div>

            {/* TAB 1: INDIVIDUAL CONTENT SIZING WITH MOUSE DRAG & SLIDERS */}
            {activeTab === 'layout' && (
              <div className="bg-white rounded-2xl border border-editorialBorder p-5 shadow-xs space-y-5 max-h-[640px] overflow-y-auto">
                {/* Content Selector Tabs */}
                <div>
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Individual Element Controls
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setActiveSubSection('banner')}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition ${
                        activeSubSection === 'banner' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Hero Banner
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSubSection('sideCards')}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition ${
                        activeSubSection === 'sideCards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Side Stories
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSubSection('insights')}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition ${
                        activeSubSection === 'insights' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Article Cards
                    </button>
                  </div>
                </div>

                {/* SECTION 1: HERO BIG BANNER */}
                {activeSubSection === 'banner' && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Width Mode */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                      <label className="text-xs font-bold text-slate-800 block">
                        Hero Banner Width Mode
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleLayoutChange('heroWidth', 'split')}
                          className={`p-2.5 rounded-xl border-2 text-left transition ${
                            theme.heroWidth === 'split'
                              ? 'border-emerald-brand bg-white shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                            <Columns size={14} className="text-emerald-brand" />
                            <span>8-Col Split</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">With 3 side stories on right</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleLayoutChange('heroWidth', 'full')}
                          className={`p-2.5 rounded-xl border-2 text-left transition ${
                            theme.heroWidth === 'full'
                              ? 'border-emerald-brand bg-white shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                            <Maximize2 size={14} className="text-emerald-brand" />
                            <span>12-Col Full Width</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">Side stories reflow below!</div>
                        </button>
                      </div>
                    </div>

                    {/* Mouse Drag Height Slider */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                          <MoveVertical size={14} className="text-emerald-brand" />
                          <span>Hero Banner Height (Drag with Mouse)</span>
                        </label>
                        <span className="text-xs font-mono font-bold text-emerald-brand px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                          {theme.heroHeight}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="280"
                        max="650"
                        step="10"
                        value={heroHeightNum}
                        onChange={(e) => handleLayoutChange('heroHeight', `${e.target.value}px`)}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-emerald-brand"
                      />

                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Compact (280px)</span>
                        <span>Standard (460px)</span>
                        <span>Large (650px)</span>
                      </div>
                    </div>

                    {/* Corner Rounding Slider */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                          <Square size={14} className="text-emerald-brand" />
                          <span>Banner & Card Corner Rounding</span>
                        </label>
                        <span className="text-xs font-mono font-bold text-emerald-brand px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                          {theme.borderRadius}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="32"
                        step="2"
                        value={borderRadiusNum}
                        onChange={(e) => handleLayoutChange('borderRadius', `${e.target.value}px`)}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-emerald-brand"
                      />

                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Sharp (0px)</span>
                        <span>Modern (14px)</span>
                        <span>Pill (32px)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 2: SIDE HIGHLIGHT STORIES */}
                {activeSubSection === 'sideCards' && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Individual Side Card Height */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800">
                          Side Card Height (Drag with Mouse)
                        </label>
                        <span className="text-xs font-mono font-bold text-emerald-brand px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                          {theme.sideCardHeight || '85px'}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="60"
                        max="130"
                        step="5"
                        value={sideCardHeightNum}
                        onChange={(e) => handleLayoutChange('sideCardHeight', `${e.target.value}px`)}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-emerald-brand"
                      />

                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Compact (60px)</span>
                        <span>Normal (85px)</span>
                        <span>Spacious (130px)</span>
                      </div>
                    </div>

                    {/* Thumbnail Width */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800">
                          Thumbnail Photo Width (Drag with Mouse)
                        </label>
                        <span className="text-xs font-mono font-bold text-emerald-brand px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                          {theme.sideCardThumbnailWidth || '96px'}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="60"
                        max="140"
                        step="4"
                        value={sideCardThumbNum}
                        onChange={(e) => handleLayoutChange('sideCardThumbnailWidth', `${e.target.value}px`)}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-emerald-brand"
                      />

                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Small (60px)</span>
                        <span>Standard (96px)</span>
                        <span>Large (140px)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 3: ARTICLE CARDS & MARKET INTELLIGENCE */}
                {activeSubSection === 'insights' && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Article Image Height */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800">
                          Article Card Image Height (Drag with Mouse)
                        </label>
                        <span className="text-xs font-mono font-bold text-emerald-brand px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                          {theme.insightsCardImageHeight || '180px'}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="120"
                        max="260"
                        step="10"
                        value={insightsImgHeightNum}
                        onChange={(e) => handleLayoutChange('insightsCardImageHeight', `${e.target.value}px`)}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-emerald-brand"
                      />

                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Compact (120px)</span>
                        <span>Standard (180px)</span>
                        <span>Tall (260px)</span>
                      </div>
                    </div>

                    {/* Market Intelligence Widget Height */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800">
                          Market Intelligence Height (Drag with Mouse)
                        </label>
                        <span className="text-xs font-mono font-bold text-emerald-brand px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                          {theme.marketWidgetHeight || '404px'}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="300"
                        max="540"
                        step="10"
                        value={marketHeightNum}
                        onChange={(e) => handleLayoutChange('marketWidgetHeight', `${e.target.value}px`)}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-emerald-brand"
                      />

                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Compact (300px)</span>
                        <span>Current (404px)</span>
                        <span>Expanded (540px)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Visibility Toggles */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Section Visibility Toggles
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { key: 'ticker', label: 'Realty Stocks Marquee Ticker' },
                      { key: 'hero', label: 'Hero Big Banner & Highlights' },
                      { key: 'latestInsights', label: 'Latest Insights Grid' },
                      { key: 'marketIntelligence', label: 'Market Intelligence & Index Chart' },
                      { key: 'sectorSpotlight', label: 'Sector Spotlight Multi-Tab Hub' },
                    ].map((sec) => {
                      const isVisible = theme.sections?.[sec.key as keyof typeof theme.sections] ?? true;
                      return (
                        <div
                          key={sec.key}
                          onClick={() => handleSectionToggle(sec.key)}
                          className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition"
                        >
                          <span className="text-xs font-medium text-slate-800">{sec.label}</span>
                          <span className={`text-xs font-bold flex items-center space-x-1 ${isVisible ? 'text-emerald-brand' : 'text-slate-400'}`}>
                            {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                            <span>{isVisible ? 'Visible' : 'Hidden'}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PRESET COLOR PACKS */}
            {activeTab === 'packs' && (
              <div className="bg-white rounded-2xl border border-editorialBorder p-5 shadow-xs space-y-3.5 max-h-[640px] overflow-y-auto">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  One-Click Editorial Theme Packs
                </div>

                <div className="space-y-3">
                  {COLOR_PACKS.map((pack) => {
                    const isSelected = theme.colorPack === pack.id;
                    return (
                      <div
                        key={pack.id}
                        onClick={() => handleSelectPack(pack)}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all btn-press ${
                          isSelected
                            ? 'border-emerald-brand bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/10'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-serif font-bold text-sm text-slate-900">
                              {pack.name}
                            </span>
                            {isSelected && (
                              <span className="px-2 py-0.5 bg-emerald-brand text-white text-[10px] font-mono font-bold rounded-full">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {pack.tag}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mb-3">{pack.description}</p>

                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-lg border border-black/10 shadow-2xs" style={{ backgroundColor: pack.primary }} />
                          <div className="w-7 h-7 rounded-lg border border-black/10 shadow-2xs" style={{ backgroundColor: pack.secondary }} />
                          <div className="w-7 h-7 rounded-lg border border-black/10 shadow-2xs" style={{ backgroundColor: pack.navy }} />
                          <div className="w-7 h-7 rounded-lg border border-black/10 shadow-2xs" style={{ backgroundColor: pack.accent }} />
                          <div className="w-7 h-7 rounded-lg border border-slate-300 shadow-2xs" style={{ backgroundColor: pack.background }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: CUSTOM PALETTE */}
            {activeTab === 'palette' && (
              <div className="bg-white rounded-2xl border border-editorialBorder p-5 shadow-xs space-y-4 max-h-[640px] overflow-y-auto">
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Core Color Palette
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fine-tune individual hex codes. Changes reflect immediately in the live preview.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Primary Brand Accent</label>
                    <span className="text-xs font-mono font-bold text-slate-600">{theme.primaryColor}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={theme.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                    />
                    <input
                      type="text"
                      value={theme.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs font-mono uppercase bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Secondary / Deep Tone</label>
                    <span className="text-xs font-mono font-bold text-slate-600">{theme.secondaryColor}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={theme.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                    />
                    <input
                      type="text"
                      value={theme.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs font-mono uppercase bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Header Dark Navy Tone</label>
                    <span className="text-xs font-mono font-bold text-slate-600">{theme.navyColor}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={theme.navyColor}
                      onChange={(e) => handleColorChange('navyColor', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                    />
                    <input
                      type="text"
                      value={theme.navyColor}
                      onChange={(e) => handleColorChange('navyColor', e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs font-mono uppercase bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Page Background</label>
                    <span className="text-xs font-mono font-bold text-slate-600">{theme.backgroundColor}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={theme.backgroundColor}
                      onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                    />
                    <div className="flex items-center space-x-1.5 flex-1">
                      {['#FFFFFF', '#F8FAFC', '#F5F7F6', '#0B132B'].map((bg) => (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => handleColorChange('backgroundColor', bg)}
                          className={`px-2 py-1 text-[10px] font-mono rounded border ${
                            theme.backgroundColor === bg ? 'border-emerald-brand bg-emerald-50 text-emerald-800 font-bold' : 'bg-white text-slate-600'
                          }`}
                        >
                          {bg}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Individual Category Badges
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(theme.categoryColors || {}).map(([cat, color]) => (
                      <div key={cat} className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                        <span className="text-xs capitalize font-medium text-slate-700">{cat}</span>
                        <input
                          type="color"
                          value={color as string}
                          onChange={(e) => handleCategoryColorChange(cat, e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Live Interactive Preview Canvas (7 Cols on XL) with Mouse Drag Handles */}
          <div className="xl:col-span-7 flex flex-col bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-800 min-h-[640px]">
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-300">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-white">Interactive Figma Canvas</span>
                <span className="text-[10px] font-mono bg-slate-800 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Drag handles on canvas with mouse to resize
                </span>
              </div>

              {/* Device Selector */}
              <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded transition ${
                    previewDevice === 'desktop' ? 'bg-emerald-brand text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Desktop View (1440px)"
                >
                  <Monitor size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded transition ${
                    previewDevice === 'tablet' ? 'bg-emerald-brand text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tablet View (768px)"
                >
                  <Tablet size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded transition ${
                    previewDevice === 'mobile' ? 'bg-emerald-brand text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mobile View (375px)"
                >
                  <Smartphone size={14} />
                </button>
              </div>
            </div>

            {/* Simulated Live Website Frame */}
            <div className="flex-1 flex items-start justify-center overflow-auto pt-4 pb-2">
              <div
                style={{
                  backgroundColor: theme.backgroundColor,
                  borderRadius: theme.borderRadius,
                  maxWidth: previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '768px' : '375px',
                  width: '100%',
                  transition: isDragging ? 'none' : 'max-width 0.3s ease',
                }}
                className="border border-slate-300 shadow-2xl overflow-hidden font-sans text-slate-900"
              >
                {/* Simulated Ticker */}
                {theme.sections.ticker && (
                  <div
                    style={{ backgroundColor: theme.navyColor }}
                    className="text-white text-[10px] px-3 py-1.5 flex items-center justify-between border-b border-white/10"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-bold" style={{ color: theme.primaryColor }}>REALTY STOCKS</span>
                      <span>DLF ₹812.40 +1.76%</span>
                      <span>Godrej Prop ₹2,834.20 +2.11%</span>
                    </div>
                    <span className="opacity-60 hidden sm:inline">LIVE SIMULATION</span>
                  </div>
                )}

                {/* Simulated Header */}
                <div
                  style={{ backgroundColor: theme.navyColor }}
                  className="px-4 py-3 flex items-center justify-between border-b border-white/10 text-white"
                >
                  <div className="font-serif font-extrabold text-base tracking-tight">
                    Nesture<span style={{ color: theme.primaryColor }}>Journal</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs opacity-80">
                    <span>Residential</span>
                    <span>Commercial</span>
                    <span>Development</span>
                    <span>Finance</span>
                  </div>
                  <button
                    style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
                    className="px-2.5 py-1 text-white text-[11px] font-bold shadow-xs"
                  >
                    Subscribe
                  </button>
                </div>

                {/* Simulated Hero Section with Mouse Drag Handle */}
                {theme.sections.hero && (
                  <div className="p-4 space-y-3">
                    {theme.heroWidth === 'full' ? (
                      // 12-Column Full Width Hero Banner
                      <div className="space-y-4">
                        <div
                          style={{
                            height: theme.heroHeight,
                            borderRadius: theme.borderRadius,
                            backgroundImage: `linear-gradient(to right, ${theme.navyColor} 40%, rgba(7, 27, 43, 0.4)), url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80)`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                          className="p-6 text-white flex flex-col justify-end relative shadow-md group border-2 border-emerald-brand/40 hover:border-emerald-brand transition-all"
                        >
                          {/* Top-Right Dimension Tag */}
                          <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-[10px] font-mono text-emerald-300 rounded border border-emerald-400/30">
                            Banner: {theme.heroHeight} × 12-Cols
                          </div>

                          <div className="space-y-2 max-w-xl">
                            <span
                              style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
                              className="px-2.5 py-0.5 text-[10px] font-bold uppercase inline-block"
                            >
                              FLAGSHIP EDITORIAL (12-COL FULL WIDTH)
                            </span>
                            <h2 className="font-serif font-bold text-xl sm:text-2xl leading-tight">
                              The Future of Real Estate, Clearly Told
                            </h2>
                            <p className="text-xs text-gray-200 line-clamp-2">
                              Full-width immersive banner layout automatically adjusting layout flow across viewports.
                            </p>
                            <button
                              style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
                              className="px-3.5 py-1.5 text-xs font-bold text-white shadow-xs inline-block mt-1"
                            >
                              Read Full Story
                            </button>
                          </div>

                          {/* DIRECT MOUSE DRAG RESIZE HANDLE AT BOTTOM */}
                          <div
                            onMouseDown={(e) => startMouseDragResize('heroHeight', 280, 650, e)}
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-brand text-white rounded-full text-[10px] font-mono font-bold flex items-center space-x-1 cursor-ns-resize shadow-md hover:scale-105 active:scale-95 transition z-20 group-hover:opacity-100"
                            title="Click and drag with mouse up/down to make bigger or smaller"
                          >
                            <ChevronsUpDown size={12} />
                            <span>Drag with mouse to resize ({theme.heroHeight})</span>
                          </div>
                        </div>

                        {/* Side stories automatically reflowed underneath into a 3-column row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            'Affordable Housing Gains Momentum Across Tier-2 Cities',
                            "Office Space Demand Remains Strong in India's Major Markets",
                            "Global Investors Eye India's Real Estate Growth Story",
                          ].map((title, i) => (
                            <div
                              key={i}
                              style={{
                                height: theme.sideCardHeight || '85px',
                                borderRadius: theme.borderRadius,
                              }}
                              className="p-3 bg-white border border-slate-200 shadow-2xs flex flex-col justify-between"
                            >
                              <span style={{ color: theme.primaryColor }} className="text-[10px] font-bold uppercase">
                                REFLOWED STORY 0{i + 1}
                              </span>
                              <div className="font-serif font-bold text-xs text-slate-900 line-clamp-2">
                                {title}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // 8-Column Split Layout
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                        <div
                          style={{
                            height: theme.heroHeight,
                            borderRadius: theme.borderRadius,
                            backgroundImage: `linear-gradient(to right, ${theme.navyColor} 40%, rgba(7, 27, 43, 0.4)), url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80)`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                          className="lg:col-span-8 p-5 text-white flex flex-col justify-end relative shadow-md group border-2 border-emerald-brand/40 hover:border-emerald-brand transition-all"
                        >
                          <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-[10px] font-mono text-emerald-300 rounded border border-emerald-400/30">
                            Banner: {theme.heroHeight} × 8-Cols
                          </div>

                          <div className="space-y-2">
                            <span
                              style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
                              className="px-2 py-0.5 text-[9px] font-bold uppercase inline-block"
                            >
                              SPLIT 8-COL BANNER
                            </span>
                            <h2 className="font-serif font-bold text-lg sm:text-xl leading-tight">
                              The Future of Real Estate, Clearly Told
                            </h2>
                            <p className="text-[11px] text-gray-200 line-clamp-2">
                              Standard 65% / 35% hero ratio with 3 stacked cards on the right.
                            </p>
                          </div>

                          {/* DIRECT MOUSE DRAG RESIZE HANDLE AT BOTTOM */}
                          <div
                            onMouseDown={(e) => startMouseDragResize('heroHeight', 280, 650, e)}
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-brand text-white rounded-full text-[10px] font-mono font-bold flex items-center space-x-1 cursor-ns-resize shadow-md hover:scale-105 active:scale-95 transition z-20 group-hover:opacity-100"
                            title="Click and drag with mouse up/down to make bigger or smaller"
                          >
                            <ChevronsUpDown size={12} />
                            <span>Drag with mouse to resize ({theme.heroHeight})</span>
                          </div>
                        </div>

                        {/* 3 Stacked Cards on Right (4 Cols) with Individual Height */}
                        <div className="lg:col-span-4 flex flex-col justify-between space-y-2">
                          {[
                            'Affordable Housing Gains Momentum Across Tier-2 Cities',
                            "Office Space Demand Remains Strong in India's Major Markets",
                            "Global Investors Eye India's Real Estate Growth Story",
                          ].map((title, i) => (
                            <div
                              key={i}
                              style={{
                                height: theme.sideCardHeight || '85px',
                                borderRadius: theme.borderRadius,
                              }}
                              className="p-2.5 bg-white border border-slate-200 shadow-2xs flex-1 flex flex-col justify-center space-y-1 relative group"
                            >
                              <span style={{ color: theme.primaryColor }} className="text-[9px] font-bold uppercase">
                                HIGHLIGHT 0{i + 1}
                              </span>
                              <div className="font-serif font-bold text-[11px] text-slate-800 line-clamp-2">
                                {title}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Simulated Article Cards & Market Intelligence Section */}
                {theme.sections.latestInsights && (
                  <div className="p-4 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xs text-slate-800">Latest Insights</span>
                      <span className="text-[10px] text-slate-400">Card Image: {theme.insightsCardImageHeight || '180px'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2].map((n) => (
                        <div
                          key={n}
                          style={{ borderRadius: theme.borderRadius }}
                          className="bg-white border border-slate-200 overflow-hidden shadow-2xs relative group"
                        >
                          <div
                            style={{ height: theme.insightsCardImageHeight || '180px' }}
                            className="bg-slate-200 relative overflow-hidden"
                          >
                            <img
                              src={
                                n === 1
                                  ? 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=400&q=80'
                                  : 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80'
                              }
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            {/* Mouse drag resize handle for cards */}
                            <div
                              onMouseDown={(e) => startMouseDragResize('insightsCardImageHeight', 120, 260, e)}
                              className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white rounded text-[9px] font-mono cursor-ns-resize"
                              title="Drag with mouse to resize image height"
                            >
                              ↕ {theme.insightsCardImageHeight || '180px'}
                            </div>
                          </div>
                          <div className="p-2.5 space-y-1">
                            <span style={{ color: theme.primaryColor }} className="text-[9px] font-bold">
                              RESIDENTIAL
                            </span>
                            <div className="font-serif font-bold text-xs text-slate-900 line-clamp-1">
                              {n === 1 ? 'Top Residential Hotspots to Watch' : 'Office Leasing Surges in Tech Hubs'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Simulated Category Badges Bar */}
                <div className="px-4 py-2 border-t border-slate-200 flex flex-wrap gap-1.5 bg-slate-50">
                  {Object.entries(theme.categoryColors || {}).map(([cat, color]) => (
                    <span
                      key={cat}
                      style={{
                        backgroundColor: `${color}15`,
                        color: color as string,
                        borderColor: `${color}40`,
                        borderRadius: theme.borderRadius,
                      }}
                      className="px-2 py-0.5 text-[10px] font-bold border uppercase"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
