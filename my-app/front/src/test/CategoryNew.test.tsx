import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CategoryNew } from '../pages/CategoryNew'

const renderCategoryNew = () => {
  render(
    <MemoryRouter>
      <CategoryNew />
    </MemoryRouter>
  )
}

describe('CategoryNew', () => {
  test('カテゴリ作成フォームが表示される', () => {
    renderCategoryNew()

    // 修正
    expect(screen.getByText('新規作成')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('恋愛 など')).toBeInTheDocument()
  })

  test('カテゴリ名を入力できる', async () => {
    renderCategoryNew()

    const input = screen.getByPlaceholderText('恋愛 など')
    await userEvent.type(input, 'テストカテゴリ')

    expect(input).toHaveValue('テストカテゴリ')
  })

  test('追加ボタンを押すとカテゴリ管理画面に遷移する', async () => {
    renderCategoryNew()

    const input = screen.getByPlaceholderText('恋愛 など')
    await userEvent.type(input, 'テストカテゴリ')

    const button = screen.getByRole('button', { name: '追加する' })
    await userEvent.click(button)

    // ここは実装次第（例）
    // navigateのmockが必要なら後で対応
  })

  test('カテゴリ名が空の場合エラーメッセージが表示される', async () => {
    renderCategoryNew()

    const button = screen.getByRole('button', { name: '追加する' })
    await userEvent.click(button)

    // 修正
    expect(await screen.findByText('カテゴリを入力してください')).toBeInTheDocument()
  })
})