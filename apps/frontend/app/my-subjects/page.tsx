'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubjectsDataTable } from '@/features/subjects/components/SubjectsDataTable';
import { SubjectModal } from '@/features/subjects/components/SubjectModal';
import { Button } from '@/components/ui/Button';
import { subjectsService, Subject } from '@/services/api/subjects.service';
import { classesService } from '@/services/api/classes.service';
import { SubjectFormData } from '@/features/subjects/types';
import { toast } from 'sonner';
import { ArrowUpRight } from 'lucide-react';

export default function MySubjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classData, setClassData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!classId) {
      toast.error('Aucune classe sélectionnée');
      router.push('/classes/my-classes');
      return;
    }
    loadData();
  }, [classId]);

  const loadData = async () => {
    if (!classId) return;
    
    try {
      setIsLoading(true);
      const [classInfo, subjectsData] = await Promise.all([
        classesService.getById(classId),
        subjectsService.getByClassId(classId),
      ]);
      setClassData(classInfo);
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error loading data:', error);
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
    if (!classId) return;

    setIsCreating(true);
    try {
      await subjectsService.create({
        name: formData.name,
        teacherName: formData.teacherName,
        teacherEmail: formData.teacherEmail || undefined, // Send if provided
        startDate: parseDate(formData.startDate),
        endDate: parseDate(formData.endDate),
        classId: classId,
      });
      toast.success('Matière créée avec succès');
      setIsModalOpen(false);
      await loadData(); // Recharger la liste
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

  const handleValidate = () => {
    router.push('/classes/my-classes');
  };

  const handleEdit = (id: string) => {
    toast.info('Modification en cours de développement');
    console.log('Edit subject:', id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) return;
    
    try {
      await subjectsService.delete(id);
      toast.success('Matière supprimée avec succès');
      await loadData();
    } catch (error: any) {
      console.error('Error deleting subject:', error);
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  const transformedSubjects = subjects.map((subject) => ({
    id: subject.id,
    name: subject.name,
    teacherName: subject.teacherName,
    teacherEmail: subject.teacherEmail || '-',
    startDate: new Date(subject.startDate).toLocaleDateString('fr-FR'),
    endDate: new Date(subject.endDate).toLocaleDateString('fr-FR'),
  }));

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingTop: '120px', paddingLeft: '32px', paddingRight: '32px', paddingBottom: '32px' }}>
      <div className="mx-auto" style={{ maxWidth: '1400px' }}>
        {/* Back link */}
        <button
          onClick={() => router.back()}
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
            textDecoration: 'underline',
          }}
        >
          Retour aux uploads des matières
        </button>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
            <h1
              className="font-mochiy"
              style={{
                fontSize: '24px',
                fontWeight: 400,
                color: '#2F2E2C',
              }}
            >
              Mes matières
            </h1>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                color: '#6B6B6B',
              }}
            >
              {classData?.name || 'B3UI'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Button
              variant="add-matiere"
              onClick={() => setIsModalOpen(true)}
            >
              Ajouter une matière
              <span style={{ fontSize: '20px', fontWeight: 300 }}>+</span>
            </Button>

            <Button
              variant="create"
              onClick={handleValidate}
            >
              Valider
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </Button>
          </div>
        </div>

        {/* Table */}
        <SubjectsDataTable
          subjects={transformedSubjects}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Modal */}
        <SubjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateSubject}
          onCSVImport={handleCSVImport}
          classId={classId || ''}
          isLoading={isCreating}
        />
      </div>
    </div>
  );
}
