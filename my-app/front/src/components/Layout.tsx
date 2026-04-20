import { Header } from './Header'
import { Footer } from './Footer'
import type { ReactNode } from 'react'

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white shadow-sm flex-shrink-0">
        <Header />
      </header>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}