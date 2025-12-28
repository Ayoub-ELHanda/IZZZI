import { AuthForm } from '@/features/auth/components/AuthForm';

export const metadata = {
  title: 'Connexion - IZZZI',
  description: 'Connectez-vous à votre compte IZZZI',
};

export default function LoginPage() {
  return <AuthForm defaultTab="login" />;
}




