import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { InviteJoin } from '@/pages/InviteJoin'
import { PostList } from '@/pages/PostList'
import { pairApi } from '@/lib/pairApi'
import axiosInstance from '@/lib/axios'
import { vi } from 'vitest'

vi.mock('@/lib/pairApi')
vi.mock('@/lib/axios')

const renderInviteJoin = (token = 'valid-token') => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[`/invite/${token}`]}>
        <Routes>
          <Route path="/invite/:token" element={<InviteJoin />} />
          <Route path="/posts" element={<PostList />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('InviteJoin', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  beforeEach(() => {
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: [] } as any)
    vi.mocked(pairApi.getStatus).mockResolvedValue({
      data: { paired: false }
    } as any)
    vi.mocked(pairApi.getPartnerPosts).mockResolvedValue({
      data: []
    } as any)
  })

  describe('トークン検証', () => {
    it('有効なトークンの場合パートナー名と参加ボタンが表示される', async () => {
      vi.mocked(pairApi.verifyToken).mockResolvedValue({
        data: { partner_name: '太郎' }
      } as any)

      renderInviteJoin()

      expect(await screen.findByText('太郎')).toBeInTheDocument()
      expect(await screen.findByText('さんからの招待です', { exact: false })).toBeInTheDocument()
      expect(await screen.findByRole('button', { name: '参加する' })).toBeInTheDocument()
    })

    it('無効なトークンの場合エラーメッセージが表示される', async () => {
      vi.mocked(pairApi.verifyToken).mockRejectedValue({
        response: { status: 404 }
      })

      renderInviteJoin('invalid-token')

      expect(await screen.findByText('招待URLが無効または期限切れです')).toBeInTheDocument()
    })

    it('トークン検証APIが正しいトークンで呼ばれる', async () => {
      vi.mocked(pairApi.verifyToken).mockResolvedValue({
        data: { partner_name: '太郎' }
      } as any)

      renderInviteJoin('test-token')

      await screen.findByRole('button', { name: '参加する' })
      expect(pairApi.verifyToken).toHaveBeenCalledWith('test-token')
    })
  })

  describe('参加処理', () => {
    beforeEach(() => {
      vi.mocked(pairApi.verifyToken).mockResolvedValue({
        data: { partner_name: '太郎' }
      } as any)
    })

    it('参加するボタンをクリックすると参加APIが呼ばれる', async () => {
      vi.mocked(pairApi.join).mockResolvedValue({
        data: { paired: true, partner_name: '太郎' }
      } as any)

      const user = userEvent.setup()
      renderInviteJoin('test-token')

      await user.click(await screen.findByRole('button', { name: '参加する' }))

      expect(pairApi.join).toHaveBeenCalledWith('test-token')
    })

    it('参加成功後に投稿一覧画面に遷移する', async () => {
      vi.mocked(pairApi.join).mockResolvedValue({
        data: { paired: true, partner_name: '太郎' }
      } as any)

      const user = userEvent.setup()
      renderInviteJoin()

      await user.click(await screen.findByRole('button', { name: '参加する' }))

      expect(await screen.findByText('伝えたいこと')).toBeInTheDocument()
    })

    it('参加失敗時にエラーメッセージが表示される', async () => {
      vi.mocked(pairApi.join).mockRejectedValue({
        response: { data: { errors: ['すでにパートナーと接続済みです'] } }
      })

      const user = userEvent.setup()
      renderInviteJoin()

      await user.click(await screen.findByRole('button', { name: '参加する' }))

      expect(await screen.findByText('すでにパートナーと接続済みです')).toBeInTheDocument()
    })

    it('キャンセルボタンをクリックすると投稿一覧画面に遷移する', async () => {
      const user = userEvent.setup()
      renderInviteJoin()

      await user.click(await screen.findByRole('button', { name: 'キャンセル' }))

      expect(await screen.findByText('伝えたいこと')).toBeInTheDocument()
    })
  })
})