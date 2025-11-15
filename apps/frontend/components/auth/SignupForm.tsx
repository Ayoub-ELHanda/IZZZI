"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

const formSchema = z.object({
  establishmentName: z
    .string()
    .min(2, "Le nom de l'établissement doit contenir au moins 2 caractères."),
  email: z
    .string()
    .email("Veuillez entrer une adresse email valide."),
  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères."),
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
})

export function SignupForm() {
  const [activeTab, setActiveTab] = React.useState<"signup" | "login">("signup")
  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      establishmentName: "",
      email: "",
      lastName: "",
      firstName: "",
      password: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("Inscription réussie!", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
    })
  }

  const handleGoogleSignup = () => {
    toast("Connexion avec Google en cours...", {
      position: "bottom-right",
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F4F4] p-4">
      <div className="flex flex-col items-center">
        {/* Logo IZZZI - À l'extérieur de la carte */}
        <div className="mb-6 flex justify-center">
          <img 
            src="/Logo.svg" 
            alt="IZZZI"
            width={130}
            height={62}
            style={{
              width: '130px',
              height: '62px',
            }}
          />
        </div>

        {/* Card blanche contenant le formulaire */}
        <div 
          className="w-full max-w-[438px] rounded-lg bg-white p-8 shadow-sm"
          style={{
            width: '438px',
            padding: '60px 48px',
          }}
        >

        {/* Toggle Buttons */}
        <div 
          className="mb-[60px] flex items-center justify-between rounded-lg bg-[#F4F4F4] p-2.5 pl-10"
          style={{
            width: '337px',
            height: '67px',
            gap: '30px',
            paddingTop: '10px',
            paddingRight: '10px',
            paddingBottom: '10px',
            paddingLeft: '40px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className="flex items-center text-base font-normal text-[#2F2E2C]"
            style={{
              fontSize: '16px',
              fontWeight: 400,
              fontFamily: 'var(--font-poppins)',
            }}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("signup")}
            className="rounded-lg bg-[#2F2E2C] text-[#EAEAE9]"
            style={{
              width: '151px',
              height: '47px',
              padding: '18px 40px',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-poppins)',
            }}
          >
            S'inscrire
          </button>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[10px]">
          {/* Nom de l'établissement */}
          <Controller
            name="establishmentName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Nom de l'établissement"
                id="establishmentName"
                type="text"
                placeholder="Entrez le nom de l'établissement"
                error={fieldState.error?.message}
                className="w-[342px]"
                style={{
                  height: '49px',
                  fontFamily: 'var(--font-poppins)',
                }}
              />
            )}
          />

          {/* Adresse email */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Adresse email"
                id="email"
                type="email"
                placeholder="Entrez votre email"
                error={fieldState.error?.message}
                className="w-[342px]"
                style={{
                  height: '49px',
                  fontFamily: 'var(--font-poppins)',
                }}
              />
            )}
          />

          {/* Nom */}
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Nom"
                id="lastName"
                type="text"
                placeholder="Entrez votre nom"
                error={fieldState.error?.message}
                className="w-[342px]"
                style={{
                  height: '49px',
                  fontFamily: 'var(--font-poppins)',
                }}
              />
            )}
          />

          {/* Prénom */}
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Prénom"
                id="firstName"
                type="text"
                placeholder="Entrez votre prénom"
                error={fieldState.error?.message}
                className="w-[342px]"
                style={{
                  height: '49px',
                  fontFamily: 'var(--font-poppins)',
                }}
              />
            )}
          />

          {/* Mot de passe */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="relative w-[342px]">
                <Input
                  {...field}
                  label="Mot de passe"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  error={fieldState.error?.message}
                  className="w-full pr-12"
                  style={{
                    height: '49px',
                    fontFamily: 'var(--font-poppins)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px]"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z" stroke="#666" strokeWidth="1.5"/>
                      <path d="M2 10C2 10 4.5 4 10 4C15.5 4 18 10 18 10C18 10 15.5 16 10 16C4.5 16 2 10 2 10Z" stroke="#666" strokeWidth="1.5"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3L17 17M10 7C11.6569 7 13 8.34315 13 10C13 10.3453 12.9417 10.6804 12.8321 10.9918M7 10C7 11.6569 8.34315 13 10 13C10.3453 13 10.6804 12.9417 10.9918 12.8321M7.36176 7.36176C6.52556 8.19796 6 9.33726 6 10.5858C6 13.3473 8.23858 15.5858 11 15.5858C12.2485 15.5858 13.388 15.0603 14.2242 14.2242M2 10C2 10 4.5 4 10 4C11.7625 4 13.2833 4.6625 14.5 5.5M18 10C18 10 15.5 16 10 16C9.25 16 8.54167 15.875 7.875 15.6667" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
              </div>
            )}
          />

          {/* Créer un compte button */}
          <div className="pt-4 flex justify-center">
            <Button
              type="submit"
              className="flex items-center justify-between"
              style={{
                width: '234.29px',
                height: '56px',
                padding: '20px 26px',
                borderRadius: '8px',
                backgroundColor: '#FFE552',
                color: '#2F2E2C',
                fontFamily: 'var(--font-poppins)',
                fontSize: '16px',
                fontWeight: 400,
              }}
            >
              <span>Créer un compte</span>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 9 9" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  flexShrink: 0,
                }}
              >
                <path d="M1 8L8 1M8 1H1M8 1V8" stroke="#2F2E2C" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </div>

          {/* Ou text */}
          <div className="flex justify-center pt-6 pb-4">
            <p 
              className="text-center text-[#2F2E2C]"
              style={{
                fontFamily: 'var(--font-mochiy)',
                fontSize: '18px',
                fontWeight: 400,
                lineHeight: '13px',
              }}
            >
              Ou
            </p>
          </div>

          {/* Google button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="flex items-center justify-center rounded-full border border-[#747775] bg-white transition-all hover:bg-gray-50"
              style={{
                width: '215px',
                height: '40px',
                padding: '3px',
                gap: '10px',
                borderRadius: '9999px',
              }}
            >
              <img 
                src="/google.png" 
                alt="Google"
                width={18}
                height={18}
                style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}
              />
              <span 
                className="text-[#2F2E2C]"
                style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '18px',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                Se connecter avec Google
              </span>
            </button>
          </div>

          {/* Bottom text */}
          <div className="flex justify-center pt-6">
            <p 
              className="text-center text-[#2F2E2C]"
              style={{
                width: '341px',
                height: '11px',
                fontFamily: 'var(--font-poppins)',
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '11px',
              }}
            >
              Vous avez déjà un compte ?{' '}
              <span 
                className="cursor-pointer underline"
                onClick={() => setActiveTab("login")}
                style={{
                  fontFamily: 'var(--font-poppins)',
                  fontSize: '16px',
                  fontWeight: 400,
                }}
              >
                Se connecter
              </span>
            </p>
          </div>
        </form>
      </div>
      {/* Fin de la card blanche */}
      </div>
    </div>
  )
}
