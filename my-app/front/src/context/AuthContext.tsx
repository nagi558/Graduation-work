import { createContext, useState, useContext, useEffect } from "react"
import type { ReactNode } from "react"
import { pairApi } from "@/lib/pairApi"
import axios from "axios"
import axiosInstance from "@/lib/axios"
import { tokenStorage } from "@/lib/tokenStorage"

type AuthContextType = {
  isLoggedIn: boolean
  isLoading: boolean
  isReady: boolean
  isPaired: boolean
  hasSeenGuide: boolean
  login: () => void
  logout: () => void
  updateHasSeenGuide: () => void
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  isReady: false,
  isPaired: false,
  hasSeenGuide: false,
  login: () => {},
  logout: () => {},
  updateHasSeenGuide: () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [isPaired, setIsPaired] = useState(false)
  const [hasSeenGuide, setHasSeenGuide] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    const checkAuth = async () => {
      try {
        const [pairRes, userRes] = await Promise.all([
          pairApi.getStatus({ signal: controller.signal }),
          axiosInstance.get("/api/v1/user", { signal: controller.signal }),
        ])
        if (cancelled) return
        setIsLoggedIn(true)
        setIsPaired(pairRes.data.paired)
        setHasSeenGuide(userRes.data.has_seen_guide)
      } catch (e) {
        if (cancelled) return
        if (axios.isCancel(e)) return
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
        setIsReady(true)
      }
    }

    checkAuth()
    return () => {
      cancelled = true
      controller.abort()}
  }, [])

  const login = () => {
    setIsLoggedIn(true)
    setIsReady(true)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setIsReady(false)
    setIsPaired(false)
    tokenStorage.clear()
  }

  const updateHasSeenGuide = () => {
    setHasSeenGuide(true)
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        isReady,
        isPaired,
        hasSeenGuide,
        login,
        logout,
        updateHasSeenGuide,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
