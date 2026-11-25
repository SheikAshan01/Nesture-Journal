'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ArticleForm from '@/components/admin/ArticleForm';

export default function NewArticlePage() {
  return (
    <AdminLayout>
      <ArticleForm isEditing={false} />
    </AdminLayout>
  );
}
