// Login form component
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { routes } from '@/config/routes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginForm() {
  const router = useRouter();
  const { login, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);

    try {
      await login(formData);
      router.push(routes.dashboard);
    } catch (error) {
      // Error is handled by the store
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Connexion
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />

          <Input
            type="password"
            name="password"
            label="Mot de passe"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 rounded" />
              <span className="text-gray-600">Se souvenir de moi</span>
            </label>
            <Link
              href={routes.auth.forgotPassword}
              className="text-blue-600 hover:text-blue-700"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Se connecter
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <Link href={routes.auth.register} className="text-blue-600 hover:text-blue-700 font-medium">
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}

