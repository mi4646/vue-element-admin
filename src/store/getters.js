const getters = {
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
  analyzesData: state => state.dashboard.analyzesData,
  permission_routes: state => state.permission.routes
}
export default getters
