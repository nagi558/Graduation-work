import { createContext, useState, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'

type AuthContextType =  {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {}
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // ページ読み込み時にlocalStorageを確認
  useEffect(() => {
    const token = localStorage.getItem('access-token')
    if (token) {
      setIsLoggedIn(true)
    }
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
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)