import React from 'react'
import { useNavigate } from 'react-router-dom'

export const ResetPasswordComplete = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen flex flex-col items-center pt-8 bg-[#E8EEF1]'>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-10 text-center">
        <div className="text-5xl mb-6">✅</div>
        <h1 className="text-[28px] font-bold text-[#444444] mb-4 font-sans">
          パスワードを更新しました
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          新しいパスワードでログインしてください。
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-[#4f8196] hover:bg-[#80949e] text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-200"
        >
          ログイン画面へ
        </button>
      </div>
    </div>
  )
}