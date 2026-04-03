import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import type { Post } from '@/types'

export const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosts = async () => {
      const accessToken = localStorage.getItem('access-token')
      const client = localStorage.getItem('client')
      const uid = localStorage.getItem('uid')

      // accessTokenが未使用の場合は削除
      const response = await axiosInstance.get('/api/v1/posts', {
        headers: {
          'access-token': accessToken ?? '',
          'client': client ?? '',
          'uid': uid ?? ''
        }
      })
      setPosts(response.data)
    }
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-[#E8EEF1] pb-20">
      
      {/* メインコンテンツ */}
      <div className="max-w-2xl mx-auto pt-4 px-4">

        {/* タイトルと新規作成ボタン */}
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold text-gray-700">伝えたいこと</h1>
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
                className="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-start"
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

      {/* フッターナビゲーション */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-4">
        <button
          onClick={() => navigate('/posts')}
          className="text-sm text-[#4f8196] font-bold"
        >
          伝えたいこと
        </button>
        <button
          onClick={() => navigate('/categories')}
          className="text-sm text-gray-400 font-medium"
        >
          カテゴリ一覧
        </button>
        <button
          onClick={() => navigate("/mypage")}
          className="text-sm text-gray-400 font-medium"
        >
          マイページ
        </button>
      </div>
    </div>
  )
}