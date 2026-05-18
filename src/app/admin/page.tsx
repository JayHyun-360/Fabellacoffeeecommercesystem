'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { AdminPage } from '../pages/AdminPage';

export default function Admin() {
  const router = useRouter();
  const { isAdmin, isStaff, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace(isStaff ? '/staff' : '/');
    }
  }, [isLoading, isAdmin, isStaff, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-black rounded-full" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return <AdminPage />;
}
