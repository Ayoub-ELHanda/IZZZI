'use client';

import { SubjectsTable } from '@/components/ui/SubjectsTable';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Download } from 'lucide-react';

export default function ClassDetailPage() {
  const params = useParams();
  const classId = params.id;

  // Mock data for demonstration
  const mockSubjects = [
    {
      id: '1',
      subjectName: 'UI design',
      teacherName: 'Kathleen Alcini',
      startDate: '21/01/2024',
      endDate: '21/01/2024',
      status: 'pending' as const,
      feedbackCount: 12,
      totalStudents: 24,
    },
    {
      id: '2',
      subjectName: 'Développement Web',
      teacherName: 'Jean Dupont',
      startDate: '22/01/2024',
      endDate: '22/01/2024',
      status: 'finished' as const,
      feedbackCount: 18,
      totalStudents: 24,
    },
    {
      id: '3',
      subjectName: 'Marketing Digital',
      teacherName: 'Marie Martin',
      startDate: '23/01/2024',
      endDate: '23/01/2024',
      status: 'finished' as const,
      feedbackCount: 24,
      totalStudents: 24,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto" style={{ maxWidth: '1700px' }}>
        {/* Back Button */}
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
              marginBottom: '24px',
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
            <span>Retour à mes classes archivées</span>
          </button>
        </Link>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            maxWidth: '1632px',
          }}
        >
          <div>
            <h1
              className="font-mochiy"
              style={{
                fontSize: '32px',
                fontWeight: 400,
                color: '#2F2E2C',
                lineHeight: '100%',
                marginBottom: '8px',
              }}
            >
              B3UI
            </h1>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '16px',
                color: '#6B6B6B',
              }}
            >
              24 étudiants
            </p>
          </div>

          <Button variant="export-class">
            <span>Exporter la classe (PDF)</span>
            <Download size={16} />
          </Button>
        </div>

        {/* Subjects Table */}
        <SubjectsTable subjects={mockSubjects} />
      </div>
    </div>
  );
}
