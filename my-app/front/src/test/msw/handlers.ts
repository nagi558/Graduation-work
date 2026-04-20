import { http, HttpResponse } from 'msw'

export const handlers = [
  // CategoryNew（カテゴリ作成）
  http.post(/\/api\/v1\/categories$/, async ({ request }) => {
    const body = await request.json() as {
      category: { name: string }
    }

    return HttpResponse.json({
      id: 1,
      name: body.category.name,
    })
  }),

  // CategoryManage / PostUpdate（カテゴリ一覧）
  http.get('http://localhost:3000/api/v1/categories', () => {
    return HttpResponse.json([
      { id: 1, name: 'テストカテゴリ1' },
      { id: 2, name: 'テストカテゴリ2' },
    ])
  }),

  http.delete(/\/api\/v1\/categories\/\d+$/, () => {
    return HttpResponse.json({ message: '削除しました' })
  }),

  http.get(/\/api\/v1\/posts$/, () => {
    return HttpResponse.json([
      {
        id: 1,
        title: 'テストタイトル',
        body: 'テスト本文',
        category: { id: 1, name: 'テストカテゴリ' }
      }
    ])
  }),

  http.delete(/\/api\/v1\/posts\/\d+/, () => {
    return HttpResponse.json({ message: 'deleted' })
  }),

  // PostNew 作成
  http.post(/\/api\/v1\/posts/, async ({ request }) => {
    const body = await request.json() as {
      post: {
        title: string
        body: string
        category_id: number
      }
    }

    return HttpResponse.json({
      id: 1,
      title: body.post.title,
      body: body.post.body,
      category: { id: body.post.category_id, name: 'テストカテゴリ' }
    })
  }),


  // PostUpdate 初期データ
  http.get(/http:\/\/localhost:3000\/api\/v1\/posts\/\d+/, () => {
    return HttpResponse.json({
      id: 1,
      title: 'テストタイトル',
      body: 'テスト本文',
      category: { id: 1, name: 'テストカテゴリ' },
    })
  }),

  // PostUpdate 更新
  http.patch(/http:\/\/localhost:3000\/api\/v1\/posts\/\d+/, async ({ request }) => {
    const body = await request.json() as {
      post: {
        title: string
        body: string
        category_id: number
      }
    }

    return HttpResponse.json({
      id: 1,
      title: body.post.title,
      body: body.post.body,
      category: { id: body.post.category_id, name: 'テストカテゴリ' },
    })
  }),
]