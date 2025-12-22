'use client';

import { ClassModal, ClassFormData } from '@/components/ui/ClassModal';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateClassPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const handleSubmit = (data: ClassFormData) => {
    console.log('Form submitted:', data);
    setIsModalOpen(false);
    router.push('/classes/my-classes');
  };

  const handleClose = () => {
    setIsModalOpen(false);
    router.push('/classes/my-classes');
  };

  return (
    <ClassModal
      isOpen={isModalOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      mode="create"
    />
  );
}
