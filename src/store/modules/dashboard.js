import { getAnalyzes } from '@/api/dashboard'

const state = {
  analyzesData: {}
}

const mutations = {
  SET_ANALYZES: (state, data) => {
    state.analyzesData = data
  }
}

const actions = {
  getAnalyzes({ commit }) {
    return new Promise((resolve, reject) => {
      getAnalyzes().then(response => {
        const { data } = response
        commit('SET_ANALYZES', data)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
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

