import request from '@/utils/request'

// 分类列表
export function catesList(query) {
  return request({
    url: '/article/categorys/',
    method: 'get',
    params: query
  })
}

// 分类添加
export function catesCreate(data) {
  return request({
    url: '/article/categorys/',
    method: 'post',
    data: data
  })
}

// 分类修改
export function catesUpdate(data) {
  return request({
    url: '/article/categorys/',
    method: 'put',
    data: data
  })
}

// 分类删除
export function catesDelete(query) {
  return request({
    url: '/article/categorys/',
    method: 'delete',
    data: query
  })
}
