import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import type { Category } from '@/types'
import { useParams } from 'react-router-dom'

export const PostUpdate = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] =useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {id} = useParams()

  const navigate = useNavigate()

  const validateForm = (): boolean => {
    // フォームの空チェック
    if (title === "") {
      setError('タイトルを入力してください')
      return false
    }

    return true
  }

  // カテゴリ一覧を取得
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

  // 既存の投稿データをセット
  useEffect(() => {
    const fetchPost = async () => {
      const accessToken = localStorage.getItem('access-token')
      const client = localStorage.getItem('client')
      const uid = localStorage.getItem('uid')

      const response = await axiosInstance.get(`/api/v1/posts/${id}`, {
        headers: {
          'access-token': accessToken || '',
          'client': client || '',
          'uid': uid || ''
        }
      })
      // フォームに初期値をセット
      setTitle(response.data.title)
      setBody(response.data.body)
      setCategoryId(response.data.category.id)
    }
    fetchPost()
  }, [id])

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // バリデーション実行
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      //APIリクエスト
      await axiosInstance.patch(`/api/v1/posts/${id}`, {
        post: {
          title,
          body,
          category_id: categoryId
        }
      }, {
        headers: {
          'access-token': localStorage.getItem('access-token') ?? '',
          'client': localStorage.getItem('client') ?? '',
          'uid': localStorage.getItem('uid') ?? ''
        }
      })

      navigate('/posts')

    } catch (err: any) {
      setError('投稿を編集できませんでした')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E8EEF1] pb-20">
      <div className="max-w-2xl mx-auto pt-4 px-4">

        {/* エラーメッセージ */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* 白いカードで全体を覆う */}
        <div className="bg-white rounded-2xl shadow-sm p-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* タイトル */}
            <h1 className="!text-[38px] !font-bold !tracking-normal !text-[#444444] text-center mb-8 !font-sans">
              投稿編集
            </h1>

            {/* 伝えたいこと */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1 text-left">
                伝えたいこと
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6]"
                disabled={loading}
              />
            </div>

            {/* カテゴリの選択 */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1 text-left">
                カテゴリ
              </label>
              <div className="flex items-center gap-14">
                <select
                  value={categoryId ?? ''}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-3/4 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6] bg-white"
                >
                  <option value="">カテゴリを選択</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* カテゴリ編集ボタン */}
                <button
                  type="button"
                  onClick={() => navigate('/categories')}
                  className="text-sm font-bold text-white bg-[#4f8196] hover:bg-[#80949e] px-4 py-2 rounded-lg whitespace-nowrap"
                >
                  カテゴリ編集
                </button>
              </div>
            </div>

            {/* 詳細 */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1 text-left">
                詳細
              </label>
              <textarea
                placeholder="投資は長く続けるほど複利が大きくなっていくので、早く始めるほど将来的なリターンも大きくなっていく（15年以上の長期投資を前提とする）"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6] resize-none"
                disabled={loading}
                rows={6}
              />
            </div>

            {/* 更新するボタン */}
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

      {/* フッターナビゲーション */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-4">
        <button
          onClick={() => navigate('/posts')}
          className="text-sm text-[#4f8196] font-bold"
        >
          伝えたいこと
        </button>
        <button
          onClick={() => navigate('/categories')}
          className="text-sm text-gray-400 font-medium"
        >
          カテゴリ一覧
        </button>
        <button
          onClick={() => navigate("/mypage")}
          className="text-sm text-gray-400 font-medium"
        >
          マイページ
        </button>
      </div>
    </div>
  )
}