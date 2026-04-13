import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { Register } from '@/pages/Register'

const renderRegister = () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    </AuthProvider>
  )
}

const fillForm = async (user: ReturnType<typeof userEvent.setup>, overrides = {}) => {
  const values = {
    nickname: 'テスト',
    email: 'test@test.com',
    password: 'password123',
    password_confirmation: 'password123',
    ...overrides
  }
  await user.type(screen.getByLabelText('ニックネーム'), values.nickname)
  await user.type(screen.getByLabelText('メールアドレス'), values.email)
  await user.type(screen.getByLabelText('パスワード'), values.password)
  await user.type(screen.getByLabelText('パスワード（確認）'), values.password_confirmation)
}

describe('Register', () => {
  it('登録フォームが表示される', () => {
    renderRegister()
    expect(screen.getByRole('button', { name: '登録' })).toBeInTheDocument()
  })

  it('全項目が空の場合エラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    renderRegister()
    await user.click(screen.getByRole('button', { name: '登録' }))
    expect(await screen.findByText('すべての項目を入力してください')).toBeInTheDocument()
  })

  it('パスワードが6文字未満の場合エラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    renderRegister()
    await fillForm(user, { password: '12345', password_confirmation: '12345' })
    await user.click(screen.getByRole('button', { name: '登録' }))
    expect(await screen.findByText('パスワードは6文字以上で入力してください')).toBeInTheDocument()
  })

  it('パスワードが一致しない場合エラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    renderRegister()
    await fillForm(user, { password_confirmation: 'password456' })
    await user.click(screen.getByRole('button', { name: '登録' }))
    expect(await screen.findByText('パスワードが一致しません')).toBeInTheDocument()
  })

  it('メール形式が不正の場合エラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    renderRegister()
    await fillForm(user, { email: 'invalid-email' })
    await user.click(screen.getByRole('button', { name: '登録' }))
    expect(await screen.findByText('有効なメールアドレスを入力してください')).toBeInTheDocument()
  })
})