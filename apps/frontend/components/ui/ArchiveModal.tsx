'use client';

import { BaseModal } from './BaseModal';

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
}

export function ArchiveModal({ isOpen, onClose, onConfirm }: ArchiveModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Archiver cette classe ?"
      description="Cette classe ne sera plus modifiable, ni restaurable, mais restera consultable à tout moment dans vos classes archivées."
      width="531px"
      height="316px"
      buttons={[
        {
          text: 'Archiver',
          variant: 'primary',
          onClick: onConfirm,
        },
        {
          text: 'Annuler',
          variant: 'secondary',
          onClick: onClose,
        },
      ]}
    />
  );
}
