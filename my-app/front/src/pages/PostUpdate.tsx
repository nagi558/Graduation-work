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

  const {id} = useParams

  const navigate = useNavigate()

  const validateForm = (): boolean => {
    // フォームの空チェック
    if (title === "") {
      setError('タイトルを入力してください')
      return false
    }

    return true
  }
}
