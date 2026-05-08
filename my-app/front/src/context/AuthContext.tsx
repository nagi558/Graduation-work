import { createContext, useState, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { pairApi } from '@/lib/pairApi'
import axios from 'axios'

type AuthContextType =  {
  isLoggedIn: boolean
  isLoading: boolean
    isPaired: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
    isPaired: false,
  login: () => {},
  logout: () => {}
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
  const token = localStorage.getItem('access-token')
  return !!(token && token.length > 0)
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isPaired, setIsPaired] = useState(false)


  useEffect(() => {
    setIsLoading(false)
  }, [])

    useEffect(() => {
    if (!isLoggedIn) return
    const controller = new AbortController()
    const fetchPairStatus = async () => {
      try {
        const res = await pairApi.getStatus({ signal: controller.signal })
        setIsPaired(res.data.paired)
      } catch (e) {
        if (axios.isCancel(e)) return
        console.error(e)
      }
    }
    fetchPairStatus()
    return () => controller.abort()
  }, [isLoggedIn])

    const login = () => {
      setIsLoggedIn(true)
    }

    const logout = () => {
      setIsLoggedIn(false)
      setIsPaired(false)
      localStorage.removeItem('access-token')
      localStorage.removeItem('client')
      localStorage.removeItem('uid')
    }

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, isPaired, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)