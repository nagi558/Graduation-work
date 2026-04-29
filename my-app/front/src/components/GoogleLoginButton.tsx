import { useEffect, useRef } from "react"
import { useGoogleLogin } from "@/hooks/useGoogleLogin"

const GoogleLoginButton = () => {
  const buttonRef = useRef<HTMLDivElement>(null)
  const { initializeGoogleLogin } = useGoogleLogin()

  useEffect(() => {
    const renderButton = () => {
      if (!buttonRef.current) return

      initializeGoogleLogin()
      window.google?.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        locale: 'ja'
      })
    }

    if (window.google) {
      renderButton()
    } else {
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
      script?.addEventListener('load', renderButton)
      return () => script?.removeEventListener('load', renderButton)
    }
  }, [initializeGoogleLogin])

  return <div ref={buttonRef} data-testid="google-login-button" />
}

export default GoogleLoginButton