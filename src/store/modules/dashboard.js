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
      // 判断localStorage中是否存在数据
      const localStorageData = localStorage.getItem('analyzesData')
      if (localStorageData) {
        // 如果存在数据，则从localStorage中取出
        const data = JSON.parse(localStorageData)
        commit('SET_ANALYZES', data)
        resolve()
      } else {
        // 如果不存在数据，则调用接口获取数据
        getAnalyzes().then(response => {
          const { data } = response
          // 存储数据到localStorage
          localStorage.setItem('analyzesData', JSON.stringify(data))
          commit('SET_ANALYZES', data)
          resolve()
        }).catch(error => {
          console.log(error)
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

