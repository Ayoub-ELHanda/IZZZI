import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { classesService } from '@/services/api/classes.service';
import { ClassFormData, CreateClassDTO } from '../types';

export function useCreateClass() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const transformFormData = (formData: ClassFormData): CreateClassDTO => {
    return {
      name: formData.className,
      studentCount: parseInt(formData.studentCount),
      studentEmails: formData.studentEmails
        .split(';')
        .map(email => email.trim())
        .filter(email => email),
      description: formData.description || undefined,
    };
  };

  const createClass = async (formData: ClassFormData) => {
    setIsLoading(true);
    try {
      const dto = transformFormData(formData);
      const newClass = await classesService.create(dto);
      toast.success('Classe créée avec succès');
      router.push(`/create-subject?classId=${newClass.id}`);
      return newClass;
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création de la classe');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createClass,
    isLoading,
  };
}
