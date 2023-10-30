import request from '@/utils/request'

// 文章列表
export function postsList(query) {
  return request({
    url: '/article/posts/',
    method: 'get',
    params: query
  })
}

// 文章详情
export function fetchPostsInfo(id, query) {
  return request({
    url: '/article/postsinfo/' + id + '/',
    method: 'get',
    params: query
  })
}

// 文章添加
export function postsCreate(data) {
  return request({
    url: '/article/posts/',
    method: 'post',
    data: data
  })
}

// 文章修改/编辑
export function postsUpdate(data) {
  return request({
    url: '/article/posts/',
    method: 'put',
    data: data
  })
}

// 文章删除
export function postsDelete(params) {
  return request({
    url: '/article/posts/',
    method: 'delete',
    data: params
  })
}

// 分类列表
export function catesList(query) {
  return request({
    url: '/article/categorys/',
    method: 'get',
    params: query
  })
}

// 标签列表
export function tagsList(query) {
  return request({
    url: '/article/tags/',
    method: 'get',
    params: query
  })
}

// 上传附件
export function uploadAccessory(data) {
  return request({
    url: '/article/accessory/',
    method: 'post',
    data: data
  })
}
