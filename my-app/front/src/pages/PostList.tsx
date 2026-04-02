import { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axios'
import type { Post } from '@/types'

export const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axiosInstance.get('/api/v1/posts', {
        headers: {
          'access-token': localStorage.getItem('access-token'),
          'client': localStorage.getItem('client'),
          'uid': localStorage.getItem('uid')
        }
      })
      setPosts(response.data)
    }
    fetchPosts()
  }, [])

  return (
    <div>
      <h1>伝えたいこと一覧</h1>
        {posts.map((post) => (
          <div key={post.id}>
            <p>{post.title}</p>
            <p>{post.category.name}</p>
        </div>
      ))}
    </div>
  )
}