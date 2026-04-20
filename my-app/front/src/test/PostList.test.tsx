import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { PostList } from '@/pages/PostList'
import { PostNew } from '@/pages/PostNew'
import { PostUpdate } from '@/pages/PostUpdate'
import axiosInstance from '@/lib/axios'
import { vi } from 'vitest'

vi.mock('@/lib/axios')

const renderPostList = () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/posts']}>
        <Routes>
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/new" element={<PostNew />} />
          <Route path="/posts/:id/edit" element={<PostUpdate />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

const mockPosts = [
  {
    id: 1,
    title: 'テストタイトル',
    body: 'テスト本文',
    category: { name: 'テストカテゴリ' }
  }
]

describe('PostList', () => {

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('投稿一覧が表示される', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: mockPosts
    } as any)

    renderPostList()

    expect(await screen.findByText('テストタイトル')).toBeInTheDocument()
    expect(await screen.findByText('テスト本文')).toBeInTheDocument()
  })

  it('投稿が0件の場合メッセージが表示される', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: []
    } as any)

    renderPostList()

    expect(await screen.findByText('まだ投稿がありません')).toBeInTheDocument()
  })

  it('新規作成ボタンをクリックすると新規画面に遷移する', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: mockPosts
    } as any)

    const user = userEvent.setup()
    renderPostList()

    await user.click(await screen.findByRole('button', { name: '新規作成' }))

    expect(await screen.findByText('新規作成')).toBeInTheDocument()
  })

  it('修正ボタンをクリックすると編集画面に遷移する', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: mockPosts
    } as any)

    const user = userEvent.setup()
    renderPostList()

    await user.click(await screen.findByRole('button', { name: '修正' }))

    expect(await screen.findByText('投稿編集')).toBeInTheDocument()
  })

  it('削除ボタンをクリックすると投稿が削除される', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: mockPosts
    } as any)

    vi.mocked(axiosInstance.delete).mockResolvedValue({} as any)

    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderPostList()

    await screen.findByText('テストタイトル')

    await user.click(screen.getByRole('button', { name: '削除' }))

    await waitFor(() => {
      expect(screen.queryByText('テストタイトル')).not.toBeInTheDocument()
    })
  })
})