import { getInfo, login, logout } from '@/api/config/user'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    currency: '',
    currencySymbol: '',
    permission: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_CURRENCY: (state, currency) => {
    state.currency = currency
  },
  SET_CURRENCY_SYMBOL: (state, currencySymbol) => {
    state.currencySymbol = currencySymbol
  },
  SET_PERMISSIONS: (state, permissions)=> {
    state.permission = permissions
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, code, userKey } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, code: code, userKey: userKey }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        let { roles, nickName, avatar, currency, currencySymbol, permission } = data
        // avatar = (state.avatar === "" || state.avatar == null) ? require("@/assets/images/404.png") : state.avatar;
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', roles)
        commit('SET_NAME', nickName)
        commit('SET_AVATAR', avatar)
        commit('SET_CURRENCY', currency)
        commit('SET_CURRENCY_SYMBOL', currencySymbol)
        commit('SET_PERMISSIONS', permission)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  backLogin({ commit }) {
    return new Promise(resolve => {
      removeToken()
      commit('RESET_STATE')
      }
    )
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

