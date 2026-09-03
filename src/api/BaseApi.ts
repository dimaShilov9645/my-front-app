import axios, { type AxiosError } from 'axios'

export interface ApiError {
  statusCode: number
  message: string
  data?: unknown
}

export function useBaseApi() {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    headers: {
      Accept: 'application/json',
    },
  })

  api.interceptors.request.use((config) => {
    // const accessToken = localStorage.getItem('access_token')
    //
    // if (accessToken) {
    //     config.headers.Authorization = `Bearer ${accessToken}`
    // }

    return config
  })

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
      const apiError: ApiError = {
        statusCode: error.response?.status ?? 0,
        message: error.response?.data?.message || error.response?.statusText || error.message,
        data: error.response?.data,
      }

      const method = error.config?.method?.toUpperCase()

      if (apiError.statusCode === 401 && method !== 'POST') {
        localStorage.removeItem('access_token')
        window.location.reload()
      }

      return Promise.reject(apiError)
    },
  )

  return api
}
