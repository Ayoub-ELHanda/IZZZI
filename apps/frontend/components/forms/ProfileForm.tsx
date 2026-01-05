'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Pen, ArrowUpRight } from 'lucide-react';

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
}

interface ProfileFormProps {
  initialData: ProfileFormData;
  onSubmit: (data: ProfileFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
  onEdit: () => void;
  userInitials?: string;
}

export function ProfileForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
  onEdit,
  userInitials = 'YK',
}: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isEditing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2F2E2C',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Prénom
            </label>
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#F5F5F5',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                color: '#2F2E2C',
              }}
            >
              {formData.firstName || '-'}
            </div>
          </div>

          <div>
            <label
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2F2E2C',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Nom
            </label>
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#F5F5F5',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                color: '#2F2E2C',
              }}
            >
              {formData.lastName || '-'}
            </div>
          </div>

          <div>
            <label
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2F2E2C',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Email
            </label>
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#F5F5F5',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                color: '#2F2E2C',
              }}
            >
              {formData.email || '-'}
            </div>
          </div>

          <div>
            <label
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2F2E2C',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Organisation
            </label>
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#F5F5F5',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                color: '#2F2E2C',
              }}
            >
              {formData.organization || '-'}
            </div>
          </div>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Input
          label="Prénom"
          name="firstName"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
        <Input
          label="Nom"
          name="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Input
          label="Établissement"
          name="organization"
          value={formData.organization}
          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
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

