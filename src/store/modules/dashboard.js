import { getAnalyzes } from '@/api/dashboard'
import { getItemWithExpiration, setItemWithExpiration } from '@/utils/localStorage-expired'
const state = {
  analyzesData: {}
}

const mutations = {
  SET_ANALYZES: (state, data) => {
    state.analyzesData = data
  }
}

const actions = {
  /*
  * 判断localStorage中是否存在数据,如果存在数据，则从localStorage中取出
  *  如果不存在数据，则调用接口获取数据,存储数据到localStorage
  */
  getAnalyzes({ commit }) {
    return new Promise((resolve, reject) => {
      const localStorageData = getItemWithExpiration('analyzesData')
      if (localStorageData) {
        commit('SET_ANALYZES', localStorageData)
        resolve()
      } else {
        getAnalyzes().then(response => {
          const { data } = response
          setItemWithExpiration('analyzesData', data, 60)
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

