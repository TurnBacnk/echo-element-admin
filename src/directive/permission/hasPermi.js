import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const all_permissions = store.getters && store.getters.permission_routes
  }
}
