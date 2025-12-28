import { AuthForm } from '@/features/auth/components/AuthForm';

import { toast } from "sonner"
import * as z from "zod"
import { AuthForm, FormField } from "@/components/auth/AuthForm"
import { routes } from "@/config/routes"

const adminSignupFields: FormField[] = [
  {
    name: "establishmentName",
    label: "Nom de l'établissement",
    type: "text",
    placeholder: "Entrez le nom de l'établissement",
    validation: z.string().min(2, "Le nom de l'établissement doit contenir au moins 2 caractères."),
  },
  {
    name: "email",
    label: "Adresse email",
    type: "email",
    placeholder: "Entrez votre email",
    validation: z.string().email("Veuillez entrer une adresse email valide."),
  },
  {
    name: "lastName",
    label: "Nom",
    type: "text",
    placeholder: "Entrez votre nom",
    validation: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  },
  {
    name: "firstName",
    label: "Prénom",
    type: "text",
    placeholder: "Entrez votre prénom",
    validation: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
  },
  {
    name: "password",
    label: "Mot de passe",
    type: "password",
    placeholder: "Entrez votre mot de passe",
    validation: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  },
]

export default function RegisterPage() {
  return <AuthForm defaultTab="register" />;
}




