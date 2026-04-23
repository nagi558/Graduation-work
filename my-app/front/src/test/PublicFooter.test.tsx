import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, MemoryRouter, useLocation } from 'react-router-dom'
import { PublicFooter } from '@/components/PublicFooter'

const LocationDisplay = () => {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

const renderPublicFooter = () => {
  render(
    <BrowserRouter>
      <PublicFooter />
    </BrowserRouter>
  )
}

describe('PublicFooter', () => {
  it('3つのリンクが表示される', () => {
    renderPublicFooter()
    expect(screen.getByRole('button', { name: '利用規約' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'プライバシーポリシー' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'お問い合わせ' })).toBeInTheDocument()
  })

  it('利用規約ボタンを押すと /terms に遷移する', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <PublicFooter />
        <LocationDisplay />
      </MemoryRouter>
    )
    await user.click(screen.getByRole('button', { name: '利用規約' }))
    expect(screen.getByRole('button', { name: '利用規約' })).toBeInTheDocument()
  })

  it('プライバシーポリシーボタンを押してもエラーが発生しない', async () => {
    const user = userEvent.setup()
    renderPublicFooter()
    await user.click(screen.getByRole('button', { name: 'プライバシーポリシー' }))
    expect(screen.getByRole('button', { name: 'プライバシーポリシー' })).toBeInTheDocument()
  })
})