'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { CardIzzy } from '@/components/ui/CardIzzy';
import { CardSuperIzzy } from '@/components/ui/CardSuperIzzy';
import { PlanTableau } from '@/components/ui/PlanTableau';
import { routes } from '@/config/routes';
import { useAuth } from '@/hooks/useAuth';

export default function PricingMensuelPage() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="bg-white min-h-screen">
     
      <div 
        className="relative w-full bg-[#F5F5F5] pt-20 pb-32 md:pt-[120px] md:pb-[350px]"
      >
        <div className="w-full max-w-[1764px] px-4 md:px-4 mx-auto">
          <div className="text-center relative">
            <h1 
              className="font-mochiy text-xl md:text-3xl text-center text-[#2F2E2C] leading-[100%] tracking-[0%]"
            >
              Deux plans. Zéro friction.
            </h1>
            
            <div className="hidden md:block absolute top-1/2 right-1/4 -mt-10">
              <Image 
                src="/Flcèhe.svg" 
                alt="Flèche" 
                width={84}
                height={86}
                className="w-20 h-20"
              />
            </div>
            
            <p 
              className="mt-4 mx-auto font-poppins font-normal text-xs md:text-sm text-[#6B7280] max-w-[400px]"
            >
              Commencez gratuitement et passez au niveau supérieur quand vous êtes prêts.
            </p>

            <div 
              className="flex items-center mt-8 mx-auto w-full max-w-[328px] md:w-[380px] h-[67px] bg-[#FBFBFB] border border-[#E0E0E0] rounded-lg p-[10px] gap-4 md:gap-[30px]"
            >
              <Link href="/pricing" className="text-decoration-none w-full md:w-[181px]">
                <div
                  className="h-[47px] bg-transparent rounded-lg p-[18px_40px_18px_30px] flex items-center justify-center cursor-pointer"
                >
                  <span
                    className="text-[#2F2E2C] font-poppins font-normal text-sm md:text-base leading-[100%] tracking-[0%]"
                  >
                    Annuel -30%
                  </span>
                </div>
              </Link>
              
              <div
                className="w-full md:w-[147px] h-[47px] bg-[#2F2E2C] rounded-lg p-[18px_40px_18px_30px] flex items-center justify-center cursor-pointer"
              >
                <span
                  className="text-[#FFFFFF] font-poppins font-normal text-sm md:text-base leading-[100%] tracking-[0%]"
                >
                  Mensuel
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div 
        className="bg-white -mt-16 md:-mt-[270px] pb-10 md:pb-20"
      >
        <div 
          className="w-full max-w-[1764px] mx-auto px-4 md:px-4 flex flex-col md:flex-row justify-center items-start gap-6 md:gap-8"
        >
          <CardIzzy isAuthenticated={isAuthenticated} />
          <CardSuperIzzy isAnnual={false} isAuthenticated={isAuthenticated} />
        </div>
      </div>
      {!isAuthenticated && (
        <>
          <div className="bg-white py-8 md:py-16">
        <div 
          className="w-full max-w-[1067.29px] mx-auto mb-6 md:mb-10 px-4 md:px-0"
        >
          <h2 
            className="font-mochiy font-normal text-xl md:text-[32px] leading-[100%] tracking-[0%] text-[#2F2E2C] text-left"
          >
            Comparez nos plans
          </h2>
        </div>

        <div className="overflow-x-auto px-4 md:px-0">
          <PlanTableau isAnnual={false} />
        </div>
      </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-20">
        <div className="mt-8 md:mt-16 max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-6 md:mb-8">
            Questions fréquentes
          </h2>
          <div className="space-y-4 md:space-y-6">
            <div>
              <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-2">
                Comment est calculé le prix ?
              </h3>
              <p className="text-xs md:text-base text-gray-600">
                Le prix est calculé en fonction du nombre de classes actives dans votre espace.
                Une classe est considérée comme active dès qu'elle contient au moins une matière.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-2">
                Puis-je changer de formule ?
              </h3>
              <p className="text-xs md:text-base text-gray-600">
                Oui, vous pouvez passer du plan mensuel au plan annuel à tout moment.
                La différence sera calculée au prorata.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-2">
                Y a-t-il une période d'essai ?
              </h3>
              <p className="text-xs md:text-base text-gray-600">
                Oui, vous bénéficiez de 14 jours d'essai gratuit pour tester la plateforme
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
