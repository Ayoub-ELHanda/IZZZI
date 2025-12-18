'use client';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClassFormData) => void;
  mode: 'create' | 'edit';
  initialData?: ClassFormData;
}

export interface ClassFormData {
  className: string;
  studentCount: string;
  studentEmails: string;
  description: string;
}

export function ClassModal({ isOpen, onClose, onSubmit, mode, initialData }: ClassModalProps) {
  const [formData, setFormData] = useState<ClassFormData>({
    className: '',
    studentCount: '',
    studentEmails: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

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

          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            {/* Title inside form for edit mode */}
            {mode === 'edit' && (
              <h2
                className="font-mochiy"
                style={{
                  width: '183px',
                  height: '13px',
                  fontSize: '18px',
                  fontWeight: 400,
                  lineHeight: '100%',
                  color: '#2F2E2C',
                  marginBottom: '16px',
                }}
              >
                Modifier la classe
              </h2>
            )}
            <div>
              <label
                style={{
                  width: '342px',
                  height: '10px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#2F2E2C',
                  marginBottom: '12px',
                  display: 'block',
                }}
              >
                Nom de la classe
              </label>
              <Input
                type="text"
                placeholder="Entrez le nom de la classe"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                style={{
                  width: '342px',
                  height: '49px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  width: '342px',
                  height: '10px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#2F2E2C',
                  marginBottom: '12px',
                  display: 'block',
                }}
              >
                Nombre d'étudiants
              </label>
              <Input
                type="number"
                placeholder="Entrez le nombre d'étudiants"
                value={formData.studentCount}
                onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                style={{
                  width: '342px',
                  height: '49px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  width: '342px',
                  height: '10px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#2F2E2C',
                  marginBottom: '12px',
                  display: 'block',
                }}
              >
                Adresse mail des étudiants
              </label>
              <textarea
                placeholder="Entrez les adresses mails étudiants séparées par un point virgule (;)"
                value={formData.studentEmails}
                onChange={(e) => setFormData({ ...formData, studentEmails: e.target.value })}
                style={{
                  width: '342px',
                  height: mode === 'edit' ? '289px' : '73px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  padding: '12px 16px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  resize: 'none',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  width: '342px',
                  height: '10px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#2F2E2C',
                  marginBottom: '12px',
                  display: 'block',
                }}
              >
                Description (facultatif)
              </label>
              <Input
                type="text"
                placeholder="Entrez une description (spé, rythme...)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{
                  width: '342px',
                  height: '49px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                }}
              />
            </div>

            <Button
              type="submit"
              style={{
                width: mode === 'edit' ? '236.29px' : '216.29px',
                height: '56px',
                backgroundColor: '#FFE552',
                color: '#2F2E2C',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                borderRadius: '8px',
                marginTop: '16px',
                padding: '20px 26px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.99px',
              }}
            >
              {mode === 'create' ? 'Créer la classe' : 'Modifier la classe'}
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M7 17l9.2-9.2M17 17V7H7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
