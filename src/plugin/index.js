import cache from '@/plugin/cache'
import modal from '@/plugin/modal'
import * as math from 'mathjs'

export default {
  install(Vue) {
    Vue.prototype.$cache = cache
    Vue.prototype.$modal = modal
    Vue.prototype.$math = math
  }
}
