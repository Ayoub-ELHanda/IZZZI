'use client';

import { X, ArrowUpRight } from 'lucide-react';
import { SubjectForm } from './SubjectForm';
import { SubjectFormData } from '../types';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubjectFormData) => void;
  onCSVImport: (file: File) => void;
  classId: string;
  isLoading?: boolean;
}

export function SubjectModal({ isOpen, onClose, onSubmit, onCSVImport, classId, isLoading = false }: SubjectModalProps) {
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
        overflow: 'auto',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '900px',
          maxHeight: '95vh',
          backgroundColor: '#F8F8F8',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
          padding: '40px',
          overflow: 'auto',
          margin: '20px',
        }}
      >
        {/* Close button */}
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

        {/* Form (without back button and step indicator) */}
        <SubjectForm
          onBack={onClose}
          onSubmit={onSubmit}
          onCSVImport={onCSVImport}
          isLoading={isLoading}
          isModal={true}
        />
      </div>
    </div>
  );
}
