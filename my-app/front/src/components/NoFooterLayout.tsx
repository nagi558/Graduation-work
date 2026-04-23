import { Header } from './Header'
import type { ReactNode } from 'react'

export const NoFooterLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='h-screen flex flex-col'>
      <header className='sticky top-0 z-50 bg-white shadow-sm flex-shrink-0'>
        <Header />
      </header>
      <main className='flex-1 overflow-y-auto'>
        {children}
      </main>
    </div>
  )
}