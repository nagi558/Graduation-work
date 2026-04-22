import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { ForgotPassword } from '@/pages/ForgotPassword'
import axiosInstance from '@/lib/axios'
import { vi } from 'vitest'

vi.mock('@/lib/axios', () => ({
  default: {
    post: vi.fn()
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

const renderForgotPassword = () => {
  render(
    <BrowserRouter>
      <ForgotPassword />
    </BrowserRouter>
  )
}

describe('ForgotPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('フォームが表示される', () => {
    renderForgotPassword()
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '再設定メールを送信' })).toBeInTheDocument()
  })

  it('メールアドレスが空の場合エラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    renderForgotPassword()
    await user.click(screen.getByRole('button', { name: '再設定メールを送信' }))
    expect(await screen.findByText('メールアドレスを入力してください')).toBeInTheDocument()
  })

  it('メールアドレスの形式が不正な場合エラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    renderForgotPassword()

    const input = screen.getByLabelText('メールアドレス')
    const button = screen.getByRole('button', { name: '再設定メールを送信' })

    await user.type(input, 'invalid@')
    fireEvent.submit(button.closest('form')!)

    expect(await screen.findByText('有効なメールアドレスを入力してください')).toBeInTheDocument()
  })

  it('送信成功時に送信完了画面へ遷移する', async () => {
    const user = userEvent.setup()
    vi.mocked(axiosInstance.post).mockResolvedValueOnce({})
    renderForgotPassword()
    await user.type(screen.getByLabelText('メールアドレス'), 'test@test.com')
    await user.click(screen.getByRole('button', { name: '再設定メールを送信' }))
    expect(mockNavigate).toHaveBeenCalledWith('/forgot-password/sent')
  })

  it('存在しないメールアドレスの場合エラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    vi.mocked(axiosInstance.post).mockRejectedValueOnce({
      response: { data: { message: 'このメールアドレスは登録されていません' } }
    })
    renderForgotPassword()
    await user.type(screen.getByLabelText('メールアドレス'), 'notfound@test.com')
    await user.click(screen.getByRole('button', { name: '再設定メールを送信' }))
    expect(await screen.findByText('このメールアドレスは登録されていません')).toBeInTheDocument()
  })
})