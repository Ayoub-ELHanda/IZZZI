'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { CardIzzy } from '@/components/ui/CardIzzy';
import { CardSuperIzzy } from '@/components/ui/CardSuperIzzy';
import { PlanTableau } from '@/components/ui/PlanTableau';
import { routes } from '@/config/routes';
import { useAuth } from '@/hooks/useAuth';

export default function PricingPage() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="bg-white min-h-screen">
     
      <div 
        className="relative w-full bg-[#F5F5F5] pt-20 pb-32 md:pt-[120px] md:pb-[350px]"
      >
        <div className="w-full max-w-[1764px] px-4 md:px-4 mx-auto">
          <div className="text-center relative">
            <h1 
              className="font-mochiy text-xl md:text-3xl text-center"
              style={{
                color: '#2F2E2C',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              Deux plans. Zéro friction.
            </h1>
            
            <div className="absolute top-1/2 right-1/4 -mt-10 hidden md:block">
              <Image 
                src="/Flcèhe.svg" 
                alt="Flèche" 
                width={84}
                height={86}
                className="w-16 h-16 md:w-20 md:h-20"
              />
            </div>
            
            <p 
              className="mt-4 mx-auto text-xs md:text-sm max-w-[400px] font-poppins font-normal text-[#6B7280]"
            >
              Commencez gratuitement et passez au niveau supérieur quand vous êtes prêts.
            </p>

        
            <div 
              className="flex items-center mt-6 md:mt-8 mx-auto w-full max-w-[328px] h-[67px] bg-[#FBFBFB] border border-[#E0E0E0] rounded-lg p-[10px_40px_10px_10px] gap-4 md:gap-[30px]"
            >
              <div
                className="w-full md:w-[181px] h-[47px] bg-[#2F2E2C] rounded-lg p-[18px_30px] md:p-[18px_40px_18px_30px] flex items-center justify-center cursor-pointer"
              >
                <span
                  className="text-white font-poppins font-normal text-sm md:text-base leading-none"
                >
                  Annuel -30%
                </span>
              </div>
              
              <Link href="/pricing-mensuel" className="text-decoration-none">
                <span
                  className="text-[#2F2E2C] font-poppins font-normal text-sm md:text-base leading-none cursor-pointer flex items-center"
                >
                  Mensuel
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards - positionnées pour chevaucher le fond gris */}
      <div 
        className="bg-white -mt-16 md:-mt-[270px] pb-8 md:pb-20"
      >
        <div 
          className="w-full max-w-[1764px] mx-auto px-4 md:px-4 flex flex-col md:flex-row justify-center items-start gap-6 md:gap-8"
        >
          <CardIzzy isAuthenticated={isAuthenticated} />
          <CardSuperIzzy isAnnual={true} isAuthenticated={isAuthenticated} />
        </div>
      </div>
      
      {/* Section tableau de comparaison et FAQ - uniquement pour visiteurs */}
      {!isAuthenticated && (
        <>
          <div className="bg-white py-8 md:py-16 px-4 md:px-0">
        <div 
          className="w-full max-w-[1067px] mx-auto mb-6 md:mb-10"
        >
          <h2 
            className="font-mochiy font-normal text-xl md:text-[32px] leading-none text-[#2F2E2C] text-left"
          >
            Comparez nos plans
          </h2>
        </div>

        <div className="overflow-x-auto -mx-4 md:mx-0">
          <PlanTableau isAnnual={true} />
        </div>
      </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-20">
        <div className="mt-8 md:mt-16 max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-6 md:mb-8">
            Questions fréquentes
          </h2>
          <div className="space-y-4 md:space-y-6">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                Comment est calculé le prix ?
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Le prix est calculé en fonction du nombre de classes actives dans votre espace.
                Une classe est considérée comme active dès qu'elle contient au moins une matière.
              </p>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                Puis-je changer de formule ?
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Oui, vous pouvez passer du plan mensuel au plan annuel à tout moment.
                La différence sera calculée au prorata.
              </p>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                Y a-t-il une période d&apos;essai ?
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Oui, vous bénéficiez de 14 jours d&apos;essai gratuit pour tester la plateforme
                sans engagement ni carte bancaire requise.
              </p>
            </div>
          </div>
        </div>
          </div>
        </>
      )}
    </div>
  );
}
