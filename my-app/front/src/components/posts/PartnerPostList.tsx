import { useEffect, useState } from 'react'
import { pairApi } from '@/lib/pairApi'
import { Spinner } from '@/components/Spinner'

type PartnerPost = {
  id: number
  title: string
  body: string
  category: { id: number; name: string }
  created_at: string
}

export const PartnerPostList = () => {
  const [posts, setPosts] = useState<PartnerPost[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await pairApi.getPartnerPosts()
        setPosts(res.data)
      } catch {
        setError('投稿の取得に失敗しました')
      } finally {
        setIsFetching(false)
      }
    }
    fetchPosts()
  }, [])

  if (isFetching) {
    return (
      <div className='flex justify-center items-center py-20'>
        <Spinner size='lg' />
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className='mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm'>
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className='text-center text-gray-400 mt-20'>
          <p>パートナーの共有投稿はありません</p>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {posts.map((post) => (
            <div key={post.id} className='bg-white rounded-2xl shadow-lg p-5'>
              <div className='flex items-center gap-2 mb-3'>
                <p className='text-gray-800 font-bold text-lg'>{post.title}</p>
                <span className='text-xs text-white bg-[#A0B9C6] px-2 py-1 rounded-full'>
                  {post.category.name}
                </span>
              </div>
              <p className='text-gray-500 text-sm text-left'>{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}