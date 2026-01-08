'use client';

import { useState } from 'react';
import { BaseModal } from '@/components/ui/BaseModal';

interface EmailReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: () => Promise<void>;
  subjectName: string;
  teacherName: string;
  studentCount: number;
}

export function EmailReminderModal({
  isOpen,
  onClose,
  onSend,
  subjectName,
  teacherName,
  studentCount,
}: EmailReminderModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    setIsLoading(true);
    try {
      await onSend();
      onClose();
    } catch (error) {
      console.error('Error sending reminders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const description = (
    <p style={{ fontSize: '16px', marginBottom: '20px', color: '#2F2E2C' }}>
      Vous êtes sur le point d'envoyer un email de relance à{' '}
      <strong>{studentCount} étudiant{studentCount > 1 ? 's' : ''}</strong> pour le cours :
    </p>
  );

  const additionalContent = (
    <>
      <div
        style={{
          background: '#F8F8F8',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <div style={{ marginBottom: '10px' }}>
          <strong style={{ color: '#2F2E2C' }}>Matière :</strong>{' '}
          <span style={{ color: '#6B6B6B' }}>{subjectName}</span>
        </div>
        <div>
          <strong style={{ color: '#2F2E2C' }}>Intervenant :</strong>{' '}
          <span style={{ color: '#6B6B6B' }}>{teacherName}</span>
        </div>
      </div>

      <div
        style={{
          background: '#FFF9E6',
          border: '1px solid #FFD93D',
          padding: '15px',
          borderRadius: '8px',
        }}
      >
        <p style={{ fontSize: '14px', color: '#2F2E2C', margin: 0 }}>
          📧 <strong>Aperçu de l'email :</strong>
        </p>
        <p style={{ fontSize: '14px', color: '#6B6B6B', marginTop: '10px', lineHeight: '1.5' }}>
          <strong>Sujet :</strong> Un petit retour sur votre cours {subjectName} ?
          <br />
          <br />
          <strong>Contenu :</strong> Les étudiants recevront un email les invitant à donner leur
          avis sur le cours avec un lien direct vers le questionnaire.
        </p>
      </div>
    </>
  );

  const buttons = [
    {
      text: 'Annuler',
      variant: 'secondary' as const,
      onClick: onClose,
    },
    {
      text: isLoading ? 'Envoi en cours...' : 'Envoyer les relances',
      variant: 'primary' as const,
      onClick: handleSend,
    },
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Relancer les étudiants"
      description={description}
      additionalContent={additionalContent}
      buttons={buttons}
      width="600px"
    />
  );
}
