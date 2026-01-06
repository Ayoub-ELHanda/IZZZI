'use client';

import { SubjectsTable, SubjectModal, SubjectFormData } from '@/features/subjects';
import { TrialBanner } from '@/components/ui/TrialBanner';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
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

  const transformedSubjects = useMemo(() => subjects.map((subject) => {
    const hasQuestionnaires = subject.questionnaires && subject.questionnaires.length > 0;

    const duringCourseQuestionnaire = subject.questionnaires?.find(
      (q) => q.type === 'DURING_COURSE'
    );
    const afterCourseQuestionnaire = subject.questionnaires?.find(
      (q) => q.type === 'AFTER_COURSE'
    );

    const duringCourseResponses = duringCourseQuestionnaire?._count?.responses || 0;
    const afterCourseResponses = afterCourseQuestionnaire?._count?.responses || 0;

    const status: 'pending' | 'finished' = new Date(subject.endDate) > new Date() ? 'pending' : 'finished';

    return {
      id: subject.id,
      subjectName: subject.name,
      teacherName: subject.teacherName,
      startDate: formatDate(subject.startDate),
      endDate: formatDate(subject.endDate),
      status,
      totalStudents: classData?.studentCount || 0,
      hasQuestionnaire: hasQuestionnaires,
      duringCourseToken: duringCourseQuestionnaire?.token,
      afterCourseToken: afterCourseQuestionnaire?.token,
      duringCourseId: duringCourseQuestionnaire?.id,
      afterCourseId: afterCourseQuestionnaire?.id,
      duringCourseResponses,
      afterCourseResponses,
    };
  }), [subjects, classData]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:pt-[120px] sm:px-8">
      <div className="mx-auto max-w-[1700px]">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <Link href="/classes/my-classes" prefetch={true} className="text-decoration-none">
            <button
              className="flex items-center gap-2 bg-none border-none text-[#2F2E2C] text-sm font-poppins cursor-pointer py-2 px-0"
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
              <span className="text-sm md:text-sm">Retour à mes classes</span>
            </button>
          </Link>

          <div className="w-full md:w-auto">
            <TrialBanner
              message1="Période d'essai en cours :"
              message2="Tout est illimité jusqu'au 18 septembre 2025."
              linkText="Je passe au plan Super Izzzi →"
              linkHref="/pricing"
              position="right"
            />
          </div>
        </div>


        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full md:w-auto">
            <div className="flex flex-col gap-4 flex-shrink-0">
              <h1
                className="font-mochiy text-base md:text-lg"
                style={{
                  fontWeight: 400,
                  color: '#2F2E2C',
                  lineHeight: '100%',
                }}
              >
                {classData?.name || 'Classe'}
              </h1>
              <p
                className="text-xs md:text-sm"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: '#6B6B6B',
                }}
              >
                {classData?.studentCount || 0} étudiants
              </p>
            </div>

            <div className="w-full md:w-auto">
              <SearchInput
                placeholder="Rechercher par intervenant, cours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Button 
            variant="add-matiere" 
            className="w-full md:w-auto flex-shrink-0"
            onClick={() => setIsModalOpen(true)}
          >
            Ajouter une matière
            <span style={{ fontSize: '20px', fontWeight: 300 }}>+</span>
          </Button>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <SubjectsTable subjects={transformedSubjects} onRefresh={loadData} />
        </div>

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
