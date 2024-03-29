import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { isLoginOrRefreshTokenRequest } from '@/utils'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true,
  timeout: 5000, // 请求超时
  headers: {
    'Content-Type': 'application/json' // 设置请求头部信息
  }
})

export const service_ip = axios.create({
  baseURL: 'https://ip.nf/me.json',
  withCredentials: true,
  timeout: 5000 // 请求超时
})

export const service_jt = axios.create({
  baseURL: process.env.VUE_APP_JT_API,
  withCredentials: true,
  timeout: 5000 // 请求超时
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    if (!isLoginOrRefreshTokenRequest(config)) {
      if (store.getters.token) {
        config.headers['Authorization'] = 'Bearer ' + sessionStorage.getItem('Token')
      }
    }
    return config
  },
  error => {
    // 做一些请求错误
    return Promise.reject(error)
  }
)

async function refreshToken(refresh_token) {
  // 向服务器发送刷新 Token 的请求
  return service.post('/accounts/refresh/', { 'refresh': refresh_token }).then((res) => {
    return res
  })
}
// 换取token并重试
async function refreshAuthorizationToken(refresh_token, response) {
  try {
    const data = await refreshToken(refresh_token)
    if (!data.code) {
      const token = data.token
      sessionStorage.setItem('Token', token)
      response.config.headers.Authorization = `${token}`
      requests.forEach(cb => cb(token))
      requests = []
      return service(response.config)
    } else {
      return Promise.reject(new Error('Error'))
    }
  } catch (error) {
    return Promise.reject(error)
  } finally {
    isRefreshing = false
  }
}

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列
let requests = []
let retryCount = 0

// 响应拦截器
service.interceptors.response.use(
  /* *
  * 如果你想获得http信息，如标题或状态
  * 请返回response => response
  */

  /* *
  * 通过自定义代码确定请求状态
    这里只是一个例子
  * 也可以通过HTTP状态码来判断状态
  */
  response => {
    return response.data
  },
  error => {
    // 判断 url 中是否包含 /api，如果包含则去掉
    if (error.response.config.url.includes('/api')) {
      error.response.config.url = error.response.config.url.replace('/api', '')
    }
    if (error.response.status === 400) {
      Message({ message: 'Bad Request', type: 'error', duration: 5 * 1000 })
      // router.push({ path: '/400' }); // 跳转到自定义的 400 页面
    } else if (error.response.status === 401 && !error.response.config.url.includes('/accounts/refresh/')) {
      const refresh_token = sessionStorage.getItem('RefreshToken')
      if (refresh_token) {
        if (retryCount < 3) {
          retryCount++
          if (!isRefreshing) {
            isRefreshing = true
            return refreshAuthorizationToken(refresh_token, error.response).catch(e => {
              Message({ message: '令牌无效或已过期', type: 'error', duration: 5 * 1000 })
              sessionStorage.clear()
              router.push(`/login`)
              return error.response.data
            })
          } else {
            return new Promise(resolve => {
              requests.push(token => {
                error.response.config.headers.Authorization = `${token}`
                resolve(service(error.response.config))
              })
            })
          }
        } else {
          sessionStorage.clear()
          router.push(`/login`)
          return error.response.data
        }
      } else {
        Message({ message: '刷新令牌未找到', type: 'error', duration: 5 * 1000 })
        router.push(`/login`)
      }
    } else if (error.response.status === 404) {
      Message({ message: 'Not Found', type: 'error', duration: 5 * 1000 })
      // router.push({ path: '/404' }) // 跳转到自定义的 404 页面
    } else if (error.response.status === 500) {
      Message({ message: '服务器错误, 系统繁忙', type: 'error', duration: 5 * 1000 })
      // router.push({ path: '/500' }) // 跳转到自定义的 500 页面
    } else {
      Message({ message: error.message, type: 'error', duration: 5 * 1000 })
    }
    return Promise.reject(error)
  }
)

export default service
