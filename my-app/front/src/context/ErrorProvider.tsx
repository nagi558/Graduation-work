import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { ErrorContext } from "@/context/ErrorContext"
import type { ApiError } from "@/context/ErrorContext"

export const ErrorProvider = ({ children }: {children: ReactNode }) => {
  const [error, setError] = useState<ApiError>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<ApiError>
      if (!customEvent.detail) return

      setError(customEvent.detail)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }

    window.addEventListener("api:error", handler)
    return () => window.removeEventListener("api:error", handler)
  }, [])

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  )
}