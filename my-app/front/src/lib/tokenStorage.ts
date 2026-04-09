import type { AuthTokens, ValidAuthTokens } from '@/types'

export const tokenStorage = {
  get(): AuthTokens {
    return {
      accessToken: localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid')
    }
  },

  set(tokens: ValidAuthTokens): void {
    const { accessToken, client, uid } = tokens

    localStorage.setItem('access-token', accessToken)
    localStorage.setItem('client', client)
    localStorage.setItem('uid', uid)
  },

  clear(): void {
    localStorage.removeItem('access-token')
    localStorage.removeItem('client')
    localStorage.removeItem('uid')
  }
}