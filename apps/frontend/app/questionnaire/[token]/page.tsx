'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import { QuestionnaireForm } from '@/components/ui/QuestionnaireForm';

export default function QuestionnairePage() {
  const params = useParams();
  const token = params.token as string;

  const [isLoading, setIsLoading] = useState(true);
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const loadQuestionnaire = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
        const response = await fetch(`${apiUrl}/questionnaires/public/${token}`);

        if (!response.ok) {
          throw new Error('Questionnaire non trouvé ou inactif');
        }

        const data = await response.json();
        setQuestionnaire(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement du questionnaire');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      loadQuestionnaire();
    }
  }, [token]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F8F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', border: '4px solid #FFD93D', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: 'Poppins, sans-serif', color: '#6B6B6B' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !questionnaire) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F8F8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px', maxWidth: '448px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span style={{ fontSize: '24px' }}></span>
          </div>
          <h2 style={{ fontFamily: 'Mochiy Pop One, sans-serif', fontSize: '20px', color: '#2F2E2C', marginBottom: '8px' }}>
            Questionnaire introuvable
          </h2>
          <p style={{ fontFamily: 'Poppins, sans-serif', color: '#6B6B6B', marginBottom: '24px' }}>
            {error || 'Ce questionnaire n\'existe pas ou n\'est plus actif.'}
          </p>
        </div>
      </div>
    );
  }

  const questionnaireType =
    questionnaire.type === 'DURING_COURSE'
      ? 'Pendant le cours'
      : 'Fin de cours';

  return (
    <>
      <Toaster position="top-right" />
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F8F8', padding: '48px' }}>
        <div style={{ display: 'flex', gap: '60px', maxWidth: '1400px', margin: '0 auto' }}>
          {/* Infos à gauche */}
          <div style={{ width: '320px', flexShrink: 0 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#2F2E2C',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <div style={{
                  width: 0,
                  height: 0,
                  borderStyle: 'solid',
                  borderWidth: '0 6px 10px 6px',
                  borderColor: 'transparent transparent #FFFFFF transparent',
                  transform: 'rotate(90deg)',
                  marginLeft: '2px'
                }} />
              </div>
              <span style={{
                fontFamily: 'Mochiy Pop One, sans-serif',
                fontSize: '20px',
                color: '#2F2E2C'
              }}>
                izzzi
              </span>
            </div>

           
            <h1 style={{
              fontFamily: 'Mochiy Pop One, sans-serif',
              fontSize: '28px',
              color: '#2F2E2C',
              lineHeight: '1.3',
              margin: '0 0 20px 0'
            }}>
              {questionnaire.subject.name}
            </h1>

            <div style={{
              width: '278px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              marginBottom: '32px'
            }}>
            
              <div style={{
                flex: '0 0 40%',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ fontSize: '16px' }}>🎓</span>
                <span style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '12px',
                  color: '#2F2E2C',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {questionnaire.subject.class.school}
                </span>
              </div>
              
             
              <div style={{
                flex: '0 0 10%',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '1px',
                  height: '24px',
                  backgroundColor: '#E5E5E5'
                }} />
              </div>
              
          
              <div style={{
                flex: '0 0 40%',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ fontSize: '16px' }}>👥</span>
                <span style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  color: '#2F2E2C',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {questionnaire.subject.class.name}
                </span>
              </div>
            </div>

            {/* Texte d'explication */}
            <div style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13px',
              color: '#6B6B6B',
              lineHeight: '1.7'
            }}>
              <p style={{ marginBottom: '12px' }}>
                Soit sincère, sinon ça ne sert à rien.
              </p>
              <p style={{ margin: 0 }}>
                C'est grâce à vos retours que nous pouvons améliorer les interventions et coller le plus possible à vos attentes.
              </p>
            </div>
          </div>

       
          <div style={{ flex: 1, maxWidth: '680px' }}>
            <QuestionnaireForm token={token} formType={questionnaire.formType} />
          </div>
        </div>
      </div>
    </>
  );
}
