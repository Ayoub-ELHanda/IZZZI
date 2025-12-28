import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { routes } from '@/config/routes';

export const metadata = {
  title: 'Tarifs - IZZZI',
  description: 'Découvrez nos offres et tarifs',
};

export default function PricingPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tarifs simples et transparents
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choisissez l'offre qui correspond à vos besoins
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Monthly Plan */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Mensuel
              </h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-extrabold text-gray-900">
                  €X
                </span>
                <span className="ml-1 text-xl text-gray-500">/mois</span>
              </div>
              <p className="mt-4 text-gray-600">
                Par classe active
              </p>
            </div>
            
            <ul className="mt-8 space-y-4">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3 text-gray-700">Questionnaires illimités</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3 text-gray-700">Synthèses automatiques</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3 text-gray-700">Alertes en temps réel</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3 text-gray-700">Sans engagement</span>
              </li>
            </ul>

            <div className="mt-8">
              <Link href={routes.auth.register}>
                <Button className="w-full" variant="outline">
                  Commencer
                </Button>
              </Link>
            </div>
          </div>

          {/* Annual Plan */}
          <div className="bg-gradient-to-b from-blue-600 to-blue-700 border-2 border-blue-600 rounded-lg p-8 relative">
            <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
              Recommandé
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                Annuel
              </h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-extrabold text-white">
                  €X
                </span>
                <span className="ml-1 text-xl text-blue-100">/an</span>
              </div>
              <p className="mt-4 text-blue-100">
                Par classe active<br/>
                <strong className="text-white">2 mois offerts</strong>
              </p>
            </div>
            
            <ul className="mt-8 space-y-4">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3 text-white">Tout du plan mensuel</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3 text-white">Support prioritaire</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3 text-white">Économies importantes</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3 text-white">Formation personnalisée</span>
              </li>
            </ul>

            <div className="mt-8">
              <Link href={routes.auth.register}>
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                  Commencer
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Questions fréquentes
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Comment est calculé le prix ?
              </h3>
              <p className="text-gray-600">
                Le prix est calculé en fonction du nombre de classes actives dans votre espace.
                Une classe est considérée comme active dès qu'elle contient au moins une matière.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Puis-je changer de formule ?
              </h3>
              <p className="text-gray-600">
                Oui, vous pouvez passer du plan mensuel au plan annuel à tout moment.
                La différence sera calculée au prorata.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Y a-t-il une période d'essai ?
              </h3>
              <p className="text-gray-600">
                Oui, vous bénéficiez de 14 jours d'essai gratuit pour tester la plateforme
                sans engagement ni carte bancaire requise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




