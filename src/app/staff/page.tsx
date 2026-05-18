'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { StaffPage } from '../pages/StaffPage';

export default function Staff() {
  const router = useRouter();
  const { isStaff, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isStaff && !isAdmin) router.replace('/');
  }, [isLoading, isStaff, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-black rounded-full" />
      </div>
    );
  }

  if (!isStaff && !isAdmin) return null;

  return <StaffPage />;
}
