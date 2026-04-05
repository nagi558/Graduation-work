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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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

          {/* 認証必要(今後追加していく) */}
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}