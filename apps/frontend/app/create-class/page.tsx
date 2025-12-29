'use client';

import { useRouter } from 'next/navigation';
import { FormClasse, ClassFormData } from '@/components/ui/FormClasse';
import { classesService } from '@/services/api/classes.service';
import { toast } from 'sonner';

export default function CreateClassPage() {
  const router = useRouter();

  const handleClassSubmit = async (data: ClassFormData) => {
    try {
      const newClass = await classesService.create({
        name: data.className,
        studentCount: parseInt(data.studentCount),
        studentEmails: data.studentEmails.split(';').map(e => e.trim()).filter(e => e),
        description: data.description || undefined,
      });
      toast.success('Classe créée avec succès');
      router.push(`/create-subject?classId=${newClass.id}`);
    } catch (error: any) {
      console.error('Error creating class:', error);
      toast.error(error.message || 'Erreur lors de la création de la classe');
    }
  };

  return (
    <FormClasse
      onSubmit={handleClassSubmit}
      submitButtonText="Créer la classe"
      mode="create"
    />
  );
}