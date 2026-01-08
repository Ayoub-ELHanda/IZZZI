'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { authService } = await import('@/services/auth/auth.service');
      await authService.forgotPassword(email);
      setIsEmailSent(true);
    } catch (error: any) {
      alert(error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] py-12 px-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo-izzzi.svg"
              alt="izzzi logo"
              width={86}
              height={41}
              className="h-auto w-auto"
            />
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Email de réinitialisation envoyé !
              </h2>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  Vérifiez votre boîte de réception (et votre dossier spam au cas où) ! Nous vous
                  avons envoyé un email avec un lien pour réinitialiser votre mot de passe.
                </p>
                <p>
                  Si vous ne recevez rien, essayez à nouveau ou contactez notre support. 🤗
                </p>
              </div>
            </div>

            <a
              href="/auth/login"
              className="w-full h-12 bg-[#FFD93D] hover:bg-[#FFC93D] text-gray-900 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Retour à la connexion
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] py-12 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo-izzzi.svg"
            alt="izzzi logo"
            width={86}
            height={41}
            className="h-auto w-auto"
          />
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe oublié</h2>
          <p className="text-sm text-gray-600 mb-6">Saisissez votre adresse email</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Adresse email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Entrez votre mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full h-12 px-4 bg-gray-50 border-0 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#FFD93D] hover:bg-[#FFC93D] text-gray-900 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Réinitialiser mon mot de passe
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}