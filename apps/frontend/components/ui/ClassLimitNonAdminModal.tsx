'use client';

import { BaseModal } from './BaseModal';

interface ClassLimitNonAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClassLimitNonAdminModal({ isOpen, onClose }: ClassLimitNonAdminModalProps) {
  const additionalContent = (
    <p
      style={{
        fontFamily: 'Poppins, sans-serif',
        fontSize: '16px',
        fontWeight: 400,
        color: '#2F2E2C',
        lineHeight: '1.5',
      }}
    >
      Pour ajouter une nouvelle classe, nous vous invitons à contacter l'administrateur de votre compte.
    </p>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Impossible d'ajouter une nouvelle classe"
      description="Le nombre maximum de classes autorisées a été atteint pour votre établissement."
      additionalContent={additionalContent}
      width="531px"
      height="324px"
      buttons={[
        {
          text: 'Fermer',
          variant: 'secondary',
          onClick: onClose,
        },
      ]}
    />
  );
}
