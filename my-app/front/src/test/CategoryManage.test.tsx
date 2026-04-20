import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { CategoryManage } from '@/pages/CategoryManage'
import { CategoryUpdate } from '@/pages/CategoryUpdate'
import { CategoryNew } from '@/pages/CategoryNew'
import axiosInstance from '@/lib/axios'

vi.mock('@/lib/axios')

const mockGet = vi.mocked(axiosInstance.get)
const mockDelete = vi.mocked(axiosInstance.delete)

const renderCategoryManage = () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/categories/manage']}>
        <Routes>
          <Route path="/categories/manage" element={<CategoryManage />} />
          <Route path="/categories/:id/edit" element={<CategoryUpdate />} />
          <Route path="/categories/new" element={<CategoryNew />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('CategoryManage', () => {

  beforeEach(() => {
    mockGet.mockImplementation((url) => {
      if (url === '/api/v1/categories') {
        return Promise.resolve({
          data: [
            { id: 1, name: 'テストカテゴリ1' },
            { id: 2, name: 'テストカテゴリ2' }
          ]
        })
      }
      return Promise.reject(new Error('not mocked'))
    })

    mockDelete.mockResolvedValue({
      data: { message: '削除しました' }
    })
  })

  it('カテゴリ一覧が表示される', async () => {
    renderCategoryManage()

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    expect(await screen.findByText('テストカテゴリ1')).toBeInTheDocument()
    expect(await screen.findByText('テストカテゴリ2')).toBeInTheDocument()
  })

  it('新規作成ボタンをクリックすると新規作成画面に遷移する', async () => {
    const user = userEvent.setup()
    renderCategoryManage()

    await user.click(await screen.findByRole('button', { name: '新規作成' }))
    expect(await screen.findByText('新規作成')).toBeInTheDocument()
  })

  it('修正ボタンをクリックすると編集画面に遷移する', async () => {
    const user = userEvent.setup()
    renderCategoryManage()

    const buttons = await screen.findAllByRole('button', { name: '修正' })
    await user.click(buttons[0])

    expect(await screen.findByText('カテゴリ編集')).toBeInTheDocument()
  })

  it('削除ボタンをクリックするとカテゴリが削除される', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderCategoryManage()

    await screen.findByText('テストカテゴリ1')

    const deleteButton = screen.getAllByRole('button', { name: '削除' })[0]
    await user.click(deleteButton)

    expect(screen.queryByText('テストカテゴリ1')).not.toBeInTheDocument()
  })
})