'use client';

import { SubjectsTable } from '@/features/subjects';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { classesService } from '@/services/api/classes.service';
import { subjectsService, Subject } from '@/services/api/subjects.service';
import { toast } from 'sonner';
import { Download } from 'lucide-react';

export default function ArchivedClassDetailPage() {
  const params = useParams();
  const classId = params.id as string;
  const [classData, setClassData] = useState<any>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (classId) {
      loadData();
    }
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
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const transformedSubjects = useMemo(() => subjects.map((subject) => {
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
  }), [subjects, classData]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingTop: '120px', paddingLeft: '32px', paddingRight: '32px', paddingBottom: '32px' }}>
      <div className="mx-auto" style={{ maxWidth: '1700px' }}>
  
        <Link href="/classes/archived" prefetch={true} style={{ textDecoration: 'none' }}>
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
              marginBottom: '32px',
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
            <span>Retour à classes archivées</span>
          </button>
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '56px',
          }}
        >
          <div>
            <h1
              className="font-mochiy"
              style={{
                fontSize: '18px',
                fontWeight: 400,
                color: '#2F2E2C',
                lineHeight: '100%',
                marginBottom: '16px',
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

          <Button variant="export-class" onClick={() => }>
            <span>Exporter la classe (PDF)</span>
            <Download size={16} />
          </Button>
        </div>

        <SubjectsTable subjects={transformedSubjects} isArchived={true} />
      </div>
    </div>
  );
}
