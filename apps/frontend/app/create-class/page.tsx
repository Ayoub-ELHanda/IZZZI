'use client';

import { FormClasse, ClassFormData } from '@/components/ui/FormClasse';
import { useRouter } from 'next/navigation';

export default function CreateClassPage() {
  const router = useRouter();

  const handleSubmit = (data: ClassFormData) => {
    console.log('Form submitted:', data);
    router.push('/classes/my-classes');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="text-center relative">
          {/* Step indicator */}
          <div
            className="flex items-center justify-center mx-auto"
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: 'white',
              border: '1px solid #E0E0E0',
              borderRadius: '750px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
              marginBottom: '24px',
            }}
          >
            1/2
          </div>

          {/* Title */}
          <h2
            className="font-mochiy mx-auto"
            style={{
              width: '233px',
              height: '69px',
              fontSize: '28px',
              fontWeight: 400,
              lineHeight: '100%',
              marginBottom: '24px',
              color: '#2F2E2C',
              textAlign: 'center',
            }}
          >
            Informations de la classe
          </h2>

          {/* Decorative text */}
          <div
            className="absolute"
            style={{
              top: '-15px',
              right: '50px',
              transform: 'rotate(-12.18deg)',
              fontFamily: 'Caveat, cursive',
              fontSize: '20px',
              color: '#2F2E2C',
            }}
          >
            C&apos;est partiii !
          </div>

          {/* Form container */}
          <div
            style={{
              width: '438px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
              padding: '40px 48px',
              position: 'relative',
              margin: '0 auto',
            }}
          >
            <FormClasse
              onSubmit={handleSubmit}
              submitButtonText="Créer la classe"
              mode="create"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
