'use client';

import { X, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface ClassLimitAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClassLimitAdminModal({ isOpen, onClose }: ClassLimitAdminModalProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push('/pricing');
    onClose();
  };

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
          height: '388px',
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
            fontSize: '18px',
            fontWeight: 400,
            color: '#2F2E2C',
            marginTop: '20px',
            marginBottom: '32px',
          }}
        >
          Limite de classes atteinte
        </h2>

        <p
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            color: '#2F2E2C',
            lineHeight: '1.5',
            marginBottom: '20px',
          }}
        >
          Vous avez atteint le nombre maximum de classes inclus dans votre offre actuelle.
        </p>

        <p
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            color: '#2F2E2C',
            lineHeight: '1.5',
            marginBottom: '40px',
          }}
        >
          Pour créer de nouvelles classes et continuer à utiliser Izzzi sans limite, vous pouvez passer à un plan supérieur.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <Button variant="class-limit-upgrade" onClick={handleUpgrade}>
            <span>Passer au plan supérieur</span>
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </Button>

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
