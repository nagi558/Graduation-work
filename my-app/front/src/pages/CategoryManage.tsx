import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import type { Category } from '@/types'
import { Footer } from '@/components/Footer'
import { Spinner } from '@/components/Spinner'

export const CategoryManage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)

  const [isFetching, setIsFetching] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/categories')
        setCategories(response.data)
      } catch {
        setError('カテゴリの取得に失敗しました')
      } finally {
        setIsFetching(false)
      }
    }
    fetchCategories()
  }, [])

  const handleDelete = async (categoryId: number) => {
    if (!confirm('削除しますか？')) return

    setDeletingId(categoryId)

    try {
      await axiosInstance.delete(`/api/v1/categories/${categoryId}`, {
        skipGlobalError: true
      })

      setCategories((prev) =>
        prev.filter((category) => category.id !== categoryId)
      )
    } catch {
      setError('削除できませんでした')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setDeletingId(null)
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#E8EEF1]">
        <Spinner size='lg' />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E8EEF1] pb-20">

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto pt-1 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">

          {/* タイトルと新規作成ボタン */}
          <div className="flex justify-between items-center mb-3">
            <h1 className="!text-[38px] !font-bold !tracking-normal !text-[#444444] text-center mb-8 !font-sans">
              カテゴリ管理
            </h1>
            <button
              onClick={() => navigate('/categories/new')}
              className="bg-[#4f8196] hover:bg-[#80949e] text-white text-sm font-bold py-2 px-4 rounded-xl shadow transition duration-200"
            >
              新規作成
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* カテゴリ一覧 */}
          {categories.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <p>まだカテゴリがありません</p>
              <p className="text-sm mt-2">新規カテゴリを作成してみましょう</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-2xl shadow-lg p-5 flex justify-between items-star"
                >
                  <div className="flex-1">
                    <div className="text-gray-800 font-bold text-lg text-left">
                      {category.name}
                    </div>
                  </div>

                  {/* 修正・削除ボタン */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => navigate(`/categories/${category.id}/edit`)}
                      className="text-sm text-[#4f8196] border border-[#4f8196] px-3 py-1 rounded-lg hover:bg-[#4f8196] hover:text-white transition duration-200"
                      disabled={deletingId === category.id}
                    >
                      修正
                    </button>

                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-sm text-red-400 border border-red-400 px-3 py-1 rounded-lg hover:bg-red-400 hover:text-white transition duration-200"
                      disabled={deletingId === category.id}
                    >
                      {deletingId === category.id ? (
                        <Spinner size='sm' />
                      ) : (
                        '削除'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* フッターナビゲーション */}
      <Footer />
    </div>
  )
}