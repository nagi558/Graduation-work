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

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // バリデーション実行
    if (!validateForm()) {
      return
    }

    try {
    // APIリクエスト
    const response = await axiosInstance.post('/auth/sign_in', {
      email,
      password
    })

    // 成功時の処理
    alert('ログインしました')

    localStorage.setItem('access-token', response.headers['access-token'])
    localStorage.setItem('client', response.headers['client'])
    localStorage.setItem('uid', response.headers['uid'])

    // ログインページに遷移
    navigate("/posts")

    } catch (err: any) {
        setError("メールアドレスまたはパスワードが正しくありません")
    }
  }
}
