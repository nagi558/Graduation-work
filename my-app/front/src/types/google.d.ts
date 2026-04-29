interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string
          callback: (response: { credential: string }) => void
        }) => void
        renderButton: (
          element: HTMLElement,
          options: {
            type?: string
            theme?: string
            size?: string
            text?: string
            locale?: string
          }
        ) => void
      }
    }
  }
}