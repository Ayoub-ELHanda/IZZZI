'use client';

import { useState, useEffect } from 'react';
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
    loadData();
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
      <div className="mx-auto p-8" style={{ maxWidth: '1650px' }}>
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
        <div style={{ marginBottom: '32px' }}>
          <Link
            href={routes.dashboard}
            style={{
              color: '#4A90E2',
              textDecoration: 'none',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              marginBottom: '16px',
              display: 'inline-block',
            }}
          >
            ← Retour au dashboard
          </Link>
          <h1
            className="font-mochiy"
            style={{
              fontSize: '24px',
              fontWeight: 400,
              color: '#2F2E2C',
              marginBottom: '8px',
            }}
          >
            Retour des étudiants
          </h1>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              color: '#6B6B6B',
            }}
          >
            {data.totalResponses} réponses
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
          {/* Colonne principale */}
          <div>
            {/* Récap temporel */}
            <Section title="Récap' temporel">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <ChartCard title="Globalement vous avez trouvé ce cours">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={generateTemporalData(data.responses)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="rating" stroke="#FF6B35" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Évolution de la satisfaction moyenne">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={generateTemporalData(data.responses)}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <ChartCard title="Globalement vous avez trouvé ce cours">
                  <ResponsiveContainer width="100%" height={200}>
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
                  <ResponsiveContainer width="100%" height={200}>
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
                        outerRadius={80}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <ChartCard title="La clarté des informations et des notions">
                  <ResponsiveContainer width="100%" height={200}>
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
                  <ResponsiveContainer width="100%" height={200}>
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
                        outerRadius={80}
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
              <Section title="Points faibles">
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {data.responses
                    .filter((r) => r.rating <= 2 && r.comment)
                    .slice(0, 5)
                    .map((response, index) => (
                      <li key={index} style={{ marginBottom: '8px', fontSize: '14px', color: '#6B6B6B' }}>
                        • {response.comment}
                      </li>
                    ))}
                  {!isPaidPlan && data.hiddenResponses > 0 && (
                    <li style={{ marginTop: '16px', padding: '12px', background: '#FFF3CD', borderRadius: '4px', fontSize: '12px', color: '#856404' }}>
                      {data.hiddenResponses} retours manquants. Passez à Super IZZZI pour les afficher.
                    </li>
                  )}
                </ul>
              </Section>
              <Section title="Points forts">
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {data.responses
                    .filter((r) => r.rating >= 4 && r.comment)
                    .slice(0, 5)
                    .map((response, index) => (
                      <li key={index} style={{ marginBottom: '8px', fontSize: '14px', color: '#6B6B6B' }}>
                        • {response.comment}
                      </li>
                    ))}
                  {!isPaidPlan && data.hiddenResponses > 0 && (
                    <li style={{ marginTop: '16px', padding: '12px', background: '#FFF3CD', borderRadius: '4px', fontSize: '12px', color: '#856404' }}>
                      {data.hiddenResponses} retours manquants. Passez à Super IZZZI pour les afficher.
                    </li>
                  )}
                </ul>
              </Section>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Partage */}
            <div
              style={{
                background: '#FFF',
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#2F2E2C',
                  marginBottom: '16px',
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
                }}
              >
                Partagez ce lien avec vos étudiants pour avoir plus de réponses ou téléchargez le QR code.
              </p>
              <div
                style={{
                  padding: '12px',
                  background: '#F5F5F5',
                  borderRadius: '4px',
                  marginBottom: '16px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  wordBreak: 'break-all',
                }}
              >
                {typeof window !== 'undefined' && `${window.location.origin}/questionnaire/${data.token}`}
              </div>
              <button
                onClick={() => questionnairesService.downloadQRCode(data.token)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#FFD93D',
                  color: '#2F2E2C',
                  border: 'none',
                  borderRadius: '4px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Télécharger le QR code
              </button>
            </div>

            {/* Export */}
            <div
              style={{
                background: '#FFF',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#2F2E2C',
                  marginBottom: '16px',
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
                }}
              >
                Exportez les retours dans le format de ton choix (CSV, xlsx).
              </p>
              <button
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#FFD93D',
                  color: '#2F2E2C',
                  border: 'none',
                  borderRadius: '4px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
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
      style={{
        background: '#FFF',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <h2
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '20px',
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
          fontFamily: 'Poppins, sans-serif',
          fontSize: '14px',
          fontWeight: 500,
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

  return Object.entries(grouped).map(([date, ratings]) => ({
    date,
    rating: ratings.reduce((a, b) => a + b, 0) / ratings.length,
    satisfaction: (ratings.reduce((a, b) => a + b, 0) / ratings.length / 5) * 100,
  }));
}

