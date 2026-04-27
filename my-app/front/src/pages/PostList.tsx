import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios'
import type { Post } from '@/types'
import { Spinner } from '@/components/Spinner'

export const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [titleQuery, setTitleQuery] = useState('')
  const [bodyQuery, setBodyQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const navigate = useNavigate()

  const fetchPosts = async (title = '', body = '' ) => {
    setIsFetching(true)
    try {
      const response = await axiosInstance.get('/api/v1/posts', {
        params: {
          ...(title && { title }),
          ...(body && { body }),
        },
      })
      setPosts(response.data)
    } catch {
      setError('投稿の取得に失敗しました')
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSearch = () => {
    setIsSearching(true)
    fetchPosts(titleQuery, bodyQuery)
  }

  const handleDelete = async (postId: number) => {
    if (!confirm('削除しますか？')) return

    try {
      await axiosInstance.delete(`/api/v1/posts/${postId}`, {
        skipGlobalError: true,
      })
      setPosts((prev) => prev.filter((post) => post.id !== postId))
    } catch {
      setError('削除できませんでした')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#E8EEF1]">
        <Spinner size='lg' />
      </div>
    )
  }

  return (
    <div className="bg-[#E8EEF1] pb-20">
      <div className="max-w-4xl mx-auto pt-1 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">

        {/* タイトルと新規作成ボタン */}
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-[38px] font-bold tracking-normal text-[#444444] text-center mb-8 font-sans pt-7">
            伝えたいこと
          </h1>
          <button
            onClick={() => navigate('/posts/new')}
            className="bg-[#4f8196] hover:bg-[#80949e] text-white text-sm font-bold py-2 px-4 rounded-xl shadow transition duration-200"
          >
            新規作成
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* 検索エリア */}
        <div className='flex gap-2 mb-6'>
          <input
            type='text'
            placeholder='タイトル検索'
            value={titleQuery}
            onChange={(e) => setTitleQuery(e.target.value)}
            className='flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f8196]'
          />
          <input
            type='text'
            placeholder='本文検索'
            value={bodyQuery}
            onChange={(e) => setBodyQuery(e.target.value)}
            className='flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f8196]'
          />
          <button
            onClick={handleSearch}
            className='bg-[#4f8196] hover:bg-[#80949e] text-white text-sm font-bold py-2 px-4 rounded-xl shadow transition duration-200'
          >
            検索
          </button>
        </div>

        {/* 投稿一覧 */}
        {posts.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            {isSearching ? (
              <p data-testid="empty-message">投稿が見つかりませんでした</p>
            ) : (
              <>
                <p>まだ投稿がありません</p>
                <p className='text-sm mt-2'>新規作成ボタンから投稿してみましょう</p>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-lg p-5 flex justify-between items-start"
              >
                {/* 左側：タイトル・カテゴリ・本文 */}
                <div className="flex-1 min-w-0">

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
    </div>
  )
}