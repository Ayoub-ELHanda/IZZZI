'use client';

import { useState, useRef } from 'react';
import { BaseModal, ModalButton } from '@/components/ui/BaseModal';
import { Upload } from 'lucide-react';

interface AvatarUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => void;
  onCancel: () => void;
  isLoading?: boolean;
  uploadProgress?: number;
  error?: string | null;
}

export function AvatarUploadModal({
  open,
  onOpenChange,
  onUpload,
  onCancel,
  isLoading = false,
  uploadProgress = 0,
  error = null,
}: AvatarUploadModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onCancel();
  };

  const buttons: ModalButton[] = [
    {
      text: 'Annuler',
      variant: 'secondary',
      onClick: handleCancel,
    },
    {
      text: 'Uploader',
      variant: 'primary',
      onClick: handleConfirm,
    },
  ];

  const additionalContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      {preview ? (
        <div
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #E5E5E5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={preview}
            alt="Preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      ) : (
        <div
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: '2px dashed #E5E5E5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onClick={() => fileInputRef.current?.click()}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2F2E2C';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E5E5E5';
          }}
        >
          <Upload size={32} color="#6B6B6B" />
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              color: '#6B6B6B',
            }}
          >
            Cliquez pour sélectionner une image
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {isLoading && (
        <div style={{ width: '100%', marginTop: '16px' }}>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#E5E5E5',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${uploadProgress}%`,
                height: '100%',
                backgroundColor: '#FFD93D',
                transition: 'width 0.3s',
              }}
            />
          </div>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '12px',
              color: '#6B6B6B',
              textAlign: 'center',
              marginTop: '8px',
            }}
          >
            Upload en cours... {uploadProgress}%
          </p>
        </div>
      )}

      {error && (
        <p
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            color: '#FF6B35',
            textAlign: 'center',
            marginTop: '8px',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );

  return (
    <BaseModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Modifier la photo de profil"
      description="Sélectionnez une nouvelle photo de profil"
      additionalContent={additionalContent}
      buttons={buttons}
      width="531px"
    />
  );
}
