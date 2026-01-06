'use client';

import { Badge } from './Badge';
import { Button } from './Button';
import { Slider } from './Slider';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { useState } from 'react';

interface CardSuperIzzyProps {
  isAnnual?: boolean;
  isAuthenticated?: boolean;
}

export function CardSuperIzzy({ isAnnual = true, isAuthenticated = false }: CardSuperIzzyProps) {
  const [classCount, setClassCount] = useState(7);
  
  let monthlyPricePerClass: number;
  if (classCount >= 1 && classCount <= 5) {
    monthlyPricePerClass = 19;
  } else if (classCount >= 6 && classCount <= 10) {
    monthlyPricePerClass = 17;
  } else if (classCount >= 11 && classCount <= 15) {
    monthlyPricePerClass = 15;
  } else if (classCount >= 16 && classCount <= 20) {
    monthlyPricePerClass = 13;
  } else {
    monthlyPricePerClass = 13;
  }
  
  // Prix annuel avec -30% de réduction
  const annualPricePerClass = Math.round(monthlyPricePerClass * 0.7);
  
  // Prix utilisé selon le mode
  const pricePerClass = isAnnual ? annualPricePerClass : monthlyPricePerClass;
  const totalPrice = classCount * pricePerClass;
  return (
    <div 
      className="w-full md:w-[521px] bg-[#F69D04] border border-[rgba(244,244,244,0.05)] rounded-lg p-6 md:p-[60px_73px] flex flex-col gap-4 relative box-border text-white"
      style={{
        minHeight: isAuthenticated ? '876px' : '972px',
      }}
    >

      <div className="mb-8">
        <div 
          className="flex items-center justify-center w-[186px] h-[50px] rounded-[30px] bg-[#FFE552]"
        >
          <span className="font-mochiy text-sm font-normal text-[#2F2E2C]">
            Super Izzzi
          </span>
        </div>
      </div>
      
   
      <div className="mb-8">
        <h3 className="font-poppins font-bold text-sm md:text-base leading-none text-[#2F2E2C] mb-4">
          Estimez le prix de votre abonnement
        </h3>
        
 
        <div className="mb-8">
     
          <div className="mb-4">
            <div className="relative">
              <Slider
                defaultValue={[7]}
                min={1}
                max={25}
                step={1}
                onValueChange={(value) => setClassCount(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs mt-2 opacity-75 text-[#2F2E2C]">
                <span>1</span>
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>+20</span>
              </div>
            </div>
          </div>
          
         
          <div className="mb-6">
            {classCount <= 20 ? (
              <div className="flex items-baseline gap-2">
                <span className="font-mochiy text-4xl md:text-[58px] font-normal text-[#2F2E2C] leading-[125%]">
                  {pricePerClass}€
                </span>
                <span className="font-poppins text-xs font-bold text-[#2F2E2C] leading-none ml-2">
                  par mois / par classe
                </span>
              </div>
            ) : (
              <p className="font-poppins text-base md:text-lg text-[#2F2E2C] text-center">
                Pour plus de 20 classes, contactez-nous pour une offre personnalisée
              </p>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          {classCount <= 20 ? (
            <Link 
              href={`/checkout?classes=${classCount}&period=${isAnnual ? 'annual' : 'monthly'}`}
              className="text-decoration-none block w-full md:w-[239px]"
            >
              <Button 
                variant="yellow"
                className="w-full h-14 bg-[#FFE552] text-[#2F2E2C] font-poppins font-normal text-sm md:text-base flex justify-between items-center px-6 border-none rounded-lg cursor-pointer"
              >
                Je choisis ce plan
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
            </Link>
          ) : (
            <Link 
              href="/contact"
              className="text-decoration-none block w-full md:w-[239px]"
            >
              <Button 
                variant="yellow"
                className="w-full h-14 bg-[#FFE552] text-[#2F2E2C] font-poppins font-normal text-xs md:text-sm flex justify-center items-center px-6 border-none rounded-lg cursor-pointer"
              >
                Demander une offre sur mesure
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
            </Link>
          )}
        </div>
      </div>
      
 
      <div className="flex flex-col gap-3">
        <h3 className="font-poppins text-sm md:text-base font-bold text-[#2F2E2C] leading-none mb-4">
          Tout ce qu&apos;il y a dans le plan gratuit,<br className="hidden md:block"/>
          et en plus :
        </h3>
        
        <div className="flex flex-col gap-4">
          {[
            { text: "Nombre de retours illimité" },
            { 
              text: "IA générative pour répondre aux alertes",
              subtext: "(un mail prêt à envoyer en un clic)"
            },
            { 
              text: "Levée d'anonymat activée par l'étudiant",
              subtext: "(Bientôt disponible)"
            },
            { 
              text: "Formulaires personnalisables",
              subtext: "(Bientôt disponible)"
            },
            { 
              text: "Envoie automatique du formulaire",
              subtext: "(Bientôt disponible)"
            },
            { 
              text: "Branding personnalisé (couleurs, logo)",
              subtext: "Au début et à la fin du cours (Bientôt disponible)"
            },
            { 
              text: "Suppression du logo IZZI",
              subtext: "(Bientôt disponible)"
            }
          ].map((item, index) => (
            <div key={index} className="flex gap-3 items-start">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-0.5">
                <path d="M20 6L9 17L4 12" stroke="#2F2E2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="flex flex-col">
                <span className="font-poppins text-sm md:text-base text-[#2F2E2C] leading-[150%]">
                  {item.text}
                </span>
                {item.subtext && (
                  <span className="font-poppins text-xs text-[#2F2E2C] leading-[150%] mt-0.5">
                    {item.subtext}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {!isAuthenticated && (
        <div className="mt-auto pt-2.5">
          <Button 
            variant="outline"
            className="w-full md:w-[278px] h-14 bg-transparent text-[#2F2E2C] font-poppins font-normal text-sm md:text-base flex justify-between items-center px-6 border border-[#2F2E2C] rounded-lg cursor-pointer"
          >
            Voir les détails du plan
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
}
