import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CategoryUpdate } from '../pages/CategoryUpdate'
import axiosInstance from '@/lib/axios'

// navigateモック
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/lib/axios')
const mockGet = vi.mocked(axiosInstance.get)
const mockPatch = vi.mocked(axiosInstance.patch)

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

  beforeEach(() => {
    mockGet.mockImplementation((url) => {
      if (url === '/api/v1/categories/1') {
        return Promise.resolve({
          data: { id: 1, name: 'テストカテゴリ' }
        })
      }
      return Promise.reject(new Error('not mocked'))
    })

    mockPatch.mockResolvedValue({
      data: { id: 1, name: '更新後カテゴリ' }
    })
  })

  test('カテゴリ編集画面が表示される', async () => {
    renderCategoryUpdate()

    expect(screen.getByRole('status')).toBeInTheDocument()

    expect(await screen.findByDisplayValue('テストカテゴリ')).toBeInTheDocument()
    expect(screen.getByText('カテゴリ編集')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  test('更新するボタンを押すとカテゴリ管理画面に遷移する', async () => {
    const user = userEvent.setup()
    renderCategoryUpdate()

    const button = await screen.findByText('更新する')
    await user.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/categories/manage')
  })
})