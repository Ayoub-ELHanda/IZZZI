'use client';

import Link from 'next/link';
import { ArrowUpRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ActionsCard() {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm w-full"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}
    >
      {/* Titre */}
      <h2 
        className="font-mochiy"
        style={{
          fontSize: '16px',
          fontWeight: 400,
          color: '#2F2E2C'
        }}
      >
        Ce que vous pouvez faire maintenant
      </h2>

      {/* Liste des actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
            <path d="M20 6L9 17L4 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span 
            className="font-poppins"
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
              lineHeight: '150%'
            }}
          >
            Accéder à vos classes et retours en illimités
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
            <path d="M20 6L9 17L4 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span 
            className="font-poppins"
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
              lineHeight: '150%'
            }}
          >
            Télécharger votre facture
          </span>
        </div>
      </div>

      {/* Boutons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Bouton 1: Accéder à mon dashboard */}
        <Link href="/dashboard" style={{ textDecoration: 'none', width: '100%' }}>
          <button
            className="w-full"
            style={{
              minHeight: '48px',
              backgroundColor: '#FFE552',
              color: '#2F2E2C',
              borderRadius: '8px',
              border: 'none',
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            <span>Accéder à mon dashboard</span>
            <ArrowUpRight size={18} />
          </button>
        </Link>

        {/* Bouton 2: Télécharger ma facture */}
        <button
          className="w-full"
          style={{
            minHeight: '48px',
            backgroundColor: '#FBFBFB',
            color: '#2F2E2C',
            borderRadius: '8px',
            border: '1px solid #E0E0E0',
            padding: '14px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontFamily: 'Poppins',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          <span>Télécharger ma facture</span>
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}
