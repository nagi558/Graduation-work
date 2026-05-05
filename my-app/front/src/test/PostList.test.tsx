import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { PostList } from '@/pages/PostList'
import { PostNew } from '@/pages/PostNew'
import { PostUpdate } from '@/pages/PostUpdate'
import axiosInstance from '@/lib/axios'
import { pairApi } from '@/lib/pairApi'
import { vi } from 'vitest'
import { within } from '@testing-library/react'

vi.mock('@/lib/axios')
vi.mock('@/lib/pairApi')

const mockPosts = [
  {
    id: 1,
    title: 'テストタイトル',
    body: 'テスト本文',
    category: { id: 1, name: 'テストカテゴリ' },
    can_view: false,
  }
]

const mockPartnerPosts = [
  {
    id: 2,
    title: 'パートナーの投稿',
    body: 'パートナーの本文',
    category: { id: 2, name: 'パートナーカテゴリ' },
  }
]

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

const closeGuideIfExists = async (user: ReturnType<typeof userEvent.setup>) => {
  const dialogs = screen.queryAllByRole('dialog')

  if (dialogs.length > 0) {
    const skip = within(dialogs[0]).queryByText('スキップ')
    if (skip) {
      await user.click(skip)
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    }
  }
}

describe('PostList', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  beforeEach(() => {
  localStorage.setItem('hasSeenGuide', 'true')

  vi.mocked(pairApi.getStatus).mockResolvedValue({
    data: { paired: true }
  } as any)

    vi.mocked(pairApi.getPartnerPosts).mockResolvedValue({
      data: mockPartnerPosts
    } as any)

    vi.mocked(axiosInstance.get).mockImplementation((url) => {
      if (url === '/api/v1/posts') {
        return Promise.resolve({ data: mockPosts } as any)
      }
      if (url === '/api/v1/categories') {
        return Promise.resolve({ data: [] } as any)
      }
      return Promise.reject(new Error(`unexpected url: ${url}`))
    })
  })

  describe('自分の投稿タブ', () => {
    it('投稿一覧が表示される', async () => {
      renderPostList()
      expect(await screen.findByText('テストタイトル')).toBeInTheDocument()
      expect(await screen.findByText('テスト本文')).toBeInTheDocument()
    })

    it('投稿取得APIが呼ばれる', async () => {
      renderPostList()
      await screen.findByText('テストタイトル')
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/v1/posts', expect.any(Object))
    })

    it('投稿が0件の場合メッセージが表示される', async () => {
      vi.mocked(axiosInstance.get).mockImplementation((url) => {
        if (url === '/api/v1/posts') return Promise.resolve({ data: [] } as any)
        return Promise.resolve({ data: [] } as any)
      })
      renderPostList()
      expect(await screen.findByText('まだ投稿がありません')).toBeInTheDocument()
    })

    it('新規作成ボタンをクリックすると新規画面に遷移する', async () => {
      const user = userEvent.setup()
      renderPostList()
      await user.click(await screen.findByRole('button', { name: '新規作成' }))
      expect(await screen.findByText('新規作成')).toBeInTheDocument()
    })

    it('修正ボタンをクリックすると編集画面に遷移する', async () => {
      const user = userEvent.setup()
      renderPostList()
      await user.click(await screen.findByRole('button', { name: '修正' }))
      expect(await screen.findByText('投稿編集')).toBeInTheDocument()
    })

    it('削除ボタンをクリックすると正しいIDでAPIが呼ばれ投稿が消える', async () => {
      vi.mocked(axiosInstance.delete).mockResolvedValue({} as any)
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      const user = userEvent.setup()
      renderPostList()

      await screen.findByText('テストタイトル')
      await user.click(screen.getByRole('button', { name: '削除' }))

      await waitFor(() => {
        expect(axiosInstance.delete).toHaveBeenCalledWith(
          '/api/v1/posts/1',
          expect.any(Object)
        )
        expect(screen.queryByText('テストタイトル')).not.toBeInTheDocument()
      })
    })

    it('タイトル検索で正しいパラメータでAPIが呼ばれ結果が表示される', async () => {
      vi.mocked(axiosInstance.get).mockImplementation((url, config: any) => {
        if (url === '/api/v1/posts') {
          const params = config?.params ?? {}
          if (params.title === 'テスト') {
            return Promise.resolve({ data: mockPosts } as any)
          }
          return Promise.resolve({ data: [] } as any)
        }
        return Promise.resolve({ data: [] } as any)
      })

      const user = userEvent.setup()
      renderPostList()

      await screen.findByText('まだ投稿がありません')
      await user.type(screen.getByPlaceholderText('タイトル検索'), 'テスト')
      await user.click(screen.getByRole('button', { name: '検索' }))

      await waitFor(() => {
        expect(axiosInstance.get).toHaveBeenCalledWith(
          '/api/v1/posts',
          expect.objectContaining({ params: { title: 'テスト' } })
        )
      })
      expect(await screen.findByText('テストタイトル')).toBeInTheDocument()
    })

    it('本文検索で正しいパラメータでAPIが呼ばれ結果が表示される', async () => {
      vi.mocked(axiosInstance.get).mockImplementation((url, config: any) => {
        if (url === '/api/v1/posts') {
          const params = config?.params ?? {}
          if (params.body === 'テスト') {
            return Promise.resolve({ data: mockPosts } as any)
          }
          return Promise.resolve({ data: [] } as any)
        }
        return Promise.resolve({ data: [] } as any)
      })

      const user = userEvent.setup()
      renderPostList()

      await screen.findByText('まだ投稿がありません')
      await user.type(screen.getByPlaceholderText('本文検索'), 'テスト')
      await user.click(screen.getByRole('button', { name: '検索' }))

      await waitFor(() => {
        expect(axiosInstance.get).toHaveBeenCalledWith(
          '/api/v1/posts',
          expect.objectContaining({ params: { body: 'テスト' } })
        )
      })
      expect(await screen.findByText('テスト本文')).toBeInTheDocument()
    })

    it('検索結果が0件の場合メッセージが表示される', async () => {
      vi.mocked(axiosInstance.get).mockImplementation((url, config: any) => {
        if (url === '/api/v1/posts') {
          const params = config?.params ?? {}
          if (params.title === '存在しないタイトル') {
            return Promise.resolve({ data: [] } as any)
          }
          return Promise.resolve({ data: mockPosts } as any)
        }
        return Promise.resolve({ data: [] } as any)
      })

      const user = userEvent.setup()
      renderPostList()

      await screen.findByText('テストタイトル')
      await user.type(screen.getByPlaceholderText('タイトル検索'), '存在しないタイトル')
      await user.click(screen.getByRole('button', { name: '検索' }))

      expect(await screen.findByTestId('empty-message')).toBeInTheDocument()
    })

    it('タイトルと本文を両方入力して検索すると両方のパラメータでAPIが呼ばれる', async () => {
      vi.mocked(axiosInstance.get).mockImplementation((url, config: any) => {
        if (url === '/api/v1/posts') {
          const params = config?.params ?? {}
          if (params.title === 'テスト' && params.body === 'テスト本文') {
            return Promise.resolve({ data: mockPosts } as any)
          }
          return Promise.resolve({ data: [] } as any)
        }
        return Promise.resolve({ data: [] } as any)
      })

      const user = userEvent.setup()
      renderPostList()

      await screen.findByText('まだ投稿がありません')
      await user.type(screen.getByPlaceholderText('タイトル検索'), 'テスト')
      await user.type(screen.getByPlaceholderText('本文検索'), 'テスト本文')
      await user.click(screen.getByRole('button', { name: '検索' }))

      await waitFor(() => {
        expect(axiosInstance.get).toHaveBeenCalledWith(
          '/api/v1/posts',
          expect.objectContaining({ params: { title: 'テスト', body: 'テスト本文' } })
        )
      })
      expect(await screen.findByText('テストタイトル')).toBeInTheDocument()
    })
  })

  describe('Pair機能', () => {
    it('Pair未接続の場合タブが表示されない', async () => {
        vi.mocked(pairApi.getStatus).mockResolvedValueOnce({
    data: { paired: false }
  } as any)

      renderPostList()
      await screen.findByText('テストタイトル')
      expect(screen.queryByRole('button', { name: '自分の投稿' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'パートナーの投稿' })).not.toBeInTheDocument()
    })

    it('Pair状態取得APIが呼ばれる', async () => {
      const user = userEvent.setup()
      renderPostList()

      await closeGuideIfExists(user)

  expect(await screen.findByText('テストタイトル')).toBeInTheDocument()
  expect(pairApi.getStatus).toHaveBeenCalled()
    })

    it('Pair接続済みの場合タブが表示される', async () => {
      vi.mocked(pairApi.getStatus).mockResolvedValue({
        data: { paired: true, partner_name: 'パートナー' }
      } as any)
      renderPostList()
      expect(await screen.findByRole('button', { name: '自分の投稿' })).toBeInTheDocument()
      expect(await screen.findByRole('button', { name: 'パートナーの投稿' })).toBeInTheDocument()
    })

    it('パートナーの投稿タブに切り替えるとパートナー投稿取得APIが呼ばれる', async () => {
      vi.mocked(pairApi.getStatus).mockResolvedValue({
        data: { paired: true, partner_name: 'パートナー' }
      } as any)

      const user = userEvent.setup()
      renderPostList()

      await user.click(await screen.findByRole('button', { name: 'パートナーの投稿' }))
      await screen.findByText('パートナーの本文')
      expect(pairApi.getPartnerPosts).toHaveBeenCalled()
    })

it('can_view=trueの投稿に共有中バッジが表示される', async () => {
    vi.mocked(pairApi.getStatus).mockResolvedValueOnce({
    data: { paired: true }
  } as any)

  vi.mocked(axiosInstance.get).mockResolvedValueOnce({
    data: [
      {
        id: 1,
        title: 'テストタイトル',
        body: 'テスト本文',
        can_view: true, // ← ここだけtrue
        category: { id: 1, name: 'テストカテゴリ' }
      }
    ]
  } as any)
  
  const user = userEvent.setup()
  renderPostList()

  await closeGuideIfExists(user)

  expect(await screen.findByText('共有中')).toBeInTheDocument()
})

    it('パートナーの投稿タブには編集・削除ボタンが表示されない', async () => {
      vi.mocked(pairApi.getStatus).mockResolvedValue({
        data: { paired: true, partner_name: 'パートナー' }
      } as any)

      const user = userEvent.setup()
      renderPostList()

      await user.click(await screen.findByRole('button', { name: 'パートナーの投稿' }))
      await screen.findByText('パートナーの本文')

      expect(screen.queryByRole('button', { name: '修正' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '削除' })).not.toBeInTheDocument()
    })
  })

describe('Guide,Info,Toast', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('初回ユーザーはGuideModalが表示される', async () => {
    renderPostList()

    const dialogs = await screen.findAllByRole('dialog')

    expect(dialogs.length).toBeGreaterThan(0)

    expect(
      within(dialogs[0]).getByText('未来の子どもに、今の想いを残そう')
    ).toBeInTheDocument()
  })

  it('GuideModalを閉じるとlocalStorageに保存される', async () => {
    const user = userEvent.setup()
    renderPostList()

    const dialogs = await screen.findAllByRole('dialog')
    const skipButton = within(dialogs[0]).getByText('スキップ')

    await user.click(skipButton)

    expect(localStorage.getItem('hasSeenGuide')).toBe('true')
  })

  it('GuideModalを閉じると投稿取得が走る', async () => {
    const user = userEvent.setup()
    renderPostList()

    const dialogs = await screen.findAllByRole('dialog')
    const skipButton = within(dialogs[0]).getByText('スキップ')

    await user.click(skipButton)

    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(
        '/api/v1/posts',
        expect.any(Object)
      )
    })
  })

  it('Guide済み & 投稿0件のときSimpleInfoModalが表示される', async () => {
    localStorage.setItem('hasSeenGuide', 'true')

    vi.mocked(axiosInstance.get).mockResolvedValue({ data: [] } as any)
const user = userEvent.setup()
    renderPostList()

    await closeGuideIfExists(user)

    expect(
      await screen.findByText('思いついた今が、残しどきです')
    ).toBeInTheDocument()
  })

  it('SimpleInfoModalの閉じるでModalが消える', async () => {
    localStorage.setItem('hasSeenGuide', 'true')

    vi.mocked(axiosInstance.get).mockResolvedValue({ data: [] } as any)

    const user = userEvent.setup()
    renderPostList()

    await closeGuideIfExists(user)

    const closeBtn = await screen.findByText('閉じる')
    await user.click(closeBtn)

    await waitFor(() => {
      expect(
        screen.queryByText('思いついた今が、残しどきです')
      ).not.toBeInTheDocument()
    })
  })

  it('「書いてみる」で新規投稿画面に遷移する', async () => {
    localStorage.setItem('hasSeenGuide', 'true')

    vi.mocked(axiosInstance.get).mockResolvedValue({ data: [] } as any)

    const user = userEvent.setup()
    renderPostList()

     await closeGuideIfExists(user)

    const btn = await screen.findByText('書いてみる')
    await user.click(btn)

    expect(await screen.findByText('新規作成')).toBeInTheDocument()
  })

  it('投稿作成後にToastが表示される', async () => {
    localStorage.setItem('hasSeenGuide', 'true')

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={[{
          pathname: '/posts',
          state: { created: true }
        }]}>
          <Routes>
            <Route path="/posts" element={<PostList />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    )

    const toasts = await screen.findAllByText(
      '記録を残しました。未来へのメッセージになります'
    )

    expect(toasts.length).toBeGreaterThan(0)
  })

  it('Toastは閉じるボタンで消える', async () => {
    localStorage.setItem('hasSeenGuide', 'true')

    const user = userEvent.setup()

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={[{
          pathname: '/posts',
          state: { created: true }
        }]}>
          <Routes>
            <Route path='/posts' element={<PostList />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    )

    const closeButtons = await screen.findAllByText('閉じる')
    await user.click(closeButtons[0])

    await waitFor(() => {
      expect(
        screen.queryByText('投稿を作成しました')
      ).not.toBeInTheDocument()
    })
  })
})
})