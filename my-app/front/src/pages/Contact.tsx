import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "@/lib/axios"
import { Spinner } from "@/components/Spinner"

export const Contact = () => {
  const [email, setEmail] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const navigate = useNavigate()

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setError('メールアドレスを入力してください')
      return false
    }

    if (body.trim().length < 10) {
      setError('お問い合わせ内容は10文字以上で入力してください')
      return false
    }

    if (body.trim().length > 2000) {
      setError('お問い合わせ内容は2000文字以内で入力してください')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await axiosInstance.post(`/api/v1/contacts`, {
        contact: { email, body }
      }, {
        skipGlobalError: true
      })

      setIsCompleted(true)

    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join('\n'))
      } else {
        setError('送信に失敗しました。時間をおいて再度お試しください。')
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCompleted) {
    return (
      <div className="h-full bg-[#E8EEF1] flex items-start justify-center pt-20">
        <div className="w-full max-w-2xl px-4">
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center space-y-4">
            <div className="text-lg font -medium text-[#444444]">
              お問い合わせが完了しました。
            </div>
            <div className="text-sm text-gray-500">
              内容を確認の上、ご登録のメールアドレスへご連絡いたします。
            </div>
            <button
              onClick={() => navigate('/posts')}
              className="text-sm font-bold text-white bg-[#4f8196] hover:bg-[#80949e] px-7 py-2 rounded-lg shadow transition duration-200">
                伝えたいこと一覧へ
              </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E8EEF1] pb-20">
      <div className="max-w-2xl mx-auto pt-4 px-4">

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className={`bg-white rounded-2xl shadow-sm p-10 transition-opacity duration-200 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
          <form onSubmit={handleSubmit} className="space-y-4">

            <h1 className="text-[38px] font-bold tracking-normal text-[#444444] text-center mb-8 font-sans pt-7">
              お問い合わせ
            </h1>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1 text-left">
                メールアドレス
              </label>
              <input
                type="email"
                placeholder="aaaaaa@aaa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6]"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1 text-left">
                お問い合わせ内容
              </label>
              <textarea
                placeholder="お問い合わせ内容をご記入ください（10文字以上）"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6] resize-none"
                disabled={isSubmitting}
                rows={6}
              />
              <div className="text-xs text-gray-400 text-right mt-1">
                {body.length} / 2000
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-sm font-bold text-white bg-[#4f8196] hover:bg-[#80949e] disabled:bg-gray-400 px-7 py-2 rounded-lg shadow transition duration-200"
              >
                {isSubmitting ? <Spinner size="sm" /> : '送信する'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  )
}