'use client';

import { X } from 'lucide-react';
import { FormClasse, ClassFormData } from '@/components/ui/FormClasse';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClassFormData) => void;
  mode: 'create' | 'edit';
  initialData?: ClassFormData;
}

export type { ClassFormData };

export function ClassModal({ isOpen, onClose, onSubmit, mode, initialData }: ClassModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {mode === 'create' && (
          <>
            {/* Step indicator */}
            <div
              className="flex items-center justify-center"
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
              className="font-mochiy"
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
                right: '95px',
                transform: 'rotate(-12.18deg)',
                fontFamily: 'Caveat, cursive',
                fontSize: '20px',
                color: '#2F2E2C',
              }}
            >
              C'est partiii !
            </div>
          </>
        )}

        {/* Form container */}
        <div
          style={{
            width: '438px',
            height: mode === 'edit' ? '849px' : 'auto',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
            padding: '40px 48px',
            position: 'relative',
          }}
        >
          {/* Close button inside form */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              zIndex: 10,
            }}
          >
            <X size={20} color="#6B6B6B" />
          </button>

          <FormClasse
            onSubmit={onSubmit}
            initialData={initialData}
            submitButtonText={mode === 'create' ? 'Créer la classe' : 'Modifier la classe'}
            mode={mode}
          />
        </div>
      </div>
    </div>
  );
}
