'use client';

import { ClassForm } from '@/features/classes/components/ClassForm';
import { useCreateClass } from '@/features/classes/hooks/useCreateClass';

export default function CreateClassPage() {
  const { createClass, isLoading } = useCreateClass();

  return (
    <ClassForm
      onSubmit={createClass}
      submitButtonText="Créer la classe"
      mode="create"
      isLoading={isLoading}
    />
  );
}
