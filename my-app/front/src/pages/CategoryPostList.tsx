import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import type { Post, Category } from '@/types'
import { Footer } from '@/components/Footer'

export const CategoryPostList = () => {
  const { id } = useParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        const categoryResponse = await axiosInstance.get(`/api/v1/categories/${id}`)
        setCategory(categoryResponse.data)

        const postsResponse = await axiosInstance.get(`/api/v1/categories/${id}/posts`)
        setPosts(postsResponse.data)
      } catch {
        setError('データの取得に失敗しました')
      }
    }
    fetchCategoryPosts()
  }, [id])

  return (
    <div className="min-h-screen bg-[#E8EEF1] pb-20">
      <div className="max-w-2xl mx-auto pt-4 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">

          {/* タイトル */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => navigate('/categories')}
              className="text-gray-400 hover:text-[#4f8196] transition duration-200"
            >
              ← 戻る
            </button>
            <h1 className="text-2xl font-bold text-gray-700">
              {category?.name}
            </h1>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* 投稿一覧 */}
          {posts.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <p>このカテゴリにはまだ投稿がありません</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border-b border-gray-100 last:border-none pb-4"
                >
                  <p className="text-gray-800 font-bold text-lg mb-2">
                    {post.title}
                  </p>
                  <p className="text-gray-500 text-sm text-left">
                    {post.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}