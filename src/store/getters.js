const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  permission: state => state.user.permission,
  currency: state => state.user.currency,
  currencySymbol: state => state.user.currencySymbol
}
export default getters
