'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Maximize2,
  Minimize2,
  Code,
  FileText,
  Table as TableIcon,
  ChevronDown,
  Wand2,
  Upload,
  Undo,
  Redo,
  Check,
} from 'lucide-react';
import Link from 'next/link';

interface ArticleFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const FONT_OPTIONS = [
  { label: 'System Sans', value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Arial Black', value: '"Arial Black", Gadget, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
];

const HEADING_OPTIONS = [
  { label: 'Normal Text', tag: 'p' },
  { label: 'Heading 2 (Major)', tag: 'h2' },
  { label: 'Heading 3 (Section)', tag: 'h3' },
  { label: 'Heading 4 (Sub)', tag: 'h4' },
];

const COLOR_PALETTE = [
  '#000000', '#1C1E21', '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB', '#1877F2', '#008F5A', '#006B45', '#1E40AF',
  '#0284C7', '#0EA5E9', '#D97706', '#EAB308', '#DC2626', '#EF4444', '#7C3AED', '#8B5CF6', '#EC4899', '#14B8A6',
];

export default function ArticleForm({ initialData, isEditing = false }: ArticleFormProps) {
  const router = useRouter();

  // Basic Details
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

  // SEO & Social Graph
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

  // Editor State
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editorImageInputRef = useRef<HTMLInputElement | null>(null);

  const [heading, setHeading] = useState('Normal Text');
  const [fontFamily, setFontFamily] = useState('System Sans');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [showTableGrid, setShowTableGrid] = useState(false);
  const [hoveredTableGrid, setHoveredTableGrid] = useState<{ rows: number; cols: number } | null>(null);
  const [showPublishConfirmModal, setShowPublishConfirmModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');

  // Stats
  const [stats, setStats] = useState({ words: 0, characters: 0, readTime: 1 });

  // Form helpers
  const [categories, setCategories] = useState<any[]>([]);
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

  // Initialize visual editor content
  useEffect(() => {
    if (editorRef.current) {
      if (!editorRef.current.innerHTML && content) {
        editorRef.current.innerHTML = content;
      }
    }
    updateStats(content);
  }, []);

  // Update content stats
  const updateStats = (text: string) => {
    const plain = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = plain ? plain.split(' ').length : 0;
    const characters = plain.length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    setStats({ words, characters, readTime });
  };

  // Sync editor innerHTML to state
  const handleEditorInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setContent(html);
      updateStats(html);
    }
  };

  // Execute native rich text command (True MS Word behavior)
  const execCmd = (command: string, value: string = '') => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleEditorInput();
  };

  const handleHeadingSelect = (item: typeof HEADING_OPTIONS[0]) => {
    setHeading(item.label);
    setShowHeadingDropdown(false);
    execCmd('formatBlock', `<${item.tag}>`);
  };

  const handleFontSelect = (item: typeof FONT_OPTIONS[0]) => {
    setFontFamily(item.label);
    setShowFontDropdown(false);
    execCmd('fontName', item.value);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setShowColorPicker(false);
    execCmd('foreColor', color);
  };

  // Insert Table
  const handleInsertTable = (rows: number, cols: number) => {
    setShowTableGrid(false);
    let tableHtml = `<table class="w-full my-4 border-collapse border border-slate-300 rounded-lg overflow-hidden text-sm"><thead><tr class="bg-slate-100">`;
    for (let c = 0; c < cols; c++) {
      tableHtml += `<th class="border border-slate-300 p-2 text-left font-bold text-slate-800">Column ${c + 1}</th>`;
    }
    tableHtml += `</tr></thead><tbody>`;
    for (let r = 0; r < rows; r++) {
      tableHtml += `<tr>`;
      for (let c = 0; c < cols; c++) {
        tableHtml += `<td class="border border-slate-300 p-2 text-slate-700">Editable data</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table><p><br></p>`;
    execCmd('insertHTML', tableHtml);
  };

  // Insert Link
  const handleInsertLink = () => {
    const url = prompt('Enter Hyperlink URL (e.g. https://propnewstime.com/story):');
    if (url) {
      execCmd('createLink', url);
    }
  };

  // Upload and insert image into document body
  const handleEditorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const imgHtml = `<figure class="my-5 text-center"><img src="${reader.result}" alt="Article Illustration" class="rounded-2xl max-w-full h-auto mx-auto shadow-md border border-slate-200" /><figcaption class="text-xs text-slate-500 mt-2 font-medium">Article Illustration</figcaption></figure><p><br></p>`;
        execCmd('insertHTML', imgHtml);
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload Featured Image for article card
  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFeaturedImage(reader.result);
        if (!ogImage) setOgImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // AI Content Audit
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
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#F0F2F5] p-6 overflow-y-auto' : ''}`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4E6EB] pb-5">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/articles"
            className="p-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 transition text-slate-700 shadow-2xs"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-serif font-extrabold text-2xl md:text-3xl text-[#1C1E21] tracking-tight">
              {isEditing ? 'Edit Article' : 'Add New Article'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Draft, categorize, and publish real estate intelligence with MS Word style visual rich formatting.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => handleSubmit('DRAFT')}
            disabled={saving}
            className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold rounded-xl text-slate-700 transition shadow-2xs btn-press"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => {
              if (!title.trim()) {
                setError('Please enter an article title before publishing.');
                return;
              }
              setShowPublishConfirmModal(true);
            }}
            disabled={saving}
            className="px-5 py-2 bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 btn-press"
          >
            <Save size={14} />
            <span>{saving ? 'Processing...' : 'Submit & Publish'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2 animate-fade-in">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 animate-fade-in">
          <CheckCircle size={16} />
          <span>{success}</span>
        </div>
      )}

      {/* Main Form Fields */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
        {/* ROW 1: Title | Category Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-[#1C1E21] mb-1.5">
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
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1E21] mb-1.5">
              Category Name *
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
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
            <label className="block text-xs font-bold text-[#1C1E21] mb-1.5">
              Source Name
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="e.g. PropNewsTime, Realty & More, Businessfortnight"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
              />
              <div className="flex flex-wrap gap-1.5">
                {['PropNewsTime', 'Realty & More', 'Businessfortnight', 'Business Standard', 'ET Realty', 'Reuters'].map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSourceName(src)}
                    className={`text-[10px] px-2.5 py-0.5 rounded-lg border font-semibold transition btn-press ${
                      sourceName === src
                        ? 'bg-[#1877F2] text-white border-[#1877F2]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1E21] mb-1.5">
              Publish Date
            </label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
            />
          </div>
        </div>

        {/* ROW 3: Publish Status | Choose Image (with Gallery Upload) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-[#1C1E21] mb-1.5">
              Publish Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1E21] mb-1.5">
              Choose Image (Support only png / webp / jpg)
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFeaturedImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#008F5A] hover:bg-[#006B45] text-white text-xs font-bold rounded-xl transition btn-press shadow-2xs"
                >
                  <Upload size={13} />
                  <span>Upload from Gallery</span>
                </button>
                <span className="text-[11px] text-slate-400">or enter image web URL below</span>
              </div>
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => {
                  setFeaturedImage(e.target.value);
                  if (!ogImage) setOgImage(e.target.value);
                }}
                placeholder="Paste image URL (e.g. https://... or uploaded image)"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
              />
              {featuredImage && (
                <div className="w-28 h-20 rounded-xl overflow-hidden border border-slate-200 mt-2 relative shadow-xs">
                  <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ROW 4: Feature Image Alt Text | Article URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-[#1C1E21] mb-1.5">
              Feature Image Alt Text
            </label>
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="e.g. Modern residential complex view"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1E21] mb-1.5">
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
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
            />
          </div>
        </div>

        {/* ROW 5: Summary */}
        <div>
          <label className="block text-xs font-bold text-[#1C1E21] mb-1.5">
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
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
          />
        </div>

        {/* =========================================================================
           ROW 6: TRUE MS WORD STYLE VISUAL WYSIWYG DOCUMENT EDITOR
           ========================================================================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label className="block text-xs font-bold text-[#1C1E21]">
                Body (H2/H3/H4 only) • MS Word Style Visual Editor
              </label>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                WYSIWYG LIVE
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              {/* Toggle Visual / Code view */}
              <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode('visual')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                    viewMode === 'visual'
                      ? 'bg-white text-[#1877F2] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  📝 Word View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('code')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                    viewMode === 'code'
                      ? 'bg-white text-[#1877F2] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  &lt;/&gt; Code View
                </button>
              </div>

              <button
                type="button"
                onClick={runAnalysis}
                disabled={analyzing}
                className="text-[#1877F2] hover:underline font-bold flex items-center space-x-1"
              >
                <Wand2 size={13} />
                <span>{analyzing ? 'Auditing...' : 'AI Audit Content'}</span>
              </button>
            </div>
          </div>

          {/* Microsoft Word Style Sticky Ribbon Toolbar */}
          <div className="border border-slate-300 rounded-2xl overflow-hidden bg-slate-50 shadow-xs">
            <div className="p-2 border-b border-slate-200 bg-[#F7F8FA] flex flex-wrap items-center gap-1.5 text-xs text-slate-700 select-none">
              {/* Undo / Redo */}
              <button
                type="button"
                onClick={() => execCmd('undo')}
                title="Undo (Ctrl+Z)"
                className="p-1.5 hover:bg-white rounded-lg transition text-slate-600 hover:text-slate-900"
              >
                <Undo size={14} />
              </button>
              <button
                type="button"
                onClick={() => execCmd('redo')}
                title="Redo (Ctrl+Y)"
                className="p-1.5 hover:bg-white rounded-lg transition text-slate-600 hover:text-slate-900"
              >
                <Redo size={14} />
              </button>

              <div className="h-4 w-px bg-slate-300 mx-1"></div>

              {/* Headings dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg flex items-center space-x-1 text-xs font-bold hover:bg-slate-50 transition"
                >
                  <span>{heading}</span>
                  <ChevronDown size={11} />
                </button>
                {showHeadingDropdown && (
                  <div className="absolute left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-fade-in-down">
                    {HEADING_OPTIONS.map((item) => (
                      <button
                        key={item.tag}
                        type="button"
                        onClick={() => handleHeadingSelect(item)}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 block font-semibold text-slate-800"
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
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg flex items-center space-x-1 text-xs font-bold hover:bg-slate-50 transition"
                >
                  <span className="truncate max-w-[90px]">{fontFamily}</span>
                  <ChevronDown size={11} />
                </button>
                {showFontDropdown && (
                  <div className="absolute left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 max-h-52 overflow-y-auto animate-fade-in-down">
                    {FONT_OPTIONS.map((f) => (
                      <button
                        key={f.label}
                        type="button"
                        onClick={() => handleFontSelect(f)}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 block font-medium"
                        style={{ fontFamily: f.value }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Font Color Palette dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-1.5 bg-white border border-slate-300 rounded-lg flex items-center space-x-1 hover:bg-slate-50 transition"
                  title="Font Color"
                >
                  <span className="font-extrabold underline text-sm leading-none" style={{ color: selectedColor }}>
                    A
                  </span>
                  <ChevronDown size={10} />
                </button>
                {showColorPicker && (
                  <div className="absolute left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-30 animate-fade-in-down">
                    <div className="text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-wider">
                      Font Color Palette
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {COLOR_PALETTE.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => handleColorSelect(c)}
                          className="w-6 h-6 rounded-md border border-slate-300 transition hover:scale-110"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleColorSelect('#000000')}
                      className="mt-2 text-[11px] text-slate-600 hover:text-black font-semibold block text-center w-full py-1 rounded bg-slate-50 hover:bg-slate-100"
                    >
                      Reset to Default Black
                    </button>
                  </div>
                )}
              </div>

              <div className="h-4 w-px bg-slate-300 mx-1"></div>

              {/* Bold, Italic, Underline, Strikethrough */}
              <button
                type="button"
                onClick={() => execCmd('bold')}
                className="p-1.5 hover:bg-white rounded-lg transition font-extrabold text-slate-800"
                title="Bold (Ctrl+B)"
              >
                <Bold size={14} />
              </button>
              <button
                type="button"
                onClick={() => execCmd('italic')}
                className="p-1.5 hover:bg-white rounded-lg transition italic text-slate-800"
                title="Italic (Ctrl+I)"
              >
                <Italic size={14} />
              </button>
              <button
                type="button"
                onClick={() => execCmd('underline')}
                className="p-1.5 hover:bg-white rounded-lg transition underline text-slate-800"
                title="Underline (Ctrl+U)"
              >
                <Underline size={14} />
              </button>
              <button
                type="button"
                onClick={() => execCmd('strikeThrough')}
                className="p-1.5 hover:bg-white rounded-lg transition text-slate-800"
                title="Strikethrough"
              >
                <Strikethrough size={14} />
              </button>

              <div className="h-4 w-px bg-slate-300 mx-1"></div>

              {/* Lists */}
              <button
                type="button"
                onClick={() => execCmd('insertUnorderedList')}
                className="p-1.5 hover:bg-white rounded-lg transition text-slate-800"
                title="Bullet List"
              >
                <List size={14} />
              </button>
              <button
                type="button"
                onClick={() => execCmd('insertOrderedList')}
                className="p-1.5 hover:bg-white rounded-lg transition text-slate-800"
                title="Numbered List"
              >
                <ListOrdered size={14} />
              </button>

              {/* Alignments */}
              <button
                type="button"
                onClick={() => execCmd('justifyLeft')}
                className="p-1.5 hover:bg-white rounded-lg transition text-slate-800"
                title="Align Left"
              >
                <AlignLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => execCmd('justifyCenter')}
                className="p-1.5 hover:bg-white rounded-lg transition text-slate-800"
                title="Align Center"
              >
                <AlignCenter size={14} />
              </button>
              <button
                type="button"
                onClick={() => execCmd('justifyRight')}
                className="p-1.5 hover:bg-white rounded-lg transition text-slate-800"
                title="Align Right"
              >
                <AlignRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => execCmd('justifyFull')}
                className="p-1.5 hover:bg-white rounded-lg transition text-slate-800"
                title="Justify Full"
              >
                <AlignJustify size={14} />
              </button>

              <div className="h-4 w-px bg-slate-300 mx-1"></div>

              {/* Table Picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowTableGrid(!showTableGrid);
                    setHoveredTableGrid(null);
                  }}
                  className={`p-1.5 hover:bg-white rounded-lg transition flex items-center space-x-0.5 text-slate-800 ${
                    showTableGrid ? 'bg-white shadow-xs' : ''
                  }`}
                  title="Insert Formatted Table"
                >
                  <TableIcon size={14} />
                  <ChevronDown size={10} />
                </button>
                {showTableGrid && (
                  <div
                    className="absolute left-0 mt-1.5 bg-white p-3.5 rounded-2xl shadow-2xl border border-slate-200 z-50 animate-fade-in-down w-60 select-none"
                    onMouseLeave={() => setHoveredTableGrid(null)}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-2 pb-1.5 border-b border-slate-100">
                      <span className="uppercase tracking-wider text-[10px] text-slate-400">Insert Table</span>
                      <span className="font-mono text-[#1877F2]">
                        {hoveredTableGrid ? `${hoveredTableGrid.rows} × ${hoveredTableGrid.cols}` : 'Grid'}
                      </span>
                    </div>
                    <div className="grid grid-cols-6 gap-1.5 p-1 bg-slate-50/80 rounded-xl border border-slate-100">
                      {[1, 2, 3, 4, 5].map((r) =>
                        [1, 2, 3, 4, 5, 6].map((c) => {
                          const isHighlighted =
                            hoveredTableGrid &&
                            r <= hoveredTableGrid.rows &&
                            c <= hoveredTableGrid.cols;
                          return (
                            <button
                              key={`${r}-${c}`}
                              type="button"
                              onMouseEnter={() => setHoveredTableGrid({ rows: r, cols: c })}
                              onClick={() => {
                                handleInsertTable(r, c);
                                setHoveredTableGrid(null);
                              }}
                              className={`w-6 h-6 rounded-xs transition-colors border ${
                                isHighlighted
                                  ? 'bg-[#1877F2] border-[#1877F2] shadow-2xs'
                                  : 'bg-white border-slate-200 hover:border-blue-400'
                              }`}
                              title={`${r} rows × ${c} columns`}
                            />
                          );
                        })
                      )}
                    </div>
                    <div className="mt-2 text-[10px] text-center text-slate-400 font-medium">
                      Click cell to insert {hoveredTableGrid ? `${hoveredTableGrid.rows} × ${hoveredTableGrid.cols} table` : 'table'}
                    </div>
                  </div>
                )}
              </div>

              {/* Hyperlink */}
              <button
                type="button"
                onClick={handleInsertLink}
                className="p-1.5 hover:bg-white rounded-lg transition text-slate-800"
                title="Insert Web Link"
              >
                <LinkIcon size={14} />
              </button>

              {/* Insert Image directly from Gallery/Device */}
              <input
                type="file"
                ref={editorImageInputRef}
                onChange={handleEditorImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => editorImageInputRef.current?.click()}
                className="p-1.5 hover:bg-white rounded-lg transition text-slate-800 flex items-center space-x-1"
                title="Insert Image from Gallery / Device"
              >
                <ImageIcon size={14} />
                <span className="text-[10px] font-bold text-[#1877F2]">Gallery</span>
              </button>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 hover:bg-white rounded-lg transition ml-auto text-slate-600 hover:text-slate-900"
                title="Toggle Fullscreen Canvas"
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            </div>

            {/* Editable Content Surface (MS Word Clean Paper Sheet) */}
            {viewMode === 'visual' ? (
              <div
                ref={editorRef}
                contentEditable={true}
                onInput={handleEditorInput}
                onBlur={handleEditorInput}
                className="min-h-[440px] p-6 sm:p-10 bg-white text-base leading-relaxed text-[#1C1E21] focus:outline-none focus:ring-0 prose prose-slate max-w-none"
                style={{ minHeight: '440px' }}
                data-placeholder="Start typing your story here just like in Microsoft Word..."
              />
            ) : (
              <textarea
                rows={18}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (editorRef.current) {
                    editorRef.current.innerHTML = e.target.value;
                  }
                  updateStats(e.target.value);
                }}
                className="w-full min-h-[440px] p-6 bg-slate-900 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none"
              />
            )}

            {/* Document Status Bar */}
            <div className="px-4 py-2 bg-slate-100/90 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-medium">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-700">{stats.words} words</span>
                <span>•</span>
                <span>{stats.characters} characters</span>
                <span>•</span>
                <span>~{stats.readTime} min read</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-mono text-slate-600">MS Word Visual Mode (No Code Displayed)</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis Feedback */}
        {analysis && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 animate-fade-in">
            <div className="font-bold text-slate-800 flex items-center space-x-1.5">
              <Sparkles size={14} className="text-[#1877F2]" />
              <span>Editorial Intelligence Report</span>
            </div>
            {analysis.duplicateWarning?.isDuplicate && (
              <div className="text-rose-600 font-semibold">
                ⚠️ Duplicate Warning: Similar title found &quot;{analysis.duplicateWarning.matchedTitle}&quot;
              </div>
            )}
            {analysis.qualityAudit && (
              <div className="text-slate-600">
                Word Count: {analysis.qualityAudit.wordCount} words • Estimated reading time: {analysis.qualityAudit.readingTime} mins • Quality: {analysis.qualityAudit.healthStatus}
              </div>
            )}
          </div>
        )}

        {/* ROW 7: SEO Keywords */}
        <div>
          <label className="block text-xs font-bold text-[#1C1E21] mb-1.5">
            SEO Keywords
          </label>
          <textarea
            rows={2}
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            placeholder="real estate trends, housing market, luxury villas, commercial office leasing"
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
          />
        </div>

        {/* ROW 8: Tags */}
        <div>
          <label className="block text-xs font-bold text-[#1C1E21] mb-1.5">
            Tags
          </label>
          <input
            type="text"
            value={tagsString}
            onChange={(e) => setTagsString(e.target.value)}
            placeholder="comma,separated,tags"
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
          />
        </div>

        {/* ROW 9: Meta Title (0/60) | Meta Description (0/160) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#1C1E21]">Meta Title</label>
              <span className="text-[11px] text-slate-400 font-mono">{metaTitle.length} / 60</span>
            </div>
            <input
              type="text"
              maxLength={70}
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Search engine title..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#1C1E21]">Meta Description</label>
              <span className="text-[11px] text-slate-400 font-mono">{metaDescription.length} / 160</span>
            </div>
            <textarea
              rows={2}
              maxLength={180}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Search engine snippet preview..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
            />
          </div>
        </div>

        {/* ROW 10: Meta Keywords | Robots Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-[#1C1E21] mb-1.5">
              Meta Keywords (comma separated)
            </label>
            <input
              type="text"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              placeholder="real estate, property, housing"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1E21] mb-1.5">
              Robots Meta
            </label>
            <select
              value={robotsMeta}
              onChange={(e) => setRobotsMeta(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
            >
              <option value="Index, Follow">Index, Follow</option>
              <option value="Noindex, Follow">Noindex, Follow</option>
              <option value="Index, Nofollow">Index, Nofollow</option>
              <option value="Noindex, Nofollow">Noindex, Nofollow</option>
            </select>
          </div>
        </div>

        {/* ROW 11: Open Graph Title | Open Graph Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-[#1C1E21] mb-1.5">
              Open Graph Title
            </label>
            <input
              type="text"
              value={ogTitle}
              onChange={(e) => setOgTitle(e.target.value)}
              placeholder="Social media share title..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1E21] mb-1.5">
              Open Graph Description
            </label>
            <textarea
              rows={2}
              value={ogDescription}
              onChange={(e) => setOgDescription(e.target.value)}
              placeholder="Social media share description..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
            />
          </div>
        </div>

        {/* ROW 12: Open Graph Image | Apply Nofollow Checkbox */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
          <div>
            <label className="block text-xs font-bold text-[#1C1E21] mb-1.5">
              Open Graph Image
            </label>
            <input
              type="text"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              placeholder="or paste OG image URL"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
            />
          </div>

          <div className="flex items-center space-x-2 pb-2">
            <input
              type="checkbox"
              id="apply-nofollow"
              checked={applyNofollow}
              onChange={(e) => setApplyNofollow(e.target.checked)}
              className="rounded text-[#1877F2] focus:ring-[#1877F2] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="apply-nofollow" className="text-xs text-slate-700 cursor-pointer select-none font-medium">
              Apply nofollow to external links in content
            </label>
          </div>
        </div>

        {/* ROW 13: Bottom Big Submit Button */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              if (!title.trim()) {
                setError('Please enter an article title before publishing.');
                return;
              }
              setShowPublishConfirmModal(true);
            }}
            disabled={saving}
            className="w-full sm:w-auto px-10 py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white text-sm font-bold rounded-xl shadow-md transition disabled:opacity-50 btn-press"
          >
            {saving ? 'Submitting Article...' : isEditing ? 'Update Article' : 'Submit Article'}
          </button>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showPublishConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-up space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1877F2] flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  Confirm Article Publication
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to submit and publish this article live to the Nesture Journal portal?
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Headline</span>
                <span className="font-serif font-bold text-slate-800 text-sm line-clamp-2">
                  {title || 'Untitled Article'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                <div>
                  <span className="text-slate-400 font-medium block text-[10px]">Category</span>
                  <span className="font-bold text-slate-700">
                    {categories.find((c) => c.id === categoryId)?.name || 'General Real Estate'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block text-[10px]">Status</span>
                  <span className="font-bold text-emerald-600 inline-flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Live Publication</span>
                  </span>
                </div>
              </div>
              <div className="pt-1 text-[11px] text-slate-500">
                Estimated Reading Time: <strong>{stats.readTime} min</strong> ({stats.words} words)
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPublishConfirmModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel & Review
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPublishConfirmModal(false);
                  handleSubmit('PUBLISHED');
                }}
                disabled={saving}
                className="px-5 py-2.5 bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-1.5 btn-press"
              >
                <CheckCircle size={14} />
                <span>Confirm & Publish Live</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
