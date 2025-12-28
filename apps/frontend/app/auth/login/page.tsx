import { AuthForm } from '@/features/auth/components/AuthForm';

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as z from "zod"
import { AuthForm, FormField } from "@/components/auth/AuthForm"
import { useAuth } from "@/hooks/useAuth"
import { routes } from "@/config/routes"

const loginFields: FormField[] = [
  {
    name: "email",
    label: "Adresse email",
    type: "email",
    placeholder: "Entrez votre email",
    validation: z.string().email("Veuillez entrer une adresse email valide."),
  },
  {
    name: "password",
    label: "Mot de passe",
    type: "password",
    placeholder: "Entrez votre mot de passe",
    validation: z.string().min(1, "Le mot de passe est requis."),
  },
]

export default function LoginPage() {
  return <AuthForm defaultTab="login" />;
}




