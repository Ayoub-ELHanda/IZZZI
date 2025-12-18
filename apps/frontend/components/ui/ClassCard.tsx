'use client';

import Link from 'next/link';
import { Eye, Edit, Archive } from 'lucide-react';

interface ClassCardProps {
  id: string;
  name: string;
  description: string;
  studentCount: number;
  archivedDate?: string;
  isArchived?: boolean;
  onModify?: () => void;
  onArchive?: () => void;
}

export function ClassCard({ id, name, description, studentCount, archivedDate, isArchived = false, onModify, onArchive }: ClassCardProps) {
  return (
    <div
      style={{
        width: '531px',
        height: '161px',
        backgroundColor: 'white',
        borderRadius: '10px',
        border: '1px solid #E0E0E0',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Header avec infos et bouton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3
            className="font-mochiy"
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
              marginBottom: '8px',
            }}
          >
            {name}
          </h3>
          
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '12px',
              fontWeight: 400,
              color: '#6B6B6B',
              marginBottom: '8px',
            }}
          >
            {description}
          </p>
          
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '11px',
              fontWeight: 400,
              color: '#6B6B6B',
            }}
          >
            {studentCount} étudiants
          </p>
          
          {isArchived && archivedDate && (
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '11px',
                fontWeight: 400,
                color: '#6B6B6B',
              }}
            >
              Archivée le {archivedDate}
            </p>
          )}
        </div>

        {/* Bouton Voir classe */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href={`/classes/${id}`}>
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                fontWeight: 400,
                color: '#2F2E2C',
              }}
            >
              Voir classe
            </span>
          </Link>

          <Link href={`/classes/${id}`}>
            <div
              style={{
                width: '43px',
                height: '43px',
                backgroundColor: '#FFE552',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3.67 12.33l8.66-8.66M12.33 12.33V3.67H3.67"
                  stroke="#2F2E2C"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* Actions en bas */}
      {isArchived ? (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Link href={`/classes/${id}`} style={{ textDecoration: 'none' }}>
            <button
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: '#2F2E2C',
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Eye size={16} />
              Voir la classe
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={onModify}
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Edit size={16} />
            Modifier la classe
          </button>

          <button
            onClick={onArchive}
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Archiver
          </button>
        </div>
      )}
    </div>
  );
}
