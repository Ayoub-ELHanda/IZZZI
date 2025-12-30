'use client';

import { useState, useEffect } from 'react';
import { ClassCard } from '@/features/classes';
import { SearchInput } from '@/components/ui/SearchInput';
import { classesService, Class } from '@/services/api/classes.service';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ArchivedClassesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [archivedClasses, setArchivedClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArchivedClasses();
  }, []);

  const loadArchivedClasses = async () => {
    try {
      setIsLoading(true);
      const data = await classesService.getAll(true);
      setArchivedClasses(data);
    } catch (error) {
      console.error('Error loading archived classes:', error);
      toast.error('Erreur lors du chargement des classes archivées');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto" style={{ maxWidth: '1650px' }}>

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
                {archivedClasses.length} classes archivées
              </h1>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  color: '#6B6B6B',
                }}
              >
                Les classes archivées ne sont plus modifiables<br />
                mais restent consultables.
              </p>
            </div>

            <SearchInput
              placeholder="Rechercher une classe"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>


        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 531px)',
          gap: '17px', 
          marginBottom: '32px',
        }}>
          {archivedClasses.map((classItem) => (
            <ClassCard
              key={classItem.id}
              id={classItem.id}
              name={classItem.name}
              description={classItem.description || ''}
              studentCount={classItem.studentCount}
              archivedDate={classItem.archivedAt 
                ? new Date(classItem.archivedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })
                : ''
              }
              isArchived={true}
            />
          ))}
        </div>


        <Link href="/classes/my-classes" style={{ textDecoration: 'none' }}>
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
            Voir les classes actives →
          </span>
        </Link>
      </div>
    </div>
  );
}
