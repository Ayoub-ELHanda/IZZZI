import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata = {
  title: 'Connexion - IZZZI',
  description: 'Connectez-vous à votre compte IZZZI',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}




