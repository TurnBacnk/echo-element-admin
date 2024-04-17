import {getCacheValue} from '@/api/config/cache'

const getDefaultState = () => {
  return {
    taxRate: 13
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TAX_RATE: (state, taxRate) => {
    state.taxRate = taxRate
  }
}

const actions = {
  // user login
  getBusinessParam({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      getCacheValue('sysConfig', 'sysConfig:tax.rate').then(res => {
        const { data } = res
        commit('SET_TAX_RATE', data.cacheValue)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
  // getBusinessParams() {
  //   return new Promise((resolve, reject) => {
  //     getParams({ username: username.trim(), password: password, code: code, userKey: userKey }).then(response => {
  //       const { data } = response
  //       commit('SET_TOKEN', data)
  //       setToken(data)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

