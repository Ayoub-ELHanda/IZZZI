import { Badge } from './Badge';
import { Button } from './Button';
import Link from 'next/link';
import { routes } from '@/config/routes';

export function CardIzzy() {
  return (
    <div 
      style={{
        width: '555px',
        backgroundColor: '#FBFBFB',
        border: '1px solid #E0E0E0',
        borderRadius: '8px',
        padding: '60px 73px 60px 73px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      {/* Badge Izzzi en haut */}
      <div className="mb-6">
        <Badge variant="white">Izzzi</Badge>
      </div>
      
      {/* Prix avec spécifications Figma exactes */}
      <div className="mb-8">
        <div className="flex items-baseline">
          <span 
            style={{
              fontFamily: 'Mochiy Pop One',
              fontSize: '58px',
              fontWeight: 400,
              lineHeight: '125%',
              letterSpacing: '0%',
              color: '#2F2E2C'
            }}
          >
            0€
          </span>
          <span 
            style={{
              fontFamily: 'Poppins',
              fontSize: '12px',
              fontWeight: 700,
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#2F2E2C',
              marginLeft: '8px'
            }}
          >
            /mois
          </span>
        </div>
      </div>
      
      {/* Bouton avec spécifications Figma exactes */}
      <div className="mb-8">
        <Link href={routes.auth.register}>
          <button
            style={{
              width: '337.29px',
              height: '56px',
              backgroundColor: '#FFE552',
              borderRadius: '8px',
              padding: '20px 26px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.99px',
              cursor: 'pointer',
              fontFamily: 'Poppins',
              fontSize: '16px',
              fontWeight: 400,
              color: '#2F2E2C',
              lineHeight: '100%',
              letterSpacing: '0%'
            }}
            className="hover:bg-[#FFD700] transition-colors"
          >
            Démarrer mes 4 mois gratuits
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.33334 8H12.6667M12.6667 8L8.00001 3.33333M12.6667 8L8.00001 12.6667" stroke="#2F2E2C" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </Link>
      </div>
      
      {/* Liste des fonctionnalités avec spécifications exactes */}
      <ul className="space-y-4 mb-8">
        <li className="flex items-start">
          <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div className="ml-3">
            <div 
              style={{
                fontFamily: 'Poppins',
                fontSize: '16px',
                fontWeight: 400,
                color: '#2F2E2C',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              4 mois d'essai illimités
            </div>
            <div 
              style={{
                fontFamily: 'Poppins',
                fontSize: '12px',
                fontWeight: 400,
                color: '#2F2E2C',
                lineHeight: '100%',
                letterSpacing: '0%',
                marginTop: '4px'
              }}
            >
              (matières, classes, retours)
            </div>
          </div>
        </li>
        
        <li className="flex items-start">
          <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div className="ml-3">
            <div 
              style={{
                fontFamily: 'Poppins',
                fontSize: '16px',
                fontWeight: 400,
                color: '#2F2E2C',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              Puis 5 retours visibles par matière
            </div>
            <div 
              style={{
                fontFamily: 'Poppins',
                fontSize: '12px',
                fontWeight: 400,
                color: '#2F2E2C',
                lineHeight: '100%',
                letterSpacing: '0%',
                marginTop: '4px'
              }}
            >
              (les autres sont enregistrés mais masqués)
            </div>
          </div>
        </li>
        
        <li className="flex items-start">
          <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div 
            className="ml-3"
            style={{
              fontFamily: 'Poppins',
              fontSize: '16px',
              fontWeight: 400,
              color: '#2F2E2C',
              lineHeight: '100%',
              letterSpacing: '0%'
            }}
          >
            Anonymat garanti pour tous les retours
          </div>
        </li>
        
        <li className="flex items-start">
          <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div className="ml-3">
            <div 
              style={{
                fontFamily: 'Poppins',
                fontSize: '16px',
                fontWeight: 400,
                color: '#2F2E2C',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              Relance manuelle possible
            </div>
            <div 
              style={{
                fontFamily: 'Poppins',
                fontSize: '12px',
                fontWeight: 400,
                color: '#2F2E2C',
                lineHeight: '100%',
                letterSpacing: '0%',
                marginTop: '4px'
              }}
            >
              (bouton à cliquer)
            </div>
          </div>
        </li>
        
        <li className="flex items-start">
          <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div 
            className="ml-3"
            style={{
              fontFamily: 'Poppins',
              fontSize: '16px',
              fontWeight: 400,
              color: '#2F2E2C',
              lineHeight: '100%',
              letterSpacing: '0%'
            }}
          >
            Export des retours en CSV à tout moment
          </div>
        </li>
        
        <li className="flex items-start">
          <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div 
            className="ml-3"
            style={{
              fontFamily: 'Poppins',
              fontSize: '16px',
              fontWeight: 400,
              color: '#2F2E2C',
              lineHeight: '100%',
              letterSpacing: '0%'
            }}
          >
            QR code généré automatiquement
          </div>
        </li>
        
        <li className="flex items-start">
          <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div className="ml-3">
            <div 
              style={{
                fontFamily: 'Poppins',
                fontSize: '16px',
                fontWeight: 400,
                color: '#2F2E2C',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              IA avancée
            </div>
            <div 
              style={{
                fontFamily: 'Poppins',
                fontSize: '12px',
                fontWeight: 400,
                color: '#2F2E2C',
                lineHeight: '100%',
                letterSpacing: '0%',
                marginTop: '4px'
              }}
            >
              (alertes négatives & alertes positives)
            </div>
          </div>
        </li>
        
        <li className="flex items-start">
          <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div className="ml-3">
            <div 
              style={{
                fontFamily: 'Poppins',
                fontSize: '16px',
                fontWeight: 400,
                color: '#2F2E2C',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              Page de suivi des alertes
            </div>
            <div 
              style={{
                fontFamily: 'Poppins',
                fontSize: '12px',
                fontWeight: 400,
                color: '#2F2E2C',
                lineHeight: '100%',
                letterSpacing: '0%',
                marginTop: '4px'
              }}
            >
              (notifications, commentaires possibles)
            </div>
          </div>
        </li>
      </ul>
      
      {/* Section Au-delà des 4 mois */}
      <div className="border-t border-gray-200 pt-6">
        <h3 
          style={{
            fontFamily: 'Poppins',
            fontSize: '12px',
            fontWeight: 700,
            color: '#2F2E2C',
            lineHeight: '100%',
            letterSpacing: '0%',
            marginBottom: '16px'
          }}
        >
          Au-delà des 4 mois :
        </h3>
        
        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span 
              className="ml-3"
              style={{
                fontFamily: 'Poppins',
                fontSize: '16px',
                fontWeight: 400,
                color: '#2F2E2C',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              Vos classes restent actives
            </span>
          </li>
          
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span 
              className="ml-3"
              style={{
                fontFamily: 'Poppins',
                fontSize: '16px',
                fontWeight: 400,
                color: '#2F2E2C',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              Les retours visibles sont limités à 5 par matière
            </span>
          </li>
        </ul>
        
        <Link href="#">
          <Button 
            variant="outline"
            className="inline-flex items-center justify-center gap-2"
            style={{
              width: '278.29px',
              height: '56px',
              backgroundColor: '#FBFBFB',
              border: '1px solid #EAEAE9',
              borderRadius: '8px',
              fontFamily: 'Poppins',
              fontSize: '16px',
              fontWeight: 400,
              color: '#2F2E2C',
              lineHeight: '100%',
              letterSpacing: '0%'
            }}
          >
            Voir les détails du plan
            <svg width="8.49" height="8.49" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M1.5 4.5h6m0 0L4.5 1.5M7.5 4.5L4.5 7.5" 
                stroke="#2F2E2C" 
                strokeWidth="1.33" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  );
}
