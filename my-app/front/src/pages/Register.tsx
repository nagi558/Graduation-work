import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'

export const Register = () => {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const validateForm = (): boolean => {
    // 必須項目チェック
    if (!nickname || !email || !password || !password_confirmation) {
      setError('すべての項目を入力してください')
      return false
    }

    // パスワードの長さチェック
    if (password.length < 6) {
      setError('パスワードが一致しません')
      return false
    }

    // パスワードの一致確認
    if (password !== password_confirmation) {
      setError("パスワードが一致しません")
      return false
    }

    // メール形式チェック
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

    // バリデーション
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // APIリクエスト
      const response = await axiosInstance.post('/users', {
        user: {
          nickname,
          email,
          password,
          password_confirmation
        }
      })

      // 成功時の処理
      alert('アカウントが作成されました')

      // ログインページに遷移
      navigate("/login")
    } catch (err) {
      // エラー処理
      if (err instanceof Error) {
        setError(err.message)
      } else {
      setError("アカウントを作成できませんでした")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center pt-8 bg-[#E8EEF1]'>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-10">

        {/* タイトル */}
        <h1 className="!text-[38px] !font-bold !tracking-normal !text-[#444444] text-center mb-8 !font-sans">
          新規登録
        </h1>

        {/* エラーメッセージ */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* 登録フォーム */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ニックネーム入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              ニックネーム
            </label>
            <input
              type="text"
              placeholder="ヤマダ"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6]"
              disabled={loading}
            />
          </div>

          {/* メール入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              メールアドレス
            </label>
            <input
              type="input"
              placeholder="aaaaaa@aaa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6]"
              disabled={loading}
            />
          </div>

          {/* パスワード入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              パスワード
            </label>
            <input
              type="password"
              placeholder="6文字以上"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6]"
              disabled={loading}
            />
          </div>

          {/* パスワード確認入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              パスワード（確認）
            </label>
            <input
              type="password"
              placeholder="パスワードを再入力"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6]"
              disabled={loading}
            />
          </div>

          {/* 登録ボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4f8196] hover:bg-[#80949e] disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-200 mt-2"
          >
            {loading ? '登録中...' : '登録'}
          </button>
        </form>
      </div>

      {/* ログインページへのリンク */}
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