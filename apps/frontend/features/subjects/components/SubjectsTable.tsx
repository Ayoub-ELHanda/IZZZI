'use client';

import { useState } from 'react';
import { BorderedContainer } from '@/components/ui/BorderedContainer';
import { Button } from '@/components/ui/Button';
import { ArrowUpRight, Clock, Check, Download, Pencil, Trash2 } from 'lucide-react';
import { FormTypeSelectionModal } from './FormTypeSelectionModal';

interface SubjectRowData {
  id: string;
  subjectName: string;
  teacherName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'finished';
  feedbackCount: number;
  totalStudents: number;
  hasQuestionnaire?: boolean; 
}

interface SubjectsTableProps {
  subjects: SubjectRowData[];
}

export function SubjectsTable({ subjects }: SubjectsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const handleOpenFormModal = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setIsFormModalOpen(true);
  };

  const handleFormTypeValidate = (formType: string) => {
    console.log('Selected form type:', formType, 'for subject:', selectedSubjectId);
    // TODO: Update subject with hasQuestionnaire: true and formType
    // This will be handled by backend later
  };

  const handleCopyLink = (subjectId: string) => {
    const link = `https://example.com/feedback/${subjectId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(subjectId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadQR = (subjectId: string) => {

    console.log('Downloading QR code for:', subjectId);
  };

  return (
    <div
      style={{
        width: '1632px',
        minHeight: '652px',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
      }}
    >

      <div
        style={{
          position: 'relative',
          width: '1752px',
          height: '78px',
          left: '-50px',
          backgroundColor: '#F8F8F8',
          borderBottom: '1px solid #E5E5E5',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '105px',
            height: '10px',
            top: '35px',
            left: '93px',
            fontSize: '14px',
            fontFamily: 'Mochiy Pop One, sans-serif',
            lineHeight: '18px',
            color: '#2F2E2C',
            fontWeight: 400,
          }}
        >
          Les matières
        </div>

        <div
          style={{
            position: 'absolute',
            width: '249px',
            height: '10px',
            top: '35px',
            left: '391px',
            fontSize: '14px',
            fontFamily: 'Mochiy Pop One, sans-serif',
            lineHeight: '18px',
            color: '#2F2E2C',
            fontWeight: 400,
          }}
        >
          Lien des formulaires de retours
        </div>

        <div
          style={{
            position: 'absolute',
            width: '66px',
            height: '10px',
            top: '35px',
            left: '1115px',
            fontSize: '14px',
            fontFamily: 'Mochiy Pop One, sans-serif',
            lineHeight: '18px',
            color: '#2F2E2C',
            fontWeight: 400,
          }}
        >
          QR code
        </div>

        <div
          style={{
            position: 'absolute',
            width: '165px',
            height: '10px',
            top: '35px',
            left: '1449px',
            fontSize: '14px',
            fontFamily: 'Mochiy Pop One, sans-serif',
            lineHeight: '18px',
            color: '#2F2E2C',
            fontWeight: 400,
          }}
        >
          Accès aux résultats
        </div>
      </div>

   
      <div>
        {subjects.map((subject) => (
          <SubjectRow
            key={subject.id}
            subject={subject}
            onCopyLink={handleCopyLink}
            onDownloadQR={handleDownloadQR}
            isCopied={copiedId === subject.id}
            onOpenFormModal={handleOpenFormModal}
          />
        ))}
      </div>

   
      <FormTypeSelectionModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedSubjectId(null);
        }}
        onValidate={handleFormTypeValidate}
        subjectId={selectedSubjectId || ''}
      />
    </div>
  );
}

interface SubjectRowProps {
  subject: SubjectRowData;
  onCopyLink: (id: string) => void;
  onDownloadQR: (id: string) => void;
  isCopied: boolean;
  onOpenFormModal: (id: string) => void;
}

function SubjectRow({ subject, onCopyLink, onDownloadQR, isCopied, onOpenFormModal }: SubjectRowProps) {
  const statusText = subject.status === 'pending' ? 'Pendant le cours' : 'Fin du cours';
  const statusColor = '#2F2E2C';

  if (!subject.hasQuestionnaire) {
    return (
      <div
        style={{
          position: 'relative',
          width: '1631px',
          height: '97px',
          borderBottom: '1px solid #E5E5E5',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
        }}
      >

        <div
          style={{
            position: 'absolute',
            left: '30px',
            top: '35px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
     
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '16px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                color: '#2F2E2C',
              }}
            >
              {subject.subjectName}
            </span>
            <span
              style={{
                fontSize: '10px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                color: '#2F2E2C',
              }}
            >
              {subject.teacherName}
            </span>
          </div>
        
          <div
            style={{
              fontSize: '11px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              color: '#9B9B9B',
            }}
          >
            {subject.startDate} - {subject.endDate}
          </div>
        </div>

  
        <div style={{ position: 'absolute', left: '320px' }}>
          <button
            onClick={() => onOpenFormModal(subject.id)}
            style={{
              width: '323.29px',
              height: '56px',
              backgroundColor: '#F69D04',
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
            }}
          >
            Choisir le type de formulaire
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <button
            onClick={() => console.log('Edit', subject.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <Pencil size={16} color="#2F2E2C" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => console.log('Delete', subject.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <Trash2 size={16} color="#2F2E2C" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '1630px',
        height: '234px',
        borderBottom: '1px solid #E5E5E5',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
      }}
    >
  
      <div
        style={{
          position: 'absolute',
          left: '30px',
          top: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontSize: '16px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              color: '#2F2E2C',
            }}
          >
            {subject.subjectName}
          </span>
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              color: '#2F2E2C',
            }}
          >
            {subject.teacherName}
          </span>
        </div>
   
        <div
          style={{
            fontSize: '11px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            color: '#9B9B9B',
          }}
        >
          {subject.startDate} - {subject.endDate}
        </div>

        <div style={{ marginTop: '16px' }}>
          <Button 
            variant="modify-questionnaire"
            onClick={() => onOpenFormModal(subject.id)}
          >
            Modifier le formulaire
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </Button>
          <div
            style={{
              width: '252px',
              marginTop: '8px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '10px',
              fontWeight: 400,
              color: '#2F2E2C',
              lineHeight: '1.1',
            }}
          >
            Le formulaire sélectionné s'applique à tous les moments d'évaluation de cette matière
          </div>
        </div>
      </div>

      
      <div style={{ position: 'absolute', left: '320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

        <BorderedContainer width="1252.29px">
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '145px',
              }}
            >
              <Clock size={16} color={statusColor} strokeWidth={1.5} />
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 700,
                  lineHeight: '100%',
                  color: statusColor,
                  whiteSpace: 'nowrap',
                }}
              >
                Pendant le cours
              </span>
            </div>

            <Button 
              variant="copy-link"
              onClick={() => onCopyLink(subject.id)}
              style={{ gap: '29.29px' }}
            >
              <span>{isCopied ? 'Lien copié !' : 'Copier le lien'}</span>
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </Button>
          </div>

          <button
            onClick={() => onDownloadQR(subject.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
            }}
          >
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '100%',
                textDecoration: 'underline',
                textDecorationStyle: 'solid',
                color: '#2F2E2C',
              }}
            >
              Télécharger le QR code
            </span>
            <Download size={12} color="#2F2E2C" strokeWidth={1.5} />
          </button>

          <a
            href="#"
            style={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: '16px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                color: '#2F2E2C',
                textDecoration: 'underline',
                textDecorationStyle: 'solid',
                marginBottom: '2px',
              }}
            >
              Voir les retours ({subject.feedbackCount}/{subject.totalStudents})
            </div>
            <div
              style={{
                fontSize: '10px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                color: '#6B6B6B',
                fontStyle: 'italic',
              }}
            >
              (Tous les retours sont anonymes sur le plan gratuit)
            </div>
          </a>
        </BorderedContainer>

   
        <BorderedContainer width="1252.29px">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '30px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '145px',
              }}
            >
              <Check size={16} color={statusColor} strokeWidth={1.5} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    lineHeight: '100%',
                    color: statusColor,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Fin du cours
                </span>
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '11px',
                    fontWeight: 400,
                    lineHeight: '100%',
                    color: '#6B6B6B',
                  }}
                >
                  (automatique)
                </span>
              </div>
            </div>

            <Button 
              variant="copy-link"
              onClick={() => onCopyLink(subject.id)}
              style={{ gap: '29.29px' }}
            >
              <span>{isCopied ? 'Lien copié !' : 'Copier le lien'}</span>
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </Button>
          </div>

          <button
            onClick={() => onDownloadQR(subject.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
            }}
          >
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '100%',
                textDecoration: 'underline',
                textDecorationStyle: 'solid',
                color: '#2F2E2C',
              }}
            >
              Télécharger le QR code
            </span>
            <Download size={12} color="#2F2E2C" strokeWidth={1.5} />
          </button>

          <a
            href="#"
            style={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: '16px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                color: '#2F2E2C',
                textDecoration: 'underline',
                textDecorationStyle: 'solid',
                marginBottom: '2px',
              }}
            >
              Voir les retours ({subject.feedbackCount}/{subject.totalStudents})
            </div>
            <div
              style={{
                fontSize: '10px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                color: '#6B6B6B',
                fontStyle: 'italic',
              }}
            >
              (Tous les retours sont anonymes sur le plan gratuit)
            </div>
          </a>
        </BorderedContainer>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '75px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <button
          onClick={() => console.log('Edit', subject.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <Pencil size={16} color="#2F2E2C" strokeWidth={1.5} />
        </button>
        <button
          onClick={() => console.log('Delete', subject.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <Trash2 size={16} color="#2F2E2C" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
