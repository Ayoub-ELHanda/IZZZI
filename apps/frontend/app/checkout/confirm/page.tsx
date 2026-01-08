'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api/client';
import { SubscriptionDetailsCard } from '@/features/checkout/components/SubscriptionDetailsCard';
import { ActionsCard } from '@/features/checkout/components/ActionsCard';

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loadUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  
  const success = searchParams.get('success') === 'true';
  const sessionId = searchParams.get('session_id');
  // Récupérer depuis l'URL si disponible, sinon sera mis à jour depuis la session Stripe
  const [classCount, setClassCount] = useState(parseInt(searchParams.get('classes') || '0'));
  const [period, setPeriod] = useState(searchParams.get('period') || 'monthly');
  const paymentMethod = searchParams.get('paymentMethod') || '**** **** **** 1234 (Visa)';
  
  useEffect(() => {
    if (!success) {
      router.push('/pricing');
      return;
    }

    const verifyAndUpdateUser = async () => {
      try {
   
        if (sessionId) {
          const response = await apiClient.post<any>('/payment/verify-session', { sessionId });
          // Récupérer le montant et les autres infos depuis la réponse
          console.log('Payment verification response:', response);
          if (response?.amount !== null && response?.amount !== undefined) {
            setPaymentAmount(response.amount);
          } else if (response?.totalAmount !== null && response?.totalAmount !== undefined) {
            setPaymentAmount(response.totalAmount);
          }
          
          // Mettre à jour classCount et period depuis la session si disponibles
          if (response?.classCount) {
            setClassCount(response.classCount);
          }
          if (response?.isAnnual !== undefined) {
            setPeriod(response.isAnnual ? 'annual' : 'monthly');
          }
        }

        await loadUser();
        setIsRefreshing(false);
      } catch (error: any) {
        console.error('Error verifying session:', error?.message || error);
        
 
        let attempts = 0;
        const maxAttempts = 5;
        const interval = setInterval(async () => {
          attempts++;
          await loadUser();
          
          if (attempts >= maxAttempts) {
            clearInterval(interval);
            setIsRefreshing(false);
          }
        }, 2000);

        setTimeout(() => {
          clearInterval(interval);
          setIsRefreshing(false);
        }, 10000);
      }
    };

    verifyAndUpdateUser();
  }, [success, sessionId, router, loadUser]);

  if (!success) {
    return null;
  }

  // Calculer le montant avec useMemo pour qu'il se mette à jour quand les données changent
  const { finalAmount, planName, formattedNextPayment } = useMemo(() => {
    const isAnnual = period === 'annual';
    
    // Si on a le montant depuis Stripe, l'utiliser directement (priorité absolue)
    if (paymentAmount !== null && paymentAmount !== undefined && paymentAmount > 0) {
      const nextPaymentDate = new Date();
      if (isAnnual) {
        nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
      } else {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      }
      
      console.log('Using paymentAmount from Stripe:', paymentAmount);
      
      return {
        finalAmount: paymentAmount,
        planName: `Super Izzzi – Paiement ${isAnnual ? 'annuel' : 'mensuel'}`,
        formattedNextPayment: nextPaymentDate.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      };
    }
    
    // Sinon, calculer à partir de classCount et period seulement si on a des valeurs valides
    if (classCount > 0) {
      // Prix mensuel par palier (doit correspondre au backend et checkout)
      let monthlyPrice: number;
      if (classCount >= 1 && classCount <= 5) {
        monthlyPrice = 19;
      } else if (classCount >= 6 && classCount <= 10) {
        monthlyPrice = 17;
      } else if (classCount >= 11 && classCount <= 15) {
        monthlyPrice = 15;
      } else if (classCount >= 16 && classCount <= 20) {
        monthlyPrice = 13;
      } else {
        monthlyPrice = 13;
      }
      
      // Calculer le prix total selon la période (doit correspondre au backend et checkout)
      let totalAmount: number;
      if (isAnnual) {
        // Prix annuel avec réduction de 30% : (prix mensuel * 12) * 0.7
        const annualPrice = monthlyPrice * 12;
        totalAmount = Math.round(annualPrice * 0.7);
      } else {
        totalAmount = monthlyPrice;
      }
      
      const nextPaymentDate = new Date();
      if (isAnnual) {
        nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
      } else {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      }
      
      // Debug: afficher les valeurs pour comprendre le problème
      console.log('Calculating amount from classCount:', {
        classCount,
        period,
        isAnnual,
        monthlyPrice,
        totalAmount,
        paymentAmount,
        sessionId
      });
      
      return {
        finalAmount: totalAmount,
        planName: `Super Izzzi – Paiement ${isAnnual ? 'annuel' : 'mensuel'}`,
        formattedNextPayment: nextPaymentDate.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      };
    }
    
    // Valeur par défaut si aucune donnée n'est disponible
    const nextPaymentDate = new Date();
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    
    return {
      finalAmount: 0, // Sera mis à jour quand les données arriveront
      planName: 'Super Izzzi – Paiement mensuel',
      formattedNextPayment: nextPaymentDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };
  }, [paymentAmount, classCount, period, sessionId]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] px-4 md:px-6" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
      <div className="max-w-[1200px] w-full mx-auto">
    
        <div className="text-center mb-8 md:mb-12">
          <h1 className="font-mochiy text-[24px] md:text-[32px] font-normal text-[#2F2E2C] mb-2 md:mb-3">
            Paiement confirmé !
          </h1>
          <p className="font-poppins text-sm md:text-base text-[#6B6B6B] leading-relaxed px-2">
            Vous êtes passé au plan Super Izzzi.
            <br />
            Merci pour votre confiance.
          </p>
        </div>

     
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          <SubscriptionDetailsCard
            plan={planName}
            amount={finalAmount}
            paymentMethod={paymentMethod}
            nextPaymentDate={formattedNextPayment}
          />
          
          <ActionsCard />
        </div>

        
        <div 
          className="text-center font-poppins px-4"
          style={{
            fontSize: '14px',
            color: '#2F2E2C',
            lineHeight: '150%'
          }}
        >
          <span style={{ fontWeight: 700 }}>Besoin d'aide ?</span>{' '}
          <span style={{ fontWeight: 400 }}>
            Notre support est à votre disposition à l'adresse{' '}
          </span>
          <a 
            href="mailto:support@izzzi.app" 
            style={{
              fontWeight: 400,
              color: '#2F2E2C',
              textDecoration: 'underline'
            }}
          >
            support@izzzi.app
          </a>
        </div>
      </div>
    </div>
  );
}
