'use client';

import { useState } from 'react';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Pen, ArrowUpRight } from 'lucide-react';

export interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordFormProps {
  onSubmit: (data: PasswordFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
  onEdit: () => void;
}

export function PasswordForm({
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
  onEdit,
}: PasswordFormProps) {
  const [formData, setFormData] = useState<PasswordFormData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    onSubmit(formData);
  };

  if (!isEditing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            color: '#6B6B6B',
          }}
        >
          ••••••••••••
        </div>

        <Button
          onClick={onEdit}
          variant="outline"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Pen size={16} />
          Modifier
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#FFF4E0',
            border: '1px solid #FF6B35',
            borderRadius: '8px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            color: '#FF6B35',
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <PasswordInput
          id="oldPassword"
          label="Ancien mot de passe"
          placeholder="Entrez votre ancien mot de passe"
          value={formData.oldPassword}
          onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
        />
        <div>
          <PasswordInput
            id="newPassword"
            label="Nouveau"
            placeholder="Entrez votre nouveau mot de passe"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '12px',
              marginTop: '8px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                color: '#6B6B6B',
              }}
            >
              • 8 caractères
            </span>
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                color: '#6B6B6B',
              }}
            >
              • 1 minuscule
            </span>
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                color: '#6B6B6B',
              }}
            >
              • 1 majuscule
            </span>
          </div>
        </div>
        <PasswordInput
          id="confirmPassword"
          label="Confirmez votre nouveau mot de passe"
          placeholder="Entrez votre nouveau mot de passe"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />
      </div>

      <Button
        type="submit"
        isLoading={isLoading}
        style={{
          backgroundColor: '#FFD93D',
          color: '#2F2E2C',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '16px',
          padding: '16px 26px',
          height: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: 'auto',
          justifyContent: 'center',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          marginTop: '8px',
          alignSelf: 'flex-start',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#FFE566';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#FFD93D';
        }}
      >
        Modifier
        <ArrowUpRight size={16} />
      </Button>
    </form>
  );
}
