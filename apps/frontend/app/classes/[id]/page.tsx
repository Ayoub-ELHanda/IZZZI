'use client';

import { SubjectsTable, SubjectModal, SubjectFormData } from '@/features/subjects';
import { TrialBanner } from '@/components/ui/TrialBanner';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { classesService } from '@/services/api/classes.service';
import { subjectsService, Subject } from '@/services/api/subjects.service';
import { toast } from 'sonner';

export default function ClassDetailPage() {
  const params = useParams();
  const classId = params.id as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [classData, setClassData] = useState<any>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, [classId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [classInfo, subjectsData] = await Promise.all([
        classesService.getById(classId),
        subjectsService.getByClassId(classId),
      ]);
      setClassData(classInfo);
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error loading class data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const parseDate = (dateStr: string): string => {
    const [day, month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString();
  };

  const handleCreateSubject = async (formData: SubjectFormData) => {
    setIsCreating(true);
    try {
      await subjectsService.create({
        name: formData.name,
        teacherName: formData.teacherName,
        startDate: parseDate(formData.startDate),
        endDate: parseDate(formData.endDate),
        classId: classId,
      });
      toast.success('Matière créée avec succès');
      setIsModalOpen(false);
      await loadData(); 
    } catch (error: any) {
      console.error('Error creating subject:', error);
      toast.error(error.message || 'Erreur lors de la création de la matière');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCSVImport = (file: File) => {
    toast.info('Import CSV en cours de développement');
    console.log('CSV file:', file);
  };

  // Fonction pour formater une date en dd/MM/yyyy
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const transformedSubjects = subjects.map((subject) => {
    const hasQuestionnaires = subject.questionnaires && subject.questionnaires.length > 0;
    const totalResponses = hasQuestionnaires
      ? subject.questionnaires.reduce((acc, q) => acc + (q._count?.responses || 0), 0)
      : 0;

    const duringCourseQuestionnaire = subject.questionnaires?.find(
      (q) => q.type === 'DURING_COURSE'
    );
    const afterCourseQuestionnaire = subject.questionnaires?.find(
      (q) => q.type === 'AFTER_COURSE'
    );

    const status: 'pending' | 'finished' = new Date(subject.endDate) > new Date() ? 'pending' : 'finished';

    return {
      id: subject.id,
      subjectName: subject.name,
      teacherName: subject.teacherName,
      startDate: formatDate(subject.startDate),
      endDate: formatDate(subject.endDate),
      status,
      feedbackCount: totalResponses,
      totalStudents: classData?.studentCount || 0,
      hasQuestionnaire: hasQuestionnaires,
      duringCourseToken: duringCourseQuestionnaire?.token,
      afterCourseToken: afterCourseQuestionnaire?.token,
      duringCourseId: duringCourseQuestionnaire?.id,
      afterCourseId: afterCourseQuestionnaire?.id,
    };
  });

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto" style={{ maxWidth: '1700px' }}>

        <TrialBanner
          message1="Période d'essai en cours :"
          message2="Tout est illimité jusqu'au 18 septembre 2025."
          linkText="Je passe au plan Super Izzzi →"
          linkHref="/pricing"
        />

        <Link href="/classes/my-classes" style={{ textDecoration: 'none' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: '#2F2E2C',
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer',
              marginBottom: '16px',
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
            <span>Retour à mes classes</span>
          </button>
        </Link>


        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <h1
                className="font-mochiy"
                style={{
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#2F2E2C',
                  lineHeight: '100%',
                }}
              >
                {classData?.name || 'Classe'}
              </h1>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  color: '#6B6B6B',
                }}
              >
                {classData?.studentCount || 0} étudiants
              </p>
            </div>


            <SearchInput
              placeholder="Rechercher par intervenant, cours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

 
          <Button variant="add-matiere" onClick={() => setIsModalOpen(true)}>
            Ajouter une matière
            <span style={{ fontSize: '20px', fontWeight: 300 }}>+</span>
          </Button>
        </div>


        <SubjectsTable subjects={transformedSubjects} onRefresh={loadData} />

        {/* Modal pour ajouter une matière */}
        <SubjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateSubject}
          onCSVImport={handleCSVImport}
          classId={classId}
          isLoading={isCreating}
        />
      </div>
    </div>
  );
}
