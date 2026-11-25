'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Upload, Trash2, Copy, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function AdminMediaPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMedia = () => {
    setLoading(true);
    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => {
        setImages(data.images || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setError('');
    setSuccess('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', altText);

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to process media.');
        setUploading(false);
        return;
      }

      setSuccess('Image optimized to WebP and added to library!');
      setFile(null);
      setAltText('');
      fetchMedia();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Upload failed due to network error.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this media file?')) return;
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMedia();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b border-editorialBorder pb-6">
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-editorialText-primary tracking-tight">
            Local Media Pipeline
          </h1>
          <p className="text-sm text-editorialText-secondary mt-1">
            Upload, optimize via Sharp (WebP/AVIF compression), and manage editorial photography locally.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-deep text-xs rounded-lg flex items-center space-x-2">
            <Check size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* Upload Drop Card */}
        <div className="bg-white p-6 rounded-xl border border-editorialBorder shadow-sm">
          <h2 className="font-serif font-bold text-base text-editorialText-primary mb-4 flex items-center space-x-2">
            <Upload size={18} className="text-emerald-brand" />
            <span>Upload New Editorial Image</span>
          </h2>

          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-editorialText-secondary mb-1">
                Select Image (PNG, JPG, WebP)
              </label>
              <input
                type="file"
                required
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-xs text-editorialText-secondary file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-brand hover:file:bg-emerald-100 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-editorialText-secondary mb-1">
                Alt Text (Accessibility)
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="e.g. Commercial glass high-rise towers"
                className="w-full px-3 py-2 bg-softBg border border-editorialBorder rounded-lg text-xs text-editorialText-primary focus:outline-none focus:border-emerald-brand"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full py-2.5 px-4 bg-emerald-brand hover:bg-emerald-hover text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {uploading ? 'Optimizing with Sharp...' : 'Upload & Compress (WebP)'}
              </button>
            </div>
          </form>
        </div>

        {/* Media Grid */}
        <div className="bg-white p-6 rounded-xl border border-editorialBorder shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-base text-editorialText-primary">
              Media Assets ({images.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-gray-400">Loading media library...</div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="group bg-softBg rounded-lg border border-editorialBorder overflow-hidden flex flex-col justify-between"
                >
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.alt || 'Asset'}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-2.5 space-y-1.5">
                    <div className="text-[11px] font-semibold text-editorialText-primary truncate">
                      {img.alt || img.filename}
                    </div>
                    <div className="text-[10px] text-gray-400 flex items-center justify-between font-mono">
                      <span>{img.width ? `${img.width}x${img.height}` : 'WebP'}</span>
                      <span>{(img.fileSize / 1024).toFixed(0)} KB</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                      <button
                        onClick={() => copyUrl(img.url, img.id)}
                        className="text-[10px] font-medium text-emerald-brand hover:underline flex items-center space-x-1"
                      >
                        {copiedId === img.id ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedId === img.id ? 'Copied' : 'Copy URL'}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(img.id)}
                        className="text-gray-400 hover:text-red-600 p-1 transition"
                        title="Delete Media"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-gray-400">
              No local media uploaded yet. Use the form above to process images.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
