import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import ProcurementManagement from './modules/ProcurementManagement'
import Warehousemanagement from './modules/Warehouse'
import StockMangement from './modules/StockMangement'
import Putmanagement from './modules/Putmanagement'
import Order from './modules/Order'
export const constantRoutes = [{
        path: '/',
        redirect: { name: 'Dashboard' },
    },
    {
        path: '/404',
        component: () =>
            import ('@/views/error-page/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () =>
            import ('@/views/error-page/401'),
        hidden: true
    },
    {
        path: '/home',
        component: Layout,
        redirect: '/dashboard',
        alwaysShow: true,
        meta: { title: 'Dashboard', icon: 'dashboard' },
        children: [{
            path: 'dashboard',
            component: () =>
                import ('@/views/dashboard/index'),
            name: 'Dashboard',
            meta: { title: 'Dashboard', noCache: true }
        }]
    },
    ProcurementManagement,
    Putmanagement,
    StockMangement,
    Warehousemanagement,
    Order
]
const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    mode: 'history',
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router