import request from '@/utils/request'

export function getProject() {
  return request({
    url: '/api/accounts/workbench/vue-project/',
    method: 'get'
  })
}
