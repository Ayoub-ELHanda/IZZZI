'use client';

import { X } from 'lucide-react';
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
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '900px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          backgroundColor: '#F8F8F8',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
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
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none', 
          }}
          className="hide-scrollbar"
        >
          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <SubjectForm
            onBack={onClose}
            onSubmit={onSubmit}
            onCSVImport={onCSVImport}
            isLoading={isLoading}
            isModal={true}
          />
        </div>
      </div>
    </div>
  );
}
