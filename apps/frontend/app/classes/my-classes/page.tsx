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
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:pt-[120px] sm:px-8">
      <div className="mx-auto max-w-[1650px]">
      
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
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-14 mt-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
            <div className="flex flex-col gap-2 flex-shrink-0"> 
              <h1
                className="font-mochiy text-base md:text-lg"
                style={{
                  fontWeight: 400,
                  color: '#2F2E2C',
                  lineHeight: '1.2',
                }}
              >
                {classes.length} classes disponibles
              </h1>
              <p
                className="text-xs md:text-sm"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: '#6B6B6B',
                }}
              >
                Vous pouvez ajouter jusqu'à 5 classes.
              </p>
            </div>

            <div className="w-full md:w-auto">
              <SearchInput
                placeholder="Rechercher une classe"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Button 
            variant="add-class"
            className="w-full md:w-auto flex-shrink-0"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4 mb-8">
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

       
        <Link href="/classes/archived" prefetch={true} className="text-sm md:text-sm text-[#2F2E2C] underline cursor-pointer inline-flex items-center gap-2">
          Voir les classes archivées →
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
