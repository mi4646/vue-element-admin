import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // CSS重置的现代替代方案

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import './assets/css/index.css'
import './assets/css/iconfont.css' // 自定义iconfont图标

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control

import * as filters from './filters' // global filters

import VueCalendarHeatmap from 'vue-calendar-heatmap'
Vue.use(VueCalendarHeatmap)

import dayjs from 'dayjs'

/**
*如果你不想使用mock-server
*你想使用MockJs模拟api
你可以执行:mockXHR()
*
*目前MockJs将在生产环境中使用，
*请在上网前将其删除!！ ！
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './styles/ant-design-vue-variables.less' // 引入自定义主题文件
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
Vue.use(Antd)
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})

Vue.filter('date', function(value, formatStr = 'YYYY-MM-DD') {
  return dayjs(value).format(formatStr)
})

Vue.filter('dateTime', function(value, formatStr = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(value).format(formatStr)
})
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
