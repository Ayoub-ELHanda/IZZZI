'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { SubjectFormData } from '../types';

interface SubjectFormProps {
  onBack: () => void;
  onSubmit: (data: SubjectFormData) => void;
  onCSVImport: (file: File) => void;
  isLoading?: boolean;
  isModal?: boolean;
}

export function SubjectForm({ onBack, onSubmit, onCSVImport, isLoading = false, isModal = false }: SubjectFormProps) {
  const [formData, setFormData] = useState<SubjectFormData>({
    name: '',
    teacherName: '',
    teacherEmail: '',
    startDate: '',
    endDate: '',
  });

  const handleInputChange = (field: keyof SubjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (formData.name && formData.teacherName && formData.startDate && formData.endDate) {
      onSubmit(formData);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCSVImport(file);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      padding: isModal ? ' 20px 50px 40px' : '180px 0 80px',
      position: 'relative',
    }}>

      {!isModal && (
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '120px',
            left: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#2F2E2C',
            fontSize: '14px',
            fontFamily: 'Poppins, sans-serif',
            cursor: 'pointer',
            padding: '8px 0',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 16L6 10L12 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Retour aux informations de la classe</span>
        </button>
      )}

      {!isModal && (
        <div className="text-center relative">
          <div
            className="flex items-center justify-center mx-auto"
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: 'white',
              border: '1px solid #E0E0E0',
              borderRadius: '750px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
              marginBottom: '24px',
            }}
          >
            2/2
          </div>

          {/* Title */}
          <h2
            className="font-mochiy mx-auto"
            style={{
              width: '356px',
              height: '23px',
              fontSize: '28px',
              fontWeight: 400,
              lineHeight: '100%',
              marginBottom: '24px',
              color: '#2F2E2C',
              textAlign: 'center',
            }}
          >
            Entrer les matières
          </h2>

          {/* Decorative text */}
          <div
            className="absolute"
            style={{
              top: '-40px',
              right: '50px',
              transform: 'rotate(-12.18deg)',
              fontFamily: 'Caveat, cursive',
              fontSize: '20px',
              color: '#2F2E2C',
              lineHeight: '1.3',
            }}
          >
            On y est<br />presque !
          </div>
        </div>
      )}

      {/* CSV Section */}
      <div style={{
        width: '800px',
        minHeight: '228px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        marginBottom: '32px',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <h2 style={{
            fontFamily: 'Mochiy Pop One, sans-serif',
            fontSize: '18px',
            fontWeight: 400,
            color: '#2F2E2C',
          }}>
            Télécharger le CSV pour ajouter toutes tes matières d'un coup.
          </h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <a
              href="#"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '16px',
                color: '#2F2E2C',
                textDecoration: 'underline',
              }}
            >
              Comment ça marche ?
            </a>
            <span style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              color: '#6B6B6B',
            }}>
              (1 minute)
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
        }}>
          <button
            type="button"
            style={{
              height: '56px',
              padding: '0 24px',
              backgroundColor: '#FFFFFF',
              color: '#2F2E2C',
              border: '1px solid #E0E0E0',
              borderRadius: '8px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              fontWeight: 400,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            Télécharger notre modèle CSV
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <label style={{ cursor: 'pointer' }}>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              style={{
                height: '56px',
                padding: '0 24px',
                backgroundColor: '#FFE552',
                color: '#2F2E2C',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '16px',
                fontWeight: 400,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onClick={(e) => {
                e.preventDefault();
                const input = e.currentTarget.parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
                input?.click();
              }}
            >
              Importer un fichier CSV
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </label>
        </div>
      </div>

      {/* OU separator */}
      <div style={{
        width: '45px',
        height: '23px',
        fontFamily: 'Mochiy Pop One, sans-serif',
        fontSize: '32px',
        fontWeight: 400,
        color: '#2F2E2C',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        ou
      </div>

      {/* Manual form section */}
      <div style={{
        width: '804px',
        minHeight: '506px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
      }}>
        <h2 style={{
          fontFamily: 'Mochiy Pop One, sans-serif',
          fontSize: '18px',
          fontWeight: 400,
          color: '#2F2E2C',
        }}>
          Ajouter les matières une par une.
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}>
          <div>
            <label style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
              marginBottom: '8px',
              display: 'block',
            }}>
              Nom de la matière
            </label>
            <Input
              placeholder="Entrez le nom de la matière"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          <div>
            <label style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
              marginBottom: '8px',
              display: 'block',
            }}>
              Nom de l'intervenant
            </label>
            <Input
              placeholder="Entrez le nom de l'intervenant"
              value={formData.teacherName}
              onChange={(e) => handleInputChange('teacherName', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            color: '#2F2E2C',
            marginBottom: '8px',
            display: 'block',
          }}>
            Email de l'intervenant (facultatif)
          </label>
          <Input
            placeholder="Entrez l'email de l'intervenant"
            value={formData.teacherEmail}
            onChange={(e) => handleInputChange('teacherEmail', e.target.value)}
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}>
          <div>
            <label style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
              marginBottom: '8px',
              display: 'block',
            }}>
              Date du premier cours (facultatif)
            </label>
            <Input
              type="text"
              placeholder="JJ/MM/AAAA"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
          </div>

          <div>
            <label style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
              marginBottom: '8px',
              display: 'block',
            }}>
              Date du dernier cours (facultatif)
            </label>
            <Input
              type="text"
              placeholder="JJ/MM/AAAA"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
            />
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
  
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" stroke="#2F2E2C" />
            <path d="M8 4V8M8 10.5V11" stroke="#2F2E2C" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '12px',
            fontWeight: 400,
            color: '#2F2E2C',
          }}>
            Après création, vous serez redirigé vers la liste de vos matières.
          </p>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            width: '228.29px',
            height: '56px',
            backgroundColor: '#FFE552',
            color: '#2F2E2C',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            borderRadius: '8px',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1,
            paddingLeft: '26px',
            paddingRight: '26px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <span>{isLoading ? 'Création...' : 'Créer la matière'}</span>
          {!isLoading && (
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M7 17l9.2-9.2M17 17V7H7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
