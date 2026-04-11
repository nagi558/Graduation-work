import { createContext } from "react"

export type ApiError = {
  message: string
  status?: number
} | null

export type ErrorContextType = {
  error: ApiError
  setError: (error: ApiError) => void
}

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined)