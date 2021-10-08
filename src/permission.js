import router from './router'
import store from './store'
import NProgress from 'nprogress' 
import { getToken, setToken, setStaffId, setStaffName } from '@/utils/auth'
import { loadingClose } from '@/utils/common'
import getPageTitle from '@/utils/get-page-title'
import 'nprogress/nprogress.css'
function action(token, appId) {
    setToken(token)
    store.dispatch('getStaffId')

    store.dispatch('getStaffName')

    store.dispatch('permission/generateRoutes', { appId })
}
NProgress.configure({ showSpinner: false })
const appId = 25
let token = '47dd9ccc7082d23ae0a52e280757534a6c407cef78c587ee5101841c6156b929'
router.beforeEach(async(to, from, next) => {
    NProgress.start()

    document.title = getPageTitle(to.meta.title)


    if (to.path === '/home/dashboard') { // 判断当前进入的页面
        if (to.query.token && to.query.id) {

            action(to.query.token,  to.query.id)

        } else {

            if (process.env.NODE_ENV === 'development') {

                action(token, appId)
            }
        }
    }
    const hasToken = getToken()

    if (!hasToken) {

        window.location.href = `${process.env.VUE_APP_ERP_ADMIN}/#/login`

        next()
    } 
    next()
})
router.afterEach(() => {

    if (document.getElementsByClassName('el-loading-mask')[0]) {

        loadingClose()
    }
    store.commit('GET_SHOP', []) // 每次路由离开的时候清空店铺下拉框

    store.commit('CAHNGE_LOADING', false)
    NProgress.done()
})