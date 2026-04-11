import axios from 'axios'
import { tokenStorage } from './tokenStorage'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken, client, uid } = tokenStorage.get()

    if (accessToken && client && uid) {
      config.headers['access-token'] = accessToken
      config.headers['client'] = client
      config.headers['uid'] = uid
    }

    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => {
    const accessToken = response.headers['access-token']
    const client = response.headers['client']
    const uid = response.headers['uid']

    if (accessToken && client && uid) {
      tokenStorage.set({ accessToken, client, uid })
    }

    return response
  },
  (error) => {
    const status = error.response?.status
    const skipGlobalError = error.config?.skipGlobalError

    if (status === 401) {
      tokenStorage.clear()

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    if (skipGlobalError) {
      return Promise.reject(error)
    }

    if (!error.response) {
      console.error('Network Error:', error)

      window.dispatchEvent(new CustomEvent('api:error', {
        detail: { message: 'ネットワークエラーが発生しました'}
      }))

      return Promise.reject(error)
    }

    if (status >= 500) {
      console.error('Server Error:', error.response)
      
      window.dispatchEvent(new CustomEvent('api:error', {
        detail: {
          message: 'サーバーエラーが発生しました',
          status
        }
      }))
    }
    return Promise.reject(error)
  }
)

export default axiosInstance