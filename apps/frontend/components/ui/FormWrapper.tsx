"use client"

import * as React from "react"

interface FormWrapperProps {
  children: React.ReactNode
  width?: string | number
  height?: string | number
  padding?: string
  showCard?: boolean
  className?: string
  onSubmit?: (e: React.FormEvent) => void
}

export function FormWrapper({
  children,
  width = "438px",
  height,
  padding = "60px 48px",
  showCard = true,
  className = "",
  onSubmit,
}: FormWrapperProps) {
  const cardStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    ...(height && { height: typeof height === "number" ? `${height}px` : height }),
    padding,
  }

  if (!showCard) {
    return (
      <div className={className} style={cardStyle}>
        {onSubmit ? (
          <form onSubmit={onSubmit} className="h-full">
            {children}
          </form>
        ) : (
          children
        )}
      </div>
    )
  }

  return (
    <div 
      className={`w-full rounded-lg bg-white shadow-sm ${className}`}
      style={cardStyle}
    >
      {onSubmit ? (
        <form onSubmit={onSubmit} className="h-full">
          {children}
        </form>
      ) : (
        children
      )}
    </div>
  )
}
