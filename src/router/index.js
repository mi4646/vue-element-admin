import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import chinaMap from '@/views/dashboard/echartsmap'

/* *
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/* **
* constantRoutes
* 没有权限要求的基页
* 所有角色都可以访问
*/

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    // component: () => import('@/views/login/index'),
    component: () => import('@/views/login/Login.vue'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/workplace',
    meta: { title: '仪表盘', icon: 'el-icon-s-home', affix: false },
    children: [
      {
        path: 'workplace',
        component: () => import('@/views/dashboard/workplace/index'),
        name: 'Workplace',
        meta: { title: '工作台', icon: 'el-icon-s-platform', affix: true }
      },
      {
        path: '/analysis',
        component: () => import('@/views/dashboard/analysis/index'),
        name: 'Analysis',
        meta: { title: '分析页', icon: 'dashboard', affix: false }
      },
      {
        path: '/echartsmap',
        component: chinaMap,
        name: 'Echartsmap',
        // meta: { title: '中国地图', icon: '@/icons/svg/map.svg', affix: false }
        meta: { title: '中国地图', icon: 'el-icon-map-location', affix: false }
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/article/article-list',
    meta: { title: '文章管理', icon: 'documentation' },
    children: [
      {
        path: 'article-list',
        component: () => import('@/views/article/article/index'),
        name: 'article-list',
        meta: { title: '发布编辑', icon: 'iconfont el-icon-myfabiaowenzhang' }
      },
      {
        path: 'article-list',
        component: () => import('@/views/article/article-list/index'),
        name: 'article-list',
        meta: { title: '文章列表', icon: 'iconfont el-icon-mywenzhangliebiao' }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    // hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
/*   {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  }, */

  // 404页一定要放在最后!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history'， //需要服务支持
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// 详情参见:https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
