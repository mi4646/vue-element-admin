import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/accounts/login/',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/accounts/user/',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/accounts/logout/',
    method: 'get'
  })
}
