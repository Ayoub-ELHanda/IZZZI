'use client';

import { Pencil, Trash2 } from 'lucide-react';

interface SubjectDataRow {
  id: string;
  name: string;
  teacherName: string;
  teacherEmail?: string;
  startDate: string;
  endDate: string;
}

interface SubjectsDataTableProps {
  subjects: SubjectDataRow[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function SubjectsDataTable({ subjects, onEdit, onDelete }: SubjectsDataTableProps) {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        border: '2px solid #00A3FF',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1.5fr 1fr 1fr 100px',
          gap: '16px',
          padding: '16px 24px',
          backgroundColor: '#F8F8F8',
          borderBottom: '1px solid #E5E5E5',
        }}
      >
        <div
          style={{
            fontFamily: 'Mochiy Pop One, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            color: '#2F2E2C',
          }}
        >
          Matière
        </div>
        <div
          style={{
            fontFamily: 'Mochiy Pop One, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            color: '#2F2E2C',
          }}
        >
          Nom de l'intervenant
        </div>
        <div
          style={{
            fontFamily: 'Mochiy Pop One, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            color: '#2F2E2C',
          }}
        >
          Email de l'intervenant
        </div>
        <div
          style={{
            fontFamily: 'Mochiy Pop One, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            color: '#2F2E2C',
          }}
        >
          Date du premier cours
        </div>
        <div
          style={{
            fontFamily: 'Mochiy Pop One, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            color: '#2F2E2C',
          }}
        >
          Date du dernier cours
        </div>
        <div></div>
      </div>

      {/* Rows */}
      {subjects.map((subject) => (
        <div
          key={subject.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1.5fr 1fr 1fr 100px',
            gap: '16px',
            padding: '20px 24px',
            borderBottom: '1px solid #E5E5E5',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
            }}
          >
            {subject.name}
          </div>
          <div
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
            }}
          >
            {subject.teacherName}
          </div>
          <div
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
            }}
          >
            {subject.teacherEmail || '-'}
          </div>
          <div
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
            }}
          >
            {subject.startDate}
          </div>
          <div
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
            }}
          >
            {subject.endDate}
          </div>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}
          >
            {onEdit && (
              <button
                onClick={() => onEdit(subject.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <Pencil size={16} color="#2F2E2C" strokeWidth={1.5} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(subject.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <Trash2 size={16} color="#2F2E2C" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      ))}

      {subjects.length === 0 && (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            color: '#6B6B6B',
          }}
        >
          Aucune matière créée pour le moment
        </div>
      )}
    </div>
  );
}
