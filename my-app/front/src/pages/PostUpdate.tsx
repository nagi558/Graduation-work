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
}