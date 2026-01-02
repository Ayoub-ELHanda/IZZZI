'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { authService } from '@/services/auth/auth.service';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export default function BillingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push(routes.auth.login);
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto px-6 py-8">
        <Link
          href={routes.account.profile}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au profil
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Gestion de la facturation</h1>
            
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Plan actuel</h2>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Plan:</span> Gratuit
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">Statut:</span> Actif
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de paiement</h2>
                <p className="text-gray-600 mb-4">
                  Aucune méthode de paiement enregistrée
                </p>
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900">
                  Ajouter une méthode de paiement
                </Button>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Factures</h2>
                <p className="text-gray-600">
                  Aucune facture disponible
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

