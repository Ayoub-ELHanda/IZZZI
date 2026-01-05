'use client';

import Link from 'next/link';
import { ArrowUpRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ActionsCard() {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm"
      style={{
        width: '463px',
        height: '373px',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '48px'
      }}
    >
      {/* Titre */}
      <h2 
        className="font-mochiy"
        style={{
          fontSize: '18px',
          fontWeight: 400,
          color: '#2F2E2C'
        }}
      >
        Ce que vous pouvez faire maintenant
      </h2>

      {/* Liste des actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
            <path d="M20 6L9 17L4 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span 
            className="font-poppins"
            style={{
              fontSize: '16px',
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
              fontSize: '16px',
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Bouton 1: Accéder à mon dashboard */}
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <button
            style={{
              width: '314.29px',
              height: '56px',
              backgroundColor: '#FFE552',
              color: '#2F2E2C',
              borderRadius: '8px',
              border: 'none',
              padding: '20px 26px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.99px',
              cursor: 'pointer',
              fontFamily: 'Poppins',
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            Accéder à mon dashboard
            <ArrowUpRight size={20} />
          </button>
        </Link>

        {/* Bouton 2: Télécharger ma facture */}
        <button
          style={{
            width: '287.29px',
            height: '56px',
            backgroundColor: '#FBFBFB',
            color: '#2F2E2C',
            borderRadius: '8px',
            border: '1px solid #E0E0E0',
            padding: '20px 26px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.99px',
            cursor: 'pointer',
            fontFamily: 'Poppins',
            fontSize: '16px',
            fontWeight: 500
          }}
        >
          Télécharger ma facture
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}
