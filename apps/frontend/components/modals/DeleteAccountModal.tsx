'use client';

import { BaseModal, ModalButton } from '@/components/ui/BaseModal';

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteAccountModal({
  open,
  onOpenChange,
  isLoading = false,
  onConfirm,
  onCancel,
}: DeleteAccountModalProps) {
  const buttons: ModalButton[] = [
    {
      text: 'Annuler',
      variant: 'secondary',
      onClick: onCancel,
    },
    {
      text: 'Supprimer mon compte',
      variant: 'primary',
      onClick: onConfirm,
    },
  ];

  return (
    <BaseModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Supprimer mon compte"
      description="Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront définitivement supprimées."
      buttons={buttons}
      width="531px"
    />
  );
}

