import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setLocked } from '@/utils/auth'
import router, { resetRouter } from '@/router'

import { Message } from 'element-ui'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  email: '',
  introduction: '',
  roles: [],
  userData: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.username = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USER: (state, data) => {
    state.userData = data
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        if (response.code === 0) {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken('Token', data.token)
          setToken('RefreshToken', data.refresh_token)
          setLocked(0)
          resolve()
        } else {
          Message({ type: 'error', message: response.codemsg, duration: 5 * 1000 })
        }
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        if (response.code === 0) {
          const { data } = response
          if (!data) {
            reject('验证失败，请重新登录。')
          }
          const { roles, username, avatar, email, introduction } = data
          // Roles必须为非空数组
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles必须是非空数组!')
          }
          commit('SET_USER', data)
          commit('SET_ROLES', roles)
          commit('SET_EMAIL', email)
          commit('SET_NAME', username)
          commit('SET_AVATAR', avatar)
          commit('SET_INTRODUCTION', introduction)
          resolve(data)
        } else {
          Message({ type: 'error', message: response.codemsg, duration: 5 * 1000 })
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then((response) => {
        if (response.code === 0) {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_USER', {})
          removeToken()
          resetRouter()
          // 重置访问视图和缓存视图
          // 固定https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })
          resolve()
        } else {
          Message({ type: 'error', message: response.codemsg, duration: 5 * 1000 })
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
