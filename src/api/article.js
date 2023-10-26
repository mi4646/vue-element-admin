import request from '@/utils/request'

// 文章列表
export function PostsList(query) {
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

// 文章修改/编辑
export function PostsUpdate(data) {
  return request({
    url: '/article/posts/',
    method: 'put',
    data: data
  })
}

// 文章删除
export function PostsDelete(params) {
  return request({
    url: '/article/posts/',
    method: 'delete',
    data: params
  })
}

// 分类列表
export function CatesList(query) {
  return request({
    url: '/article/categorys/',
    method: 'get',
    params: query
  })
}

// 标签列表
export function TagsList(query) {
  return request({
    url: '/article/tags/',
    method: 'get',
    params: query
  })
}

// 上传附件
export function UploadAccessory(data) {
  return request({
    url: '/article/accessory/',
    method: 'post',
    data: data
  })
}

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
