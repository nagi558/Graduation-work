// src/test/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  // 投稿一覧
  http.get('/api/v1/posts', () => {
    return HttpResponse.json([
      { id: 1, title: 'テストタイトル', body: 'テスト本文', category: { id: 1, name: 'テスト' } }
    ])
  }),

  // 投稿詳細
  http.get('/api/v1/posts/:id', () => {
    return HttpResponse.json(
      { id: 1, title: 'テストタイトル', body: 'テスト本文', category: { id: 1, name: 'テスト' } }
    )
  }),

  // 投稿作成
  http.post('/api/v1/posts', () => {
    return HttpResponse.json(
      { id: 1, title: 'テストタイトル', body: 'テスト本文', category: { id: 1, name: 'テスト' } },
      { status: 201 }
    )
  }),

  // 投稿更新
  http.patch('/api/v1/posts/:id', () => {
    return HttpResponse.json(
      { id: 1, title: '更新タイトル', body: 'テスト本文', category: { id: 1, name: 'テスト' } }
    )
  }),

  // 投稿削除
  http.delete('/api/v1/posts/:id', () => {
    return HttpResponse.json({ message: '投稿を削除しました' })
  }),

  // カテゴリ一覧
  http.get('/api/v1/categories', () => {
    return HttpResponse.json([
      { id: 1, name: 'テストカテゴリ' }
    ])
  }),

  // カテゴリ詳細
  http.get('/api/v1/categories/:id', () => {
    return HttpResponse.json(
      { id: 1, name: 'テストカテゴリ' }
    )
  }),

  // カテゴリ作成
  http.post('/api/v1/categories', () => {
    return HttpResponse.json(
      { id: 1, name: 'テストカテゴリ' },
      { status: 201 }
    )
  }),

  // カテゴリ更新
  http.patch('/api/v1/categories/:id', () => {
    return HttpResponse.json(
      { id: 1, name: '更新カテゴリ' }
    )
  }),

  // カテゴリ削除
  http.delete('/api/v1/categories/:id', () => {
    return HttpResponse.json({ message: 'カテゴリを削除しました' })
  }),

  // ログイン
  http.post('/auth/sign_in', async ({ request }) => {
    const body = await request.json() as { email: string, password: string }
    if (body.email === 'test@test.com' && body.password === 'password123') {
      return HttpResponse.json(
        { data: { id: 1, email: body.email, nickname: 'テスト' } },
        { headers: {
          'access-token': 'test-token',
          'client': 'test-client',
          'uid': body.email
        }}
      )
    }
    return new HttpResponse(null, { status: 401 })
  }),

  // 会員登録
  http.post('/auth', async ({ request }) => {
    const body = await request.json() as { email: string, password: string, nickname: string }
    return HttpResponse.json(
      { data: { id: 1, email: body.email, nickname: body.nickname } },
      { status: 201 }
    )
  }),
]