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

  // Récupérer et valider les paramètres de l'URL
  const classesParam = searchParams.get('classes');
  const periodParam = searchParams.get('period');
  
  // Valider le nombre de classes (entre 1 et 20)
  const classCount = Math.max(1, Math.min(20, parseInt(classesParam || '7') || 7));
  
  // Valider la période (annual ou monthly)
  const isAnnual = periodParam === 'annual';
  
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
  
  // Calculer le prix total selon la période
  let totalAmount: number;
  if (isAnnual) {
    const baseAnnualPrice = monthlyPrice * 12; // Ex: 9 × 12 = 108€
    totalAmount = Math.round(baseAnnualPrice * 0.7); // 108 × 0.7 = 76€
  } else {
    totalAmount = monthlyPrice; // 9€/mois
  }
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    const currentUrl = window.location.pathname + window.location.search;
    router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`);
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

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
      const response = await fetch(`${apiBaseUrl}/payment/create-checkout-session`, {
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
        let errorMessage = 'Erreur lors de la création de la session de paiement';
        
        // Gérer spécifiquement les erreurs 401 (non autorisé)
        if (response.status === 401) {
          errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
          // Rediriger vers la page de connexion
          router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
          setIsProcessing(false);
          return;
        }
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // Si la réponse n'est pas du JSON, essayer de lire le texte
          try {
            const text = await response.text();
            if (text) {
              errorMessage = text;
            } else {
              errorMessage = `Erreur ${response.status}: ${response.statusText}`;
            }
          } catch (textError) {
            errorMessage = `Erreur ${response.status}: ${response.statusText}`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
    
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error: any) {
      console.error('Erreur de paiement:', error);
      
      // Gérer les erreurs réseau différemment
      let errorMessage = 'Une erreur est survenue lors du paiement. Veuillez réessayer.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Erreur de connexion au serveur. Vérifiez que le backend est démarré.';
      }
      
      alert(errorMessage);
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

        {/* Layout à 2 colonnes - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start">
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
                totalAmount={totalAmount}
                onSubmit={handleSubmit}
              />
            )}
          </div>

          {/* Colonne droite : Résumé */}
          <OrderSummary
            classCount={classCount}
            isAnnual={isAnnual}
            totalAmount={totalAmount}
          />
        </div>
      </div>
    </div>
  );
}