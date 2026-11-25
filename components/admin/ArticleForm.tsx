'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Tag,
  Search,
  ExternalLink,
  Bold,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Video,
  Maximize2,
  Minimize2,
  Code,
  HelpCircle,
  Table as TableIcon,
  Palette,
  ChevronDown,
  Wand2,
} from 'lucide-react';
import Link from 'next/link';

interface ArticleFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const FONT_OPTIONS = [
  'sans-serif',
  'Arial',
  'Arial Black',
  'Comic Sans MS',
  'Courier New',
  'Helvetica',
  'Impact',
  'Tahoma',
  'Times New Roman',
  'Verdana',
];

const HEADING_OPTIONS = [
  { label: 'Normal', tag: 'p' },
  { label: 'Header 2', tag: 'h2' },
  { label: 'Header 3', tag: 'h3' },
  { label: 'Header 4', tag: 'h4' },
];

const COLOR_PALETTE = [
  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
  '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
  '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
  '#071B2B', '#102B3D', '#008F5A', '#006B45', '#1B365D', '#0284C7', '#EAB308', '#EF4444', '#10B981', '#6366F1'
];

export default function ArticleForm({ initialData, isEditing = false }: ArticleFormProps) {
  const router = useRouter();

  // Basic Details matching Screenshot 2026-11-24 211708.png
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [subcategoryId, setSubcategoryId] = useState(initialData?.subcategoryId || '');
  const [sourceName, setSourceName] = useState(initialData?.sourceName || 'PropNewsTime');
  const [sourceUrl, setSourceUrl] = useState(initialData?.sourceUrl || '');
  const [publishDate, setPublishDate] = useState(
    initialData?.publicationDate
      ? new Date(initialData.publicationDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState(initialData?.status || 'DRAFT');
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || '');
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || '');
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '');
  const [content, setContent] = useState(initialData?.content || '');

  // SEO & Social Graph matching Screenshots 2026-11-24 211800.png & 211808.png
  const [seoKeywords, setSeoKeywords] = useState(initialData?.seoKeywords || '');
  const [tagsString, setTagsString] = useState(
    initialData?.tags?.map((t: any) => t.tag?.name || t.name).join(', ') || ''
  );
  const [metaTitle, setMetaTitle] = useState(initialData?.seoTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.seoDescription || '');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [robotsMeta, setRobotsMeta] = useState('Index, Follow');
  const [ogTitle, setOgTitle] = useState(initialData?.title || '');
  const [ogDescription, setOgDescription] = useState(initialData?.shortDescription || '');
  const [ogImage, setOgImage] = useState(initialData?.featuredImage || '');
  const [applyNofollow, setApplyNofollow] = useState(false);

  // Editorial Flags
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [isTrending, setIsTrending] = useState(initialData?.isTrending || false);
  const [isBreaking, setIsBreaking] = useState(initialData?.isBreaking || false);

  // Editor Toolbar State matching Screenshot 2026-11-24 211729.png & 211741.png
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [heading, setHeading] = useState('Normal');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [showTableGrid, setShowTableGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Form helpers
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
      });
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    const cat = categories.find((c) => c.id === categoryId);
    if (cat?.subcategories) {
      setSubcategories(cat.subcategories);
    } else {
      setSubcategories([]);
    }
  }, [categoryId, categories]);

  // Insert formatting into textarea
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('article-content-body') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    setContent(content.substring(0, start) + replacement + content.substring(end));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 10);
  };

  const handleHeadingSelect = (item: typeof HEADING_OPTIONS[0]) => {
    setHeading(item.label);
    setShowHeadingDropdown(false);
    if (item.tag === 'h2') insertFormatting('\n## ', '\n');
    else if (item.tag === 'h3') insertFormatting('\n### ', '\n');
    else if (item.tag === 'h4') insertFormatting('\n#### ', '\n');
  };

  const handleFontSelect = (font: string) => {
    setFontFamily(font);
    setShowFontDropdown(false);
    insertFormatting(`<span style="font-family: ${font}">`, '</span>');
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setShowColorPicker(false);
    insertFormatting(`<span style="color: ${color}">`, '</span>');
  };

  const handleInsertTable = (rows: number, cols: number) => {
    setShowTableGrid(false);
    let table = '\n| ' + Array(cols).fill('Header').join(' | ') + ' |\n';
    table += '| ' + Array(cols).fill('---').join(' | ') + ' |\n';
    for (let r = 0; r < rows; r++) {
      table += '| ' + Array(cols).fill('Cell').join(' | ') + ' |\n';
    }
    insertFormatting(table);
  };

  // Run Content Audit
  const runAnalysis = async () => {
    if (!title && !content) return;
    setAnalyzing(true);
    setError('');

    try {
      const res = await fetch('/api/content-engine/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          shortDescription,
          content,
          featuredImage,
          imageAlt,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (targetStatus?: string) => {
    setError('');
    setSuccess('');
    setSaving(true);

    const postStatus = targetStatus || status;

    const payload = {
      title,
      slug: slug || undefined,
      shortDescription,
      content,
      featuredImage: featuredImage || null,
      imageAlt: imageAlt || null,
      categoryId,
      subcategoryId: subcategoryId || null,
      status: postStatus,
      isFeatured,
      isTrending,
      isBreaking,
      sourceName: sourceName || null,
      sourceUrl: sourceUrl || null,
      sourceAttribution: sourceName ? `${sourceName} Editorial` : null,
      seoTitle: metaTitle || title,
      seoDescription: metaDescription || shortDescription,
      canonicalUrl: sourceUrl || null,
    };

    try {
      const url = isEditing ? `/api/articles/${initialData.id}` : '/api/articles';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save article.');
        setSaving(false);
        return;
      }

      setSuccess(`Article successfully ${postStatus === 'PUBLISHED' ? 'published' : 'saved as draft'}!`);
      setTimeout(() => {
        router.push(postStatus === 'PUBLISHED' ? '/admin/articles?status=PUBLISHED' : '/admin/articles?status=UNPUBLISHED');
      }, 1000);
    } catch (err: any) {
      setError('A network error occurred while saving.');
      setSaving(false);
    }
  };

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : ''}`}>
      {/* Top Header matching reference */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/articles"
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-gray-600"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-serif font-bold text-2xl md:text-3xl text-gray-900 tracking-tight">
              {isEditing ? 'Edit Article' : 'Add New Article'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Draft, categorize, and publish real estate intelligence with rich editorial formatting.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => handleSubmit('DRAFT')}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold rounded-lg text-gray-700 transition"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('PUBLISHED')}
            disabled={saving}
            className="px-5 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center space-x-1.5"
          >
            <Save size={14} />
            <span>{saving ? 'Processing...' : 'Submit & Publish'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle size={16} />
          <span>{success}</span>
        </div>
      )}

      {/* Main Form Fields matching Screenshots 2026-11-24 211708.png through 211808.png */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
        {/* ROW 1: Title | Category Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!metaTitle) setMetaTitle(e.target.value);
                if (!ogTitle) setOgTitle(e.target.value);
              }}
              placeholder="e.g. ₹83.8 Crore Worth Villas Bought by Meesho Founder in Bengaluru"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Category Name *
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-[#0284C7]"
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ROW 2: Source Name | Publish Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Source Name
            </label>
            <div className="space-y-1.5">
              <input
                type="text"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="e.g. PropNewsTime, Realty & More, Businessfortnight"
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:border-[#0284C7]"
              />
              <div className="flex flex-wrap gap-1.5">
                {['PropNewsTime', 'Realty & More', 'Businessfortnight', 'Business Standard', 'ET Realty', 'Reuters'].map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSourceName(src)}
                    className={`text-[10px] px-2 py-0.5 rounded border transition ${
                      sourceName === src
                        ? 'bg-[#0284C7] text-white border-[#0284C7]'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Publish Date
            </label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#0284C7]"
            />
          </div>
        </div>

        {/* ROW 3: Publish Status | Choose Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Publish Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:border-[#0284C7]"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Choose Image (Support only png / webp / jpg)
            </label>
            <div className="space-y-1.5">
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => {
                  setFeaturedImage(e.target.value);
                  if (!ogImage) setOgImage(e.target.value);
                }}
                placeholder="Paste image URL (e.g. https://... or /uploads/...)"
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#0284C7]"
              />
              {featuredImage && (
                <div className="w-24 h-16 rounded-md overflow-hidden border border-gray-200 mt-1 relative">
                  <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ROW 4: Feature Image Alt Text | Article URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Feature Image Alt Text
            </label>
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="e.g. Modern residential complex view"
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Article URL (Original Link or Custom Slug)
            </label>
            <input
              type="text"
              value={sourceUrl || slug}
              onChange={(e) => {
                setSourceUrl(e.target.value);
                setSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase());
              }}
              placeholder="https://propnewstime.com/... or custom-slug"
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-mono focus:outline-none focus:border-[#0284C7]"
            />
          </div>
        </div>

        {/* ROW 5: Summary */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Summary
          </label>
          <textarea
            rows={3}
            value={shortDescription}
            onChange={(e) => {
              setShortDescription(e.target.value);
              if (!metaDescription) setMetaDescription(e.target.value);
              if (!ogDescription) setOgDescription(e.target.value);
            }}
            placeholder="Write a clear editorial summary of the story..."
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-xs leading-relaxed focus:outline-none focus:border-[#0284C7]"
          />
        </div>

        {/* ROW 6: Body (H2/H3/H4 only) with Rich Text Toolbar matching Screenshots */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-gray-700">
              Body (H2/H3/H4 only)
            </label>
            <div className="flex items-center space-x-2 text-[11px] text-gray-500">
              <button
                type="button"
                onClick={runAnalysis}
                disabled={analyzing}
                className="text-[#0284C7] hover:underline font-semibold flex items-center space-x-1"
              >
                <Wand2 size={12} />
                <span>{analyzing ? 'Auditing...' : 'AI Audit Content'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Rich Toolbar matching Screenshots 2026-11-24 211721.png to 211748.png */}
          <div className="border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
            <div className="p-2 border-b border-gray-300 bg-gray-100/80 flex flex-wrap items-center gap-1.5 text-xs text-gray-700">
              {/* Magic Audit */}
              <button
                type="button"
                onClick={runAnalysis}
                title="AI Content Assist"
                className="p-1.5 hover:bg-white rounded transition text-emerald-700"
              >
                <Sparkles size={14} />
              </button>

              <div className="h-4 w-px bg-gray-300 mx-0.5"></div>

              {/* Headings dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
                  className="px-2 py-1 bg-white border border-gray-300 rounded flex items-center space-x-1 text-xs font-medium hover:bg-gray-50"
                >
                  <span>{heading}</span>
                  <ChevronDown size={11} />
                </button>
                {showHeadingDropdown && (
                  <div className="absolute left-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-30">
                    {HEADING_OPTIONS.map((item) => (
                      <button
                        key={item.tag}
                        type="button"
                        onClick={() => handleHeadingSelect(item)}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 block font-medium"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Font Family selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFontDropdown(!showFontDropdown)}
                  className="px-2 py-1 bg-white border border-gray-300 rounded flex items-center space-x-1 text-xs font-medium hover:bg-gray-50"
                >
                  <span className="truncate max-w-[80px]">{fontFamily}</span>
                  <ChevronDown size={11} />
                </button>
                {showFontDropdown && (
                  <div className="absolute left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-30 max-h-48 overflow-y-auto">
                    {FONT_OPTIONS.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => handleFontSelect(f)}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 block"
                        style={{ fontFamily: f }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Color Palette dropdown matching Screenshot 2026-11-24 211729.png */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-1.5 bg-white border border-gray-300 rounded flex items-center space-x-1 hover:bg-gray-50"
                  title="Text & Background Color"
                >
                  <span className="font-bold underline" style={{ color: selectedColor }}>A</span>
                  <ChevronDown size={10} />
                </button>
                {showColorPicker && (
                  <div className="absolute left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-200 p-2.5 z-30">
                    <div className="text-[10px] text-gray-500 font-bold mb-1">Color Palette</div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {COLOR_PALETTE.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => handleColorSelect(c)}
                          className="w-6 h-6 rounded border border-gray-300 transition hover:scale-110"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleColorSelect('#000000')}
                      className="mt-2 text-[10px] text-gray-600 hover:text-black block text-center w-full"
                    >
                      Reset to default
                    </button>
                  </div>
                )}
              </div>

              <div className="h-4 w-px bg-gray-300 mx-0.5"></div>

              {/* Bold, Underline, Strikethrough */}
              <button
                type="button"
                onClick={() => insertFormatting('**', '**')}
                className="p-1.5 hover:bg-white rounded transition font-bold"
                title="Bold"
              >
                <Bold size={13} />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<u>', '</u>')}
                className="p-1.5 hover:bg-white rounded transition"
                title="Underline"
              >
                <Underline size={13} />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('~~', '~~')}
                className="p-1.5 hover:bg-white rounded transition"
                title="Strikethrough"
              >
                <Strikethrough size={13} />
              </button>

              <div className="h-4 w-px bg-gray-300 mx-0.5"></div>

              {/* Lists */}
              <button
                type="button"
                onClick={() => insertFormatting('\n- ')}
                className="p-1.5 hover:bg-white rounded transition"
                title="Bullet List"
              >
                <List size={14} />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('\n1. ')}
                className="p-1.5 hover:bg-white rounded transition"
                title="Numbered List"
              >
                <ListOrdered size={14} />
              </button>

              {/* Alignments */}
              <button
                type="button"
                onClick={() => insertFormatting('<div align="left">', '</div>')}
                className="p-1.5 hover:bg-white rounded transition"
                title="Align Left"
              >
                <AlignLeft size={13} />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<div align="center">', '</div>')}
                className="p-1.5 hover:bg-white rounded transition"
                title="Align Center"
              >
                <AlignCenter size={13} />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<div align="right">', '</div>')}
                className="p-1.5 hover:bg-white rounded transition"
                title="Align Right"
              >
                <AlignRight size={13} />
              </button>

              <div className="h-4 w-px bg-gray-300 mx-0.5"></div>

              {/* Table Picker matching Screenshot 2026-11-24 211748.png */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTableGrid(!showTableGrid)}
                  className="p-1.5 hover:bg-white rounded transition flex items-center space-x-0.5"
                  title="Insert Table Grid"
                >
                  <TableIcon size={14} />
                  <ChevronDown size={10} />
                </button>
                {showTableGrid && (
                  <div className="absolute left-0 mt-1 bg-white p-2.5 rounded-xl shadow-xl border border-gray-200 z-30">
                    <div className="text-[10px] text-gray-500 font-bold mb-1">Insert Table</div>
                    <div className="grid grid-cols-4 gap-1">
                      {[1, 2, 3, 4].map((r) =>
                        [1, 2, 3, 4].map((c) => (
                          <button
                            key={`${r}-${c}`}
                            type="button"
                            onClick={() => handleInsertTable(r, c)}
                            className="w-5 h-5 border border-gray-300 hover:bg-[#0284C7] hover:border-[#0284C7] transition"
                            title={`${r} x ${c}`}
                          />
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Link, Image, Video */}
              <button
                type="button"
                onClick={() => insertFormatting('[Link Text](', ')')}
                className="p-1.5 hover:bg-white rounded transition"
                title="Insert Link"
              >
                <LinkIcon size={13} />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('![Image Alt](', ')')}
                className="p-1.5 hover:bg-white rounded transition"
                title="Insert Image"
              >
                <ImageIcon size={13} />
              </button>

              {/* Fullscreen & Code */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 hover:bg-white rounded transition ml-auto"
                title="Full Screen Toggle"
              >
                {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
            </div>

            {/* Editable Content Canvas */}
            <textarea
              id="article-content-body"
              rows={16}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Draft the article body content here..."
              className="w-full p-4 bg-white text-sm font-sans leading-relaxed text-gray-900 focus:outline-none"
              style={{ fontFamily }}
            />
          </div>
        </div>

        {/* Content Engine Audit Insights Preview */}
        {analysis && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
            <div className="font-bold text-gray-900 flex items-center space-x-1.5">
              <Sparkles size={14} className="text-emerald-600" />
              <span>Internal Content Audit Results</span>
            </div>
            {analysis.duplicateWarning && (
              <div className="text-red-600">
                ⚠️ Duplicate Warning: Similar title found "{analysis.duplicateWarning.matchedTitle}"
              </div>
            )}
            {analysis.qualityAudit && (
              <div className="text-gray-600">
                Word Count: {analysis.qualityAudit.wordCount} words • Estimated reading time: {analysis.qualityAudit.readingTime} mins • Quality: {analysis.qualityAudit.healthStatus}
              </div>
            )}
          </div>
        )}

        {/* ROW 7: SEO Keywords */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            SEO Keywords
          </label>
          <textarea
            rows={2}
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            placeholder="real estate trends, housing market, luxury villas, commercial office leasing"
            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#0284C7]"
          />
        </div>

        {/* ROW 8: Tags */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Tags
          </label>
          <input
            type="text"
            value={tagsString}
            onChange={(e) => setTagsString(e.target.value)}
            placeholder="comma,separated,tags"
            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#0284C7]"
          />
        </div>

        {/* ROW 9: Meta Title (0/60) | Meta Description (0/160) matching Screenshot 2026-11-24 211800.png */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700">Meta Title</label>
              <span className="text-[11px] text-gray-400 font-mono">{metaTitle.length} / 60</span>
            </div>
            <input
              type="text"
              maxLength={70}
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Search engine title..."
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700">Meta Description</label>
              <span className="text-[11px] text-gray-400 font-mono">{metaDescription.length} / 160</span>
            </div>
            <textarea
              rows={2}
              maxLength={180}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Search engine snippet preview..."
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#0284C7]"
            />
          </div>
        </div>

        {/* ROW 10: Meta Keywords | Robots Meta matching Screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Meta Keywords (comma separated)
            </label>
            <input
              type="text"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              placeholder="real estate, property, housing"
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Robots Meta
            </label>
            <select
              value={robotsMeta}
              onChange={(e) => setRobotsMeta(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:border-[#0284C7]"
            >
              <option value="Index, Follow">Index, Follow</option>
              <option value="Noindex, Follow">Noindex, Follow</option>
              <option value="Index, Nofollow">Index, Nofollow</option>
              <option value="Noindex, Nofollow">Noindex, Nofollow</option>
            </select>
          </div>
        </div>

        {/* ROW 11: Open Graph Title | Open Graph Description matching Screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Open Graph Title
            </label>
            <input
              type="text"
              value={ogTitle}
              onChange={(e) => setOgTitle(e.target.value)}
              placeholder="Social media share title..."
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Open Graph Description
            </label>
            <textarea
              rows={2}
              value={ogDescription}
              onChange={(e) => setOgDescription(e.target.value)}
              placeholder="Social media share description..."
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#0284C7]"
            />
          </div>
        </div>

        {/* ROW 12: Open Graph Image | Apply Nofollow Checkbox matching Screenshot 2026-11-24 211808.png */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Open Graph Image
            </label>
            <input
              type="text"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              placeholder="or paste OG image URL"
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          <div className="flex items-center space-x-2 pb-2">
            <input
              type="checkbox"
              id="apply-nofollow"
              checked={applyNofollow}
              onChange={(e) => setApplyNofollow(e.target.checked)}
              className="rounded text-[#0284C7] focus:ring-[#0284C7] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="apply-nofollow" className="text-xs text-gray-700 cursor-pointer select-none">
              Apply nofollow to external links in content
            </label>
          </div>
        </div>

        {/* ROW 13: Bottom Big Submit Button matching Screenshot 2026-11-24 211808.png */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-center">
          <button
            type="button"
            onClick={() => handleSubmit('PUBLISHED')}
            disabled={saving}
            className="w-full sm:w-auto px-10 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-bold rounded-lg shadow-md transition disabled:opacity-50"
          >
            {saving ? 'Submitting Article...' : isEditing ? 'Update Article' : 'Submit Article'}
          </button>
        </div>
      </div>
    </div>
  );
}
