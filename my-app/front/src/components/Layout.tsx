import { Header } from "./Header"
import { Footer } from "./Footer"
import type { ReactNode } from "react"

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm flex-shrink-0">
        <Header />
      </header>
      <main className="flex-1 overflow-y-scroll mt-[72px]" id="main-scroll">
        {children}
      </main>
      <Footer />
      </div>
  )
}