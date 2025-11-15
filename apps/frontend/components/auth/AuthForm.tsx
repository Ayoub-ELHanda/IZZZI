"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { Input } from "@/components/ui/Input"
import { PasswordInput } from "@/components/ui/PasswordInput"
import { AuthFormLayout } from "./AuthFormLayout"
import { routes } from "@/config/routes"

// Configuration d'un champ
export interface FormField {
  name: string
  label: string
  type: "text" | "email" | "password"
  placeholder: string
  validation: z.ZodTypeAny
}

// Props du composant Form réutilisable
export interface AuthFormProps {
  fields: FormField[]
  submitButtonText: string
  bottomText: string
  bottomLinkText: string
  bottomLinkHref: string
  defaultTab: "signup" | "login"
  submitButtonWidth?: string
  showForgotPassword?: boolean
  onSubmit: (data: any) => void | Promise<void>
  isLoading?: boolean
}

export function AuthForm({
  fields,
  submitButtonText,
  bottomText,
  bottomLinkText,
  bottomLinkHref,
  defaultTab,
  submitButtonWidth = "234.29px",
  showForgotPassword = false,
  onSubmit,
  isLoading = false,
}: AuthFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<"signup" | "login">(defaultTab)

  // Créer le schema dynamiquement à partir des champs
  const formSchema = z.object(
    fields.reduce((acc, field) => {
      acc[field.name] = field.validation
      return acc
    }, {} as Record<string, z.ZodTypeAny>)
  )

  // Valeurs par défaut
  const defaultValues = fields.reduce((acc, field) => {
    acc[field.name] = ""
    return acc
  }, {} as Record<string, string>)

  const form = useForm({
    resolver: zodResolver(formSchema) as any,
    defaultValues,
  })

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.handleSubmit(onSubmit)(e)
  }

  const handleTabChange = (tab: "signup" | "login") => {
    setActiveTab(tab)
    // Navigation selon le tab
    if (tab === "signup" && defaultTab === "login") {
      router.push(routes.auth.register)
    } else if (tab === "login" && defaultTab === "signup") {
      router.push(routes.auth.login)
    }
  }

  const handleBottomLinkClick = () => {
    router.push(bottomLinkHref)
  }

  return (
    <AuthFormLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onSubmit={handleFormSubmit}
      bottomText={bottomText}
      bottomLinkText={bottomLinkText}
      onBottomLinkClick={handleBottomLinkClick}
      submitButtonText={submitButtonText}
      submitButtonWidth={submitButtonWidth}
      showGoogleButton={true}
    >
      {/* Rendu dynamique des champs */}
      {fields.map((field) => (
        <Controller
          key={field.name}
          name={field.name}
          control={form.control}
          render={({ field: fieldProps, fieldState }) => {
            // Si c'est un champ password, utiliser PasswordInput
            if (field.type === "password") {
              return (
                <PasswordInput
                  {...fieldProps}
                  id={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  error={fieldState.error?.message}
                  disabled={isLoading}
                  value={fieldProps.value as string}
                />
              )
            }

            // Sinon utiliser Input classique
            return (
              <Input
                {...fieldProps}
                id={field.name}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                error={fieldState.error?.message}
                disabled={isLoading}
                className="w-[342px]"
                style={{
                  height: '49px',
                  fontFamily: 'var(--font-poppins)',
                }}
                value={fieldProps.value as string}
              />
            )
          }}
        />
      ))}

      {/* Lien "Mot de passe oublié" si nécessaire */}
      {showForgotPassword && (
        <div className="flex justify-end w-[342px]">
          <button
            type="button"
            onClick={() => router.push(routes.auth.forgotPassword)}
            className="text-[#2F2E2C] underline"
            style={{
              fontFamily: 'var(--font-poppins)',
              fontSize: '14px',
              fontWeight: 400,
            }}
            disabled={isLoading}
          >
            Mot de passe oublié ?
          </button>
        </div>
      )}
    </AuthFormLayout>
  )
}
