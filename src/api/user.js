import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/accounts/login/',
    method: 'post',
    data
  })
}

// 用户详情
export function getInfo() {
  return request({
    url: '/accounts/user/',
    method: 'get'
  })
}

// 退出
export function logout() {
  return request({
    url: '/accounts/logout/',
    method: 'get'
  })
}

// 用户修改
export function userUpdate(data) {
  return request({
    url: '/accounts/user/',
    method: 'put',
    data: data
  })
}
