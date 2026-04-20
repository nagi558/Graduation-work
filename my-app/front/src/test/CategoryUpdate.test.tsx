import { render, screen,waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CategoryUpdate } from '../pages/CategoryUpdate'
import { server } from './msw/server'
import { http, HttpResponse } from 'msw'
import { Route, Routes } from 'react-router-dom'

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
    <MemoryRouter initialEntries={['/categories/update/1']}>
      <Routes>
        <Route path="/categories/update/:id" element={<CategoryUpdate />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('CategoryUpdate', () => {
  test('カテゴリ編集画面が表示される', async () => {
    server.use(
      http.get(/\/api\/v1\/categories\/1(\?.*)?$/, () => {
        return HttpResponse.json({
          id: 1,
          name: 'テストカテゴリ'
        })
      })
    )
    
    renderCategoryUpdate()

    expect(screen.getByRole('status')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByDisplayValue('テストカテゴリ')).toBeInTheDocument()
    })

    expect(screen.getByText('カテゴリ編集')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

test('更新するボタンを押すとカテゴリ管理画面に遷移する', async () => {
  server.use(
    http.get(/\/api\/v1\/categories\/1(\?.*)?$/, () => {
      return HttpResponse.json({
        id: 1,
        name: 'テストカテゴリ'
      })
    }),

    http.patch(/\/api\/v1\/categories\/1(\?.*)?$/, () => {
      return HttpResponse.json({
        id: 1,
        name: '更新後カテゴリ'
      })
    })
  )

    renderCategoryUpdate()

    const button = await screen.findByText('更新する')
    await userEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/categories/manage')
  })
})