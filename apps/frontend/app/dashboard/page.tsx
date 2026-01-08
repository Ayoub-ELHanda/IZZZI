'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';
import { authService } from '@/services/auth/auth.service';
import { useAuth } from '@/hooks/useAuth';
import { questionnairesService, SubjectWithResponses } from '@/services/api/questionnaires.service';
import { toast } from 'sonner';
import Link from 'next/link';
import { SearchInput } from '@/components/ui/SearchInput';
import { RefreshCw, MoveUpRight } from 'lucide-react';
import { NotificationsModal } from '@/components/modals/NotificationsModal';
import { AlertsModal } from '@/components/modals/AlertsModal';
import { FeedbackSummaryModal } from '@/components/modals/FeedbackSummaryModal';
import { useNotifications } from '@/hooks/useNotifications';
import { apiClient } from '@/lib/api/client';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectWithResponses[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'in-progress' | 'completed'>('in-progress');
  const isTrialing = user?.subscriptionStatus === 'TRIALING';
  const isFreePlan = user?.subscriptionStatus === 'FREE';
  const isPaidPlan = user?.subscriptionStatus === 'ACTIVE' || user?.subscriptionStatus === 'TRIALING';
  const [showAlertsOnly, setShowAlertsOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('');
  const [filterBy, setFilterBy] = useState<string>('');
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isFeedbackSummaryModalOpen, setIsFeedbackSummaryModalOpen] = useState(false);
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<string | null>(null);
  const { unreadCount, untreatedAlertCount } = useNotifications();

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        router.push(routes.auth.login);
        return;
      }

      try {
        // Only load responses, user is already loaded by AuthProvider
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
    } catch (error: unknown) {
      console.error('Error loading responses:', error);
      toast.error('Erreur lors du chargement des retours');
    }
  };

  // Filtrer les matières selon l'onglet actif et la recherche
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
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
  }, [subjects, activeTab, searchQuery]);

  // Aplatir tous les questionnaires pour l'affichage
  const allQuestionnairesBase = useMemo(() => {
    return filteredSubjects.flatMap((subject) =>
      subject.questionnaires.map((q) => ({
        ...q,
        subject,
      }))
    );
  }, [filteredSubjects]);

  // Trier les questionnaires d'abord
  const sortedQuestionnaires = useMemo(() => {
    const sorted = [...allQuestionnairesBase];
    if (sortBy === 'date') {
      sorted.sort((a, b) => {
        const dateA = new Date(a.subject.startDate).getTime();
        const dateB = new Date(b.subject.startDate).getTime();
        return dateB - dateA; // Plus récent en premier
      });
    } else if (sortBy === 'score') {
      sorted.sort((a, b) => {
        return (b.averageRating || 0) - (a.averageRating || 0); // Score le plus élevé en premier
      });
    } else if (sortBy === 'responses') {
      sorted.sort((a, b) => {
        return (b.visibleResponses || 0) - (a.visibleResponses || 0); // Plus de retours en premier
      });
    }
    return sorted;
  }, [allQuestionnairesBase, sortBy]);

  // Filtrer par alertes si nécessaire (après le tri)
  const displayedQuestionnaires = useMemo(() => {
    if (!showAlertsOnly) {
      return sortedQuestionnaires;
    }
    
    const filtered = sortedQuestionnaires.filter((q) => {
      // Vérifier si le questionnaire a des alertes
      // Un questionnaire a une alerte si :
      // - Le score moyen est inférieur à 3.5 OU
      // - Le nombre de retours visibles est inférieur à 5
      const averageRating = Number(q.averageRating) || 0;
      const visibleResponses = Number(q.visibleResponses) || 0;
      
      const hasLowRating = averageRating < 3.5;
      const hasLowResponses = visibleResponses < 5;
      
      return hasLowRating || hasLowResponses;
    });
    
    return filtered;
  }, [showAlertsOnly, sortedQuestionnaires]);

  // Filtrer par matière si nécessaire (pour l'instant, "all" affiche tout)
  // Cette fonctionnalité peut être étendue plus tard pour filtrer par matière spécifique

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

  // Calculer la date de fin d'essai (4 mois à partir de maintenant)
  const trialEndDate = new Date();
  trialEndDate.setMonth(trialEndDate.getMonth() + 4);
  const trialEndDateStr = trialEndDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#F5F5F5]" style={{ paddingTop: '120px' }}>
      <div className="mx-auto p-4 md:p-8" style={{ maxWidth: '1650px', width: '100%', boxSizing: 'border-box' }}>
        {/* En-tête avec onglets */}
        <div style={{ marginBottom: '24px' }}>
          {/* Ligne 1 : Titre + Onglets à gauche, Bannière à droite */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {/* Gauche : Titre + Onglets */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <h1
                className="font-mochiy"
                style={{
                  fontSize: '24px',
                  fontWeight: 400,
                  color: '#2F2E2C',
                  margin: 0,
                }}
              >
                Retour des étudiants
              </h1>
              <div style={{ display: 'flex', gap: '24px' }}>
                <button
                  onClick={() => setActiveTab('in-progress')}
                  style={{
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    color: activeTab === 'in-progress' ? '#2F2E2C' : '#6B6B6B',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontWeight: activeTab === 'in-progress' ? 700 : 500,
                    textDecoration: activeTab === 'in-progress' ? 'underline' : 'none',
                    textUnderlineOffset: '4px',
                    transition: 'all 0.2s',
                  }}
                >
                  Matières en cours
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  style={{
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    color: activeTab === 'completed' ? '#2F2E2C' : '#6B6B6B',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontWeight: activeTab === 'completed' ? 700 : 500,
                    textDecoration: activeTab === 'completed' ? 'underline' : 'none',
                    textUnderlineOffset: '4px',
                    transition: 'all 0.2s',
                  }}
                >
                  Matières terminées
                </button>
              </div>
            </div>

            {/* Droite : Bannière période d'essai - Afficher pour TRIALING et plan gratuit */}
            {(isTrialing || isFreePlan) && (
              <div
                style={{
                  backgroundColor: '#FFF4E0',
                  border: '1px solid #FF6B35',
                  borderRadius: '8px',
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  flex: '0 1 auto',
                  minWidth: '300px',
                  maxWidth: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '1px solid #FF6B35',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#FF6B35' }}>i</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 500, color: '#FF6B35', margin: 0, lineHeight: '1.4' }}>
                      {isTrialing ? "Période d'essai en cours :" : "Plan gratuit :"}
                    </p>
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 500, color: '#FF6B35', margin: 0, lineHeight: '1.4' }}>
                      {isTrialing ? `tout est illimité jusqu'au ${trialEndDateStr}.` : "Passez au plan Super Izzzi pour débloquer toutes les fonctionnalités."}
                    </p>
                  </div>
                </div>
                <Link
                  href="/pricing"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    color: '#FF6B35',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontWeight: 500,
                  }}
                >
                  Je passe au plan Super Izzzi
                  <MoveUpRight size={16} color="#FF6B35" />
                </Link>
              </div>
            )}
          </div>

          {/* Ligne 2 : Barre de recherche (gauche) + Dropdowns et toggle (droite) - MÊME LIGNE */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '16px', 
            marginBottom: '0',
            flexWrap: 'wrap',
          }}>
            {/* Barre de recherche à gauche */}
            <div style={{ flex: '1 1 300px', minWidth: '200px', maxWidth: '500px' }}>
              <SearchInput
                placeholder="rechercher par classe, intervenant, cours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Dropdowns et toggle à droite */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              flexWrap: 'wrap',
            }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 16px',
                border: '1px solid #E5E5E5',
                borderRadius: '4px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                backgroundColor: '#FFF',
                color: '#2F2E2C',
                minWidth: '120px',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232F2E2C' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '36px',
              }}
            >
              <option value="">Trier par</option>
              <option value="date">Date</option>
              <option value="score">Score</option>
              <option value="responses">Nombre de retours</option>
            </select>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              style={{
                padding: '8px 16px',
                border: '1px solid #E5E5E5',
                borderRadius: '4px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                backgroundColor: '#FFF',
                color: '#2F2E2C',
                minWidth: '120px',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232F2E2C' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '36px',
              }}
            >
              <option value="">Filtrer par</option>
              <option value="all">Toutes les matières</option>
            </select>
            <label 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                fontFamily: 'Poppins, sans-serif', 
                fontSize: '14px', 
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                color: '#2F2E2C',
              }}
            >
              <div style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={showAlertsOnly}
                  onChange={(e) => {
                    e.stopPropagation();
                    setShowAlertsOnly(e.target.checked);
                  }}
                  style={{
                    opacity: 0,
                    width: 0,
                    height: 0,
                    position: 'absolute',
                  }}
                />
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowAlertsOnly(!showAlertsOnly);
                  }}
                  style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    width: '44px',
                    height: '24px',
                    backgroundColor: showAlertsOnly ? '#2F2E2C' : '#E5E5E5',
                    borderRadius: '24px',
                    transition: '0.3s',
                    display: 'block',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      height: '18px',
                      width: '18px',
                      left: showAlertsOnly ? '22px' : '3px',
                      top: '3px',
                      backgroundColor: '#FFF',
                      borderRadius: '50%',
                      transition: '0.3s',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      display: 'block',
                    }}
                  />
                </span>
              </div>
              <span onClick={(e) => {
                e.preventDefault();
                setShowAlertsOnly(!showAlertsOnly);
              }}>Afficher les alertes uniquement</span>
            </label>
            </div>
          </div>
        </div>

        {/* Grille de cartes */}
        {displayedQuestionnaires.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#6B6B6B' }}>
            <p>Aucun retour disponible pour le moment.</p>
          </div>
        ) : (
          <div
            className="dashboard-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '18px',
            }}
          >
            {displayedQuestionnaires.map((questionnaire) => (
              <QuestionnaireCard
                key={questionnaire.id}
                questionnaire={questionnaire}
                isPaidPlan={isPaidPlan}
                trialEndDate={trialEndDateStr}
                onOpenAlertsModal={() => setIsAlertsModalOpen(true)}
                onOpenSummaryModal={(questionnaireId) => {
                  setSelectedQuestionnaireId(questionnaireId);
                  setIsFeedbackSummaryModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
      />
      <AlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
      />
      {selectedQuestionnaireId && (
        <FeedbackSummaryModal
          isOpen={isFeedbackSummaryModalOpen}
          onClose={() => {
            setIsFeedbackSummaryModalOpen(false);
            setSelectedQuestionnaireId(null);
          }}
          questionnaireId={selectedQuestionnaireId}
        />
      )}
    </div>
  );
}

interface QuestionnaireCardProps {
  questionnaire: SubjectWithResponses['questionnaires'][0] & { subject: SubjectWithResponses };
  isPaidPlan: boolean;
  trialEndDate: string;
  onOpenAlertsModal: () => void;
  onOpenSummaryModal: (questionnaireId: string) => void;
}

function QuestionnaireCard({ questionnaire, isPaidPlan, trialEndDate, onOpenAlertsModal, onOpenSummaryModal }: QuestionnaireCardProps) {
  const [summaryPreview, setSummaryPreview] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const { alerts, untreatedAlertCount } = useNotifications();

  const formTypeLabel =
    questionnaire.type === 'DURING_COURSE'
      ? 'FORMULAIRE PENDANT LE COURS'
      : 'FORMULAIRE FIN DE COURS';

  const formTypeColor = questionnaire.type === 'DURING_COURSE' ? '#FF6B35' : '#4A90E2';
  const formTypeBgColor = questionnaire.type === 'DURING_COURSE' ? '#FFF3E0' : '#E3F2FD';

  // Charger la synthèse depuis l'API
  useEffect(() => {
    const loadSummary = async () => {
      if (!questionnaire.id) return;
      
      setIsLoadingSummary(true);
      try {
        const data = await apiClient.get<{
          summary: string;
          sentiment: string;
          strengths: string[];
          improvements: string[];
          pedagogicalAlerts: string[];
        }>(`/questionnaires/${questionnaire.id}/ai-summary`);
        
        // Afficher les premiers 150 caractères de la synthèse
        if (data.summary && data.summary.length > 0) {
          const preview = data.summary.length > 150 
            ? data.summary.substring(0, 150) + '...' 
            : data.summary;
          setSummaryPreview(preview);
        }
      } catch (error: any) {
        // Si la synthèse n'existe pas encore, ne pas afficher d'erreur
        // Elle sera générée automatiquement lors de la prochaine alerte
        if (error?.response?.status !== 404) {
          console.error('Error loading summary:', error);
        }
        setSummaryPreview(null);
      } finally {
        setIsLoadingSummary(false);
      }
    };

    loadSummary();
  }, [questionnaire.id]);

  // Récupérer les vraies alertes pour ce questionnaire
  const questionnaireAlerts = alerts.filter(
    (alert) => alert.questionnaire?.id === questionnaire.id && alert.status === 'UNTREATED'
  );
  
  // Debug: log pour vérifier les alertes
  useEffect(() => {
    if (questionnaire.id) {
      console.log(`[QuestionnaireCard] Questionnaire ID: ${questionnaire.id}`);
      console.log(`[QuestionnaireCard] Total alerts: ${alerts.length}`);
      console.log(`[QuestionnaireCard] Alerts for this questionnaire:`, questionnaireAlerts);
      console.log(`[QuestionnaireCard] All alerts:`, alerts.map(a => ({
        id: a.id,
        questionnaireId: a.questionnaire?.id,
        status: a.status,
        message: a.message?.substring(0, 50)
      })));
    }
  }, [questionnaire.id, alerts, questionnaireAlerts]);
  
  // Utiliser le nombre total d'alertes non traitées pour correspondre au modal
  const alertCount = untreatedAlertCount;
  const isDuringCourse = questionnaire.type === 'DURING_COURSE';
  
  // Trier les alertes par date (plus récente en premier) et prendre la première
  const sortedQuestionnaireAlerts = [...questionnaireAlerts].sort((a, b) => {
    const dateA = new Date((a as any).updatedAt || a.createdAt).getTime();
    const dateB = new Date((b as any).updatedAt || b.createdAt).getTime();
    return dateB - dateA; // Plus récent en premier
  });
  
  // Afficher seulement la dernière alerte non traitée pour ce questionnaire
  const lastAlert = sortedQuestionnaireAlerts.length > 0 
    ? {
        type: sortedQuestionnaireAlerts[0].type === 'ALERT_POSITIVE' ? 'success' : 'warning',
        text: sortedQuestionnaireAlerts[0].message,
      }
    : null;

  return (
    <div
      style={{
        background: '#FFF',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        height: '100%',
      }}
    >
      {/* En-tête - Ligne 1 : Titre | Badge formulaire | Badges Retours/Score */}
      <div className="questionnaire-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '4px', flexWrap: 'wrap' }}>
        {/* Gauche : Titre seul */}
        <div style={{ flex: '0 1 auto', minWidth: '150px' }}>
          <h3
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '22px',
              fontWeight: 700,
              color: '#2F2E2C',
              margin: 0,
              lineHeight: '1.2',
            }}
          >
            {questionnaire.subject.name}
          </h3>
        </div>

        {/* Centre : Badge formulaire */}
        <div
          style={{
            padding: '8px 14px',
            background: '#FFF',
            border: `1.5px solid ${formTypeColor}`,
            color: formTypeColor,
            borderRadius: '8px',
            fontSize: '10px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            letterSpacing: '0.3px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            height: 'fit-content',
          }}
        >
          {formTypeLabel}
        </div>

        {/* Droite : Badges Retours et Score */}
        <div className="questionnaire-card-badges" style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
          <div
            style={{
              padding: '7px 14px',
              background: '#FFFBF0',
              border: 'none',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#2F2E2C',
              }}
            >
              Retours
            </span>
            <span
              style={{
                padding: '4px 10px',
                background: '#FFD93D',
                borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13px',
                fontWeight: 700,
                color: '#2F2E2C',
              }}
            >
              {questionnaire.visibleResponses}
            </span>
          </div>
          <div
            style={{
              padding: '7px 14px',
              background: '#FFFBF0',
              border: 'none',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#2F2E2C',
              }}
            >
              Score
            </span>
            <span
              style={{
                padding: '4px 10px',
                background: '#FFD93D',
                borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13px',
                fontWeight: 700,
                color: '#2F2E2C',
              }}
            >
              {questionnaire.averageRating.toFixed(1).replace('.', ',')}
            </span>
          </div>
        </div>
      </div>

      {/* Ligne 2 : Classe | Prof directement sous le titre */}
      <div style={{ marginBottom: '20px' }}>
        <p
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: '#6B6B6B',
            margin: 0,
            marginTop: '2px',
            lineHeight: '1.3',
          }}
        >
          {questionnaire.subject.className} | {questionnaire.subject.teacherName}
        </p>
      </div>

      {/* Contenu principal en 2 colonnes */}
      <div className="questionnaire-card-content" style={{ display: 'flex', gap: '24px', flex: 1, alignItems: 'stretch' }}>
        {/* Colonne gauche : Alertes + Synthèse */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Section Alertes */}
          {alertCount > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '12px',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                <h4
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#2F2E2C',
                    margin: 0,
                  }}
                >
                  {alertCount} Alertes disponibles
                </h4>
                <button
                  onClick={onOpenAlertsModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '13px',
                    color: '#2F2E2C',
                    textDecoration: 'underline',
                    whiteSpace: 'nowrap',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Voir toutes les alertes
                </button>
              </div>
              {/* Afficher seulement la dernière alerte pour ce questionnaire si elle existe */}
              {lastAlert && (
                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: lastAlert.type === 'success' ? '#4CAF50' : '#FF6B35',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    border: 'none',
                    position: 'relative',
                  }}
                >
                  {/* Badge avec le numéro de la dernière alerte */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '12px',
                      padding: '3px 9px',
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      borderRadius: '12px',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#FFF',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {questionnaireAlerts.length > 0 ? `${questionnaireAlerts.length}/${questionnaireAlerts.length}` : '0/0'}
                  </span>
                  {lastAlert.type === 'success' ? (
                    <span style={{ fontSize: '18px', lineHeight: '1', flexShrink: 0, marginTop: '2px' }}>❤️</span>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <path d="M12 2L22 20H2L12 2Z" />
                    </svg>
                  )}
                  <div style={{ flex: 1, minWidth: 0, paddingRight: '50px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      marginBottom: '6px',
                      flexWrap: 'wrap',
                    }}>
                      <span
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#FFF',
                        }}
                      >
                        Alerte
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '13px',
                        color: '#FFF',
                        lineHeight: '1.5',
                        margin: 0,
                        wordBreak: 'break-word',
                      }}
                    >
                      {lastAlert.text}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section Synthèse */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#2F2E2C" strokeWidth="2"/>
                <line x1="7" y1="9" x2="17" y2="9" stroke="#2F2E2C" strokeWidth="2" strokeLinecap="round"/>
                <line x1="7" y1="13" x2="17" y2="13" stroke="#2F2E2C" strokeWidth="2" strokeLinecap="round"/>
                <line x1="7" y1="17" x2="13" y2="17" stroke="#2F2E2C" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h4
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#2F2E2C',
                  margin: 0,
                }}
              >
                Synthèse des retours
              </h4>
            </div>
            {isLoadingSummary ? (
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '13px',
                  color: '#6B6B6B',
                  lineHeight: '1.6',
                  marginBottom: '10px',
                  fontStyle: 'italic',
                }}
              >
                Chargement de la synthèse...
              </p>
            ) : summaryPreview ? (
              <>
                <p
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '13px',
                    color: '#2F2E2C',
                    lineHeight: '1.6',
                    marginBottom: '10px',
                  }}
                >
                  {summaryPreview}
                </p>
                <button
                  onClick={() => onOpenSummaryModal(questionnaire.id)}
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '13px',
                    color: '#2F2E2C',
                    textDecoration: 'underline',
                    fontWeight: 500,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Voir plus
                </button>
              </>
            ) : (
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '13px',
                  color: '#6B6B6B',
                  lineHeight: '1.6',
                  marginBottom: '10px',
                  fontStyle: 'italic',
                }}
              >
                Aucune synthèse disponible pour le moment. La synthèse sera générée automatiquement lors de la prochaine alerte.
              </p>
            )}
          </div>
        </div>

        {/* Colonne droite : Actions - Positionnée en bas */}
        <div className="questionnaire-card-actions" style={{ width: '200px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start', marginTop: 'auto' }}>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '11px',
              color: '#6B6B6B',
              lineHeight: '1.5',
              margin: 0,
              marginBottom: '0',
            }}
          >
            <span style={{ fontWeight: 700 }}>En essai jusqu&apos;au {trialEndDate}.</span> Retours visibles (anonymes sur le plan gratuit)
          </p>
          <Link
            href={routes.retours.detail(questionnaire.id)}
            prefetch={false}
            style={{
              padding: '12px 20px',
              background: '#FFD93D',
              color: '#2F2E2C',
              textAlign: 'center',
              borderRadius: '8px',
              textDecoration: 'none',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              width: '100%',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFC933';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFD93D';
            }}
          >
            Voir les retours
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </Link>
          <Link
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13px',
              color: '#6B6B6B',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Relancer les étudiants
            <RefreshCw size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
