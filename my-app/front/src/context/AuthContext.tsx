import { createContext, useState, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'

type AuthContextType =  {
  isLoggedIn: boolean
  isLoading: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  login: () => {},
  logout: () => {}
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // ページ読み込み時にlocalStorageを確認
  useEffect(() => {
    const token = localStorage.getItem('access-token')
    if (token && token.length > 0) {
      setIsLoggedIn(true)
    }
    setIsLoading(false)
  }, [])

    const login = () => {
      setIsLoggedIn(true)
    }

    const logout = () => {
      setIsLoggedIn(false)
      localStorage.removeItem('access-token')
      localStorage.removeItem('client')
      localStorage.removeItem('uid')
    }

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)