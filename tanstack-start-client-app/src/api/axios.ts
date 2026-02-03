import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

// Create an instance with defaults
export const axiosApiInstance = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // include cookies (JSESSIONID)
  withXSRFToken: true, // include XSRF token
  xsrfCookieName: 'XSRF-TOKEN', // Spring CSRF cookie
  xsrfHeaderName: 'X-XSRF-TOKEN', // header Spring expects
})

export const axiosApi = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const { data } = await axiosApiInstance({ ...config, ...options })
  return data
}
