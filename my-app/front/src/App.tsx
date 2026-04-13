import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Top } from './pages/Top'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PostList } from './pages/PostList'
import { PostNew } from './pages/PostNew'
import { PostUpdate } from './pages/PostUpdate'
import { CategoryList } from './pages/CategoryList.tsx'
import { CategoryManage } from './pages/CategoryManage'
import { CategoryNew } from './pages/CategoryNew'
import { CategoryUpdate } from './pages/CategoryUpdate'
import { MyPage } from './pages/MyPage'
import { ErrorProvider } from './context/ErrorProvider'
import ErrorBanner from './components/ErrorBanner'

export default function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <BrowserRouter>

          <ErrorBanner />

          <Routes>
            {/* 認証不要 */}
            <Route path="/" element={
              <Layout><Top /></Layout>
            } />
          
            <Route path="/login" element={
              <Layout><Login /></Layout>
            } />
          
            <Route path="/register" element={
              <Layout><Register /></Layout>
            } />

            {/* 認証必要 */}
            <Route path="/posts" element={
              <ProtectedRoute>
                <Layout><PostList /></Layout>
              </ProtectedRoute>
            } />
          
            <Route path="/posts/new" element={
              <ProtectedRoute>
                <Layout><PostNew /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/posts/:id/edit" element={
              <ProtectedRoute>
                <Layout><PostUpdate /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/categories" element={
              <ProtectedRoute>
                <Layout><CategoryList /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/categories/manage" element={
              <ProtectedRoute>
                <Layout><CategoryManage /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/categories/new" element={
              <ProtectedRoute>
                <Layout><CategoryNew /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/categories/:id/edit" element={
              <ProtectedRoute>
                <Layout><CategoryUpdate /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/mypage" element={
              <ProtectedRoute>
                <Layout><MyPage /></Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorProvider>
  )
}