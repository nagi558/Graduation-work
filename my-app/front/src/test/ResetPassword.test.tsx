import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ResetPassword } from '@/pages/ResetPassword'
import axiosInstance from '@/lib/axios'
import { vi } from 'vitest'

vi.mock('@/lib/axios', () => ({
  default: {
    put: vi.fn()
  }
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// トークンありで描画
const renderWithToken = () => {
  render(
    <MemoryRouter initialEntries={['/reset-password?reset_password_token=validtoken123']}>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </MemoryRouter>
  )
}

// トークンなしで描画
const renderWithoutToken = () => {
  render(
    <MemoryRouter initialEntries={['/reset-password']}>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ResetPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('トークンがある場合フォームが表示される', async () => {
    renderWithToken()
    expect(await screen.findByLabelText('新しいパスワード')).toBeInTheDocument()
    expect(screen.getByLabelText('新しいパスワード（確認）')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'パスワードを更新する' })).toBeInTheDocument()
  })

  it('トークンがない場合期限切れ画面が表示される', async () => {
    renderWithoutToken()
    expect(await screen.findByText('リンクの有効期限が切れています')).toBeInTheDocument()
  })

  it('パスワードが空の場合エラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    renderWithToken()
    await user.click(await screen.findByRole('button', { name: 'パスワードを更新する' }))
    expect(await screen.findByText('パスワードを入力してください')).toBeInTheDocument()
  })

  it('パスワードが8文字未満の場合エラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    renderWithToken()
    await user.type(await screen.findByLabelText('新しいパスワード'), 'short')
    await user.click(screen.getByRole('button', { name: 'パスワードを更新する' }))
    expect(await screen.findByText('パスワードは8文字以上で入力してください')).toBeInTheDocument()
  })

  it('パスワードが一致しない場合エラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    renderWithToken()
    await user.type(await screen.findByLabelText('新しいパスワード'), 'password123')
    await user.type(screen.getByLabelText('新しいパスワード（確認）'), 'different123')
    await user.click(screen.getByRole('button', { name: 'パスワードを更新する' }))
    expect(await screen.findByText('パスワードが一致しません')).toBeInTheDocument()
  })

  it('更新成功時に完了画面へ遷移する', async () => {
    const user = userEvent.setup()
    vi.mocked(axiosInstance.put).mockResolvedValueOnce({})
    renderWithToken()
    await user.type(await screen.findByLabelText('新しいパスワード'), 'newpassword123')
    await user.type(screen.getByLabelText('新しいパスワード（確認）'), 'newpassword123')
    await user.click(screen.getByRole('button', { name: 'パスワードを更新する' }))
    expect(mockNavigate).toHaveBeenCalledWith('/reset-password/complete')
  })

  it('トークン期限切れエラー時に期限切れ画面が表示される', async () => {
    const user = userEvent.setup()
    vi.mocked(axiosInstance.put).mockRejectedValueOnce({
      response: { status: 422 }
    })
    renderWithToken()
    await user.type(await screen.findByLabelText('新しいパスワード'), 'newpassword123')
    await user.type(screen.getByLabelText('新しいパスワード（確認）'), 'newpassword123')
    await user.click(screen.getByRole('button', { name: 'パスワードを更新する' }))
    expect(await screen.findByText('リンクの有効期限が切れています')).toBeInTheDocument()
  })
})