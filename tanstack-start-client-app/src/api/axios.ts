import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { getBaseUrl } from '@/api/utils'

// Create an instance with defaults
export const axiosApiInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true, // include cookies (JSESSIONID, SESSION, ...)
  withXSRFToken: true, // include XSRF token
  xsrfCookieName: 'XSRF-TOKEN', // Spring CSRF cookie (Only work for same-origin. For cross-origin, we manually get the token and set it in header)
  xsrfHeaderName: 'X-XSRF-TOKEN', // header Spring expects
})

export const axiosApi = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const { data } = await axiosApiInstance({ ...config, ...options })
  return data
}
