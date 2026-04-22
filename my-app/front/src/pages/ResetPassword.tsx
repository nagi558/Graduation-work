import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import { Spinner } from '@/components/Spinner'

type TokenStatus = 'valid' | 'expired' | 'checking'

export const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>('checking')
  const navigate = useNavigate()

  const token       = searchParams.get('reset_password_token')
  const accessToken = searchParams.get('access-token')
  const client      = searchParams.get('client')
  const uid         = searchParams.get('uid')

  useEffect(() => {
    if (!token && !accessToken) {
      setTokenStatus('expired')
    } else {
      setTokenStatus('valid')
    }
  }, [token, accessToken])

  const validate = (): boolean => {
    if (!password) {
      setError('パスワードを入力してください')
      return false
    }
    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください')
      return false
    }
    if (password !== passwordConfirmation) {
      setError('パスワードが一致しません')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validate()) return

    try {
      setIsSubmitting(true)
      await axiosInstance.put('/auth/password', {
        password,
        password_confirmation: passwordConfirmation,
        reset_password_token: token,
      }, {
        headers: accessToken ? {
          'access-token': accessToken,
          'client': client,
          'uid': uid,
        } : {}
      })
      navigate('/reset-password/complete')
    } catch (err: any) {
      const status = err.response?.status
      if (status === 401 || status === 422) {
        setTokenStatus('expired')
      } else {
        setError('パスワードの再設定に失敗しました。しばらくしてお試しください。')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (tokenStatus === 'checking') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[#E8EEF1]'>
        <Spinner size="md" />
      </div>
    )
  }

  if (tokenStatus === 'expired') {
    return (
      <div className='min-h-screen flex flex-col items-center pt-8 bg-[#E8EEF1]'>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-10 text-center">
          <div className="text-5xl mb-6">⚠️</div>
          <h1 className="text-[24px] font-bold text-[#444444] mb-4">
            リンクの有効期限が切れています
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            再設定リンクの有効期限（6時間）が切れているか、<br />
            すでに使用されています。再度お手続きください。
          </p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full bg-[#4f8196] hover:bg-[#80949e] text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-200"
          >
            再設定メールを再送する
          </button>
          <p className="mt-4 text-sm">
            <span
              onClick={() => navigate('/login')}
              className="text-gray-400 underline cursor-pointer hover:text-[#4f8196]"
            >
              ログイン画面へ戻る
            </span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col items-center pt-8 bg-[#E8EEF1]'>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-10">
        <h1 className="text-[32px] font-bold text-[#444444] text-center mb-8 font-sans pt-7">
          新しいパスワードの設定
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 text-left">
              新しいパスワード
            </label>
            <input
              id="password"
              type="password"
              placeholder="8文字以上"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6]"
            />
          </div>

          <div>
            <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700 mb-1 text-left">
              新しいパスワード（確認）
            </label>
            <input
              id="passwordConfirmation"
              type="password"
              placeholder="******"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#4f8196] hover:bg-[#80949e] disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-200 mt-2"
          >
            {isSubmitting ? <Spinner size="sm" /> : 'パスワードを更新する'}
          </button>
        </form>
      </div>
    </div>
  )
}