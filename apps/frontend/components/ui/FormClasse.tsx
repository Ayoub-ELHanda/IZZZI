'use client';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';

export interface ClassFormData {
  className: string;
  studentCount: string;
  studentEmails: string;
  description: string;
}

interface FormClasseProps {
  onSubmit: (data: ClassFormData) => void;
  initialData?: ClassFormData;
  submitButtonText?: string;
  mode?: 'create' | 'edit';
}

export function FormClasse({
  onSubmit,
  initialData,
  submitButtonText = 'Créer la classe',
  mode = 'create',
}: FormClasseProps) {
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      {/* Title for edit mode */}
      {mode === 'edit' && (
        <h2
          className="font-mochiy"
          style={{
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
        {submitButtonText}
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
  );
}
