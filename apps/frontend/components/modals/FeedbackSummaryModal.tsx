'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

interface FeedbackSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionnaireId: string;
}

interface FeedbackSummary {
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  strengths: string[];
  improvements: string[];
  pedagogicalAlerts: string[];
}

export function FeedbackSummaryModal({ isOpen, onClose, questionnaireId }: FeedbackSummaryModalProps) {
  const [summary, setSummary] = useState<FeedbackSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && questionnaireId) {
      loadSummary();
    } else {
      
      setSummary(null);
      setError(null);
    }
  }, [isOpen, questionnaireId]);

  const loadSummary = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.get<FeedbackSummary>(
        `/questionnaires/${questionnaireId}/ai-summary`
      );
      setSummary(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de la synthèse');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '#10B981'; 
      case 'negative':
        return '#EF4444'; 
      default:
        return '#6B7280'; 
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp size={16} color={getSentimentColor(sentiment)} />;
      case 'negative':
        return <TrendingDown size={16} color={getSentimentColor(sentiment)} />;
      default:
        return <CheckCircle size={16} color={getSentimentColor(sentiment)} />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          width: 'auto',
          minWidth: '500px',
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <X size={20} color="#2F2E2C" />
        </button>
        <div
          style={{
            padding: '24px 24px 16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#2F2E2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="14 2 14 8 20 8" stroke="#2F2E2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke="#2F2E2C" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke="#2F2E2C" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h2
            style={{
              fontFamily: 'Mochiy Pop One, sans-serif',
              fontSize: '18px',
              fontWeight: 400,
              fontStyle: 'normal',
              color: '#2F2E2C',
              margin: 0,
              lineHeight: '100%',
              letterSpacing: '0px',
              opacity: 1,
            }}
          >
            Synthèse des retours
          </h2>
        </div>
        <div
          style={{
            padding: '0 24px',
            overflowY: 'auto',
            maxHeight: '400px',
          }}
        >
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                gap: '16px',
              }}
            >
              <Loader2 size={48} color="#666666" style={{ animation: 'spin 1s linear infinite' }} />
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  color: '#666666',
                  textAlign: 'center',
                }}
              >
                Génération de la synthèse en cours...
              </p>
            </div>
          ) : error ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                gap: '16px',
              }}
            >
              <AlertCircle size={48} color="#EF4444" />
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  color: '#EF4444',
                  textAlign: 'center',
                }}
              >
                {error}
              </p>
              <button
                onClick={loadSummary}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4A90E2',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Réessayer
              </button>
            </div>
          ) : summary ? (
            <div
              style={{
                opacity: 1,
                marginBottom: '16px',
              }}
            >
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '15px',
                  color: '#2F2E2C',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                }}
              >
                {summary.summary}
              </p>
            </div>
          ) : null}
        </div>
        <div
          style={{
            padding: '16px 24px 24px 24px',
            borderTop: '1px solid #E5E5E5',
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: 0,
              background: 'none',
              border: 'none',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#2F2E2C',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
              height: '16px',
              opacity: 1,
            }}
          >
            Fermer
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.15135 0.666626H9.15135M9.15135 0.666626V6.66663M9.15135 0.666626L0.666016 9.15196" stroke="#2F2E2C" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
