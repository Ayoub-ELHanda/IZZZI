'use client';

import { X, ArrowUpRight, Eye, Clock, Check } from 'lucide-react';
import { Button } from './Button';
import { useState } from 'react';
import { FormPreview } from './FormPreview';

interface FormTypeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate: (formType: string) => void;
  subjectId: string;
}

type FormType = 'basic' | 'technical' | 'soft-skills' | 'logiciel' | 'custom';

interface FormOption {
  id: FormType;
  title: string;
  titleWidth: string;
  titleHeight: string;
  description: string;
  descWidth: string;
  descHeight: string;
  disabled?: boolean;
}

const formOptions: FormOption[] = [
  {
    id: 'basic',
    title: 'Basique',
    titleWidth: '83px',
    titleHeight: '13px',
    description: 'Adapté à tous les cours',
    descWidth: '165px',
    descHeight: '10px',
  },
  {
    id: 'technical',
    title: 'Adapté aux cours techniques',
    titleWidth: '299px',
    titleHeight: '13px',
    description: 'Ex : ReactJS, HTML/CSS, Gitlab ...',
    descWidth: '271px',
    descHeight: '10px',
  },
  {
    id: 'soft-skills',
    title: 'Adapté aux soft skills',
    titleWidth: '230px',
    titleHeight: '13px',
    description: 'Ex : Améliorer ses compétences de présentation ...',
    descWidth: '348px',
    descHeight: '10px',
  },
  {
    id: 'logiciel',
    title: 'Adapté aux cours logiciel',
    titleWidth: '260px',
    titleHeight: '13px',
    description: 'Ex : Figma, Webflow, Hubspot ...',
    descWidth: '213px',
    descHeight: '10px',
  },
  {
    id: 'custom',
    title: 'Créer mes formulaires',
    titleWidth: '228px',
    titleHeight: '13px',
    description: 'Bientôt disponible',
    descWidth: '126px',
    descHeight: '10px',
    disabled: true,
  },
];

export function FormTypeSelectionModal({
  isOpen,
  onClose,
  onValidate,
  subjectId,
}: FormTypeSelectionModalProps) {
  const [selectedType, setSelectedType] = useState<FormType>('technical');

  if (!isOpen) return null;

  const handleValidate = () => {
    onValidate(selectedType);
    onClose();
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
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '1437px',
          height: '886px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Close Button */}
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
          <X size={20} color="#2F2E2C" strokeWidth={2} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h2
            style={{
              width: '573px',
              height: '39px',
              fontFamily: 'Mochiy Pop One, sans-serif',
              fontSize: '18px',
              fontWeight: 400,
              color: '#2F2E2C',
              marginBottom: '24px',
              lineHeight: '1.3',
            }}
          >
            Deux moments clés pour recueillir les retours des étudiants
          </h2>

          {/* Explanations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#2F2E2C" strokeWidth={1.5} />
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#2F2E2C',
                }}
              >
                <strong>Pendant le cours :</strong> pour recueillir des retours à chaud.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={16} color="#2F2E2C" strokeWidth={1.5} />
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#2F2E2C',
                  
                }}
              >
                <strong>À la fin du cours :</strong> pour évaluer l'ensemble du cours (Ce formulaire est
                généré automatiquement).
              </span>
            </div>
          </div>
        </div>

        {/* Main Content - Two columns */}
        <div style={{ display: 'flex', gap: '40px', height: '600px', overflow: 'hidden' }}>
          {/* Left Column - Form options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: '0 0 auto' }}>
            {formOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => !option.disabled && setSelectedType(option.id)}
                disabled={option.disabled}
                style={{
                  width: '576px',
                  height: '97px',
                  backgroundColor:
                    selectedType === option.id && !option.disabled ? '#FFE552' : '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: option.disabled ? 'not-allowed' : 'pointer',
                  opacity: option.disabled ? 0.5 : 1,
                  transition: 'all 0.2s',
                }}
              >
                {/* Icon container */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: '#F8F8F8',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Eye size={16} color="#2F2E2C" strokeWidth={1.5} />
                </div>

                {/* Text content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                  <div
                    style={{
                      width: option.titleWidth,
                      height: option.titleHeight,
                      fontFamily: 'Mochiy Pop One, sans-serif',
                      fontSize: '18px',
                      fontWeight: 400,
                      color: '#2F2E2C',
                      lineHeight: '1',
                    }}
                  >
                    {option.title}
                  </div>
                  <div
                    style={{
                      width: option.descWidth,
                      height: option.descHeight,
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#6B6B6B',
                      lineHeight: '1',
                    }}
                  >
                    {option.description}
                  </div>
                </div>

                {/* Plus icon for disabled option */}
                {option.disabled && (
                  <div
                    style={{
                      marginLeft: 'auto',
                      fontSize: '24px',
                      color: '#6B6B6B',
                      fontWeight: 300,
                    }}
                  >
                    +
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Right Column - Preview */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              backgroundColor: '#F8F8F8',
              padding: '40px',
              overflowY: 'auto',
            }}
          >
            {selectedType ? (
              <FormPreview formType={selectedType} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Eye size={16} color="#2F2E2C" strokeWidth={1.5} />
                </div>
                <p
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#6B6B6B',
                    textAlign: 'center',
                    maxWidth: '400px',
                  }}
                >
                  Sélectionner un type de formulaire pour le prévisualiser
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Validate Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
          <button
            onClick={handleValidate}
            style={{
              width: '163.29px',
              height: '56px',
              backgroundColor: '#FFE552',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              fontWeight: 400,
              color: '#2F2E2C',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '20px 26px',
            }}
          >
            Valider
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
