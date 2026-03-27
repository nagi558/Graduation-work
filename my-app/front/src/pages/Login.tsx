import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const validateForm = (): boolean => {
    // メールアドレスの空チェック
    if (email === "") {
      setError('メールアドレスを入力してください')
      return false
    }

    // パスワードの空チェック
    if (password === "") {
      setError('パスワードを入力してください')
      return false
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('有効なメールアドレスを入力してください')
      return false
    }

    return true
  }
}