import request from '@/utils/request'
import { service_ip, service_jt } from '@/utils/request'

export function getProject() {
  return request({
    url: '/accounts/workbench/vue-project/',
    method: 'get'
  })
}

export function getAnalyzes() {
  return request({
    url: '/accounts/analyzes/',
    method: 'get'
  })
}

export function getJiTang() {
  return service_jt({
    url: '/jt',
    method: 'get'
  })
}

export function getDiZhi() {
  return service_ip({
    url: 'https://ip.nf/me.json',
    method: 'get'
  })
}

export function getChianMapJson(id) {
  return request({
    url: '/static/json/map/',
    method: 'get',
    params: { id }
  })
}
