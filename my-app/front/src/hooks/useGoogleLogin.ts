import { useAuth } from "@/context/AuthContext"
import { tokenStorage } from "@/lib/tokenStorage"
import axiosInstance from "@/lib/axios"

export const useGoogleLogin = () => {
  const { login } = useAuth()

  const handleCredentialResponse = async (response: { credential: string }) => {
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
      }
    } catch (error) {
      console.error('Googleログイン失敗:', error)
    }
  }

  const initializeGoogleLogin = () => {
    window.google?.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    })
  }

  return { initializeGoogleLogin, handleCredentialResponse }
}