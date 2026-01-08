import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { subjectsService } from '@/services/api/subjects.service';
import { SubjectFormData, CreateSubjectDTO } from '../types';

export function useCreateSubject(classId: string) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const parseDate = (dateStr: string): string => {
    const [day, month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString();
  };

  const transformFormData = (formData: SubjectFormData): CreateSubjectDTO => {
    return {
      name: formData.name,
      teacherName: formData.teacherName,
      startDate: parseDate(formData.startDate),
      endDate: parseDate(formData.endDate),
      classId: classId,
    };
  };

  const createSubject = async (formData: SubjectFormData) => {
    setIsLoading(true);
    try {
      const dto = transformFormData(formData);
      const newSubject = await subjectsService.create(dto);
      toast.success('Matière créée avec succès');
      router.push(`/my-subjects?classId=${classId}`);
      return newSubject;
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création de la matière');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCSVImport = (file: File) => {
    toast.info('Import CSV en cours de développement');
  };

  return {
    createSubject,
    handleCSVImport,
    isLoading,
  };
}
