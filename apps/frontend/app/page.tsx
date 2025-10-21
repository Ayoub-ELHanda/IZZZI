import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { routes } from '@/config/routes';

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Recueillez les avis de vos étudiants{' '}
            <span className="text-blue-600">en temps réel</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            IZZZI vous aide à collecter, analyser et exploiter les retours de vos étudiants 
            pour améliorer continuellement la qualité de vos formations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={routes.auth.register}>
              <Button size="lg" className="w-full sm:w-auto">
                Commencer gratuitement
              </Button>
            </Link>
            <Link href={routes.pricing}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Voir les tarifs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Pourquoi choisir IZZZI ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Collecte simplifiée
            </h3>
            <p className="text-gray-600">
              Créez des questionnaires personnalisés et partagez-les facilement via QR code ou lien.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Analyse intelligente
            </h3>
            <p className="text-gray-600">
              Synthèses automatiques et alertes pour identifier rapidement les points d'amélioration.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Réactivité accrue
            </h3>
            <p className="text-gray-600">
              Recevez des notifications en temps réel et agissez rapidement sur les retours importants.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à améliorer votre enseignement ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Rejoignez les établissements qui font confiance à IZZZI
          </p>
          <Link href={routes.auth.register}>
            <Button size="lg" variant="secondary">
              Créer mon compte gratuitement
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
