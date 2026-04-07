import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import { Footer } from '@/components/Footer'

export const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      const accessToken = localStorage.getItem('access-token')
      const client = localStorage.getItem('client')
      const uid = localStorage.getItem('uid')

      const response = await axiosInstance.get('/api/v1/categories', {
        headers: {
          'access-token': accessToken || '',
          'client': client || '',
          'uid': uid || ''
        }
      })
    setCategories(response.data)
    }
    fetchCategories()
  }, [])

  const handleDelete = async (categoryId: number) => {
    if (!confirm('削除しますか？')) return

    try {
      await axiosInstance.delete(`/api/v1/categories/${categoryId}`, {
        headers: {
          'access-token': localStorage.getItem('access-token') ?? '',
          'client': localStorage.getItem('client') ?? '',
          'uid': localStorage.getItem('uid') ?? ''
        }
      })
      // 削除後に一覧を更新
      setCategories(categories.filter((category) => category.id !== categoryId))
    } catch (err: any) {
      alert('削除できませんでした')
    }
  }

  return (
    <div className="min-h-screen bg-[#E8EEF1] pb-20">

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto pt-1 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">

          {/* タイトルと新規作成ボタン */}
          <div className="flex justify-between items-center mb-3">
            <h1 className="!text-[38px] !font-bold !tracking-normal !text-[#444444] text-center mb-8 !font-sans">
              カテゴリ一覧
            </h1>
            <button
              onClick={() => navigate('/categories/new')}
              className="bg-[#4f8196] hover:bg-[#80949e] text-white text-sm font-bold py-2 px-4 rounded-xl shadow transition duration-200"
            >
              新規作成
            </button>
          </div>

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
                  className="bg-white rounded-2xl shadow-lg p-5 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <p className="text-gray-800 font-bold text-lg">
                      {category.title}
                    </p>
                  </div>

                  {/* 修正・削除ボタン */}
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => navigate(`/categories/${category.id}/edit`)}
                      className="text-sm text-[#4f8196] border border-[#4f8196] px-3 py-1 rounded-lg hover:bg-[#4f8196] hover:text-white transition duration-200"
                    >
                      修正
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-sm text-red-400 border border-red-400 px-3 py-1 rounded-lg hover:bg-red-400 hover:text-white transition duration-200"
                    >
                      削除
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