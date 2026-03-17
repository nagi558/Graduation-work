import { createContext, useState, useContext, ReactNode } from 'react'

type AuthContextType =  {
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType>({ isLoggedIn: false })

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn] = useState(false)

  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)