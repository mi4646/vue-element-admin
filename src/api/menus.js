import request from '@/utils/request'

// 菜单列表
export function menusList(query) {
  return request({
    url: '/accounts/menus/',
    method: 'get',
    params: query
  })
}

// 菜单添加
export function menusCreate(data) {
  return request({
    url: '/accounts/menus/',
    method: 'post',
    data: data
  })
}

// 菜单修改/编辑
export function menusUpdate(id, data) {
  return request({
    url: id ? '/accounts/menu/' + id + '/' : '/accounts/menu/',
    method: 'put',
    data: data
  })
}

// 菜单删除
export function menusDelete(id, params) {
  return request({
    url: id ? '/accounts/menu/' + id + '/' : '/accounts/menu/',
    method: 'delete',
    data: params
  })
}
