import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { Login } from '@/pages/Login'

const renderLogin = () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthProvider>
  )
}

describe('Login', () => {
  it('ログインフォームが表示される', () => {
    renderLogin()
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument()
  })

  it('メールアドレスが空の場合エラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    renderLogin()
    const button = screen.getByRole('button', { name: 'ログイン' })
    await user.click(button)

    expect(button).not.toBeDisabled()

    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()

    expect(await screen.findByText('メールアドレスを入力してください')).toBeInTheDocument()
  })

  it('パスワードが空の場合エラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    renderLogin()
    await user.type(screen.getByLabelText('メールアドレス'), 'test@test.com')

    const button = screen.getByRole('button', { name: 'ログイン' })
    await user.click(button)

    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()

    expect(await screen.findByText('パスワードを入力してください')).toBeInTheDocument()
  })
})