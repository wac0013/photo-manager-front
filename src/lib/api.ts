import axios, { AxiosError } from 'axios'
import { authClient } from './auth-client'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

const AUTH_ENDPOINTS = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/sign-out',
  '/auth/refresh',
  '/auth/session',
]

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const requestUrl = error.config?.url || ''
    const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) =>
      requestUrl.includes(endpoint)
    )

    if (error.response?.status === 401 && !isAuthEndpoint) {
      const { data: session } = await authClient.getSession()

      if (!session) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export { api }
