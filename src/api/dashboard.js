import axios from 'axios'
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
// 获取ip地址
export function getIp() {
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

// 获取全国JSON
export const getChinaJson = (params) => axios.get(`/map/china.json`, params)

// 获取省JSON
export const getProvinceJson = (path, params) => axios.get(`/map/province/${path}.json`, params)

// 获取市JSON
export const getCityJson = (path, params) => axios.get(`/map/city/${path}.json`, params)

// 获取县JSON
export const getDistrictJson = (path, params) => axios.get(`/map/county/${path}.json`, params)
