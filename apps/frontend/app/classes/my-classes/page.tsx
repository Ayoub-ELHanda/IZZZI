'use client';

import { useState } from 'react';
import { ClassCard } from '@/components/ui/ClassCard';
import { TrialBanner } from '@/components/ui/TrialBanner';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { ClassModal, ClassFormData } from '@/components/ui/ClassModal';
import { ArchiveModal } from '@/components/ui/ArchiveModal';
import Link from 'next/link';

export default function MyClassesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archivingClassId, setArchivingClassId] = useState<string | null>(null);
  
  const mockClasses = [
    {
      id: '1',
      name: 'M2DG',
      description: 'Description de la classe',
      studentCount: 24,
    },
    {
      id: '2',
      name: 'B3MD',
      description: 'Description de la classe',
      studentCount: 24,
    },
    {
      id: '3',
      name: 'B2FG',
      description: 'En alternance',
      studentCount: 24,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto" style={{ maxWidth: '1650px' }}>
      
        <TrialBanner
          message1="Période d'essai en cours :"
          message2="Tout est illimité jusqu'au 18 septembre 2025."
          linkText="Je passe au plan Super Izzzi →"
          linkHref="/pricing"
        />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <h1
                className="font-mochiy"
                style={{
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#2F2E2C',
                  lineHeight: '100%',
                }}
              >
                {mockClasses.length} classes disponibles
              </h1>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  color: '#6B6B6B',
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

       
          <Link href="/create-class" style={{ textDecoration: 'none' }}>
            <Button variant="add-class">
              Ajouter une classe
              <span style={{ fontSize: '20px', fontWeight: 300 }}>+</span>
            </Button>
          </Link>
        </div>

       
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 531px)',
          gap: '17px', 
          marginBottom: '32px',
        }}>
          {mockClasses.map((classItem) => (
            <ClassCard
              key={classItem.id}
              id={classItem.id}
              name={classItem.name}
              description={classItem.description}
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

       
        <Link href="/classes/archived" style={{ textDecoration: 'none' }}>
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
          onSubmit={(data: ClassFormData) => {
            console.log('Class updated:', data);
            setIsModalOpen(false);
            setEditingClass(null);
          }}
          mode="edit"
          initialData={editingClass ? {
            className: editingClass.name,
            studentCount: editingClass.studentCount.toString(),
            studentEmails: '',
            description: editingClass.description,
          } : undefined}
        />

        <ArchiveModal
          isOpen={isArchiveModalOpen}
          onClose={() => {
            setIsArchiveModalOpen(false);
            setArchivingClassId(null);
          }}
          onConfirm={() => {
            console.log('Archiving class:', archivingClassId);
            setIsArchiveModalOpen(false);
            setArchivingClassId(null);
            // TODO: Implement actual archiving logic
          }}
        />
      </div>
    </div>
  );
}
