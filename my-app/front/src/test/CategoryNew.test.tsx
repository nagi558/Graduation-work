import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CategoryNew } from '../pages/CategoryNew'
import { CategoryManage } from '../pages/CategoryManage'
import axiosInstance from '@/lib/axios'

// navigate モック
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/lib/axios')
const mockPost = vi.mocked(axiosInstance.post)

const renderCategoryNew = () => {
  render(
    <MemoryRouter initialEntries={['/categories/new']}>
      <Routes>
        <Route path="/categories/new" element={<CategoryNew />} />
        <Route path="/categories/manage" element={<CategoryManage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('CategoryNew', () => {

  beforeEach(() => {
    mockPost.mockResolvedValue({
      data: {
        id: 1,
        name: 'テストカテゴリ'
      }
    })
  })

  test('カテゴリ作成フォームが表示される', () => {
    renderCategoryNew()

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
    const user = userEvent.setup()
    renderCategoryNew()

    const input = screen.getByPlaceholderText('恋愛 など')
    await user.type(input, 'テストカテゴリ')

    const button = screen.getByRole('button', { name: '追加する' })
    await user.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/categories/manage')
  })

  test('カテゴリ名が空の場合エラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    renderCategoryNew()

    const button = screen.getByRole('button', { name: '追加する' })
    await user.click(button)

    expect(await screen.findByText('カテゴリを入力してください')).toBeInTheDocument()
  })
})