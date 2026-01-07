'use client';

import { AlertTriangle } from 'lucide-react';
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
      onClick: isLoading ? () => {} : onCancel,
    },
    {
      text: isLoading ? 'Suppression en cours...' : 'Oui, supprimer mon compte',
      variant: 'danger',
      onClick: isLoading ? () => {} : onConfirm,
    },
  ];

  const description = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p style={{ margin: 0, lineHeight: '1.6', color: '#2F2E2C' }}>
        Nous sommes désolés de vous voir partir. Avant de continuer, veuillez noter que la suppression de votre compte entraînera la perte permanente de :
      </p>
      <ul style={{ 
        margin: 0, 
        paddingLeft: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px',
        color: '#4B5563',
        lineHeight: '1.6'
      }}>
        <li>Toutes vos classes et matières</li>
        <li>Tous les questionnaires et réponses collectées</li>
        <li>Vos informations de profil et paramètres</li>
        <li>Votre historique d'abonnement et de paiement</li>
      </ul>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '16px',
        backgroundColor: '#FEF2F2',
        borderRadius: '8px',
        border: '1px solid #FECACA',
        marginTop: '4px'
      }}>
        <AlertTriangle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ flex: 1 }}>
          <p style={{ 
            margin: 0, 
            color: '#991B1B', 
            fontSize: '14px',
            lineHeight: '1.5',
            fontWeight: 600,
            marginBottom: '4px'
          }}>
            Action irréversible
          </p>
          <p style={{ 
            margin: 0, 
            color: '#991B1B', 
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            Cette action ne peut pas être annulée. Vos données seront définitivement supprimées et ne pourront pas être récupérées.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <BaseModal
      isOpen={open}
      onClose={() => !isLoading && onOpenChange(false)}
      title="Supprimer mon compte"
      description={description}
      buttons={buttons}
      width="531px"
      isLoading={isLoading}
    />
  );
}

