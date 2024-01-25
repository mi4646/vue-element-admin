import { resetRouter } from '@/router'
import { getIp } from '@/api/dashboard'
import { login, logout, getInfo } from '@/api/user'
import { getItemWithExpiration, setItemWithExpiration } from '@/utils/localStorage-expired'

const state = {
  token: sessionStorage.getItem('Token'),
  name: '',
  avatar: '',
  email: '',
  introduction: '',
  roles: [],
  userData: {},
  ipAddress: getItemWithExpiration('ipAddress')
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
  },
  SET_IP: (state, data) => {
    state.ipAddress = data
  }
}

const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        if (response.code === 0) {
          const { data } = response
          commit('SET_TOKEN', data.token)
          sessionStorage.setItem('Token', data.token)
          sessionStorage.setItem('RefreshToken', data.refresh_token)
          dispatch('getIPAddress')
          resolve()
        } else {
          reject(response.codemsg)
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
      getInfo(
        // state.token
      ).then(response => {
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
          reject(response.codemsg)
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
          localStorage.clear()
          sessionStorage.clear()
          resetRouter()
          // 重置访问视图和缓存视图
          // 固定https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })
          resolve()
        } else {
          reject(response.codemsg)
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
      localStorage.clear()
      sessionStorage.clear()
      resolve()
    })
  },

  // 获取ip地址
  getIPAddress({ commit }) {
    return new Promise((resolve, reject) => {
      const localStorageData = getItemWithExpiration('ipAddress')
      if (localStorageData) {
        commit('SET_IP', localStorageData)
        resolve()
      } else {
        getIp().then(response => {
          const { data } = response
          setItemWithExpiration('ipAddress', data)
          commit('SET_IP', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      }
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
