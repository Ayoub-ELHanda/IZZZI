'use client';

import { X, ArrowUpRight } from 'lucide-react';
import { Button } from './Button';

export interface ModalButton {
  text: string;
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  href?: string;
  disabled?: boolean;
}

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string | React.ReactNode;
  additionalContent?: React.ReactNode;
  buttons: ModalButton[];
  width?: string;
  height?: string;
  isLoading?: boolean;
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  description,
  additionalContent,
  buttons,
  width = '531px',
  height = 'auto',
  isLoading = false,
}: BaseModalProps) {
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
          width,
          minHeight: height,
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
        <h2
          style={{
            fontFamily: 'Mochiy Pop One, sans-serif',
            fontSize: '19px',
            fontWeight: 400,
            color: '#2F2E2C',
            marginBottom: '24px',
          }}
        >
          {title}
        </h2>
        <div
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            color: '#2F2E2C',
            lineHeight: '1.5',
            marginBottom: additionalContent ? '16px' : '32px',
          }}
        >
          {description}
        </div>
        {additionalContent && (
          <div style={{ marginBottom: '32px' }}>
            {additionalContent}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          {buttons.map((button, index) => {
            const isDisabled = isLoading || button.disabled;
            if (button.variant === 'primary') {
              return (
                <Button
                  key={index}
                  variant="archive-modal"
                  onClick={button.onClick}
                  disabled={isDisabled}
                  isLoading={isLoading && index === buttons.length - 1}
                >
                  <span>{button.text}</span>
                  {!isLoading && <ArrowUpRight size={16} strokeWidth={1.5} />}
                </Button>
              );
            } else if (button.variant === 'danger') {
              return (
                <Button
                  key={index}
                  variant="danger"
                  onClick={button.onClick}
                  disabled={isDisabled}
                  isLoading={isLoading && index === buttons.length - 1}
                  style={{
                    height: '56px',
                    padding: '0 24px',
                    fontSize: '16px',
                    fontWeight: 500,
                  }}
                >
                  <span>{button.text}</span>
                  {!isLoading && <ArrowUpRight size={16} strokeWidth={1.5} />}
                </Button>
              );
            } else {
              return (
                <button
                  key={index}
                  onClick={button.onClick}
                  disabled={isDisabled}
                  style={{
                    height: '56px',
                    background: 'none',
                    border: 'none',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    color: isDisabled ? '#9CA3AF' : '#2F2E2C',
                    opacity: isDisabled ? 0.6 : 1,
                  }}
                >
                  <span>{button.text}</span>
                  <ArrowUpRight size={16} color={isDisabled ? '#9CA3AF' : '#2F2E2C'} strokeWidth={1.5} />
                </button>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
