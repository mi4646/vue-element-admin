/**
 * 锁屏相关配置
 */

// 长时间不操作默认锁屏时间
const initTime = 10 * 1000
let timeOut = null

const state = {
  lockTime: initTime,
  isLock: false
}

const mutations = {

  SET_LOCK: (state, v) => {
    state.isLock = v
  },
  SET_LOCKTIME: (state, v = initTime) => {
    state.lockTime = v
  }
}

const actions = {
  setLockTime: ({ commit }, v) => {
    commit('SET_LOCKTIME', v)
  },
  setLock: ({ commit, state }, v) => {
    commit('SET_LOCK', v)
    if (!v) {
      clearTimeout(timeOut)
      timeOut = null
      timeOut = setTimeout(() => {
        commit('SET_LOCK', true)
      }, state.lockTime)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

