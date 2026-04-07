import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import { Footer } from '@/components/Footer'

export const CategoryNew = () => {
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const validateForm = (): boolean => {
    if (name === "") {
      setError('カテゴリを入力してください')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if(!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      await axiosInstance.post('/api/v1/categories', {
        category: {
          name,
          category_id: categoryId
        }
      }, {
        headers: {
          'access-token': localStorage.getItem('access-token') ?? '',
          'client': localStorage.getItem('client') ?? '',
          'uid': localStorage.getItem('uid') ?? ''
        }
      })

      navigate('/categories')

    } catch (err: any) {
      setError('カテゴリを作成できませんでした')
    } finally {
      setLoading(false)
    }
  }
}