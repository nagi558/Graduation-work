import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import GoogleLoginButton from '@/components/GoogleLoginButton'

const mockInitialize = vi.fn()
const mockRenderButton = vi.fn()

const renderGoogleLoginButton = () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <GoogleLoginButton />
      </BrowserRouter>
    </AuthProvider>
  )
}

describe('GoogleLoginButton', () => {
  beforeEach(() => {
    vi.stubGlobal('google', {
      accounts: {
        id: {
          initialize: mockInitialize,
          renderButton: mockRenderButton
        }
      }
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('google-login-buttonのdivがレンダリングされる', () => {
    renderGoogleLoginButton()
    expect(screen.getByTestId('google-login-button')).toBeInTheDocument()
  })

  it('google.accounts.id.initializeが正しい引数で呼ばれる', () => {
    renderGoogleLoginButton()
    expect(mockInitialize).toHaveBeenCalledWith(
      expect.objectContaining({
        client_id: expect.any(String),
        callback: expect.any(Function)
      })
    )

    // callbackが関数であることを検証
    const callback = mockInitialize.mock.calls[0][0].callback
    expect(typeof callback).toBe('function')
  })

  it('google.accounts.id.renderButtonが正しいDOM要素と引数で呼ばれる', () => {
    renderGoogleLoginButton()
    const buttonDiv = screen.getByTestId('google-login-button')
    expect(mockRenderButton).toHaveBeenCalledWith(
      buttonDiv,
      expect.objectContaining({
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        locale: 'ja'
      })
    )
  })
})