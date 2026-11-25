'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UsersRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/settings');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="p-6 bg-white rounded-xl border border-slate-200 text-center space-y-2">
        <p className="text-sm font-semibold text-slate-800">Users List has been consolidated into Platform Settings.</p>
        <p className="text-xs text-slate-500">Redirecting you to Settings...</p>
      </div>
    </div>
  );
}
