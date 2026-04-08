import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import { useParams } from 'react-router-dom'
import { Footer } from '@/components/Footer'

export const CategoryUpdate = () => {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {id} = useParams()

  const navigate = useNavigate()

  const validateForm = (): boolean => {
    if (name === "") {
      setError('カテゴリを入力してください')
      return false
    }

    return true
  }

  useEffect(() => {
    const fetchCategories = async () => {
      const accessToken = localStorage.getItem('access-token')
      const client = localStorage.getItem('client')
      const uid = localStorage.getItem('uid')

      const response = await axiosInstance.get(`/api/v1/categories/${id}`, {
        headers: {
          'access-token': accessToken || '',
          'client': client || '',
          'uid': uid || ''
        }
      })
      setName(response.data.name)
    }
    fetchCategories()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      await axiosInstance.patch(`/api/v1/categories/${id}`, {
        category: {
          name
        }
      }, {
        headers: {
          'access-token': localStorage.getItem('access-token') ?? '',
          'client': localStorage.getItem('client') ?? '',
          'uid': localStorage.getItem('uid') ?? ''
        }
      })

      navigate('/categories')

    } catch (err: any) {
      setError('カテゴリを編集できませんでした')
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
                カテゴリ編集
            </h1>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1 text-left">
                カテゴリ
              </label>
              <input
                type="text"
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
                {loading ? '更新中...' : '更新する'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}