import { createContext, useState, useContext, useEffect } from "react"
import type { ReactNode } from "react"
import { pairApi } from "@/lib/pairApi"
import axios from "axios"
import axiosInstance from "@/lib/axios"

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
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("access-token")
    return !!(token && token.length > 0)
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [isPaired, setIsPaired] = useState(false)
  const [hasSeenGuide, setHasSeenGuide] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false)
      setIsReady(false)
      return
    }
    const controller = new AbortController()
const fetchUserData = async () => {
  try {
    const [pairRes, userRes] = await Promise.all([
      pairApi.getStatus({ signal: controller.signal }),
      axiosInstance.get("/api/v1/user", { signal: controller.signal }),
    ])
    setIsPaired(pairRes.data.paired)
    setHasSeenGuide(userRes.data.has_seen_guide)
    setIsLoading(false)
    setIsReady(true)
  } catch (e) {
    if (axios.isCancel(e)) return
    console.error(e)
    setIsLoading(false)
    setIsReady(true)
  }
}
    fetchUserData()
    return () => controller.abort()
  }, [isLoggedIn])

  const login = () => {
    setIsLoggedIn(true)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setIsReady(false)
    setIsPaired(false)
    localStorage.removeItem("access-token")
    localStorage.removeItem("client")
    localStorage.removeItem("uid")
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