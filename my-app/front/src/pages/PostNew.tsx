import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import type { Category } from '@/types'

export const PostNew = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] =useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
    // APIリクエスト
      await axiosInstance.post('/api/v1/posts', {
        post: {
          title,
          body,
          category_id: categoryId
        }
      })

      navigate('/posts')

    } catch (err: any) {
      setError('投稿を作成できませんでした')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
        {/* 仮 */}
    </div>
  )
}