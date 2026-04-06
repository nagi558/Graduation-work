import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import type { Post } from '@/types'
import { Footer } from '@/components/Footer'

export const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosts = async () => {
      const accessToken = localStorage.getItem('access-token')
      const client = localStorage.getItem('client')
      const uid = localStorage.getItem('uid')

      const response = await axiosInstance.get('/api/v1/posts', {
        headers: {
          'access-token': accessToken || '',
          'client': client || '',
          'uid': uid || ''
        }
      })
      setPosts(response.data)
    }
    fetchPosts()
  }, [])

  const handleDelete = async (postId: number) => {
    if (!confirm('削除しますか？')) return

    try {
      await axiosInstance.delete(`/api/v1/posts/${postId}`, {
        headers: {
          'access-token': localStorage.getItem('access-token') ?? '',
          'client': localStorage.getItem('client') ?? '',
          'uid': localStorage.getItem('uid') ?? ''
        }
      })
      // 削除後に一覧を更新
      setPosts(posts.filter((post) => post.id !== postId))
    } catch (err: any) {
      alert('削除できませんでした')
    }

  }

  return (
    <div className="min-h-screen bg-[#E8EEF1] pb-20">
      
      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto pt-1 px-4">
             <div className="bg-white rounded-2xl shadow-sm p-6">

        {/* タイトルと新規作成ボタン */}
        <div className="flex justify-between items-center mb-3">
          <h1 className="!text-[38px] !font-bold !tracking-normal !text-[#444444] text-center mb-8 !font-sans">
            伝えたいこと
          </h1>
          <button
            onClick={() => navigate('/posts/new')}
            className="bg-[#4f8196] hover:bg-[#80949e] text-white text-sm font-bold py-2 px-4 rounded-xl shadow transition duration-200"
          >
            新規作成
          </button>
        </div>

        {/* 投稿一覧 */}
        {posts.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p>まだ投稿がありません</p>
            <p className="text-sm mt-2">新規作成ボタンから投稿してみましょう</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-lg p-5 flex justify-between items-start"
              >
                {/* 左側：タイトル・カテゴリ・本文 */}
                <div className="flex-1">

                  {/* タイトルとカテゴリ */}
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-gray-800 font-bold text-lg">
                      {post.title}
                    </p>
                    <span className="text-xs text-white bg-[#A0B9C6] px-2 py-1 rounded-full">
                      {post.category.name}
                    </span>
                  </div>

                  {/* 本文 */}
                  <p className="text-gray-500 text-sm text-left">
                    {post.body}
                  </p>
                </div>

                {/* 右側：修正・削除ボタン（縦並び） */}
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => navigate(`/posts/${post.id}/edit`)}
                    className="text-sm text-[#4f8196] border border-[#4f8196] px-3 py-1 rounded-lg hover:bg-[#4f8196] hover:text-white transition duration-200"
                  >
                    修正
                  </button>
                  <button
                      onClick={() => handleDelete(post.id)}
                      className="text-sm text-red-400 border border-red-400 px-3 py-1 rounded-lg hover:bg-red-400 hover:text-white transition duration-200"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* フッターナビゲーション */}
      <Footer />
    </div>
  )
}