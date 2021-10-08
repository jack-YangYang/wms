import Layout from '@/layout'
export default {
    path: '/procurementmanagement',
    redirect: '/procurementmanagement/procurementorder',
    component: Layout,
    alwaysShow: true,
    meta: {
        title: '采购管理',
        icon: 'procurement',
    },
    children: [
        {
            path: 'procurementorder',
            component: () => import (/* webpackChunkName: "Procurementorder" */ '@/views/ProcurementManagement/Procurementorder'),
            name: 'Procurementorder',
            meta: { title: '采购订单', noCache: false }
        },
        {
            path: 'procurementorder/storagecontent',
            component: () => import (/* webpackChunkName: 'StorageContent' */ '@/views/ProcurementManagement/Procurementorder/detail'),
            name: 'StorageContent',
            hidden: true,
            meta: {
                title: '采购单入库',
                noCache: true
            }
        },
        {
            path: 'procurementfallback',
            component: () => import (/* webpackChunkName: "ProcurementFallback" */ '@/views/ProcurementManagement/ProcurementFallback'),
            name: 'ProcurementFallback',
            meta: { title: '采购回退单', noCache: true },
        },
        {
            path: 'procurementfallback/fallbackcontent',
            component: () => import (/* webpackChunkName: "ProcurementFallback" */ '@/views/ProcurementManagement/ProcurementFallback/detail'),
            name: 'fallbackContent',
            meta: { title: '采购回退单详情', noCache: true },
            hidden: true
        }
    ]
}