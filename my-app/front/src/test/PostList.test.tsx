import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { PostList } from '@/pages/PostList'
import { PostNew } from '@/pages/PostNew'
import { PostUpdate } from '@/pages/PostUpdate'
import { server } from './server'
import { http, HttpResponse } from 'msw'
import { vi } from 'vitest'

const renderPostList = () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/posts']}>
        <Routes>
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/new" element={<PostNew />} />
          <Route path="/posts/:id/edit" element={<PostUpdate />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('PostList', () => {
  it('投稿一覧が表示される', async () => {
    renderPostList()
    expect(await screen.findByText('テストタイトル')).toBeInTheDocument()
    expect(await screen.findByText('テスト本文')).toBeInTheDocument()
  })

  it('投稿が0件の場合メッセージが表示される', async () => {
    server.use(
      http.get('/api/v1/posts', () => {
        return HttpResponse.json([])
      })
    )

    renderPostList()
    expect(await screen.findByText('まだ投稿がありません')).toBeInTheDocument()
  })

  it('新規作成ボタンをクリックすると新規画面に遷移する', async () => {
    const user = userEvent.setup()
    renderPostList()

    await user.click(await screen.findByRole('button', { name: '新規作成' }))

    expect(await screen.findByText('新規作成')).toBeInTheDocument()
  })

  it('修正ボタンをクリックすると編集画面に遷移する', async () => {
    const user = userEvent.setup()
    renderPostList()

    await user.click(await screen.findByRole('button', { name: '修正' }))

    expect(await screen.findByText('投稿編集')).toBeInTheDocument()
  })

  it('削除ボタンをクリックすると投稿が削除される', async () => {
    const user = userEvent.setup()

    vi.spyOn(window, 'confirm').mockReturnValue(true)

    server.use(
      http.delete('/api/v1/posts/1', () => {
        return HttpResponse.json({ message: '投稿を削除しました' })
      })
    )

    renderPostList()

    await screen.findByText('テストタイトル')

    await user.click(screen.getByRole('button', { name: '削除' }))

    expect(screen.queryByText('テストタイトル')).not.toBeInTheDocument()
  })
})