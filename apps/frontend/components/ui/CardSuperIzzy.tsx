import { Badge } from './Badge';
import { Button } from './Button';
import Link from 'next/link';
import { routes } from '@/config/routes';

export function CardSuperIzzy() {
  return (
    <div 
      style={{
        width: '521px',
        minHeight: '972px',
        backgroundColor: '#F69D04',
        border: '1px solid rgba(244, 244, 244, 0.05)',
        borderRadius: '8px',
        padding: '60px 73px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        position: 'relative',
        boxSizing: 'border-box',
        color: 'white'
      }}
    >
      {/* Badge Super Izzzi en haut */}
      <div style={{ marginBottom: '24px' }}>
        <Badge variant="yellow">Super Izzzi</Badge>
      </div>
      
      {/* Section estimation du prix */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: 500, 
          marginBottom: '16px',
          lineHeight: '1.5'
        }}>
          Estimez le prix de votre abonnement
        </h3>
        
        {/* Slider de classe - simulation visuelle */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '14px',
            marginBottom: '8px'
          }}>
            <span>7 classes</span>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '33.33%',
                height: '100%',
                backgroundColor: 'white',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translate(50%, -50%)',
                  width: '16px',
                  height: '16px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  border: '2px solid #F69D04'
                }}></div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              marginTop: '4px',
              opacity: 0.75
            }}>
              <span>1</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>+20</span>
            </div>
          </div>
        </div>
        
        {/* Prix calculé */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'baseline',
            gap: '8px'
          }}>
            <span style={{
              fontSize: '48px',
              fontWeight: 700,
              lineHeight: 1
            }}>17€</span>
            <span style={{
              fontSize: '16px',
              opacity: 0.9
            }}>par mois / par classe</span>
          </div>
        </div>
      </div>
      
      {/* Bouton principal */}
      <div style={{ marginBottom: '32px' }}>
        <Link href={routes.auth.register} style={{ textDecoration: 'none' }}>
          <Button 
            style={{
              width: '100%',
              backgroundColor: '#FFE552',
              color: '#2F2E2C',
              border: 'none',
              borderRadius: '8px',
              padding: '16px 24px',
              fontSize: '16px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s'
            }}
          >
            Je choisis ce plan
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </Link>
      </div>
      
      {/* Section "Tout ce qu'il y a dans le plan gratuit, et en plus:" */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 500,
          marginBottom: '16px',
          lineHeight: '1.5'
        }}>
          Tout ce qu'il y a dans le plan gratuit,<br/>
          et en plus:
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
            }
          ].map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginTop: '2px' }}>
                <path d="M20 6L9 17L4 12" stroke="#FFE552" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontFamily: 'Poppins',
                  fontSize: '16px',
                  color: 'white',
                  lineHeight: '150%',
                  fontWeight: item.subtext ? 600 : 400
                }}>
                  {item.text}
                </span>
                {item.subtext && (
                  <span style={{
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '150%',
                    marginTop: '2px'
                  }}>
                    {item.subtext}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
