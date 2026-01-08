'use client';

import { X } from 'lucide-react';
import { ClassForm } from './ClassForm';
import { ClassFormData } from '../types';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClassFormData) => void;
  mode: 'create' | 'edit';
  initialData?: ClassFormData;
}

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
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '56px',
            right: '56px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            zIndex: 10,
          }}
        >
          <X size={20} color="#6B6B6B" />
        </button>

        {/* Scrollable content - scrollbar hidden */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            // Hide scrollbar for Chrome, Safari and Opera
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE and Edge
          }}
          className="hide-scrollbar"
        >
          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <ClassForm
            onSubmit={onSubmit}
            initialData={initialData}
            submitButtonText={mode === 'create' ? 'Créer la classe' : 'Modifier la classe'}
            mode={mode}
            isModal={true}
          />
        </div>
      </div>
    </div>
  );
}
