import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Top } from './pages/Top'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Layout><Top /></Layout>
          } />
          <Route path="/login" element={
            <Layout><Login /></Layout>
          } />
          <Route path="/register" element={
            <Layout><Register /></Layout>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}