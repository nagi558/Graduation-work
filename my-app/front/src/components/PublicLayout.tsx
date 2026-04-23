import { Header } from "./Header"
import { PublicFooter } from "./PublicFooter"
import type { ReactNode } from 'react'

export const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white shadow-sm flex-shrink-0">
        <Header />
      </header>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <PublicFooter />
    </div>
  )
}