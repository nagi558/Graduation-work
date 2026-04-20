import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { CategoryManage } from '@/pages/CategoryManage'
import { CategoryUpdate } from '@/pages/CategoryUpdate'
import { CategoryNew } from '@/pages/CategoryNew'
import { server } from './server'
import { http, HttpResponse } from 'msw'

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

    server.use(
      http.delete('/api/v1/categories/1', () => {
        return HttpResponse.json({ message: '削除しました' })
      })
    )

    renderCategoryManage()

    await screen.findByText('テストカテゴリ1')

    const deleteButton = screen.getAllByRole('button', { name: '削除' })[0]

    await user.click(deleteButton)

    expect(screen.queryByText('テストカテゴリ1')).not.toBeInTheDocument()
  })
})