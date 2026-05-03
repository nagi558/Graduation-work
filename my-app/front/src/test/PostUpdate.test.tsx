import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { PostUpdate } from '@/pages/PostUpdate'
import { PostList } from '@/pages/PostList'
import { CategoryManage } from '@/pages/CategoryManage'
import axiosInstance from '@/lib/axios'
import { pairApi } from '@/lib/pairApi'
import { vi } from 'vitest'

vi.mock('@/lib/axios')
vi.mock('@/lib/pairApi')

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
  beforeEach(() => {
    vi.mocked(pairApi.getStatus).mockResolvedValue({
      data: { paired: false, pending: false }
    } as any)

    vi.mocked(pairApi.getPartnerPosts).mockResolvedValue({
      data: []
    } as any)

    mockGet.mockImplementation((url) => {
      if (url === '/api/v1/categories') {
        return Promise.resolve({
          data: [
            { id: 1, name: 'テストカテゴリ' },
            { id: 2, name: 'テストカテゴリ2' }
          ]
        })
      }

      if (url === '/api/v1/posts/1') {
        return Promise.resolve({
          data: {
            id: 1,
            title: 'テストタイトル',
            body: 'テスト本文',
            category: { id: 1, name: 'テストカテゴリ' },
            can_view: false,
          }
        })
      }

      if (url === '/api/v1/posts') {
        return Promise.resolve({
          data: [
            {
              id: 1,
              title: '更新タイトル',
              body: 'テスト本文',
              category: { id: 1, name: 'テストカテゴリ' },
              can_view: false,
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
        category: { id: 1, name: 'テストカテゴリ' },
        can_view: false,
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
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

  describe('Pair機能', () => {
    it('Pair未接続の場合パートナーに見せるトグルが表示されない', async () => {
      renderPostUpdate()
      await screen.findByText('投稿編集')
      expect(screen.queryByText('パートナーに見せる')).not.toBeInTheDocument()
    })

    it('Pair接続済みの場合パートナーに見せるトグルが表示される', async () => {
      vi.mocked(pairApi.getStatus).mockResolvedValue({
        data: { paired: true, pending: false, partner_name: 'パートナー' }
      } as any)

      renderPostUpdate()
      expect(await screen.findByText('パートナーに見せる')).toBeInTheDocument()
    })

    it('can_viewをtrueにして更新するとcan_view: trueが送信される', async () => {
      vi.mocked(pairApi.getStatus).mockResolvedValue({
        data: { paired: true, pending: false, partner_name: 'パートナー' }
      } as any)

      const user = userEvent.setup()
      renderPostUpdate()

      await user.click(await screen.findByRole('button', { name: 'パートナーに見せる' }))
      await user.click(screen.getByRole('button', { name: '更新する' }))

      expect(axiosInstance.patch).toHaveBeenCalledWith(
        '/api/v1/posts/1',
        expect.objectContaining({
          post: expect.objectContaining({ can_view: true })
        }),
        expect.any(Object)
      )
    })
  })
})