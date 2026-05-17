import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/Spinner'

export const Register = () => {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()

  const navigate = useNavigate()

  const validateForm = (): boolean => {
    if (!nickname || !email || !password || !password_confirmation) {
      setError('すべての項目を入力してください')
      return false
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return false
    }

    if (password !== password_confirmation) {
      setError("パスワードが一致しません")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('有効なメールアドレスを入力してください')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await axiosInstance.post('/auth', {
        nickname,
        email,
        password,
        password_confirmation
      })

      login()
      alert('アカウントが作成されました')
      navigate("/posts")

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
      setError("アカウントを作成できませんでした")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-full flex flex-col items-center py-6 bg-[#E8EEF1]'>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-10">
        <h1 className="text-[38px] font-bold tracking-normal text-[#444444] text-center mb-8 font-sans pt-7">
          新規登録
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1 text-left">
              ニックネーム
            </label>
            <input
              id="nickname"
              type="text"
              placeholder="ヤマダ"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6]"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">
              メールアドレス
            </label>
            <input
              id="email"
              type="input"
              placeholder="aaaaaa@aaa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6]"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 text-left">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              placeholder="6文字以上"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6]"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1 text-left">
              パスワード（確認）
            </label>
            <input
              id="password_confirmation"
              type="password"
              placeholder="パスワードを再入力"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6]"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#4f8196] hover:bg-[#80949e] disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-200 mt-2"
          >
            {isSubmitting ? <Spinner size="sm" /> : '登録'}
          </button>
        </form>
      </div>

      <p className="!mt-4 text-sm text-gray-500 text-center">
        既に登録済みの方は
        <span
          onClick={() => navigate('/login')}
          className="text-gray-500 underline cursor-pointer ml-1 hover:text-[#4f8196]"
        >
          こちら
        </span>
      </p>
    </div>
  )
}