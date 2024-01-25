import router from './router'
import store from './store'
import { Message } from 'element-ui'
import getPageTitle from '@/utils/get-page-title'

const whiteList = ['/login', '/auth-redirect'] // 没有重定向白名单

// 路由守卫
router.beforeEach(async(to, from, next) => {
  // 启动进度条
  if (to.path !== from.path) {
    store.dispatch('loading/setLoading', true)
  }

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  // 判断用户是否已经登录
  const hasToken = sessionStorage.getItem('Token')

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({ path: '/' })
    } else {
      // 通过getInfo判断用户是否获得了权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          // 注意:角色必须是一个对象数组!例如:['admin']或['developer'，'editor']
          const { roles } = await store.dispatch('user/getInfo')

          // 根据角色生成可访问的路由映射
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 动态添加可访问路由
          router.addRoutes(accessRoutes)

          // hack方法确保adroutes是完整的
          // 设置replace: true，这样导航就不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 删除令牌并转到登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          store.dispatch('loading/setLoading', false)
        }
      }
    }
  } else {
  /* 没有令牌*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在自由登录白名单中，直接进入
      next()
    } else {
      // 其他没有访问权限的页面被重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      store.dispatch('loading/setLoading', false)
    }
  }
})

router.afterEach(() => {
  // 最多延迟 关闭 loading 完成进度条
  setTimeout(() => {
    store.dispatch('loading/setLoading', false)
  }, 1500)
})
