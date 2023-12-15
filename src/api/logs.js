import request from '@/utils/request'

export function logsList(query) {
  return request({
    url: '/auditlog/show-logs/',
    method: 'get',
    params: query
  })
}

