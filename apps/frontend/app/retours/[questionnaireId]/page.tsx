'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { questionnairesService, QuestionnaireDetails } from '@/services/api/questionnaires.service';
import { toast } from 'sonner';
import { TrialBanner } from '@/components/ui/TrialBanner';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

const COLORS = ['#FF6B35', '#FFD93D', '#4A90E2', '#50C878', '#9B59B6'];

export default function QuestionnaireDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const questionnaireId = params.questionnaireId as string;
  const [data, setData] = useState<QuestionnaireDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaidPlan] = useState(false); // TODO: Vérifier le plan depuis Stripe
  const [aiStatistics, setAiStatistics] = useState<{
    theoryPracticeRatio: { theory: number; practice: number };
    teachingSpeed: { tooSlow: number; justRight: number; tooFast: number };
    insights: string[];
    recommendations: string[];
    trendAnalysis: string;
  } | null>(null);
  const [allStatistics, setAllStatistics] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);

  useEffect(() => {
    if (questionnaireId) {
      loadData();
      loadAIStatistics();
      loadAllStatistics();
    }
  }, [questionnaireId]);

  const loadAllStatistics = async () => {
    if (!questionnaireId) return;
    
    setIsLoadingStats(true);
    try {
      const stats = await apiClient.get<any>(`/questionnaires/${questionnaireId}/all-statistics`);
      setAllStatistics(stats);
    } catch (error: any) {
      console.error('Error loading all statistics:', error);
      // Ne pas afficher d'erreur si les stats ne sont pas disponibles
    } finally {
      setIsLoadingStats(false);
    }
  };

  const loadAIStatistics = async () => {
    if (!questionnaireId) return;
    
    setIsLoadingStats(true);
    try {
      const stats = await apiClient.get<{
        theoryPracticeRatio: { theory: number; practice: number };
        teachingSpeed: { tooSlow: number; justRight: number; tooFast: number };
        insights: string[];
        recommendations: string[];
        trendAnalysis: string;
      }>(`/questionnaires/${questionnaireId}/ai-statistics`);
      setAiStatistics(stats);
    } catch (error: any) {
      console.error('Error loading AI statistics:', error);
      // Ne pas afficher d'erreur si les stats ne sont pas disponibles
    } finally {
      setIsLoadingStats(false);
    }
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await questionnairesService.getQuestionnaireDetails(questionnaireId);
      setData(response);
    } catch (error: any) {
      console.error('Error loading questionnaire details:', error);
      const errorMessage = error?.message || 'Erreur lors du chargement des détails';
      toast.error(errorMessage);
  
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };


  // Extraire les dates uniques des réponses pour les filtres
  const availableDates = useMemo(() => {
    if (!data?.responses) return [];
    const dates = new Set<string>();
    data.responses.forEach((response) => {
      const date = new Date(response.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
      });
      dates.add(date);
    });
    return Array.from(dates).sort((a, b) => {
      const date1 = new Date(a.split(' ').reverse().join(' '));
      const date2 = new Date(b.split(' ').reverse().join(' '));
      return date1.getTime() - date2.getTime();
    });
  }, [data?.responses]);

  // Filtrer les réponses selon la date sélectionnée
  const filteredResponses = useMemo(() => {
    if (!data?.responses) return [];
    if (!selectedDateFilter || selectedDateFilter === 'all') return data.responses;
    
    return data.responses.filter((response) => {
      const responseDate = new Date(response.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
      });
      return responseDate === selectedDateFilter;
    });
  }, [data?.responses, selectedDateFilter]);

  const temporalData = useMemo(() => {
    if (!filteredResponses || filteredResponses.length === 0) return [];
    return generateTemporalData(filteredResponses);
  }, [filteredResponses]);

  // Calculer ratingDistribution pour les données filtrées
  const filteredRatingDistribution = useMemo(() => {
    // Utiliser les données IA si disponibles
    if (allStatistics?.overallRatingDistribution && allStatistics.overallRatingDistribution.length > 0) {
      return allStatistics.overallRatingDistribution;
    }
    // Sinon utiliser les données calculées
    if (!filteredResponses || filteredResponses.length === 0) return data?.ratingDistribution || [];
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredResponses.forEach((response) => {
      distribution[response.rating] = (distribution[response.rating] || 0) + 1;
    });
    return Object.entries(distribution).map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
    }));
  }, [filteredResponses, data?.ratingDistribution, allStatistics]);

  
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);

  const weakPoints = useMemo(() => {
    // Utiliser les données IA si disponibles
    if (allStatistics?.weakPoints && allStatistics.weakPoints.length > 0) {
      return allStatistics.weakPoints.map((point: string, index: number) => ({
        id: `weak-${index}`,
        rating: selectedRatingFilter || 2,
        comment: point,
        isAnonymous: true,
        createdAt: new Date().toISOString(),
      }));
    }
    // Sinon utiliser les données calculées
    if (!data?.responses) return [];
    let filtered = data.responses.filter((r) => r.rating <= 2 && r.comment);
    if (selectedRatingFilter) {
      filtered = filtered.filter((r) => r.rating === selectedRatingFilter);
    }
    return filtered;
  }, [data?.responses, selectedRatingFilter, allStatistics]);

  const strongPoints = useMemo(() => {
    // Utiliser les données IA si disponibles
    if (allStatistics?.strongPoints && allStatistics.strongPoints.length > 0) {
      return allStatistics.strongPoints.map((point: string, index: number) => ({
        id: `strong-${index}`,
        rating: selectedRatingFilter || 4,
        comment: point,
        isAnonymous: true,
        createdAt: new Date().toISOString(),
      }));
    }
    // Sinon utiliser les données calculées
    if (!data?.responses) return [];
    let filtered = data.responses.filter((r) => r.rating >= 4 && r.comment);
    if (selectedRatingFilter) {
      filtered = filtered.filter((r) => r.rating === selectedRatingFilter);
    }
    return filtered;
  }, [data?.responses, selectedRatingFilter, allStatistics]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">
            Impossible de charger les détails du questionnaire. Vérifiez que vous avez accès à ce questionnaire.
          </p>
          <Link
            href={routes.dashboard}
            className="inline-block px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-medium transition-colors"
          >
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1650px] pt-20 pb-8 px-4 sm:pt-[100px] sm:px-8 sm:pb-8">
        {/* Bannière plan gratuit */}
        {!isPaidPlan && data.hiddenResponses > 0 && (
          <TrialBanner
            message1={`Débloquez vos réponses. ${data.visibleResponses} utilisées par membre [plan gratuit]`}
            message2=""
            linkText="Je passe au plan Super IZZZI"
            linkHref="/pricing"
          />
        )}

        {/* En-tête */}
        <div className="mb-8">
          <Link
            href={routes.dashboard}
            prefetch={true}
            className="text-[#4A90E2] no-underline text-sm font-poppins mb-4 inline-block"
          >
            ← Retour au dashboard
          </Link>
          <h1
            className="font-mochiy text-xl md:text-2xl"
            style={{
              fontWeight: 400,
              color: '#2F2E2C',
              marginBottom: '8px',
            }}
          >
            Retour des étudiants
          </h1>
          <p
            className="text-sm md:text-base font-poppins text-[#6B6B6B]"
          >
            {data.totalResponses} réponses
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          {/* Colonne principale */}
          <div>
            {/* Récap temporel */}
            <Section title="Récap' temporel">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <ChartCard title="Globalement vous avez trouvé ce cours">
                  <ResponsiveContainer width="100%" height={180} className="min-h-[180px] md:h-[200px]">
                    <LineChart data={temporalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#2F2E2C', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}
                        axisLine={{ stroke: '#E5E5E5' }}
                      />
                      <YAxis 
                        domain={[0, 20]} 
                        tick={{ fill: '#2F2E2C', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}
                        axisLine={{ stroke: '#E5E5E5' }}
                        ticks={[0, 5, 10, 15, 20]}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #E5E5E5',
                          borderRadius: '8px',
                          fontFamily: 'Poppins, sans-serif',
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rating" 
                        stroke="#000000" 
                        strokeWidth={2}
                        dot={{ fill: '#FF6B35', r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Évolution de la satisfaction moyenne">
                  <ResponsiveContainer width="100%" height={180} className="min-h-[180px] md:h-[200px]">
                    <LineChart data={temporalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#2F2E2C', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}
                        axisLine={{ stroke: '#E5E5E5' }}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        tick={{ fill: '#2F2E2C', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}
                        axisLine={{ stroke: '#E5E5E5' }}
                        ticks={[0, 25, 50, 75, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #E5E5E5',
                          borderRadius: '8px',
                          fontFamily: 'Poppins, sans-serif',
                        }}
                        formatter={(value: any) => [`${value}%`, 'Satisfaction']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="satisfaction" 
                        stroke="#000000" 
                        strokeWidth={2}
                        dot={{ fill: '#FF6B35', r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </Section>

            {/* Le cours */}
            <Section title="Le cours">
              {/* Filtres de date */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {availableDates.slice(0, 2).map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDateFilter(selectedDateFilter === date ? null : date)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      backgroundColor: selectedDateFilter === date ? '#2F2E2C' : '#F5F5F5',
                      color: selectedDateFilter === date ? '#FFFFFF' : '#2F2E2C',
                      transition: 'all 0.2s',
                    }}
                  >
                    {date}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedDateFilter(selectedDateFilter === 'all' ? null : 'all')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    backgroundColor: selectedDateFilter === 'all' ? '#2F2E2C' : '#F5F5F5',
                    color: selectedDateFilter === 'all' ? '#FFFFFF' : '#2F2E2C',
                    transition: 'all 0.2s',
                  }}
                >
                  Tout voir
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <ChartCard title="Globalement vous avez trouvé ce cours">
                  <div style={{ position: 'relative' }}>
                    <ResponsiveContainer width="100%" height={180} className="min-h-[180px] md:h-[200px]">
                      <BarChart data={filteredRatingDistribution.length > 0 ? filteredRatingDistribution : data.ratingDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                        <XAxis 
                          dataKey="rating" 
                          tick={{ fill: '#2F2E2C', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}
                          axisLine={{ stroke: '#E5E5E5' }}
                        />
                        <YAxis 
                          domain={[0, 6]} 
                          tick={{ fill: '#2F2E2C', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}
                          axisLine={{ stroke: '#E5E5E5' }}
                          ticks={[0, 1, 2, 3, 4, 5, 6]}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #E5E5E5',
                            borderRadius: '8px',
                            fontFamily: 'Poppins, sans-serif',
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ 
                            position: 'absolute', 
                            top: 0, 
                            right: 0,
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '12px',
                          }}
                          iconType="square"
                          formatter={(value) => 'Note globale'}
                        />
                        <Bar dataKey="count" fill="#FF6B35" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
                <ChartCard title="Le ratio Théorie/Pratique">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <ResponsiveContainer width="50%" height={180} className="min-h-[180px] md:h-[200px]">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'J\'aurai aimé plus de mode cours (on écoute et on apprends)', value: 50, emoji: '😊' },
                            { name: 'Juste comme il faut', value: 30, emoji: '😉' },
                            { name: 'J\'aurai aimé plus de mode atelier (on fait et on apprend)', value: 20 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={false}
                          outerRadius={70}
                          innerRadius={35}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#F26103" />
                          <Cell fill="#FFE552" />
                          <Cell fill="#F69D04" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#F26103', borderRadius: '2px' }}></div>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: '#2F2E2C' }}>
                          J'aurai aimé plus de mode cours (on écoute et on apprends) 😊
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#FFE552', borderRadius: '2px' }}></div>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: '#2F2E2C' }}>
                          Juste comme il faut 😉
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#F69D04', borderRadius: '2px' }}></div>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: '#2F2E2C' }}>
                          J'aurai aimé plus de mode atelier (on fait et on apprend)
                        </span>
                      </div>
                    </div>
                  </div>
                  {isLoadingStats && (
                    <p className="text-xs text-gray-500 mt-2 text-center">Génération des statistiques IA...</p>
                  )}
                </ChartCard>
              </div>
              
              {/* Nouveaux graphiques en donut */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* L'ambiance durant le cours était */}
                <ChartCard title="L'ambiance durant le cours était">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <ResponsiveContainer width="100%" height={180} className="min-h-[180px] md:h-[200px]">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Sympa et cool, juste comme il faut', value: 65 },
                            { name: 'Un peu trop détendue à mon goût', value: 25 },
                            { name: 'Froide', value: 10 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={false}
                          outerRadius={70}
                          innerRadius={35}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#FFE552" />
                          <Cell fill="#F26103" />
                          <Cell fill="#F69D04" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#FFE552', borderRadius: '2px' }}></div>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#2F2E2C' }}>
                          Sympa et cool, juste comme il faut
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#F26103', borderRadius: '2px' }}></div>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#2F2E2C' }}>
                          Un peu trop détendue à mon goût
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#F69D04', borderRadius: '2px' }}></div>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#2F2E2C' }}>
                          Froide
                        </span>
                      </div>
                    </div>
                  </div>
                </ChartCard>

                {/* Le nombre d'heures */}
                <ChartCard title="Le nombre d'heures">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <ResponsiveContainer width="100%" height={180} className="min-h-[180px] md:h-[200px]">
                      <PieChart>
                        <Pie
                          data={allStatistics?.courseHours ? [
                            { name: 'Parfait', value: allStatistics.courseHours.parfait },
                            { name: 'Trop', value: allStatistics.courseHours.trop },
                            { name: 'Pas assez', value: allStatistics.courseHours.pasAssez },
                          ] : [
                            { name: 'Parfait', value: 65 },
                            { name: 'Trop', value: 25 },
                            { name: 'Pas assez', value: 10 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={false}
                          outerRadius={70}
                          innerRadius={35}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#FFE552" />
                          <Cell fill="#F26103" />
                          <Cell fill="#F69D04" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#FFE552', borderRadius: '2px' }}></div>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#2F2E2C' }}>
                          Parfait
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#F26103', borderRadius: '2px' }}></div>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#2F2E2C' }}>
                          Trop
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#F69D04', borderRadius: '2px' }}></div>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#2F2E2C' }}>
                          Pas assez
                        </span>
                      </div>
                    </div>
                  </div>
                </ChartCard>

                {/* La pertinence des infos */}
                <ChartCard title="La pertinence des infos par rapport à ce que vous imaginiez de ce cours">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <ResponsiveContainer width="100%" height={180} className="min-h-[180px] md:h-[200px]">
                      <PieChart>
                        <Pie
                          data={allStatistics?.contentRelevance ? [
                            { name: 'Comme je l\'imaginais', value: allStatistics.contentRelevance.commeImaginais },
                            { name: 'Rien à voir mais top', value: allStatistics.contentRelevance.rienAVoirTop },
                            { name: 'Rien à voir mais nul', value: allStatistics.contentRelevance.rienAVoirNul },
                          ] : [
                            { name: 'Comme je l\'imaginais', value: 65 },
                            { name: 'Rien à voir mais top', value: 25 },
                            { name: 'Rien à voir mais nul', value: 10 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={false}
                          outerRadius={70}
                          innerRadius={35}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#FFE552" />
                          <Cell fill="#F26103" />
                          <Cell fill="#F69D04" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#FFE552', borderRadius: '2px' }}></div>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#2F2E2C' }}>
                          Comme je l'imaginais
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#F26103', borderRadius: '2px' }}></div>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#2F2E2C' }}>
                          Rien à voir mais top
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#F69D04', borderRadius: '2px' }}></div>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#2F2E2C' }}>
                          Rien à voir mais nul
                        </span>
                      </div>
                    </div>
                  </div>
                </ChartCard>
              </div>
            </Section>

            {/* L'intervenant */}
            <Section title="L'intervenant">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ChartCard title="La clarté des informations et des notions">
                  <div style={{ position: 'relative' }}>
                    <ResponsiveContainer width="100%" height={180} className="min-h-[180px] md:h-[200px]">
                      <BarChart data={filteredRatingDistribution.length > 0 ? filteredRatingDistribution : data.ratingDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                        <XAxis 
                          dataKey="rating" 
                          tick={{ fill: '#2F2E2C', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}
                          axisLine={{ stroke: '#E5E5E5' }}
                        />
                        <YAxis 
                          domain={[0, 12]} 
                          tick={{ fill: '#2F2E2C', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}
                          axisLine={{ stroke: '#E5E5E5' }}
                          ticks={[0, 2, 4, 6, 8, 10, 12]}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #E5E5E5',
                            borderRadius: '8px',
                            fontFamily: 'Poppins, sans-serif',
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ 
                            position: 'absolute', 
                            top: 0, 
                            right: 0,
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '12px',
                          }}
                          iconType="square"
                          formatter={(value) => 'Clarté'}
                        />
                        <Bar dataKey="count" fill="#FF6B35" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
                <ChartCard title="Niveau vitesse">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <ResponsiveContainer width="50%" height={180} className="min-h-[180px] md:h-[200px]">
                      <PieChart>
                        <Pie
                          data={allStatistics?.teachingSpeed ? [
                            { name: 'Juste comme il faut', value: allStatistics.teachingSpeed.juste },
                            { name: 'Trop lent', value: allStatistics.teachingSpeed.tropLent },
                            { name: 'Trop rapide', value: allStatistics.teachingSpeed.tropRapide },
                          ] : aiStatistics?.teachingSpeed ? [
                            { name: 'Juste comme il faut', value: aiStatistics.teachingSpeed.justRight },
                            { name: 'Trop lent', value: aiStatistics.teachingSpeed.tooSlow },
                            { name: 'Trop rapide', value: aiStatistics.teachingSpeed.tooFast },
                          ] : [
                            { name: 'Juste comme il faut', value: 70 },
                            { name: 'Trop lent', value: 20 },
                            { name: 'Trop rapide', value: 10 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={false}
                          outerRadius={70}
                          innerRadius={35}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#FFE552" />
                          <Cell fill="#F26103" />
                          <Cell fill="#F69D04" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#FFE552', borderRadius: '2px' }}></div>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: '#2F2E2C' }}>
                          Juste comme il faut 😊
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#F26103', borderRadius: '2px' }}></div>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: '#2F2E2C' }}>
                          Trop lent 🐌
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#F69D04', borderRadius: '2px' }}></div>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: '#2F2E2C' }}>
                          Trop rapide 🚀
                        </span>
                      </div>
                    </div>
                  </div>
                  {isLoadingStats && (
                    <p className="text-xs text-gray-500 mt-2 text-center">Génération des statistiques IA...</p>
                  )}
                </ChartCard>
              </div>
            </Section>

            {/* Analyse des tendances IA */}
            {aiStatistics?.trendAnalysis && (
              <Section title="Analyse des tendances (IA)">
                <p className="text-sm md:text-base text-[#2F2E2C] leading-relaxed">
                  {aiStatistics.trendAnalysis}
                </p>
              </Section>
            )}

            {/* Insights et Recommandations IA */}
            {(aiStatistics?.insights.length > 0 || aiStatistics?.recommendations.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {aiStatistics.insights.length > 0 && (
                  <Section title="Insights (IA)">
                    <ul className="list-none p-0">
                      {aiStatistics.insights.map((insight, index) => (
                        <li key={index} className="mb-2 text-xs md:text-sm text-[#2F2E2C]">
                          • {insight}
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}
                {aiStatistics.recommendations.length > 0 && (
                  <Section title="Recommandations (IA)">
                    <ul className="list-none p-0">
                      {aiStatistics.recommendations.map((recommendation, index) => (
                        <li key={index} className="mb-2 text-xs md:text-sm text-[#2F2E2C]">
                          • {recommendation}
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}
              </div>
            )}

            {/* Points faibles et forts */}
            <div className="mt-6">
              {/* Barre de filtres par note */}
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0',
                  padding: '12px 0',
                  borderBottom: '1px solid #E5E5E5',
                  marginBottom: '16px',
                }}
              >
                {[0, 1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRatingFilter(selectedRatingFilter === rating ? null : rating)}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      background: 'none',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '16px',
                      fontWeight: selectedRatingFilter === rating ? 600 : 400,
                      color: selectedRatingFilter === rating ? '#2F2E2C' : '#6B6B6B',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {rating === 0 ? '0' : rating.toString()}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Section title="Points faibles">
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {weakPoints.length > 0 ? (
                      weakPoints.map((response, index) => (
                        <li 
                          key={index} 
                          style={{
                            marginBottom: '8px',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            color: '#2F2E2C',
                            lineHeight: '1.5',
                          }}
                        >
                          {response.comment}
                        </li>
                      ))
                    ) : (
                      <li style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        color: '#6B6B6B',
                      }}>
                        Aucun point faible
                      </li>
                    )}
                    {!isPaidPlan && data.hiddenResponses > 0 && (
                      <li style={{
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: '#FFF3CD',
                        borderRadius: '8px',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '12px',
                        color: '#856404',
                      }}>
                        {data.hiddenResponses} retours manquants. Passez à Super IZZZI pour les afficher.
                      </li>
                    )}
                  </ul>
                </Section>
                <Section title="Points forts">
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {strongPoints.length > 0 ? (
                      strongPoints.map((response, index) => (
                        <li 
                          key={index} 
                          style={{
                            marginBottom: '8px',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            color: '#2F2E2C',
                            lineHeight: '1.5',
                          }}
                        >
                          {response.comment}
                        </li>
                      ))
                    ) : (
                      <li style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        color: '#6B6B6B',
                      }}>
                        Aucun point fort
                      </li>
                    )}
                    {!isPaidPlan && data.hiddenResponses > 0 && (
                      <li style={{
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: '#FFF3CD',
                        borderRadius: '8px',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '12px',
                        color: '#856404',
                      }}>
                        {data.hiddenResponses} retours manquants. Passez à Super IZZZI pour les afficher.
                      </li>
                    )}
                  </ul>
                </Section>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24">
            {/* Partage */}
            <div
              className="bg-white rounded-lg p-4 md:p-6 mb-6"
              style={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#2F2E2C',
                  marginBottom: '12px',
                }}
              >
                Partage
              </h3>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  color: '#6B6B6B',
                  marginBottom: '16px',
                  lineHeight: '1.5',
                }}
              >
                Partage ce lien aux étudiants pour obtenir plus de réponses ou télécharge le QR code.
              </p>
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#F5F5F5',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  color: '#2F2E2C',
                  wordBreak: 'break-all',
                  marginBottom: '16px',
                }}
              >
                {typeof window !== 'undefined' && `${window.location.origin}/questionnaire/${data.token}`}
              </div>
              <button
                onClick={() => questionnairesService.downloadQRCode(data.token)}
                style={{
                  width: '100%',
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
                  gap: '8px',
                }}
              >
                Télécharger le QR code
                <ArrowUpRight size={16} color="#2F2E2C" />
              </button>
            </div>

            {/* Export */}
            <div
              className="bg-white rounded-lg p-4 md:p-6"
              style={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#2F2E2C',
                  marginBottom: '12px',
                }}
              >
                Export
              </h3>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  color: '#6B6B6B',
                  marginBottom: '16px',
                  lineHeight: '1.5',
                }}
              >
                Exporte les retours dans le format de ton choix (.CSV, .xlsx).
              </p>
              <button
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#FFD93D',
                  color: '#2F2E2C',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                Exporter les retours
                <ArrowDown size={16} color="#2F2E2C" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const isRecapTemporel = title === "Récap' temporel";
  
  return (
    <div
      className="bg-white rounded-lg p-4 md:p-6 mb-6"
      style={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <h2
        style={isRecapTemporel ? {
          fontFamily: 'Mochiy Pop One, sans-serif',
          fontWeight: 400,
          fontStyle: 'normal',
          fontSize: '18px',
          lineHeight: '100%',
          letterSpacing: '0px',
          color: '#2F2E2C',
          marginBottom: '16px',
        } : {
          fontFamily: 'Poppins, sans-serif',
          fontSize: '16px',
          fontWeight: 600,
          color: '#2F2E2C',
          marginBottom: '16px',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3
        style={{
          fontFamily: 'Mochiy Pop One, sans-serif',
          fontWeight: 400,
          fontStyle: 'normal',
          fontSize: '14px',
          lineHeight: '18px',
          letterSpacing: '0px',
          color: '#2F2E2C',
          marginBottom: '12px',
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function generateTemporalData(responses: QuestionnaireDetails['responses']) {
  // Grouper les réponses par date
  const grouped = responses.reduce((acc, response) => {
    const date = new Date(response.createdAt).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(response.rating);
    return acc;
  }, {} as Record<string, number[]>);

  return Object.entries(grouped)
    .sort(([dateA], [dateB]) => {
      // Trier par date
      const date1 = new Date(dateA.split(' ').reverse().join(' '));
      const date2 = new Date(dateB.split(' ').reverse().join(' '));
      return date1.getTime() - date2.getTime();
    })
    .map(([date, ratings]) => {
      const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      // Convertir le rating de 1-5 à 0-20 pour le premier graphique
      const ratingScaled = (avgRating / 5) * 20;
      return {
        date,
        rating: ratingScaled,
        satisfaction: (avgRating / 5) * 100,
      };
    });
}

