import { useEffect, useRef } from "react"
import { useGoogleLogin } from "@/hooks/useGoogleLogin"

const GoogleLoginButton = () => {
  const buttonRef = useRef<HTMLDivElement>(null)
  const { initializeGoogleLogin } = useGoogleLogin()

  useEffect(() => {
    initializeGoogleLogin()

    if (buttonRef.current) {
      window.google?.account.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        locale: 'ja'
      })
    }
  }, [initializeGoogleLogin])

  return <div ref={buttonRef} />
}

export default GoogleLoginButton