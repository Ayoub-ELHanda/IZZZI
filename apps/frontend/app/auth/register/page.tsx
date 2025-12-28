'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { RegisterAdminForm } from '@/features/auth/components/RegisterAdminForm';
import { RegisterGuestForm } from '@/features/auth/components/RegisterGuestForm';

function RegisterContent() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('token');

  // If there's an invite token, show guest registration
  if (inviteToken) {
    return <RegisterGuestForm />;
  }

  // Otherwise, show admin registration
  return <RegisterAdminForm />;
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}




