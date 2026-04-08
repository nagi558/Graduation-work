import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import type { Category } from '@/types'
import { useParams } from 'react-router-dom'
import { Footer } from '@/components/Footer'

export const CategoryUpdate = () => {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {id} = useParams()

  const navigate = useNavigate()

  const validateForm = (): boolean => {
    if (name === "") {
      setError('カテゴリを入力してください')
      return false
    }

    return true
  }

  useEffect(() => {
    const fetchCategories = async () => {
      const accessToken = localStorage.getItem('access-token')
      const client = localStorage.getItem('client')
      const uid = localStorage.getItem('uid')

      const response = await axiosInstance.get(`/api/v1/categories/${id}`, {
        headers: {
          'access-token': accessToken || '',
          'client': client || '',
          'uid': uid || ''
        }
      })
      setName(response.data.name)
    }
    fetchCategories()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      await axiosInstance.patch(`/api/v1/categories/${id}`, {
        category: {
          name
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
      setError('カテゴリを編集できませんでした')
    } finally {
      setLoading(false)
    }
  }
}