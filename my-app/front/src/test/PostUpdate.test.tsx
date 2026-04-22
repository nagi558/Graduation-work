import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { PostUpdate } from '@/pages/PostUpdate'
import { PostList } from '@/pages/PostList'
import { CategoryManage } from '@/pages/CategoryManage'
import axiosInstance from '@/lib/axios'

vi.mock('@/lib/axios')

const mockGet = vi.mocked(axiosInstance.get)
const mockPatch = vi.mocked(axiosInstance.patch)

const renderPostUpdate = () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/posts/1/edit']}>
        <Routes>
          <Route path="/posts/:id/edit" element={<PostUpdate />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/categories/manage" element={<CategoryManage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('PostUpdate', () => {

  // ★ 全テスト共通のモックをここに置く
  beforeEach(() => {
  mockGet.mockImplementation((url) => {

    // カテゴリ一覧（PostUpdate と PostList 両方で使う）
    if (url === '/api/v1/categories') {
      return Promise.resolve({
        data: [
          { id: 1, name: 'テストカテゴリ' },
          { id: 2, name: 'テストカテゴリ2' }
        ]
      })
    }

    // 投稿詳細（PostUpdate 用）
    if (url === '/api/v1/posts/1') {
      return Promise.resolve({
        data: {
          id: 1,
          title: 'テストタイトル',
          body: 'テスト本文',
          category: { id: 1, name: 'テストカテゴリ' }
        }
      })
    }

    // ★ 投稿一覧（更新後に PostList が呼ぶ）
    if (url === '/api/v1/posts') {
      return Promise.resolve({
        data: [
          {
            id: 1,
            title: '更新タイトル',
            body: 'テスト本文',
            category: { id: 1, name: 'テストカテゴリ' }
          }
        ]
      })
    }

    return Promise.reject(new Error('not mocked'))
  })

  mockPatch.mockResolvedValue({
    data: {
      id: 1,
      title: '更新タイトル',
      body: 'テスト本文',
      category: { id: 1, name: 'テストカテゴリ' }
    }
  })
})

  it('初回ロード中はスピナーが表示される', () => {
    renderPostUpdate()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('ロード完了後に編集フォームが表示される', async () => {
    renderPostUpdate()
    expect(await screen.findByText('投稿編集')).toBeInTheDocument()
  })

  it('既存データがフォームに表示される', async () => {
    renderPostUpdate()
    expect(await screen.findByDisplayValue('テストタイトル')).toBeInTheDocument()
    expect(await screen.findByDisplayValue('テスト本文')).toBeInTheDocument()
  })

  it('カテゴリ一覧が表示される', async () => {
    renderPostUpdate()
    expect(await screen.findAllByText(/テストカテゴリ/)).toHaveLength(2)
  })

  it('タイトルが空の場合エラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    renderPostUpdate()

    const titleInput = await screen.findByDisplayValue('テストタイトル')
    await user.clear(titleInput)
    await user.click(screen.getByRole('button', { name: '更新する' }))

    expect(await screen.findByText('タイトルを入力してください')).toBeInTheDocument()
  })

  it('正常に更新すると一覧画面に遷移する', async () => {
    const user = userEvent.setup()
    renderPostUpdate()

    const titleInput = await screen.findByDisplayValue('テストタイトル')
    await user.clear(titleInput)
    await user.type(titleInput, '更新タイトル')

    await user.click(screen.getByRole('button', { name: '更新する' }))

    expect(await screen.findByText('更新タイトル')).toBeInTheDocument()
  })

  it('カテゴリ編集ボタンをクリックするとカテゴリ管理画面に遷移する', async () => {
    const user = userEvent.setup()
    renderPostUpdate()

    await user.click(await screen.findByRole('button', { name: 'カテゴリ編集' }))
    expect(await screen.findByText('カテゴリ管理')).toBeInTheDocument()
  })
})
