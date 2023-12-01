/**
 * 锁屏相关配置
 */

// 长时间不操作默认锁屏时间
const initTime = parseInt(process.env.VUE_APP_LOCK_TIME)

const state = {
  lockTime: 0,
  isLock: sessionStorage.getItem('isLock') || 'false'
}

const mutations = {

  SET_LOCK: (state, v) => {
    state.isLock = v
  },
  SET_LOCKTIME: (state, v = initTime) => {
    // console.log('修改定时时间', v)
    state.lockTime = v
  }
}

const actions = {
  setLockTime: ({ commit }, v) => {
    commit('SET_LOCKTIME', v)
  },
  setLock: ({ commit }, v) => {
    commit('SET_LOCK', v)
    sessionStorage.setItem('isLock', v)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

