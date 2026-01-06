/**
 * @file lib/request.ts
 * @desc Axios 请求封装
 */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'

// 创建实例
const request = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    if (typeof window !== 'undefined') {
      const storage = localStorage.getItem('user-storage')
      if (storage) {
        const { state } = JSON.parse(storage)
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`
        }
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response
    // 业务错误
    if (data.code !== 0) {
      message.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message))
    }
    return data.data
  },
  (error: AxiosError<{ message?: string }>) => {
    // HTTP 错误
    if (error.response) {
      const { status, data } = error.response
      switch (status) {
        case 401:
          message.error('登录已过期，请重新登录')
          // 清除 token 并跳转登录页
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user-storage')
            window.location.href = '/login'
          }
          break
        case 403:
          message.error('没有权限访问')
          break
        case 404:
          message.error('请求的资源不存在')
          break
        case 500:
          message.error('服务器错误')
          break
        default:
          message.error(data?.message || '网络错误')
      }
    } else {
      message.error('网络连接失败')
    }
    return Promise.reject(error)
  }
)

export default request

// 便捷方法
export const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return request.get(url, config)
}

export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.post(url, data, config)
}

export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.put(url, data, config)
}

export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return request.delete(url, config)
}
