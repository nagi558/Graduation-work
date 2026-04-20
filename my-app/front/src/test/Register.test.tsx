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

describe('Register', () => {
  it('登録フォームが表示される', () => {
    renderRegister()
    expect(screen.getByRole('button', { name: '登録' })).toBeInTheDocument()
  })

  it('全項目が空の場合エラーメッセージが表示される', async () => {
    renderRegister()

    const button = screen.getByRole('button', { name: '登録' })
    await userEvent.click(button)

    expect(await screen.findByText('すべての項目を入力してください')).toBeInTheDocument()
  })

  it('パスワードが6文字未満の場合エラーメッセージが表示される', async () => {
    renderRegister()

    const nickname = screen.getByPlaceholderText('ヤマダ')
    const email = screen.getByPlaceholderText('aaaaaa@aaa.com')
    const password = screen.getByPlaceholderText('6文字以上')
    const passwordConfirmation = screen.getByPlaceholderText('パスワードを再入力')

    await userEvent.type(nickname, 'テスト太郎')
    await userEvent.type(email, 'test@example.com')
    await userEvent.type(password, 'abc') // 6文字未満
    await userEvent.type(passwordConfirmation, 'abc')

    const button = screen.getByRole('button', { name: '登録' })
    await userEvent.click(button)

    expect(await screen.findByText('パスワードは6文字以上で入力してください')).toBeInTheDocument()
  })

  it('パスワードが一致しない場合エラーメッセージが表示される', async () => {
    renderRegister()

    const nickname = screen.getByPlaceholderText('ヤマダ')
    const email = screen.getByPlaceholderText('aaaaaa@aaa.com')
    const password = screen.getByPlaceholderText('6文字以上')
    const passwordConfirmation = screen.getByPlaceholderText('パスワードを再入力')
   
    await userEvent.type(nickname, 'テスト太郎')
    await userEvent.type(email, 'test@example.com')
    await userEvent.type(password, 'abcdef')
    await userEvent.type(passwordConfirmation, 'abcdeg')

    const button = screen.getByRole('button', { name: '登録' })
    await userEvent.click(button)

    expect(await screen.findByText('パスワードが一致しません')).toBeInTheDocument()
  })

  it('メール形式が不正の場合エラーメッセージが表示される', async () => {
    renderRegister()

    const emailInput = screen.getByPlaceholderText('aaaaaa@aaa.com')
    await userEvent.type(emailInput, 'invalid-email')

    const button = screen.getByRole('button', { name: '登録' })
    await userEvent.click(button)

    expect(await screen.findByText('すべての項目を入力してください')).toBeInTheDocument()
  })
})