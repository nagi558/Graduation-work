import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { PublicLayout } from "@/components/PublicLayout"

const renderPublicLayout = (children = <div>テストコンテンツ</div>) => {
  render(
    <BrowserRouter>
      <PublicLayout>{children}</PublicLayout>
    </BrowserRouter>
  )
}

describe('PublicLayout', () => {
  it('childrenが表示される', () => {
    renderPublicLayout()
    expect(screen.getByText('テストコンテンツ')).toBeInTheDocument()
  })

  it('PublicFooterが表示される', () => {
    renderPublicLayout()
    expect(screen.getByRole('button', { name: '利用規約' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'プライバシーポリシー' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'お問い合わせ' })).toBeInTheDocument()
  })

  it('Headerが表示される', () => {
    renderPublicLayout()
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })
})