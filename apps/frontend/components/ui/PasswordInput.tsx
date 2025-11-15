"use client"

import * as React from "react"
import { Input } from "./Input"

interface PasswordInputProps {
  label?: string
  id: string
  placeholder?: string
  error?: string
  disabled?: boolean
  className?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  name?: string
}

export function PasswordInput({
  label = "Mot de passe",
  id,
  placeholder = "Entrez votre mot de passe",
  error,
  disabled,
  className = "w-[342px]",
  ...field
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className={`relative ${className}`}>
      <Input
        {...field}
        label={label}
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        error={error}
        disabled={disabled}
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
        disabled={disabled}
        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
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
  )
}
