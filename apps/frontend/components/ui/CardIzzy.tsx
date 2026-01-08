import { Button } from './Button';
import Link from 'next/link';
import { routes } from '@/config/routes';
import Image from 'next/image';

interface CardIzzyProps {
  isAuthenticated?: boolean;
}

export function CardIzzy({ isAuthenticated = false }: CardIzzyProps) {
  return (
    <div 
      className="w-full md:w-[555px] min-h-[722px] md:min-h-[906px] bg-[#FBFBFB] border border-[#E0E0E0] rounded-lg p-6 md:p-[40px_60px] flex flex-col relative"
      style={{
        minHeight: isAuthenticated ? '722px' : '906px',
      }}
    >

      <div className="mb-6 flex justify-between items-center">
        <div 
          className="flex items-center justify-center w-[135px] h-[50px] rounded-[30px] border border-[#E0E0E0] bg-white"
        >
          <span className="font-mochiy text-sm font-normal text-[#2F2E2C]">
            Izzzi
          </span>
        </div>
        
        {isAuthenticated && (
          <div 
            style={{
              display: 'inline-flex',
              padding: '8px 16px',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '6px',
              background: 'white',
              border: '2px solid #F69D04',
              width: 'fit-content'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#F69D04" strokeWidth="2"/>
              <path d="M12 8V12" stroke="#F69D04" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="#F69D04"/>
            </svg>
            <span style={{
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: 600,
              color: '#F69D04'
            }}>
              Plan actuel
            </span>
          </div>
        )}
      </div>

    
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="font-mochiy text-4xl md:text-[58px] font-normal text-[#2F2E2C] leading-[125%]">
            0€
          </span>
          <span className="font-poppins text-xs font-bold text-[#2F2E2C] leading-none">
            /mois
          </span>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="mb-6">
          <Link href={routes.auth.register} className="text-decoration-none block">
            <Button 
              variant="yellow"
              className="w-full md:w-[337px] h-14 bg-[#FFE552] text-[#2F2E2C] font-poppins font-normal text-sm md:text-base flex justify-between items-center px-6 py-4 border-none rounded-lg cursor-pointer"
            >
              <span>Démarrer mes 4 mois gratuits</span>
              <Image 
                src="/ArrowV.svg" 
                alt="Flèche" 
                width={16} 
                height={16}
              />
            </Button>
          </Link>
        </div>
      )}

      <div className="mb-6 flex-1">
        <div className="flex flex-col gap-3">
          {[
            { text: "4 mois d'essai illimités", subtext: "(matières, classes, retours)" },
            { text: "Puis 5 retours visibles par matière", subtext: "(les autres sont enregistrés mais masqués)" },
            { text: "Anonymat garanti pour tous les retours" },
            { text: "Relance manuelle possible", subtext: "(bouton à cliquer)" },
            { text: "Export des retours en CSV à tout moment" },
            { text: "QR code généré automatiquement" },
            { text: "IA avancée", subtext: "(alertes négatives & alertes positives)" },
            { text: "Page de suivi des alertes", subtext: "(notifications, commentaires possibles)" }
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
                  <span className="font-poppins text-xs text-[#999999] leading-[150%] mt-0.5">
                    {item.subtext}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

  
      <div className="mb-6">
        <h3 className="font-poppins text-xs font-semibold text-[#2F2E2C] mb-3">
          Au-delà des 4 mois :
        </h3>
        
        <div className="flex flex-col gap-3">
          {[
            "Vos classes restent actives",
            "Les retours visibles sont limités à 5 par matière"
          ].map((item, index) => (
            <div key={index} className="flex gap-3 items-start">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-0.5">
                <path d="M20 6L9 17L4 12" stroke="#2F2E2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-poppins text-sm md:text-base text-[#2F2E2C] leading-[150%]">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {!isAuthenticated && (
        <div className="mt-auto">
          <Button 
            variant="outline"
            className="w-full md:w-[278px] h-14 bg-transparent text-[#2F2E2C] font-poppins font-normal text-sm md:text-base flex justify-between items-center px-6 border border-[#E0E0E0] rounded-lg cursor-pointer"
          >
            Voir les détails du plan
            <Image 
              src="/ArrowV.svg" 
              alt="Flèche" 
              width={16} 
              height={16}
            />
          </Button>
        </div>
      )}
    </div>
  );
}
