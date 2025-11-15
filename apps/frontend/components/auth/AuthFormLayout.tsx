"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { FormWrapper } from "@/components/ui/FormWrapper"

interface AuthFormLayoutProps {
  activeTab: "signup" | "login"
  onTabChange: (tab: "signup" | "login") => void
  onSubmit: (e: React.FormEvent) => void
  bottomText: string
  bottomLinkText: string
  onBottomLinkClick: () => void
  submitButtonText: string
  submitButtonWidth?: string
  showGoogleButton?: boolean
  children: React.ReactNode
}

export function AuthFormLayout({
  activeTab,
  onTabChange,
  onSubmit,
  bottomText,
  bottomLinkText,
  onBottomLinkClick,
  submitButtonText,
  submitButtonWidth = "234.29px",
  showGoogleButton = true,
  children,
}: AuthFormLayoutProps) {
  const handleGoogleAuth = () => {
    // TODO: Implémenter la logique Google Auth
    console.log("Google authentication")
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

        {/* Utilisation de FormWrapper pour la carte blanche */}
        <FormWrapper
          width="438px"
          padding="60px 48px"
          className="max-w-[438px]"
        >
          {/* Toggle Buttons */}
          <div 
            className="mb-[60px] flex items-center justify-between rounded-lg bg-[#F4F4F4] p-2.5"
            style={{
              width: '337px',
              height: '67px',
              gap: '30px',
              padding: '10px',
            }}
          >
            <button
              type="button"
              onClick={() => onTabChange("login")}
              className={`flex items-center justify-center text-base font-normal ${
                activeTab === "login" 
                  ? "rounded-lg bg-[#2F2E2C] text-[#EAEAE9]" 
                  : "text-[#2F2E2C]"
              }`}
              style={{
                width: '151px',
                height: '47px',
                fontSize: '16px',
                fontWeight: 400,
                fontFamily: 'var(--font-poppins)',
                lineHeight: '11px',
              }}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => onTabChange("signup")}
              className={`flex items-center justify-center text-base font-normal ${
                activeTab === "signup" 
                  ? "rounded-lg bg-[#2F2E2C] text-[#EAEAE9]" 
                  : "text-[#2F2E2C]"
              }`}
              style={{
                width: '151px',
                height: '47px',
                fontSize: '16px',
                fontWeight: 400,
                fontFamily: 'var(--font-poppins)',
                lineHeight: '11px',
              }}
            >
              S'inscrire
            </button>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-[10px]">
            {/* Children - Les champs spécifiques du formulaire */}
            {children}

            {/* Bouton de soumission */}
            <div className="pt-4 flex justify-center">
              <Button
                type="submit"
                className="flex items-center justify-between"
                style={{
                  width: submitButtonWidth,
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
                <span>{submitButtonText}</span>
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

            {showGoogleButton && (
              <>
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
                    onClick={handleGoogleAuth}
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
              </>
            )}

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
                {bottomText}{' '}
                <span 
                  className="cursor-pointer underline"
                  onClick={onBottomLinkClick}
                  style={{
                    fontFamily: 'var(--font-poppins)',
                    fontSize: '16px',
                    fontWeight: 400,
                  }}
                >
                  {bottomLinkText}
                </span>
              </p>
            </div>
          </form>
        </FormWrapper>
        {/* Fin de la card blanche (FormWrapper) */}
      </div>
    </div>
  )
}
