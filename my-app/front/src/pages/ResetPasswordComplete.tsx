import React from 'react'
import { useNavigate } from 'react-router-dom'

export const ResetPasswordComplete = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen flex flex-col items-center justify-center  bg-[#E8EEF1]'>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-10 text-center">
        <div className="text-[30px] font-bold text-[#444444] mb-4 font-sans">
          パスワードを更新しました
        </div>
        <div className="text-sm text-gray-500 mb-8">
          新しいパスワードでログインしてください。
        </div>
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