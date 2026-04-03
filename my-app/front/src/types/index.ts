export interface Category {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface Post {
  id: number
  title: string
  body: string
  category: Category
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  nickname: string
  email: string
}