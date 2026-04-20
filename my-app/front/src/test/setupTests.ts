import '@testing-library/jest-dom'
import { server } from './msw/server'

// テスト開始前にサーバー起動
beforeAll(() => server.listen())

// 各テスト後にハンドラをリセット
afterEach(() => server.resetHandlers())

// テスト終了後にサーバー停止
afterAll(() => server.close())