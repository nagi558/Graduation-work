import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { NoFooterLayout } from "@/components/NoFooterLayout"

const renderNoFooterLayout = (children = <div>テストコンテンツ</div>) => {
  render(
    <BrowserRouter>
      <NoFooterLayout>{children}</NoFooterLayout>
    </BrowserRouter>
  )
}

describe('NoFooterLayout', () => {
  it('childrenが表示される', () => {
    renderNoFooterLayout()
    expect(screen.getByText('テストコンテンツ')).toBeInTheDocument()
  })

  it('Headerが表示される', () => {
    renderNoFooterLayout()
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('フッターのリンクが表示されない', () => {
    renderNoFooterLayout()
    expect(screen.queryByRole('button', { name: '利用規約' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'プライバシーポリシー' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'お問い合わせ' })).not.toBeInTheDocument()
  })
})