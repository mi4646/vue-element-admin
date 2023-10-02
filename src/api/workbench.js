import { service_ip, service_jt } from '@/utils/request'
import request from '@/utils/request'

export function getProject() {
  return request({
    url: '/accounts/workbench/vue-project/',
    method: 'get'
  })
}

export function getJiTang() {
  return service_jt({
    url: '/jt',
    method: 'get'
  })
}

export function getDiZHI() {
  return service_ip({
    url: 'https://ip.nf/me.json',
    method: 'get'
  })
}
