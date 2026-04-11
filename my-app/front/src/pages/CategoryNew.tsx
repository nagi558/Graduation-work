import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import { Footer } from '@/components/Footer'

export const CategoryNew = () => {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const validateForm = (): boolean => {
    if (name.trim() === "") {
      setError('カテゴリを入力してください')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if(!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      await axiosInstance.post('/api/v1/categories', {
        category: {
          name
        }
      }, {
        skipGlobalError: true
      })

      navigate('/categories')

    } catch {
      setError('カテゴリを作成できませんでした')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E8EEF1] flex items-center">
      <div className="w-full max-w-2xl mx-auto pt-4 px-4">
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-10">
          <form onSubmit={handleSubmit} className="space-y-4">

            <h1 className="!text-[38px] !font-bold !tracking-normal !text-[#444444] text-center mb-8 !font-sans">
              新規作成
            </h1>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1 text-left">
                カテゴリ
              </label>
              <input
                type="text"
                placeholder="恋愛 など"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6]"
                disabled={loading}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="text-sm font-bold text-white bg-[#4f8196] hover:bg-[#80949e] disabled:bg-gray-400 px-7 py-2 rounded-lg shadow transition duration-200"
              >
                {loading ? '追加中...' : '追加する'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* フッターナビゲーション */}
      <Footer />
    </div>
  )
}