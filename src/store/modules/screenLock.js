/**
 * 锁屏相关配置
 */

// 长时间不操作默认锁屏时间
const initTime = 60 * 60

const state = {
  isLocked: false,
  lockTime: initTime
}

const mutations = {
  SET_LOCK: (state, v) => {
    state.isLocked = v
  },
  SET_LOCKTIME: (state, v) => {
    if (v) {
      state.lockTime = v
    } else {
      state.lockTime = this.state.isLocked ? initTime : 0
    }
  }

}

const actions = {
  setLock: ({ commit }, v) => {
    commit('SET_LOCK', v)
  },
  setLockTime: ({ commit }, v) => {
    commit('SET_LOCKTIME', v)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

