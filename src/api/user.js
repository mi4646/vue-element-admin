import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/accounts/login/',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/accounts/user/',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/accounts/logout/',
    method: 'get'
  })
}
