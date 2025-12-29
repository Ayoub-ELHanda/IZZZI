'use client';

import { SubjectsTable } from '@/components/ui/SubjectsTable';
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

  // Transform subjects to match SubjectsTable format
  const transformedSubjects = subjects.map((subject) => {
    const hasQuestionnaires = subject.questionnaires && subject.questionnaires.length > 0;
    const totalResponses = hasQuestionnaires
      ? subject.questionnaires.reduce((acc, q) => acc + (q._count?.responses || 0), 0)
      : 0;

    return {
      id: subject.id,
      subjectName: subject.name,
      teacherName: subject.teacherName,
      startDate: new Date(subject.startDate).toLocaleDateString('fr-FR'),
      endDate: new Date(subject.endDate).toLocaleDateString('fr-FR'),
      status: new Date(subject.endDate) < new Date() ? ('finished' as const) : ('pending' as const),
      feedbackCount: totalResponses,
      totalStudents: classData?.studentCount || 0,
      hasQuestionnaire: hasQuestionnaires,
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

 
          <Button variant="add-matiere" onClick={() => console.log('Ajouter une matière')}>
            Ajouter une matière
            <span style={{ fontSize: '20px', fontWeight: 300 }}>+</span>
          </Button>
        </div>


        <SubjectsTable subjects={transformedSubjects} />
      </div>
    </div>
  );
}
