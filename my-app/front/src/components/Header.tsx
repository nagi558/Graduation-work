import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import axiosInstance from '@/lib/axios'

export const Header = () => {
  const { isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axiosInstance.delete('/auth/sign_out', {
        headers: {
          'access-token': localStorage.getItem('access-token'),
          'client': localStorage.getItem('client'),
          'uid': localStorage.getItem('uid')
        }
      })
    } catch (err) {
      console.error('ログアウトエラー:', err)
    } finally {
      logout()
      navigate('/')
    }
  }
  return (
    <div className="p-3">
      <img src="/logo.png" alt="ロゴ" className="h-12 pl-10" />
    </div>
  )
}