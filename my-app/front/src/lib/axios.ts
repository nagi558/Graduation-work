import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

const tokenStorage = {
  get() {
    return {
      accessToken: localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid')
    }
  },
  set({ accessToken, client, uid }) {
    if (accessToken && client && uid) {
      localStorage.setItem('access-token', accessToken)
      localStorage.setItem('client', client)
      localStorage.setItem('uid', uid)
    }
  },
  clear() {
    localStorage.removeItem('access-token')
    localStorage.removeItem('client')
    localStorage.removeItem('uid')
  }
}

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
    if(!error.response) {
      console.error('Network Error:', error)
      return Promise.reject(error)
    }

    const status = error.response.status

    if (status === 401) {
      tokenStorage.clear()

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    if (status >= 500) {
      console.error('Server Error:', error.response)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance