'use client';

import React, { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string) => Promise<void>;
  subjectName: string;
  className: string;
  studentCount: number;
}

export function SendMessageModal({
  isOpen,
  onClose,
  onSubmit,
  subjectName,
  className,
  studentCount,
}: SendMessageModalProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Veuillez saisir un message');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(message);
      setMessage('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setMessage('');
      setError(null);
      onClose();
    }
  };

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
        zIndex: 1001,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #E5E5E5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                color: '#2F2E2C',
                margin: 0,
                marginBottom: '4px',
              }}
            >
              Envoyer un message aux étudiants
            </h2>
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13px',
                color: '#666666',
              }}
            >
              {studentCount} étudiant{studentCount > 1 ? 's' : ''} de {className} recevront ce message
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            style={{
              background: 'none',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isSubmitting ? 0.5 : 1,
            }}
          >
            <X size={24} color="#2F2E2C" />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ padding: '24px', flex: 1 }}>
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#2F2E2C',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Cours concerné
              </label>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#F5F5F5',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  color: '#2F2E2C',
                }}
              >
                {subjectName}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="message"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#2F2E2C',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setError(null);
                }}
                placeholder="Écrivez votre message aux étudiants..."
                disabled={isSubmitting}
                required
                style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  color: '#2F2E2C',
                  border: error ? '2px solid #FF6B35' : '1px solid #E5E5E5',
                  borderRadius: '8px',
                  resize: 'vertical',
                  backgroundColor: isSubmitting ? '#F5F5F5' : '#FFFFFF',
                  cursor: isSubmitting ? 'not-allowed' : 'text',
                }}
              />
              {error && (
                <div
                  style={{
                    marginTop: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    color: '#FF6B35',
                  }}
                >
                  {error}
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              padding: '24px',
              borderTop: '1px solid #E5E5E5',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                backgroundColor: '#FFFFFF',
                color: '#666666',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              style={{
                padding: '10px 20px',
                backgroundColor: isSubmitting || !message.trim() ? '#CCCCCC' : '#4A90E2',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                cursor: isSubmitting || !message.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Envoyer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
