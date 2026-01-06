'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SubscriptionDetailsCard } from '@/features/checkout/components/SubscriptionDetailsCard';
import { ActionsCard } from '@/features/checkout/components/ActionsCard';

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loadUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(true);
  
  const success = searchParams.get('success') === 'true';
  const classCount = parseInt(searchParams.get('classes') || '0');
  const period = searchParams.get('period') || 'monthly';
  const paymentMethod = searchParams.get('paymentMethod') || '**** **** **** 1234 (Visa)';
  
  useEffect(() => {
    if (!success) {
      router.push('/pricing');
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;
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
    }, 20000);

    return () => clearInterval(interval);
  }, [success, router, loadUser]);

  if (!success) {
    return null;
  }

  
  const isAnnual = period === 'annual';
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
  
  const pricePerClass = isAnnual ? Math.round(monthlyPricePerClass * 0.7) : monthlyPricePerClass;
  const totalAmount = classCount * pricePerClass;
  
  
  const nextPaymentDate = new Date();
  if (isAnnual) {
    nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
  } else {
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  }
  
  const formattedNextPayment = nextPaymentDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });


  const planName = `Super Izzzi – Paiement ${isAnnual ? 'annuel' : 'mensuel'}`;

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-15 px-6">
      <div className="max-w-[1200px] w-full mx-auto">
    
        <div className="text-center mb-12">
          <h1 className="font-mochiy text-[32px] font-normal text-[#2F2E2C] mb-3">
            Paiement confirmé !
          </h1>
          <p className="font-poppins text-base text-[#6B6B6B] leading-relaxed">
            Vous êtes passé au plan Super Izzzi.
            <br />
            Merci pour votre confiance.
          </p>
        </div>

        {/* Deux cartes côte à côte */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <SubscriptionDetailsCard
            plan={planName}
            amount={totalAmount}
            paymentMethod={paymentMethod}
            nextPaymentDate={formattedNextPayment}
          />
          
          <ActionsCard />
        </div>

        {/* Message de support en bas */}
        <div 
          className="text-center font-poppins"
          style={{
            fontSize: '16px',
            color: '#2F2E2C',
            lineHeight: '100%'
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
