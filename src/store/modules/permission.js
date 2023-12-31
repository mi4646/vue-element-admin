import { asyncRoutes, constantRoutes } from '@/router'
import { menusList } from '@/api/menus'
import Layout from '@/layout/index'
import { Message } from 'element-ui'

/**
 * 移动菜单管理到个人中心前面
 * @param {*Array} routes 路由数组
 * @returns 排序完的数组
 */
function moveMenuAfterArticle(routes) {
  const menuIndex = routes.findIndex(route => route.path === '/menus')
  const profileIndex = routes.findIndex(route => route.path === '/profile')
  if (menuIndex !== -1 && profileIndex !== -1) {
    const menuToMove = routes.splice(menuIndex, 1)[0]
    routes.splice(profileIndex - 1, 0, menuToMove)
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
    let route = {}
    // 直接展示一级菜单
    if (!item.parent_id && item.component !== 'Layout' && item.path !== '*') {
      route = {
        path: item.path,
        component: Layout,
        redirect: `${item.path}/index`,
        children: [
          {
            path: 'index',
            component: loadView(item.component),
            name: item.name,
            meta: {
              title: item.name,
              icon: item.icon,
              noCache: !!item.Nocache
            }
          }
        ]
      }
    } else {
      // 目录嵌套一级菜单形式
      route = {
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
    routes = moveMenuAfterArticle(constantRoutes.concat(routes))
    // 调用函数进行移动
    const updatedRoutes = routes
    // const updatedRoutes = moveElementAfter(constantRoutes.concat(routes))
    // console.log(updatedRoutes)
    state.addRoutes = routes
    state.routes = updatedRoutes
    // state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      menusList().then(res => {
        if (res.code === 0) {
          var mergedData = res.data
          // console.log(mergedData, 'mergedData')
          let accessedRoutes
          if (roles.includes('admin')) {
            accessedRoutes = mergedData || []
          } else {
            accessedRoutes = filterAsyncRoutes(mergedData, roles)
          }
          const combinedRoutes = accessedRoutes.concat(asyncRoutes)
          // console.log(combinedRoutes, 'combinedRoutes')

          const routesData = convertRoutesData(combinedRoutes)
          // console.log('routesData ', routesData)

          commit('SET_ROUTES', routesData)
          resolve(routesData)
        } else {
          Message.error({ message: '获取菜单失败' })
          commit('SET_ROUTES', asyncRoutes)
          resolve(asyncRoutes)
        }
      }).catch(error => {
        Message.error({ message: '获取菜单失败' })
        commit('SET_ROUTES', asyncRoutes)
        resolve(asyncRoutes)
        console.log(error)
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
