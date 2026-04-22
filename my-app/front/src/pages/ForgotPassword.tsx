import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import { Spinner } from '@/components/Spinner'

export const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email) {
      setError('メールアドレスを入力してください')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('有効なメールアドレスを入力してください')
      return
    }

    try {
      setIsSubmitting(true)
      await axiosInstance.post('/auth/password', {
        email,
        redirect_url: `${window.location.origin}/reset-password`
      })
      navigate('/forgot-password/sent')
    } catch (err: any) {
      const message = err.response?.data?.message
      setError(message ?? 'メールの送信に失敗しました。しばらくしてお試しください')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full bg-[#E8EEF1] flex items-start justify-center pt-20">
      <div className="w-full max-w-2xl px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-[38px] font-bold tracking-normal text-[#444444] text-center mb-8 font-sans pt-7">
              パスワード再設定
            </h1>

            <p className="text-sm text-gray-500 text-center mb-8">
              登録したメールアドレスを入力してください。 <br />
              再設定用のリンクをお送りします。
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor='email' className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  メールアドレス
                </label>
                <input
                  id='email'
                  type='email'
                  placeholder='aaaaaa@aaa.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6]'
                />
              </div>

              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-[#4f8196] hover:bg-[#80949e] disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-200 mt-2'
              >
                {isSubmitting ? <Spinner size='sm' /> : '再設定メールを送信'}
              </button>
            </form>

            <p className='mt-6 text-sm text-gray-500 text-center'>
              <span
                onClick={() => navigate('/login')}
                className='underline cursor-pointer hover:text-[#4f8196]'
              >
                ログイン画面へ戻る
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}