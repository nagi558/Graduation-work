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
import { CategoryPostList } from './pages/CategoryPostList'
import { MyPage } from './pages/MyPage'
import { ErrorProvider } from './context/ErrorProvider'
import ErrorBanner from './components/ErrorBanner'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ForgotPassword } from '@/pages/ForgotPassword'
import { ForgotPasswordSent } from '@/pages/ForgotPasswordSent'
import { ResetPassword } from '@/pages/ResetPassword'
import { ResetPasswordComplete } from '@/pages/ResetPasswordComplete'
import { TermsOfService } from '@/pages/TermsOfService'
import { PrivacyPolicy } from '@/pages/PrivacyPolicy'
import { PublicLayout } from './components/PublicLayout'
import { NoFooterLayout } from './components/NoFooterLayout'
import { Contact } from './pages/Contact'
import { InviteJoin } from './pages/InviteJoin'

const UnauthorizedHandler = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => navigate('/login')
    window.addEventListener('auth:unauthorized', handler)
    return () => window.removeEventListener('auth:unauthorized', handler)
  }, [navigate])

  return null
}

export default function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <BrowserRouter>
          <UnauthorizedHandler />

          <ErrorBanner />

          <Routes>
            {/* 認証不要・PublicFooterあり */}
              <Route path="/" element={
  <PublicLayout><Top /></PublicLayout>
            } />

            <Route path="/terms" element={
              <PublicLayout><TermsOfService /></PublicLayout>
            } />

            <Route path="/privacy-policy" element={
              <PublicLayout><PrivacyPolicy /></PublicLayout>
            } />

            <Route path ="/contact" element={
              <PublicLayout><Contact /></PublicLayout>
            } />

            {/* 認証不要・フッターなし */}
            <Route path="/login" element={
              <NoFooterLayout><Login /></NoFooterLayout>
            } />

            <Route path="/register" element={
              <NoFooterLayout><Register /></NoFooterLayout>
            } />

            <Route path="/forgot-password" element={
              <NoFooterLayout><ForgotPassword /></NoFooterLayout>
            } />

            <Route path="/forgot-password/sent" element={
              <NoFooterLayout><ForgotPasswordSent /></NoFooterLayout>
            } />

            <Route path="/reset-password" element={
              <NoFooterLayout><ResetPassword /></NoFooterLayout>
            } />

            <Route path="/reset-password/complete" element={
              <NoFooterLayout><ResetPasswordComplete /></NoFooterLayout>
            } />

            {/* 未ログインでも閲覧可能 */}
            <Route path="/terms" element={
              <Layout><TermsOfService /></Layout>
            } />

            <Route path="/privacy-policy" element={
              <Layout><PrivacyPolicy /></Layout>
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

            <Route path="/categories/:id/posts" element={
              <ProtectedRoute>
                <Layout><CategoryPostList /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/invite/:token" element={
              <ProtectedRoute>
                <Layout><InviteJoin /></Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorProvider>
  )
}