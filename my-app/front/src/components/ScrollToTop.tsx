import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    const el = document.getElementById("main-scroll")
    if (el) {
      el.scrollTop = 0
    }
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
