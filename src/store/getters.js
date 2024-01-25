const getters = {
  loading: state => state.loading.isLoading,
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  email: state => state.user.email,
  avatar: state => state.user.avatar,
  name: state => state.user.username,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  userData: state => state.user.userData,
  permission_routes: state => state.permission.routes,
  menus: state => state.permission.addRoutes,
  isLock: state => state.screenLock.isLock,
  lockTime: state => state.screenLock.lockTime,
  analyzesData: state => state.dashboard.analyzesData,
  ipAddress: state => state.user.ipAddress
}
export default getters
