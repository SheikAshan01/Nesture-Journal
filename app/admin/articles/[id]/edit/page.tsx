'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ArticleForm from '@/components/admin/ArticleForm';

export default function EditArticlePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/articles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setArticle(data.article);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        router.push('/admin/articles');
      });
  }, [id, router]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-20 text-center text-xs text-gray-500">
          Loading article data...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ArticleForm initialData={article} isEditing={true} />
    </AdminLayout>
  );
}
