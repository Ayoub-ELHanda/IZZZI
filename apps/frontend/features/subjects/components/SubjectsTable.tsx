'use client';

import { useState } from 'react';
import { BorderedContainer } from '@/components/ui/BorderedContainer';
import { Button } from '@/components/ui/Button';
import { ArrowUpRight, Clock, Check, Download, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { FormTypeSelectionModal } from './FormTypeSelectionModal';
import { EmailReminderModal } from './EmailReminderModal';
import { questionnairesService, FormType } from '@/services/api/questionnaires.service';
import { toast } from 'sonner';

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
  duringCourseToken?: string;
  afterCourseToken?: string;
  duringCourseId?: string;
  afterCourseId?: string;
}

interface SubjectsTableProps {
  subjects: SubjectRowData[];
  onRefresh?: () => void;
}

export function SubjectsTable({ subjects, onRefresh }: SubjectsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'during' | 'after' | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectRowData | null>(null);
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenFormModal = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    setSelectedSubjectId(subjectId);
    setSelectedSubject(subject || null);
    setIsFormModalOpen(true);
  };

  const handleFormTypeValidate = async (formType: string) => {
    if (!selectedSubjectId) return;

    setIsLoading(true);
    try {
      const subject = subjects.find(s => s.id === selectedSubjectId);
      
      if (subject?.hasQuestionnaire) {
        // Vérifier si la modification est possible
        const { canModify, reason } = await questionnairesService.canModify(selectedSubjectId);
        
        if (!canModify) {
          toast.error(reason || 'Impossible de modifier les questionnaires');
          return;
        }

        // Mettre à jour les questionnaires
        await questionnairesService.update(selectedSubjectId, formType as FormType);
        toast.success('Questionnaires mis à jour avec succès');
      } else {
        // Créer les questionnaires
        await questionnairesService.create(selectedSubjectId, formType as FormType);
        toast.success('Questionnaires créés avec succès');
      }

      setIsFormModalOpen(false);
      setSelectedSubjectId(null);
      setSelectedSubject(null);
      
      // Recharger les données
      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      console.error('Error with questionnaires:', error);
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = (token: string, type: 'during' | 'after') => {
    const link = questionnairesService.getPublicQuestionnaireUrl(token);
    navigator.clipboard.writeText(link);
    setCopiedId(token);
    setCopiedType(type);
    toast.success('Lien copié dans le presse-papier !');
    setTimeout(() => {
      setCopiedId(null);
      setCopiedType(null);
    }, 2000);
  };

  const handleDownloadQR = async (token: string) => {
    try {
      await questionnairesService.downloadQRCode(token);
      toast.success('QR Code téléchargé avec succès');
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Erreur lors du téléchargement du QR code');
    }
  };

  const handleOpenEmailModal = (questionnaireId: string, subject: SubjectRowData) => {
  setSelectedQuestionnaireId(questionnaireId);
  setSelectedSubject(subject);
  setIsEmailModalOpen(true);
};

const handleSendReminders = async () => {
  if (!selectedQuestionnaireId) return;
  await questionnairesService.sendReminders(selectedQuestionnaireId);
  toast.success('Emails envoyés avec succès !');
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
            onOpenEmailModal={handleOpenEmailModal}
            copiedId={copiedId}
            copiedType={copiedType}
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

      {selectedSubject && (
        <EmailReminderModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          onSend={handleSendReminders}
          subjectName={selectedSubject.subjectName}
          teacherName={selectedSubject.teacherName}
          studentCount={selectedSubject.totalStudents}
        />
      )}
    </div>
  );
}

interface SubjectRowProps {
  subject: SubjectRowData;
  onCopyLink: (token: string, type: 'during' | 'after') => void;
  onDownloadQR: (token: string) => void;
  onOpenEmailModal: (questionnaireId: string, subject: SubjectRowData) => void;
  copiedId: string | null;
  copiedType: 'during' | 'after' | null;
  onOpenFormModal: (id: string) => void;
}

function SubjectRow({ subject, onCopyLink, onDownloadQR, onOpenEmailModal, copiedId, copiedType, onOpenFormModal }: SubjectRowProps) {
  const statusText = subject.status === 'pending' ? 'Pendant le cours' : 'Fin du cours';
  const statusColor = '#2F2E2C';
  
  const isDuringCopied = copiedId === subject.duringCourseToken && copiedType === 'during';
  const isAfterCopied = copiedId === subject.afterCourseToken && copiedType === 'after';

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
              onClick={() => subject.duringCourseToken && onCopyLink(subject.duringCourseToken, 'during')}
              style={{ gap: '29.29px' }}
            >
              <span>{isDuringCopied ? 'Lien copié !' : 'Copier le lien'}</span>
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </Button>
          </div>

          <button
            onClick={() => subject.duringCourseToken && onDownloadQR(subject.duringCourseToken)}
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

          <button
            onClick={() => subject.duringCourseId && onOpenEmailModal(subject.duringCourseId, subject)}
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
              Relancer les étudiants
            </span>
            <RefreshCw size={12} color="#2F2E2C" strokeWidth={1.5} />
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
              onClick={() => subject.afterCourseToken && onCopyLink(subject.afterCourseToken, 'after')}
              style={{ gap: '29.29px' }}
            >
              <span>{isAfterCopied ? 'Lien copié !' : 'Copier le lien'}</span>
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </Button>
          </div>

          <button
            onClick={() => subject.afterCourseToken && onDownloadQR(subject.afterCourseToken)}
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

          <button
            onClick={() => subject.afterCourseId && onOpenEmailModal(subject.afterCourseId, subject)}
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
              Relancer les étudiants
            </span>
            <RefreshCw size={12} color="#2F2E2C" strokeWidth={1.5} />
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
