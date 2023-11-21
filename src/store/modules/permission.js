import { asyncRoutes, constantRoutes } from '@/router'
import { menusList } from '@/api/menus'
import Layout from '@/layout/index'
import { Message } from 'element-ui'

function moveMenuAfterArticle(routes) {
  const menuIndex = routes.findIndex(route => route.path === '/menus')
  const articleIndex = routes.findIndex(route => route.path === '/article')

  if (menuIndex !== -1 && articleIndex !== -1) {
    const menuToMove = routes.splice(menuIndex, 1)[0]
    routes.splice(articleIndex + 1, 0, menuToMove)
  }

  return routes
}

/**
 * 将从后端获取的数据转换成前端格式
 * @param {Array} data
 * @returns {Array}
 */
function convertRoutesData(data) {
  const result = []

  data.forEach(item => {
    const route = {
      name: item.name,
      path: item.path,
      redirect: item.redirect,
      hidden: Boolean(item.hidden),
      component: item.component === 'Layout' ? Layout : loadView(item.component),
      meta: {
        title: item.name,
        icon: item.icon,
        affix: Boolean(item.affix),
        noCache: Boolean(item.noCache)
      },
      children: []
    }

    if (item.children && item.children.length > 0) {
      // 设置重定向到第一个子路由
      route.redirect = item.children[0].path
      item.children.forEach(child => {
        const childRoute = {
          path: child.path,
          name: child.name,
          hidden: Boolean(child.hidden),
          component: loadView(child.component),
          meta: {
            title: child.name,
            icon: child.icon,
            affix: Boolean(child.affix),
            noCache: Boolean(child.noCache)
          }
        }
        route.children.push(childRoute)
      })
    }

    result.push(route)
  })

  return result
}

function loadView(view) {
  // 注意：webpack4动态import不支持变量方式，如下写法是不行的
  // return () => import(`@/views/${view}`)
  return resolve => require([`@/views/${view}`], resolve)
}

/**
 * 使用meta.role，以确定当前用户是否具有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param 角色
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    console.log(constantRoutes.concat(routes))
    // 调用函数进行移动
    const updatedRoutes = moveMenuAfterArticle(constantRoutes.concat(routes))
    console.log(updatedRoutes, '88888888888888888888888')
    state.routes = updatedRoutes
    // state.routes = constantRoutes.concat(routes)
    // console.log(state.routes, 'state.routes')
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      menusList().then(res => {
        if (res.code === 0) {
          var mergedData = res.data
          let accessedRoutes
          if (roles.includes('admin')) {
            accessedRoutes = mergedData || []
          } else {
            accessedRoutes = filterAsyncRoutes(mergedData, roles)
          }
          const combinedRoutes = accessedRoutes.concat(asyncRoutes)
          console.log(combinedRoutes, 'combinedRoutes')
          // var mergedData = res.data.concat(asyncRoutes)
          // console.log(mergedData, '66666666666666666666666')

          const routesData = convertRoutesData(combinedRoutes)
          // console.log('routesData ', routesData)

          commit('SET_ROUTES', routesData)
          resolve(routesData)
        } else {
          Message.error('获取菜单失败')
        }
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
