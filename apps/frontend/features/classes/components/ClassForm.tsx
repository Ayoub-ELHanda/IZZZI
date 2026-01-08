'use client';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { ClassFormData } from '../types';

interface ClassFormProps {
  onSubmit: (data: ClassFormData) => void;
  initialData?: ClassFormData;
  submitButtonText?: string;
  mode?: 'create' | 'edit';
  isLoading?: boolean;
  isModal?: boolean;
}

export function ClassForm({
  onSubmit,
  initialData,
  submitButtonText = 'Créer la classe',
  mode = 'create',
  isLoading = false,
  isModal = false,
}: ClassFormProps) {
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

  return (
    <div className={isModal ? '' : 'min-h-screen bg-white'}>
      <div className="relative flex items-center justify-center" style={isModal ? { padding: '40px 20px 20px 20px' } : { minHeight: 'calc(100vh - 80px)', paddingTop: '140px', paddingBottom: '40px' }}>
        <div className="text-center relative">
         
          {mode === 'create' && (
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
          )}

          <h2
            className="font-mochiy mx-auto"
            style={{
              width: '233px',
              height: '69px',
              fontSize: mode === 'edit' ? '18px' : '28px',
              fontWeight: 400,
              lineHeight: '100%',
              marginBottom: mode === 'edit' ? '16px' : '24px',
              color: '#2F2E2C',
              textAlign: 'center',
            }}
          >
            {mode === 'edit' ? 'Modifier la classe' : 'Informations de la classe'}
          </h2>

          {mode === 'create' && (
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
          )}

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
            <form onSubmit={handleSubmit} className="flex flex-col gap-7">
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
                  Nombre d&apos;étudiants
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
                    color: '#2F2E2C',
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
                disabled={isLoading}
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
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                {isLoading ? 'Chargement...' : submitButtonText}
                {!isLoading && (
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
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
