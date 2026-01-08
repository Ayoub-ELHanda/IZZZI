'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { SubjectForm } from '@/features/subjects/components/SubjectForm';
import { useCreateSubject } from '@/features/subjects/hooks/useCreateSubject';

export default function CreateSubjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!classId) {
      toast.error('Aucune classe sélectionnée');
      router.push('/create-class');
    } else {
      setIsReady(true);
    }
  }, [classId, router]);

  const { createSubject, handleCSVImport, isLoading } = useCreateSubject(classId || '');

  const handleBack = () => {
    router.push('/create-class');
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SubjectForm
        onBack={handleBack}
        onSubmit={createSubject}
        onCSVImport={handleCSVImport}
        isLoading={isLoading}
      />
    </div>
  );
}
