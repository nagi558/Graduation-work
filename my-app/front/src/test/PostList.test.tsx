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

  it('タイトル検索で一致する投稿のみ表示される', async () => {
    vi.mocked(axiosInstance.get).mockImplementation((_url, config: any) => {
      const params = config?.params ?? {}

      if (params.title === 'テスト' && params.body === undefined) {
        return Promise.resolve({
          data: [{ id: 1, title: 'テストタイトル', body: 'テスト本文', category: { name: 'テストカテゴリ' } }]
        } as any)
      }

      return Promise.resolve({ data: mockPosts } as any)
    })

    const user = userEvent.setup()
    renderPostList()

    await screen.findByText('テストタイトル')

    await user.type(screen.getByPlaceholderText('タイトル検索'), 'テスト')
    await user.click(screen.getByRole('button', { name: '検索' }))

    expect(await screen.findByText('テストタイトル')).toBeInTheDocument()
  })

  it('本文検索で一致する投稿のみ表示される', async () => {
    vi.mocked(axiosInstance.get).mockImplementation((_url, config: any) => {
      const params = config?.params ?? {}

      if (params.body === 'テスト' && params.title === undefined) {
        return Promise.resolve({
          data: [{ id: 1, title: 'テストタイトル', body: 'テスト本文', category: { name: 'テストカテゴリ' } }]
        } as any)
      }

      return Promise.resolve({ data: mockPosts } as any)
    })

    const user = userEvent.setup()
    renderPostList()

    await screen.findByText('テストタイトル')

    await user.type(screen.getByPlaceholderText('本文検索'), 'テスト')
    await user.click(screen.getByRole('button', { name: '検索' }))

    expect(await screen.findByText('テスト本文')).toBeInTheDocument()
  })

  it('検索結果が0件の場合メッセージが表示される', async () => {
    vi.mocked(axiosInstance.get).mockImplementation((_url, config: any) => {
      const params = config?.params ?? {}

      if (params.title === '存在しないタイトル') {
        return Promise.resolve({ data: [] } as any)
      }

      return Promise.resolve({ data: mockPosts } as any)
    })

    const user = userEvent.setup()
    renderPostList()

    await screen.findByText('テストタイトル')

    await user.type(screen.getByPlaceholderText('タイトル検索'), '存在しないタイトル')
    await user.click(screen.getByRole('button', { name: '検索' }))

    expect(await screen.findByTestId('empty-message')).toBeInTheDocument()
  })

  it('検索時に正しいクエリパラメータでAPIが1回だけ呼ばれる', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockPosts } as any)

    const user = userEvent.setup()
    renderPostList()

    await screen.findByText('テストタイトル')

    await user.type(screen.getByPlaceholderText('タイトル検索'), 'テスト')
    await user.click(screen.getByRole('button', { name: '検索' }))

    await waitFor(() => {
      const calls = vi.mocked(axiosInstance.get).mock.calls
      const searchCalls = calls.filter(([, config]: any) => config?.params?.title === 'テスト')
      expect(searchCalls).toHaveLength(1)
      const searchCallParams = searchCalls[0]?.[1]
      expect(searchCallParams).toBeDefined()
      expect(searchCallParams?.params).toEqual({ title: 'テスト' })
    })
  })

  it('タイトルと本文を両方入力して検索すると両方のパラメータでAPIが呼ばれ結果が表示される', async () => {
    vi.mocked(axiosInstance.get).mockImplementation((_url, config: any) => {
      const params = config?.params ?? {}

      if (params.title === 'テスト' && params.body === 'テスト本文') {
        return Promise.resolve({
          data: [{ id: 1, title: 'テストタイトル', body: 'テスト本文', category: { name: 'テストカテゴリ' } }]
        } as any)
      }

      return Promise.resolve({ data: mockPosts } as any)
    })

    const user = userEvent.setup()
    renderPostList()

    await screen.findByText('テストタイトル')

    await user.type(screen.getByPlaceholderText('タイトル検索'), 'テスト')
    await user.type(screen.getByPlaceholderText('本文検索'), 'テスト本文')
    await user.click(screen.getByRole('button', { name: '検索' }))

    await waitFor(() => {
      const calls = vi.mocked(axiosInstance.get).mock.calls
      const searchCalls = calls.filter(([, config]: any) =>
        config?.params?.title === 'テスト' && config?.params?.body === 'テスト本文'
      )
      expect(searchCalls).toHaveLength(1)
      const searchCallParams = searchCalls[0]?.[1]
      expect(searchCallParams).toBeDefined()
      expect(searchCallParams?.params).toEqual({ title: 'テスト', body: 'テスト本文' })
    })

    expect(await screen.findByText('テスト本文')).toBeInTheDocument()
  })
})