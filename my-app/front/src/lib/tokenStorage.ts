import type { AuthTokens, ValidAuthTokens } from "@/types"

let memoryTokens: AuthTokens = {
  accessToken: null,
  client: null,
  uid: null,
}

export const tokenStorage = {
  get(): AuthTokens {
    return memoryTokens
  },

  set(tokens: ValidAuthTokens): void {
    memoryTokens = tokens
  },

  clear(): void {
    memoryTokens = { accessToken: null, client: null, uid: null }
  },

  hasTokens(): boolean {
    return !!(
      memoryTokens.accessToken &&
      memoryTokens.client &&
      memoryTokens.uid
    )
  },
}
