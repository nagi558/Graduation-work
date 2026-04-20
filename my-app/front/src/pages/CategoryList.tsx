import { useEffect, useState } from 'react'
import type { Category } from '@/types'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'

export const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/categories')
        setCategories(response.data)
      } catch {
        setError('カテゴリの取得に失敗しました')
      }
    }
    fetchCategories()
  }, [])

  const handleClick = (categoryId: number) => {
    navigate(`/categories/${categoryId}/posts`)
  }

  return (
    <div className="min-h-screen bg-[#E8EEF1] pb-20">
      <div className="max-w-4xl mx-auto pt-1 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h1 className="text-[38px] font-bold tracking-normal text-[#444444] text-center mb-8 font-sans pt-7">
            カテゴリ一覧
          </h1>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          {categories.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <p>まだカテゴリがありません</p>
              <p className="text-sm mt-2">投稿作成時にカテゴリを追加してみましょう</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleClick(category.id)}
                  className="cursor-pointer bg-white rounded-xl shadow-md p-4 hover:bg-[#f4f8fa] transition duration-200"
                >
                  <p className="text-gray-800 font-semibold text-lg">
                    {category.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}