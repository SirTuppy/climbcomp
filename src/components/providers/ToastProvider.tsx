'use client'; // This is a magic comment that tells Vercel to use the `@supabase/ssr` package

import { Toaster } from "../ui/toaster"

interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}