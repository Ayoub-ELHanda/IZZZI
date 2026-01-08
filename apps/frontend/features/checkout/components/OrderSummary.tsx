'use client';

import { Badge } from '@/components/ui/Badge';
import { useState } from 'react';

interface OrderSummaryProps {
  classCount: number;
  isAnnual: boolean;
  totalAmount: number;
}

export function OrderSummary({ classCount, isAnnual, totalAmount }: OrderSummaryProps) {
  const [acceptedCGV, setAcceptedCGV] = useState(false);
  
  // Prix mensuel par palier
  let monthlyPrice: number;
  if (classCount >= 1 && classCount <= 5) {
    monthlyPrice = 13;
  } else if (classCount >= 6 && classCount <= 10) {
    monthlyPrice = 12;
  } else if (classCount >= 11 && classCount <= 15) {
    monthlyPrice = 11;
  } else if (classCount >= 16 && classCount <= 20) {
    monthlyPrice = 9;
  } else {
    monthlyPrice = 9;
  }

  return (
    <div style={{
      width: '396px',
      minHeight: '589px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #E0E0E0',
      borderRadius: '8px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      position: 'sticky',
      top: '138px'
    }}>
     
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
 
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: !isAnnual ? '#FFF9E6' : '#F5F5F5',
          border: !isAnnual ? '2px solid #F69D04' : '1px solid #E0E0E0',
          borderRadius: '8px',
          padding: '16px',
          cursor: 'pointer'
        }}>
          <input
            type="radio"
            name="billing-period"
            checked={!isAnnual}
            readOnly
            style={{ 
              width: '18px',
              height: '18px',
              cursor: 'pointer',
              margin: 0,
              accentColor: '#F69D04'
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: 700,
              color: '#2F2E2C',
              lineHeight: '100%',
              marginBottom: '8px'
            }}>
              Payez mensuellement
            </div>
            <div style={{
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: 400,
              color: '#6B6B6B',
              lineHeight: '100%'
            }}>
              {monthlyPrice}€/mois
            </div>
          </div>
        </label>


        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: isAnnual ? '#FFF9E6' : '#F5F5F5',
          border: isAnnual ? '2px solid #F69D04' : '1px solid #E0E0E0',
          borderRadius: '8px',
          padding: '16px',
          cursor: 'pointer',
          position: 'relative'
        }}>
          <input
            type="radio"
            name="billing-period"
            checked={isAnnual}
            readOnly
            style={{ 
              width: '18px',
              height: '18px',
              cursor: 'pointer',
              margin: 0,
              accentColor: '#F69D04'
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: 700,
              color: '#2F2E2C',
              lineHeight: '100%',
              marginBottom: '8px'
            }}>
              Payez annuellement
            </div>
            <div style={{
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: 400,
              color: '#6B6B6B',
              lineHeight: '100%'
            }}>
              {totalAmount}€/ans
            </div>
          </div>
          {/* Badge -30% */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: '#F69D04',
            borderRadius: '6px',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              fontFamily: 'Poppins',
              fontSize: '12px',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: '100%'
            }}>
              -30%
            </span>
          </div>
        </label>
      </div>

      {/* Séparateur */}
      <div style={{
        width: '100%',
        height: '1px',
        backgroundColor: '#E0E0E0'
      }} />

      {/* Total */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{
          fontFamily: 'Poppins',
          fontSize: '16px',
          fontWeight: 700,
          color: '#2F2E2C',
          lineHeight: '100%'
        }}>
          Total
        </span>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '4px'
        }}>
          {isAnnual && (
            <span style={{
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: 400,
              color: '#9CA3AF',
              textDecoration: 'line-through',
              lineHeight: '100%'
            }}>
              {monthlyPrice * 12}€/an
            </span>
          )}
          <div style={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            color: '#2F2E2C',
            lineHeight: '100%'
          }}>
            {isAnnual ? `${totalAmount}€/an TTC` : `${totalAmount}€/mois TTC`}
          </div>
        </div>
      </div>

      {/* Checkbox CGV */}
      <label style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        cursor: 'pointer'
      }}>
        <input
          type="checkbox"
          checked={acceptedCGV}
          onChange={(e) => setAcceptedCGV(e.target.checked)}
          style={{ 
            width: '16px',
            height: '16px',
            cursor: 'pointer',
            marginTop: '2px'
          }}
        />
        <span style={{
          fontFamily: 'Poppins',
          fontSize: '12px',
          fontWeight: 400,
          color: '#6B6B6B',
          lineHeight: '140%'
        }}>
          J'accepte les <a href="/legal/cgv" style={{ color: '#2F2E2C', textDecoration: 'underline' }}>Conditions Générales de Vente<br />(CGV)</a>
        </span>
      </label>

      {/* Bouton de paiement */}
      <button
        type="submit"
        form="checkout-form"
        disabled={!acceptedCGV}
        style={{
          width: '100%',
          height: '51px',
          backgroundColor: acceptedCGV ? '#FFE552' : '#E0E0E0',
          color: acceptedCGV ? '#2F2E2C' : '#9CA3AF',
          fontFamily: 'Poppins',
          fontSize: '14px',
          fontWeight: 700,
          cursor: acceptedCGV ? 'pointer' : 'not-allowed',
          border: 'none',
          borderRadius: '8px',
          lineHeight: '100%'
        }}
      >
        {isAnnual 
          ? `Valider et payer ${totalAmount}€/an`
          : `Valider et payer ${totalAmount}€/mois`
        }
      </button>

      {/* Message sécurité */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span style={{
          fontFamily: 'Poppins',
          fontSize: '12px',
          fontWeight: 400,
          color: '#6B6B6B',
          lineHeight: '100%'
        }}>
          Paiement sécurisé via Stripe
        </span>
      </div>

      {/* Textes légaux */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <p style={{
          fontFamily: 'Poppins',
          fontSize: '10px',
          fontWeight: 400,
          color: '#9CA3AF',
          lineHeight: '140%',
          margin: 0
        }}>
          En souscrivant à ce plan, vous renoncez expressément à votre droit de rétractation conformément à l'article L221-28 du Code de la consommation.
        </p>
        <p style={{
          fontFamily: 'Poppins',
          fontSize: '10px',
          fontWeight: 400,
          color: '#9CA3AF',
          lineHeight: '140%',
          margin: 0
        }}>
          L'abonnement sera automatiquement renouvelé chaque année/mois, sauf résiliation avant la date de renouvellement.
        </p>
      </div>
    </div>
  );
}