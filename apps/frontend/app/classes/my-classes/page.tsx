'use client';

import { useState, useEffect } from 'react';
import { 
  ClassCard, 
  ClassModal, 
  ArchiveModal, 
  ClassLimitAdminModal, 
  ClassLimitNonAdminModal,
  ClassFormData 
} from '@/features/classes';
import { TrialBanner } from '@/components/ui/TrialBanner';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { classesService, Class } from '@/services/api/classes.service';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/entities';
import { toast } from 'sonner';
import Link from 'next/link';

export default function MyClassesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archivingClassId, setArchivingClassId] = useState<string | null>(null);
  const [isAdminLimitModalOpen, setIsAdminLimitModalOpen] = useState(false);
  const [isNonAdminLimitModalOpen, setIsNonAdminLimitModalOpen] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { user } = useAuth();
  
  // Vérifier si l'utilisateur est en période d'essai
  const isTrialing = user?.subscriptionStatus === 'TRIALING';
  
  useEffect(() => {
    setIsAdmin(user?.role === UserRole.ADMIN);
  }, [user]);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setIsLoading(true);
      const data = await classesService.getAll(false);
      setClasses(data);
    } catch (error) {
      console.error('Error loading classes:', error);
      toast.error('Erreur lors du chargement des classes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClass = async (data: ClassFormData) => {
    try {
      await classesService.create({
        name: data.className,
        studentCount: parseInt(data.studentCount),
        studentEmails: data.studentEmails.split(';').map(e => e.trim()).filter(e => e),
        description: data.description || undefined,
      });
      toast.success('Classe créée avec succès');
      setIsModalOpen(false);
      loadClasses();
    } catch (error: any) {
      console.error('Error creating class:', error);
      toast.error(error.message || 'Erreur lors de la création de la classe');
    }
  };

  const handleUpdateClass = async (data: ClassFormData) => {
    if (!editingClass) return;
    try {
      await classesService.update(editingClass.id, {
        name: data.className,
        studentCount: parseInt(data.studentCount),
        studentEmails: data.studentEmails.split(';').map(e => e.trim()).filter(e => e),
        description: data.description || undefined,
      });
      toast.success('Classe modifiée avec succès');
      setIsModalOpen(false);
      setEditingClass(null);
      loadClasses();
    } catch (error: any) {
      console.error('Error updating class:', error);
      toast.error(error.message || 'Erreur lors de la modification');
    }
  };

  const handleArchiveClass = async () => {
    if (!archivingClassId) return;
    try {
      await classesService.archive(archivingClassId);
      toast.success('Classe archivée avec succès');
      setIsArchiveModalOpen(false);
      setArchivingClassId(null);
      loadClasses();
    } catch (error: any) {
      console.error('Error archiving class:', error);
      toast.error(error.message || 'Erreur lors de l\'archivage');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingTop: '120px', paddingLeft: '32px', paddingRight: '32px', paddingBottom: '32px' }}>
      <div className="mx-auto" style={{ maxWidth: '1650px' }}>
      
        {/* Afficher la bannière UNIQUEMENT pour les utilisateurs en TRIALING */}
        {isTrialing && (
          <TrialBanner
            message1="Période d'essai en cours :"
            message2="Tout est illimité jusqu'au 18 septembre 2025."
            linkText="Je passe au plan Super Izzzi →"
            linkHref="/pricing"
            position="left"
          />
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '56px', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <h1
                className="font-mochiy"
                style={{
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#2F2E2C',
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                }}
              >
                {classes.length} classes disponibles
              </h1>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  color: '#6B6B6B',
                  whiteSpace: 'nowrap',
                }}
              >
                Vous pouvez ajouter jusqu'à 5 classes.
              </p>
            </div>

            <SearchInput
              placeholder="Rechercher une classe"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button 
            variant="add-class"
            onClick={() => {
              if (classes.length >= 5) {
                if (isAdmin) {
                  setIsAdminLimitModalOpen(true);
                } else {
                  setIsNonAdminLimitModalOpen(true);
                }
              } else {
                setIsModalOpen(true);
              }
            }}
          >
            Ajouter une classe
            <span style={{ fontSize: '20px', fontWeight: 300 }}>+</span>
          </Button>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 531px)',
          gap: '17px', 
          marginBottom: '32px',
        }}>
          {classes.map((classItem) => (
            <ClassCard
              key={classItem.id}
              id={classItem.id}
              name={classItem.name}
              description={classItem.description || ''}
              studentCount={classItem.studentCount}
              onModify={() => {
                setEditingClass(classItem);
                setIsModalOpen(true);
              }}
              onArchive={() => {
                setArchivingClassId(classItem.id);
                setIsArchiveModalOpen(true);
              }}
            />
          ))}
        </div>

       
        <Link href="/classes/archived" prefetch={true} style={{ textDecoration: 'none' }}>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              color: '#2F2E2C',
              textDecoration: 'underline',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            Voir les classes archivées →
          </span>
        </Link>

        <ClassModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingClass(null);
          }}
          onSubmit={editingClass ? handleUpdateClass : handleCreateClass}
          mode={editingClass ? 'edit' : 'create'}
          initialData={editingClass ? {
            className: editingClass.name,
            studentCount: editingClass.studentCount.toString(),
            studentEmails: editingClass.studentEmails.join('; '),
            description: editingClass.description || '',
          } : undefined}
        />

        <ArchiveModal
          isOpen={isArchiveModalOpen}
          onClose={() => {
            setIsArchiveModalOpen(false);
            setArchivingClassId(null);
          }}
          onConfirm={handleArchiveClass}
        />

        <ClassLimitAdminModal
          isOpen={isAdminLimitModalOpen}
          onClose={() => setIsAdminLimitModalOpen(false)}
        />

        <ClassLimitNonAdminModal
          isOpen={isNonAdminLimitModalOpen}
          onClose={() => setIsNonAdminLimitModalOpen(false)}
        />
      </div>
    </div>
  );
}
