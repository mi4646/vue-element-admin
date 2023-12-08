import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // CSS重置的现代替代方案

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import './assets/css/index.css'
import './assets/css/demo.css'
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

/*
时间日期处理库
*/
import dayjs from 'dayjs'
Vue.filter('date', function(value, formatStr = 'YYYY-MM-DD') {
  return dayjs(value).format(formatStr)
})
Vue.filter('dateTime', function(value, formatStr = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(value).format(formatStr)
})

// 注册全局实用程序过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

/*
mavonEditor 富文本及代码高亮设置
文档：https://github.com/hinesboy/mavonEditor
https://uixor.com/article/1473849675479126017
*/
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

import hljs from 'highlight.js'
import 'highlight.js/styles/github.css' // 根据自己的需求选择样式文件
Vue.directive('highlight', function(el) {
  const blocks = el.querySelectorAll('pre code')
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
