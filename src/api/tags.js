import request from '@/utils/request'

// 标签列表
export function tagsList(query) {
  return request({
    url: '/article/tags/',
    method: 'get',
    params: query
  })
}

// 标签添加
export function tagsCreate(data) {
  return request({
    url: '/article/tags/',
    method: 'post',
    data: data
  })
}

// 标签修改
export function tasUpdate(data) {
  return request({
    url: '/article/tags/',
    method: 'put',
    data: data
  })
}

// 标签删除
export function tagsDelete(query) {
  return request({
    url: '/article/tags/',
    method: 'delete',
    data: query
  })
}
