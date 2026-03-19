import { Header } from './Header'
import type { ReactNode } from 'react'

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <Header />
      </header>
      <main>{children}</main>
    </div>
  )
}