'use client';

import { X, ArrowUpRight } from 'lucide-react';
import { Button } from './Button';

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
}

export function ArchiveModal({ isOpen, onClose, onConfirm, className }: ArchiveModalProps) {
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
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '531px',
          minHeight: '316px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <X size={16} color="#2F2E2C" strokeWidth={2} />
        </button>

        {/* Title */}
        <h2
          style={{
            fontFamily: 'Mochiy Pop One, sans-serif',
            fontSize: '19px',
            fontWeight: 400,
            color: '#2F2E2C',
            marginBottom: '24px',
          }}
        >
          Archiver cette classe ?
        </h2>

        {/* Description */}
        <p
          style={{
            width: '435px',
            minHeight: '59px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            color: '#2F2E2C',
            lineHeight: '1.5',
            marginBottom: '32px',
          }}
        >
          Cette classe ne sera plus modifiable, ni restaurable, mais restera consultable à tout moment dans vos classes archivées.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          {/* Archive Button */}
          <Button variant="archive-modal" onClick={onConfirm}>
            <span>Archiver</span>
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </Button>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            style={{
              height: '56px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              fontWeight: 400,
              color: '#2F2E2C',
            }}
          >
            <span>Annuler</span>
            <ArrowUpRight size={16} color="#2F2E2C" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
