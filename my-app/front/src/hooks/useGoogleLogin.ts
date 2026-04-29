import { useCallback } from "react"
import { useAuth } from "@/context/AuthContext"
import { tokenStorage } from "@/lib/tokenStorage"
import axiosInstance from "@/lib/axios"
import { useNavigate } from "react-router-dom"

export const useGoogleLogin = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
    try {
      const res = await axiosInstance.post('/api/v1/auth/google', {
        id_token: response.credential
      })

      const accessToken = res.headers['access-token']
      const client      = res.headers['client']
      const uid         = res.headers['uid']

      if (accessToken && client && uid) {
        tokenStorage.set({ accessToken, client, uid })
        login()
        navigate('/posts')
      }
    } catch (error) {
      console.error('Googleログイン失敗:', error)
    }
  }, [login, navigate])

  const initializeGoogleLogin = useCallback(() => {
    window.google?.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    })
  }, [handleCredentialResponse])

  return { initializeGoogleLogin, handleCredentialResponse }
}