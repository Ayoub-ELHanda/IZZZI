import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { CardIzzy } from '@/components/ui/CardIzzy';
import { CardSuperIzzy } from '@/components/ui/CardSuperIzzy';
import { routes } from '@/config/routes';

export const metadata = {
  title: 'Tarifs - IZZZI',
  description: 'Découvrez nos offres et tarifs',
};

export default function PricingPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header avec background subtil */}
      <div className="bg-gray-50 py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative">
            <h1 
              className="font-mochiy text-3xl text-center"
              style={{
                color: '#2F2E2C',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              Deux plans. Zero friction.
            </h1>
            
            {/* Flèche orange exportée de Figma */}
            <div className="absolute top-1/2 right-1/4 -mt-10">
              <Image 
                src="/Flcèhe.svg" 
                alt="Flèche" 
                width={84}
                height={86}
                className="w-20 h-20"
              />
            </div>
            
            <p 
              className="mt-4 mx-auto"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                color: '#6B7280',
                maxWidth: '400px'
              }}
            >
              Commencez gratuitement et passez au niveau supérieur quand vous êtes prêts.
            </p>

            {/* Toggle Annuel/Mensuel selon spécifications Figma exactes */}
            <div 
              className="flex items-center mt-8 mx-auto"
              style={{
                width: '328px',
                height: '67px',
                backgroundColor: '#FBFBFB',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                padding: '10px 40px 10px 10px',
                gap: '30px'
              }}
            >
              {/* Frame 2 - Annuel -36% */}
              <div
                style={{
                  width: '181px',
                  height: '47px',
                  backgroundColor: '#2F2E2C',
                  borderRadius: '8px',
                  padding: '18px 40px 18px 30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <span
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-poppins), Poppins, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    letterSpacing: '0%'
                  }}
                >
                  Annuel -30%
                </span>
              </div>
              
              {/* Text Mensuel */}
              <span
                style={{
                  width: '67px',
                  height: '11px',
                  color: '#2F2E2C',
                  fontFamily: 'var(--font-poppins), Poppins, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Mensuel
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
          <CardIzzy />
          <CardSuperIzzy />
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
