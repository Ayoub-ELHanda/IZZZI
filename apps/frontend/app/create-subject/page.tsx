'use client';

import { useEffect, useState } from 'react';
import { FormMatiere, MatiereFormData } from '@/components/ui/FormMatiere';
import { useRouter, useSearchParams } from 'next/navigation';
import { subjectsService } from '@/services/api/subjects.service';
import { toast } from 'sonner';

export default function CreateSubjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!classId) {
      toast.error('Aucune classe sélectionnée');
      router.push('/create-class');
    } else {
      setIsLoading(false);
    }
  }, [classId, router]);

  const handleMatiereSubmit = async (data: MatiereFormData) => {
    if (!classId) return;
    
    try {
      const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split('/');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString();
      };

      await subjectsService.create({
        name: data.name,
        teacherName: data.teacherName,
        startDate: parseDate(data.startDate),
        endDate: parseDate(data.endDate),
        classId: classId,
      });
      toast.success('Matière créée avec succès');
      router.push(`/classes/${classId}`);
    } catch (error: any) {
      console.error('Error creating subject:', error);
      toast.error(error.message || 'Erreur lors de la création de la matière');
    }
  };

  const handleCSVImport = async (file: File) => {
    toast.info('Import CSV en cours de développement');
    console.log('CSV file:', file);
  };

  const handleBack = () => {
    router.push('/create-class');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FormMatiere
        onBack={handleBack}
        onSubmit={handleMatiereSubmit}
        onCSVImport={handleCSVImport}
      />
    </div>
  );
}
