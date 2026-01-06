'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { routes } from '@/config/routes';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

interface AuthFormProps {
  defaultTab?: 'login' | 'register';
  inviteToken?: string | null;
}

function AuthFormContent({ defaultTab = 'register', inviteToken }: AuthFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form data
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form data
  const [registerData, setRegisterData] = useState({
    establishmentName: '',
    email: '',
    lastName: '',
    firstName: '',
    password: '',
  });

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { authService } = await import('@/services/auth/auth.service');
      await authService.login(loginData);
      router.push(routes.dashboard);
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { authService } = await import('@/services/auth/auth.service');
      
      let response;
      if (inviteToken) {
        // Invited user registration (Responsable Pédagogique)
        response = await authService.registerInvited({
          email: registerData.email,
          lastName: registerData.lastName,
          firstName: registerData.firstName,
          password: registerData.password,
          inviteToken: inviteToken,
        });
      } else {
        // Admin registration
        response = await authService.registerAdmin({
          establishmentName: registerData.establishmentName,
          email: registerData.email,
          lastName: registerData.lastName,
          firstName: registerData.firstName,
          password: registerData.password,
        });
      }
      
      // Show success message with role information
      const roleName = response.user.role === 'ADMIN' 
        ? 'Administrateur' 
        : response.user.role === 'RESPONSABLE_PEDAGOGIQUE'
        ? 'Responsable Pédagogique'
        : 'Visiteur';
      
      alert(`Inscription réussie !\n\nRôle: ${roleName}\nEmail: ${response.user.email}\n\nVous allez être redirigé vers votre tableau de bord.`);
      
      router.push(routes.dashboard);
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error?.message || error?.toString() || 'Une erreur est survenue lors de l\'inscription';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleAuth = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
    if (inviteToken) {
      window.location.href = `${apiUrl}/auth/google?inviteToken=${inviteToken}`;
    } else {
      window.location.href = `${apiUrl}/auth/google`;
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isInvitedRegistration = !!inviteToken;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image 
            src="/logo-izzzi.svg"
            alt="izzzi logo"
            width={86}
            height={41}
            style={{
              height: 'auto',
              width: 'auto',
              maxHeight: '41px',
            }}
            className="h-[41px] w-auto"
          />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'login'
                  ? 'text-white bg-[#2F2E2C]'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'register'
                  ? 'text-white bg-[#2F2E2C]'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              S'inscrire
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Entrez votre email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  disabled={isLoading}
                  className="w-full h-12 px-4 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Entrez votre mot de passe"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    disabled={isLoading}
                    className="w-full h-12 px-4 pr-12 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  href={routes.auth.forgotPassword}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Mot de passe oubliÃ© ?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#FFD93D] hover:bg-[#FFC93D] text-gray-900 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Establishment Name - Only for Admin */}
              {!isInvitedRegistration && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Nom de l'Ã©tablissement
                  </label>
                  <input
                    type="text"
                    name="establishmentName"
                    placeholder="Entrez le nom de l'Ã©tablissement"
                    value={registerData.establishmentName}
                    onChange={handleRegisterChange}
                    required
                    disabled={isLoading}
                    className="w-full h-12 px-4 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Entrez votre email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                  disabled={isLoading}
                  className="w-full h-12 px-4 bg-gray-50 border-0 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Entrez votre nom"
                  value={registerData.lastName}
                  onChange={handleRegisterChange}
                  required
                  disabled={isLoading}
                  className="w-full h-12 px-4 bg-gray-50 border-0 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  PrÃ©nom
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Entrez votre prÃ©nom"
                  value={registerData.firstName}
                  onChange={handleRegisterChange}
                  required
                  disabled={isLoading}
                  className="w-full h-12 px-4 bg-gray-50 border-0 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Entrez votre mot de passe"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                    disabled={isLoading}
                    className="w-full h-12 px-4 pr-12 bg-gray-50 border-0 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#FFD93D] hover:bg-[#FFC93D] text-gray-900 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    CrÃ©er un compte
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Ou</span>
            </div>
          </div>

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full h-12 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Se connecter avec Google
          </button>

          {/* Bottom Link */}
          {activeTab === 'login' && (
            <p className="mt-6 text-center text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <button
                onClick={() => setActiveTab('register')}
                className="text-gray-900 font-medium hover:underline"
              >
                Inscription
              </button>
            </p>
          )}

          {activeTab === 'register' && (
            <p className="mt-6 text-center text-sm text-gray-600">
              Vous avez dÃ©jÃ  un compte ?{' '}
              <button
                onClick={() => setActiveTab('login')}
                className="text-gray-900 font-medium hover:underline"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function AuthForm({ defaultTab = 'register' }: { defaultTab?: 'login' | 'register' }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthFormWithParams defaultTab={defaultTab} />
    </Suspense>
  );
}

function AuthFormWithParams({ defaultTab }: { defaultTab?: 'login' | 'register' }) {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('token');

  return <AuthFormContent defaultTab={defaultTab} inviteToken={inviteToken} />;
}