
const state = {
  isLoading: false

}

const mutations = {
  SET_LOADING: (state, v) => {
    state.isLoading = v
  }
}

const actions = {
  setLoading: ({ commit }, v) => {
    commit('SET_LOADING', v)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

