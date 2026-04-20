import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { PostNew } from '@/pages/PostNew'
import { PostList } from '@/pages/PostList'
import { CategoryManage } from '@/pages/CategoryManage'
import { server } from './server'
import { http, HttpResponse } from 'msw'

const renderPostNew = () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/posts/new']}>
        <Routes>
          <Route path="/posts/new" element={<PostNew />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/categories/manage" element={<CategoryManage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('PostNew', () => {
  it('新規作成フォームが表示される', async () => {
    renderPostNew()
    expect(await screen.findByText('新規作成')).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: '追加する' })).toBeInTheDocument()
  })

  it('カテゴリ一覧が表示される', async () => {
    renderPostNew()
    expect(await screen.findAllByText(/テストカテゴリ/)).toHaveLength(2)
  })

  it('タイトルが空の場合エラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    renderPostNew()
    await user.click(await screen.findByRole('button', { name: '追加する' }))
    expect(await screen.findByText('タイトルを入力してください')).toBeInTheDocument()
  })

  it('正常に投稿を作成すると一覧画面に遷移する', async () => {
    const user = userEvent.setup()

    server.use(
      http.post('/api/v1/posts', async ({ request }) => {
        const body = await request.json() as { post: { title: string, body: string } }
        return HttpResponse.json({
          id: 1,
          title: body.post.title,
          body: body.post.body,
          category: { id: 1, name: 'テストカテゴリ' }
        })
      })
    )

    renderPostNew()
    await screen.findByText('新規作成')

    await user.type(screen.getByPlaceholderText('月1,000円でも投資に回す'), 'テストタイトル')
    await user.selectOptions(screen.getByRole('combobox'), '1')
    await user.type(screen.getByPlaceholderText('投資は長く続けるほど複利が大きくなっていくので、早く始めるほど将来的なリターンも大きくなっていく（15年以上の長期投資を前提とする）'), 'テスト本文')

    const submitButton = screen.getByRole('button', {name: '追加する' })

    await user.click(submitButton)
    
    expect(await screen.findByText('テストタイトル')).toBeInTheDocument()
  })

  it('カテゴリ編集ボタンをクリックするとカテゴリ管理画面に遷移する', async () => {
    const user = userEvent.setup()
    renderPostNew()
    await user.click(await screen.findByRole('button', { name: 'カテゴリ編集' }))
    expect(await screen.findByText('カテゴリ一覧')).toBeInTheDocument()
  })
})