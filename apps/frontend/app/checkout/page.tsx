'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { CheckoutForm } from '@/features/checkout/components/CheckoutForm';
import { OrderSummary } from '@/features/checkout/components/OrderSummary';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const classCount = parseInt(searchParams.get('classes') || '7');
  const isAnnual = searchParams.get('period') === 'annual';
  
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
  
 
  const annualPricePerClass = Math.round(monthlyPricePerClass * 0.7);
  const pricePerClass = isAnnual ? annualPricePerClass : monthlyPricePerClass;
  
  const [isProcessing, setIsProcessing] = useState(false);

 
  if (!isAuthenticated) {
    router.push('/auth/login?redirect=/checkout');
    return null;
  }

  const handleSubmit = async (formData: any) => {
    setIsProcessing(true);
    
    try {
    
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        alert('Vous devez être connecté pour effectuer un paiement.');
        router.push('/auth/login');
        return;
      }

      const response = await fetch('http://localhost:4000/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          classCount,
          isAnnual
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la session de paiement');
      }

      const { url } = await response.json();
    
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error: any) {
      console.error('Erreur de paiement:', error);
      alert(error.message || 'Une erreur est survenue lors du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-10 pb-20">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header avec bouton retour */}
        <div className="mb-10">
          <Link 
            href="/pricing"
            className="inline-flex items-center gap-2 font-poppins text-sm text-[#2F2E2C] no-underline transition-opacity hover:opacity-70"
          >
            <ArrowLeft size={20} />
            Retour
          </Link>
        </div>

        {/* Titre principal */}
        <div className="text-center mb-12">
          <h1 className="font-mochiy text-[32px] font-normal text-[#2F2E2C] mb-2">
            Confirmez votre abonnement
          </h1>
          <p className="font-poppins text-base text-[#6B6B6B]">
            Vérifiez les détails de votre commande avant de procéder au paiement
          </p>
        </div>

        {/* Layout à 2 colonnes */}
        <div className="grid grid-cols-[1fr_400px] gap-12 items-start">
          {/* Colonne gauche : Formulaire */}
          <div className="bg-white rounded-lg p-10 shadow-sm">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-20 gap-6">
                <div className="w-12 h-12 border-4 border-[#E0E0E0] border-t-[#F69D04] rounded-full animate-spin"></div>
                <p className="font-poppins text-base text-[#6B6B6B]">
                  Traitement du paiement en cours...
                </p>
              </div>
            ) : (
              <CheckoutForm
                classCount={classCount}
                isAnnual={isAnnual}
                pricePerClass={pricePerClass}
                onSubmit={handleSubmit}
              />
            )}
          </div>

          {/* Colonne droite : Résumé */}
          <OrderSummary
            classCount={classCount}
            isAnnual={isAnnual}
            pricePerClass={pricePerClass}
          />
        </div>
      </div>
    </div>
  );
}
