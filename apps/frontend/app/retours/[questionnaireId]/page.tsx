'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { questionnairesService, QuestionnaireDetails } from '@/services/api/questionnaires.service';
import { toast } from 'sonner';
import { TrialBanner } from '@/components/ui/TrialBanner';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#FF6B35', '#FFD93D', '#4A90E2', '#50C878', '#9B59B6'];

export default function QuestionnaireDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const questionnaireId = params.questionnaireId as string;
  const [data, setData] = useState<QuestionnaireDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaidPlan] = useState(false); // TODO: Vérifier le plan depuis Stripe

  useEffect(() => {
    if (questionnaireId) {
      loadData();
    }
  }, [questionnaireId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await questionnairesService.getQuestionnaireDetails(questionnaireId);
      setData(response);
    } catch (error: any) {
      console.error('Error loading questionnaire details:', error);
      const errorMessage = error?.message || 'Erreur lors du chargement des détails';
      toast.error(errorMessage);
      // Ne pas rediriger automatiquement, laisser l'utilisateur voir l'erreur
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize temporal data to avoid recalculating on every render
  const temporalData = useMemo(() => {
    if (!data?.responses) return [];
    return generateTemporalData(data.responses);
  }, [data?.responses]);

  // Memoize filtered responses for points forts/faibles
  const weakPoints = useMemo(() => {
    if (!data?.responses) return [];
    return data.responses
      .filter((r) => r.rating <= 2 && r.comment)
      .slice(0, 5);
  }, [data?.responses]);

  const strongPoints = useMemo(() => {
    if (!data?.responses) return [];
    return data.responses
      .filter((r) => r.rating >= 4 && r.comment)
      .slice(0, 5);
  }, [data?.responses]);

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
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="rating" stroke="#FF6B35" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Évolution de la satisfaction moyenne">
                  <ResponsiveContainer width="100%" height={180} className="min-h-[180px] md:h-[200px]">
                    <LineChart data={temporalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="satisfaction" stroke="#4A90E2" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </Section>

            {/* Le cours */}
            <Section title="Le cours">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <ChartCard title="Globalement vous avez trouvé ce cours">
                  <ResponsiveContainer width="100%" height={180} className="min-h-[180px] md:h-[200px]">
                    <BarChart data={data.ratingDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#FF6B35" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Le ratio Théorie/Pratique">
                  <ResponsiveContainer width="100%" height={180} className="min-h-[180px] md:h-[200px]">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Théorie', value: 60 },
                          { name: 'Pratique', value: 40 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[0, 1].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </Section>

            {/* L'intervenant */}
            <Section title="L'intervenant">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ChartCard title="La clarté des informations et des notions">
                  <ResponsiveContainer width="100%" height={180} className="min-h-[180px] md:h-[200px]">
                    <BarChart data={data.ratingDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4A90E2" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Niveau vitesse">
                  <ResponsiveContainer width="100%" height={180} className="min-h-[180px] md:h-[200px]">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Juste', value: 70 },
                          { name: 'Trop lent', value: 20 },
                          { name: 'Trop rapide', value: 10 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[0, 1, 2].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </Section>

            {/* Points faibles et forts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Section title="Points faibles">
                <ul className="list-none p-0">
                  {weakPoints.map((response, index) => (
                    <li key={index} className="mb-2 text-xs md:text-sm text-[#6B6B6B]">
                      • {response.comment}
                    </li>
                  ))}
                  {!isPaidPlan && data.hiddenResponses > 0 && (
                    <li className="mt-4 p-3 bg-[#FFF3CD] rounded text-[10px] md:text-xs text-[#856404]">
                      {data.hiddenResponses} retours manquants. Passez à Super IZZZI pour les afficher.
                    </li>
                  )}
                </ul>
              </Section>
              <Section title="Points forts">
                <ul className="list-none p-0">
                  {strongPoints.map((response, index) => (
                    <li key={index} className="mb-2 text-xs md:text-sm text-[#6B6B6B]">
                      • {response.comment}
                    </li>
                  ))}
                  {!isPaidPlan && data.hiddenResponses > 0 && (
                    <li className="mt-4 p-3 bg-[#FFF3CD] rounded text-[10px] md:text-xs text-[#856404]">
                      {data.hiddenResponses} retours manquants. Passez à Super IZZZI pour les afficher.
                    </li>
                  )}
                </ul>
              </Section>
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
                className="text-base md:text-lg font-poppins font-semibold text-[#2F2E2C] mb-4"
              >
                Partage
              </h3>
              <p
                className="text-xs md:text-sm font-poppins text-[#6B6B6B] mb-4"
              >
                Partagez ce lien avec vos étudiants pour avoir plus de réponses ou téléchargez le QR code.
              </p>
              <div
                className="p-3 bg-[#F5F5F5] rounded text-[10px] md:text-xs font-mono break-all mb-4"
              >
                {typeof window !== 'undefined' && `${window.location.origin}/questionnaire/${data.token}`}
              </div>
              <button
                onClick={() => questionnairesService.downloadQRCode(data.token)}
                className="w-full py-3 px-3 bg-[#FFD93D] text-[#2F2E2C] border-none rounded text-xs md:text-sm font-poppins font-medium cursor-pointer"
              >
                Télécharger le QR code
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
                className="text-base md:text-lg font-poppins font-semibold text-[#2F2E2C] mb-4"
              >
                Export
              </h3>
              <p
                className="text-xs md:text-sm font-poppins text-[#6B6B6B] mb-4"
              >
                Exportez les retours dans le format de ton choix (CSV, xlsx).
              </p>
              <button
                className="w-full py-3 px-3 bg-[#FFD93D] text-[#2F2E2C] border-none rounded text-xs md:text-sm font-poppins font-medium cursor-pointer"
              >
                Exporter les retours
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="bg-white rounded-lg p-4 md:p-6 mb-6"
      style={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <h2
        className="text-base md:text-xl font-poppins font-semibold text-[#2F2E2C] mb-4"
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
        className="text-xs md:text-sm font-poppins font-medium text-[#2F2E2C] mb-3"
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

  return Object.entries(grouped).map(([date, ratings]) => ({
    date,
    rating: ratings.reduce((a, b) => a + b, 0) / ratings.length,
    satisfaction: (ratings.reduce((a, b) => a + b, 0) / ratings.length / 5) * 100,
  }));
}

