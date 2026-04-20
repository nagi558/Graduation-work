import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/Spinner'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()

  const navigate = useNavigate()

  const validateForm = (): boolean => {
    // メールアドレスの空チェック
    if (email === "") {
      setError('メールアドレスを入力してください')
      return false
    }

    // パスワードの空チェック
    if (password === "") {
      setError('パスワードを入力してください')
      return false
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('有効なメールアドレスを入力してください')
      return false
    }

    return true
  }

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // バリデーション実行
    if (!validateForm()) {
      return
    }

    try {
    // ローディングかいし
    setIsSubmitting(true)

    // APIリクエスト
    const response = await axiosInstance.post('/auth/sign_in', {
      email,
      password
    })

    // 成功時の処理
    const accessToken = response.headers['access-token'] as string ?? ''
    const client = response.headers['client'] as string ?? ''
    const uid = response.headers['uid'] as string ?? ''

    localStorage.setItem('access-token', accessToken)
    localStorage.setItem('client', client)
    localStorage.setItem('uid', uid)
    login()
    navigate("/posts")

    } catch (err: any) {
        setError("メールアドレスまたはパスワードが正しくありません")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center pt-8 bg-[#E8EEF1]'>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-10">

        {/* タイトル */}
        <h1 className="!text-[38px] !font-bold !tracking-normal !text-[#444444] text-center mb-8 !font-sans">
          ログイン
        </h1>

        {/* エラーメッセージ */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* 登録フォーム */}
        <form onSubmit={handleSubmit} className="space-y-4">

        {/* メール入力 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              placeholder="aaaaaa@aaa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6]"
            />
          </div>

          {/* パスワード入力 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 text-left">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6]"
            />
          </div>

          {/* パスワードを忘れた方 */}
          <p className="text-right mt-3 text-sm">
            <span className="text-gray-400 cursor-not-allowed">
              パスワードを忘れた方はこちら(実装予定)
            </span>
          </p>

          {/* ログイン */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#4f8196] hover:bg-[#80949e] disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-200 mt-2"
          >
            {isSubmitting ? (
              <Spinner size="sm" />
            ): (
              "ログイン"
            )}
          </button>
        </form>
      </div>

      {/* 新規登録画面へ誘導 */}
      <p className="!mt-4 text-sm text-gray-500 text-center">
        はじめての方は
        <span
          onClick={() => navigate('/register')}
          className="text-gray-500 underline cursor-pointer ml-1 hover:text-[#4f8196]"
        >
          こちら
        </span>
      </p>
    </div>
  )
}
