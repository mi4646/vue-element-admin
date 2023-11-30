import Cookies from 'js-cookie'

export function getToken(key = 'Token') {
  return Cookies.get(key)
}

export function setToken(key, value) {
  return Cookies.set(key, value)
}

// 清除所有cookie
export function removeToken() {
  const cookies = Cookies.get()
  for (const cookie in cookies) {
    Cookies.remove(cookie)
  }
}

// 判断当前请求是否为登录接口或刷新 Token 接口
export function isLoginOrRefreshTokenRequest(config) {
  const LOGIN_URL = '/accounts/login/'
  const REFRESH_TOKEN_URL = '/accounts/refresh/'
  return config.url.includes(LOGIN_URL) || config.url.includes(REFRESH_TOKEN_URL)
}

/**
 *锁屏验证
 * @param {*} key
 * @returns
 */
export function getLocked() {
  return Cookies.get('isLocked')
}

export function setLocked(value = false) {
  return Cookies.set('isLocked', value)
}

export function getLockTime() {
  return Cookies.get('lockTime')
}

export function setLockTime(value = 60 * 60) {
  return Cookies.set('lockTime', value)
}

