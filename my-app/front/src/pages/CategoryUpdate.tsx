import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import { useParams } from 'react-router-dom'
import { Spinner } from '@/components/Spinner'

export const CategoryUpdate = () => {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [isFetching, setIsFetching] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {id} = useParams()
  const navigate = useNavigate()

  const validateForm = (): boolean => {
    if (name.trim() === "") {
      setError('カテゴリを入力してください')
      return false
    }

    return true
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/categories/${id}`)
        setName(response.data.name)
      } catch {
        setError('カテゴリの取得に失敗しました')
      } finally {
        setIsFetching(false)
      }
    }
    fetchCategories()
  }, [id])

  if (isFetching) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#E8EEF1]">
        <Spinner size='lg' />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await axiosInstance.patch(`/api/v1/categories/${id}`, {
        category: {
          name
        }
      }, {
        skipGlobalError: true
      })

      navigate('/categories/manage')

    } catch {
      setError('カテゴリを編集できませんでした')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full bg-[#E8EEF1] flex items-start justify-center pt-30">
      <div className="w-full max-w-2xl px-4">

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
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-sm font-bold text-white bg-[#4f8196] hover:bg-[#80949e] disabled:bg-gray-400 px-7 py-2 rounded-lg shadow transition duration-200"
              >
                {isSubmitting ? <Spinner size="sm" /> : '更新する'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}