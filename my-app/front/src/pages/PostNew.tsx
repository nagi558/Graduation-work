import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import { pairApi } from '@/lib/pairApi'
import type { Category } from '@/types'
import { Spinner } from '@/components/Spinner'

export const PostNew = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] =useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [canView, setCanView] = useState(false)
  const [isPaired, setIsPaired] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  const validateForm = (): boolean => {
    if (title.trim() === "") {
      setError('タイトルを入力してください')
      return false
    }

    return true
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/categories')
        setCategories(response.data)
      } catch {
        setError('カテゴリの取得に失敗しました')
      }
    }
    const fetchPairStatus = async () => {
      try {
        const res = await pairApi.getStatus()
        setIsPaired(res.data.paired)
      } catch {
        console.error('Pair状態の取得に失敗しました')
      }
    }
    fetchCategories()
    fetchPairStatus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validateForm()) return
    setIsSubmitting(true)

    try {
      await axiosInstance.post('/api/v1/posts', {
        post: {
          title,
          body,
          category_id: categoryId,
          can_view: canView,
        }
      }, { skipGlobalError: true })

      navigate('/posts')

    } catch {
      setError('投稿を作成できませんでした')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E8EEF1] pb-20">
      <div className="max-w-2xl mx-auto pt-4 px-4">

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-10">
          <form onSubmit={handleSubmit} className="space-y-4">

            <h1 className="text-[38px] font-bold tracking-normal text-[#444444] text-center mb-8 font-sans pt-7">
              新規作成
            </h1>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1 text-left">
                伝えたいこと
              </label>
              <input
                type="text"
                placeholder="月1,000円でも投資に回す"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6]"
                disabled={isSubmitting}
              />
            </div>

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
                <button
                  type="button"
                  onClick={() => navigate('/categories/manage')}
                  className="text-sm font-bold text-white bg-[#4f8196] hover:bg-[#80949e] px-4 py-2 rounded-lg whitespace-nowrap"
                  disabled={isSubmitting}
                >
                  カテゴリ編集
                </button>
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1 text-left">
                詳細
              </label>
              <textarea
                placeholder="投資は長く続けるほど複利が大きくなっていくので、早く始めるほど将来的なリターンも大きくなっていく（15年以上の長期投資を前提とする）"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0B9C6] resize-none"
                disabled={isSubmitting}
                rows={6}
              />
            </div>

            {isPaired && (
              <div className='flex items-center justify-between py-3 border-t border-gray-100'>
                <div>
                  <div className='text-sm font-medium text-gray-700'>パートナーに見せる</div>
                  <div className='text-xs text-gray-400'>オンにするとパートナーが閲覧できます</div>
                </div>
                <button
                  type='button'
                  aria-label='パートナーに見せる'
                  onClick={() => setCanView((prev) => !prev)}
                  style={{ minHeight: 'unset', lineHeight: '1' }}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 overflow-hidden ${
                    canView ? 'bg-[#4f8196]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                    style={{ transform: canView ? 'translateX(24px)' : 'translateX(0px)' }}
                  />
                </button>
              </div>
            )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-sm font-bold text-white bg-[#4f8196] hover:bg-[#80949e] disabled:bg-gray-400 px-7 py-2 rounded-lg shadow transition duration-200"
                >
                  {isSubmitting ? <Spinner size="sm" /> : '追加する'}
                </button>
              </div>

          </form>
        </div>
      </div>
    </div>
  )
}