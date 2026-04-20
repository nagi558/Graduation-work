import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { PostUpdate } from '@/pages/PostUpdate'
import { PostList } from '@/pages/PostList'
import { CategoryManage } from '@/pages/CategoryManage'
import { server } from './server'
import { http, HttpResponse } from 'msw'

const renderPostUpdate = () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/posts/1/edit']}>
        <Routes>
          <Route path="/posts/:id/edit" element={<PostUpdate />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/categories/manage" element={<CategoryManage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('PostUpdate', () => {
  it('初回ロード中はスピナーが表示される', () => {
    renderPostUpdate()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('ロード完了後に編集フォームが表示される', async () => {
    renderPostUpdate()

    // スピナーが消えるのを待つ
    await waitFor(() => {
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
  })

  // フォームが表示される
    expect(await screen.findByText('投稿編集')).toBeInTheDocument()
  })


  it('既存データがフォームに表示される', async () => {
    renderPostUpdate()

    // スピナーが消えるのを待つ
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    expect(await screen.findByDisplayValue('テストタイトル')).toBeInTheDocument()
    expect(await screen.findByDisplayValue('テスト本文')).toBeInTheDocument()
  })

  it('カテゴリ一覧が表示される', async () => {
    renderPostUpdate()
    expect(await screen.findAllByText(/テストカテゴリ/)).toHaveLength(2)
  })

  it('タイトルが空の場合エラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    renderPostUpdate()

    const titleInput = await screen.findByDisplayValue('テストタイトル')
    await user.clear(titleInput)
    await user.click(screen.getByRole('button', { name: '更新する' }))

    expect(await screen.findByText('タイトルを入力してください')).toBeInTheDocument()
  })

  it('正常に更新すると一覧画面に遷移する', async () => {
    const user = userEvent.setup()

    server.use(
      http.patch('/api/v1/posts/1', async ({ request }) => {
        const body = await request.json() as { post: { title: string, body: string } }
        return HttpResponse.json({
          id: 1,
          title: body.post.title,
          body: body.post.body,
          category: { id: 1, name: 'テストカテゴリ' }
        })
      })
    )

    renderPostUpdate()

    const titleInput = await screen.findByDisplayValue('テストタイトル')
    await user.clear(titleInput)
    await user.type(titleInput, '更新タイトル')

    await user.click(screen.getByRole('button', { name: '更新する' }))

    expect(await screen.findByText('テストタイトル')).toBeInTheDocument()
  })

  it('カテゴリ編集ボタンをクリックするとカテゴリ管理画面に遷移する', async () => {
    const user = userEvent.setup()
    renderPostUpdate()

    await user.click(await screen.findByRole('button', { name: 'カテゴリ編集' }))

    expect(await screen.findByText('カテゴリ一覧')).toBeInTheDocument()
  })
})