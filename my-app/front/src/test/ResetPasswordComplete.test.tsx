import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { ResetPasswordComplete } from '@/pages/ResetPasswordComplete'
import { vi } from 'vitest'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('ResetPasswordComplete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('完了メッセージが表示される', () => {
    render(<BrowserRouter><ResetPasswordComplete /></BrowserRouter>)
    expect(screen.getByText('パスワードを更新しました')).toBeInTheDocument()
  })

  it('ログイン画面へボタンでログインへ遷移する', async () => {
    const user = userEvent.setup()
    render(<BrowserRouter><ResetPasswordComplete /></BrowserRouter>)
    await user.click(screen.getByRole('button', { name: 'ログイン画面へ' }))
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })
})