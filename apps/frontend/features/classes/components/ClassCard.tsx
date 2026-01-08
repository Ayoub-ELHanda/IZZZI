'use client';

import Link from 'next/link';
import { Eye, Edit } from 'lucide-react';

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
      className="w-full min-h-[161px] p-4 md:p-6"
      style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        border: '1px solid #E0E0E0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >

      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3
            className="font-mochiy text-sm md:text-sm"
            style={{
              fontWeight: 400,
              color: '#2F2E2C',
              marginBottom: '8px',
            }}
          >
            {name}
          </h3>
          
          <p
            className="text-xs md:text-xs"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              color: '#6B6B6B',
              marginBottom: '8px',
              wordBreak: 'break-word',
            }}
          >
            {description}
          </p>
          
          <p
            className="text-[11px] md:text-[11px]"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              color: '#6B6B6B',
            }}
          >
            {studentCount} étudiants
          </p>
          
          {isArchived && archivedDate && (
            <p
              className="text-[11px] md:text-[11px]"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                color: '#6B6B6B',
              }}
            >
              Archivée le {archivedDate}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <Link href={isArchived ? `/classes/archived/${id}` : `/classes/${id}`} prefetch={true} className="hidden sm:inline">
            <span
              className="text-xs md:text-xs"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                color: '#2F2E2C',
              }}
            >
              Voir classe
            </span>
          </Link>

          <Link href={isArchived ? `/classes/archived/${id}` : `/classes/${id}`} prefetch={true}>
            <div
              className="w-10 h-10 md:w-[43px] md:h-[43px]"
              style={{
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

      {isArchived ? (
        <div className="flex justify-start items-center mt-4">
          <Link href={`/classes/archived/${id}`} prefetch={true} className="text-decoration-none">
            <button
              className="text-sm md:text-sm text-[#2F2E2C] underline bg-none border-none cursor-pointer p-0 flex items-center gap-2"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
              }}
            >
              <Eye size={16} />
              Voir la classe
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex justify-between items-center mt-4 gap-4 flex-wrap">
          <button
            onClick={onModify}
            className="text-sm md:text-sm text-[#2F2E2C] underline bg-none border-none cursor-pointer p-0 flex items-center gap-2"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
            }}
          >
            <Edit size={16} />
            Modifier la classe
          </button>

          <button
            onClick={onArchive}
            className="text-sm md:text-sm text-[#2F2E2C] underline bg-none border-none cursor-pointer p-0"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
            }}
          >
            Archiver
          </button>
        </div>
      )}
    </div>
  );
}
