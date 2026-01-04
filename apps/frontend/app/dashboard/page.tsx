'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';
import { authService } from '@/services/auth/auth.service';
import { useAuth } from '@/hooks/useAuth';
import { questionnairesService, SubjectWithResponses } from '@/services/api/questionnaires.service';
import { toast } from 'sonner';
import Link from 'next/link';
import { SearchInput } from '@/components/ui/SearchInput';
import { TrialBanner } from '@/components/ui/TrialBanner';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectWithResponses[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'in-progress' | 'completed'>('in-progress');
  const [isPaidPlan] = useState(false); // TODO: Vérifier le plan depuis Stripe

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        router.push(routes.auth.login);
        return;
      }

      try {
        await authService.getProfile();
        await loadResponses();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const loadResponses = async () => {
    try {
      const data = await questionnairesService.getMyResponses();
      setSubjects(data);
    } catch (error: any) {
      console.error('Error loading responses:', error);
      toast.error('Erreur lors du chargement des retours');
    }
  };

  // Filtrer les matières selon l'onglet actif et la recherche
  const filteredSubjects = subjects.filter((subject) => {
    const now = new Date();
    const endDate = new Date(subject.endDate);
    const isCompleted = endDate < now;
    
    if (activeTab === 'in-progress' && isCompleted) return false;
    if (activeTab === 'completed' && !isCompleted) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        subject.name.toLowerCase().includes(query) ||
        subject.teacherName.toLowerCase().includes(query) ||
        subject.className.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Aplatir tous les questionnaires pour l'affichage
  const allQuestionnaires = filteredSubjects.flatMap((subject) =>
    subject.questionnaires.map((q) => ({
      ...q,
      subject,
    }))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto p-8" style={{ maxWidth: '1650px' }}>
        {/* Bannière d'essai ou plan gratuit */}
        {!isPaidPlan && (
          <TrialBanner
            message1="Période d'essai terminée:"
            message2="changez de plan pour débloquer les retours illimités"
            linkText="Je passe au plan Super Izzzi →"
            linkHref="/pricing"
          />
        )}

        {/* En-tête avec onglets */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
            <h1
              className="font-mochiy"
              style={{
                fontSize: '24px',
                fontWeight: 400,
                color: '#2F2E2C',
              }}
            >
              Retour des étudiants
            </h1>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('in-progress')}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  background: activeTab === 'in-progress' ? '#2F2E2C' : 'transparent',
                  color: activeTab === 'in-progress' ? '#FFF' : '#2F2E2C',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  borderRadius: '4px',
                }}
              >
                Matières en cours
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  background: activeTab === 'completed' ? '#2F2E2C' : 'transparent',
                  color: activeTab === 'completed' ? '#FFF' : '#2F2E2C',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  borderRadius: '4px',
                }}
              >
                Matières terminées
              </button>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <SearchInput
              placeholder="Rechercher par classe, intervenant, cours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <select
              style={{
                padding: '8px 16px',
                border: '1px solid #E5E5E5',
                borderRadius: '4px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
              }}
            >
              <option>Trier par</option>
              <option>Date</option>
              <option>Score</option>
              <option>Nombre de retours</option>
            </select>
            <select
              style={{
                padding: '8px 16px',
                border: '1px solid #E5E5E5',
                borderRadius: '4px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
              }}
            >
              <option>Filtrer par</option>
              <option>Toutes les matières</option>
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>
              <input type="checkbox" />
              Afficher les alertes uniquement
            </label>
          </div>
        </div>

        {/* Grille de cartes */}
        {allQuestionnaires.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#6B6B6B' }}>
            <p>Aucun retour disponible pour le moment.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '17px',
            }}
          >
            {allQuestionnaires.map((questionnaire) => (
              <QuestionnaireCard
                key={questionnaire.id}
                questionnaire={questionnaire}
                isPaidPlan={isPaidPlan}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface QuestionnaireCardProps {
  questionnaire: SubjectWithResponses['questionnaires'][0] & { subject: SubjectWithResponses };
  isPaidPlan: boolean;
}

function QuestionnaireCard({ questionnaire, isPaidPlan }: QuestionnaireCardProps) {
  const formTypeLabel =
    questionnaire.type === 'DURING_COURSE'
      ? 'FORMULAIRE PENDANT LE COURS'
      : 'FORMULAIRE FIN DE COURS';

  const formTypeColor = questionnaire.type === 'DURING_COURSE' ? '#FF6B35' : '#4A90E2';

  return (
    <div
      style={{
        background: '#FFF',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      {/* En-tête de la carte */}
      <div style={{ marginBottom: '16px' }}>
        <h3
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '18px',
            fontWeight: 600,
            color: '#2F2E2C',
            marginBottom: '4px',
          }}
        >
          {questionnaire.subject.name}
        </h3>
        <p
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            color: '#6B6B6B',
            marginBottom: '8px',
          }}
        >
          {questionnaire.subject.teacherName} - {questionnaire.subject.className}
        </p>
        <div
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            background: formTypeColor,
            color: '#FFF',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
          }}
        >
          {formTypeLabel}
        </div>
      </div>

      {/* Statistiques */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <div
          style={{
            padding: '6px 12px',
            background: '#FFD93D',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
          }}
        >
          Retours {questionnaire.visibleResponses}
        </div>
        <div
          style={{
            padding: '6px 12px',
            background: '#FFD93D',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
          }}
        >
          Score {questionnaire.averageRating.toFixed(1)}
        </div>
      </div>

      {/* Message de limitation pour plan gratuit */}
      {!isPaidPlan && questionnaire.hiddenResponses > 0 && (
        <div
          style={{
            padding: '12px',
            background: '#FFF3CD',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '12px',
            fontFamily: 'Poppins, sans-serif',
            color: '#856404',
          }}
        >
          {questionnaire.visibleResponses} retours visibles. Les suivants sont masqués. (anonymes sur le plan gratuit)
        </div>
      )}

      {/* Boutons d'action */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link
          href={routes.retours.detail(questionnaire.id)}
          style={{
            padding: '10px 16px',
            background: '#FFD93D',
            color: '#2F2E2C',
            textAlign: 'center',
            borderRadius: '4px',
            textDecoration: 'none',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          Voir les retours →
        </Link>
      </div>
    </div>
  );
}
