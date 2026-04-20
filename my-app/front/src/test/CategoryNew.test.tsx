import { render, screen,} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CategoryNew } from '../pages/CategoryNew'
import { server } from './msw/server'
import { http, HttpResponse } from 'msw'
import { fireEvent } from '@testing-library/react'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

const renderCategoryNew = () => {
  render(
    <MemoryRouter>
      <CategoryNew />
    </MemoryRouter>
  )
}

server.use(
  http.post('http://localhost:3000/api/v1/categories', async ({ request }) => {
    const body = await request.json() as { category: { name: string } }
    return HttpResponse.json({
      id: 1,
      name: body.category.name,
    })
  })
)

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

  test('追加ボタンを押すと送信中になり、その後カテゴリ管理画面に遷移する', async () => {
    renderCategoryNew()

    const input = screen.getByPlaceholderText('恋愛 など')
    await userEvent.type(input, 'テストカテゴリ')

    const button = screen.getByRole('button', { name: '追加する' })
    fireEvent.submit(button.closest('form')!)

    expect(await screen.findByText('カテゴリ一覧')).toBeInTheDocument()
  })

  test('カテゴリ名が空の場合エラーメッセージが表示される', async () => {
    renderCategoryNew()

    const button = screen.getByRole('button', { name: '追加する' })
    await userEvent.click(button)

    // 修正
    expect(await screen.findByText('カテゴリを入力してください')).toBeInTheDocument()
  })
})