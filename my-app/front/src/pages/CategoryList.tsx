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
}