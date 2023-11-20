import cache from '@/plugin/cache'
import modal from '@/plugin/modal'

export default {
  install(Vue) {
    Vue.prototype.$cache = cache
    Vue.prototype.$modal = modal
  }
}
