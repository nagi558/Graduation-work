import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { ForgotPasswordSent } from '@/pages/ForgotPasswordSent'
import { vi } from 'vitest'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('ForgotPasswordSent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('送信完了メッセージが表示される', () => {
    render(<BrowserRouter><ForgotPasswordSent /></BrowserRouter>)
    expect(screen.getByText('メールを送信しました')).toBeInTheDocument()
  })

  it('ログイン画面へ戻るボタンでログインへ遷移する', async () => {
    const user = userEvent.setup()
    render(<BrowserRouter><ForgotPasswordSent /></BrowserRouter>)
    await user.click(screen.getByRole('button', { name: 'ログイン画面へ戻る' }))
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })
})