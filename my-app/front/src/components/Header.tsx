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
    <header className="sticky top-0 z-50 bg-white w-full px-4 py-3 flex justify-between items-center will-change-transform">
      <img
        src="/logo.png"
        alt="ロゴ"
        className="h-12 pl-10" cursor-pointer
        onClick={() => isLoggedIn ? navigate('/posts') : navigate('/')}
      />

      {/* ログイン済みの場合のみログアウトボタンを表示 */}
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="bg-[#4f8196] hover:bg-[#80949e] text-white font-bold px-3 py-2 rounded-xl shadow-lg"
        >
          ログアウト
        </button>
      )}
    </header>
  )
}