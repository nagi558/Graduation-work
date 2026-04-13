import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CategoryUpdate } from '../pages/CategoryUpdate'

// navigateモック
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderCategoryUpdate = () => {
  render(
    <MemoryRouter>
      <CategoryUpdate />
    </MemoryRouter>
  )
}

describe('CategoryUpdate', () => {
  test('カテゴリ編集画面が表示される', () => {
    renderCategoryUpdate()

    expect(screen.getByText('カテゴリ編集')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  test('更新するボタンを押すとカテゴリ管理画面に遷移する', async () => {
    renderCategoryUpdate()

    const button = screen.getByText('更新する')
    await userEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/categories/manage')
  })
})