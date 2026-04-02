import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import type { ReactNode } from 'react'

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}