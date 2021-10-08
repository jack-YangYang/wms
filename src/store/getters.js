import { getMenus } from '@/utils/auth'
const getters = {
    sidebar: state => state.app.sidebar,
    size: state => state.app.size,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.common.name,
    introduction: state => state.user.introduction,
    roles: state => state.user.roles,
    permission_routes(state) {
        // console.log(state.permission.routes, 'state.permission.routes')
        // if (getMenus()) {
        //     console.log(JSON.parse(getMenus()), 'JSON.parse(getMenus())')
        //     return JSON.parse(getMenus())
        // }
        return state.permission.routes
    },
    errorLogs: state => state.errorLog.logs
}
export default getters