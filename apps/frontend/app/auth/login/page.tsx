"use client"

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
  const router = useRouter()
  const { login, error, clearError } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(data: any) {
    clearError()
    setIsLoading(true)

    try {
      await login(data)
      toast.success("Connexion réussie!", {
        position: "bottom-right",
      })
      router.push(routes.dashboard)
    } catch (err) {
      toast.error(error || "Erreur de connexion", {
        position: "bottom-right",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthForm
      fields={loginFields}
      submitButtonText="Se connecter"
      bottomText="Pas encore de compte ?"
      bottomLinkText="Inscription"
      bottomLinkHref={routes.auth.register}
      defaultTab="login"
      submitButtonWidth="203.29px"
      showForgotPassword={true}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  )
}
