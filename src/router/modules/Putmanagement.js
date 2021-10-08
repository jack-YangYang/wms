import Layout from '@/layout'
export default {
    path: '/putmanagement',
    redirect: '/putmanagement/putinstorageorder',
    component: Layout,
    alwaysShow: true,
    meta: {
        title: '入库管理',
        icon: 'put',
    },
    children: [
        {
            path: 'putinstorageorder',
            component: () => import (/* webpackChunkName: "PutInStorageOrder" */ '@/views/PutManagement/PutInStorageOrder'),
            name: 'PutInStorageOrder',
            meta: { title: '入库管理', noCache: true }
        },
        {
            path: 'quality',
            component: () => import (/* webpackChunkName: "Quality" */ '@/views/PutManagement/Quality'),
            name: 'Quality',
            meta: { title: '质检管理', noCache: false }
        },
        {
            path: 'scanstorage',
            component: () => import (/* webpackChunkName: "DeliveryScanStorage" */ '@/views/PutManagement/DeliveryScanStorage'),
            name: 'DeliveryScanStorage',
            meta: { title: '收货扫描入库', noCache: false }
        },
        {
            path: 'putinstorageorder/putinstorageconent',
            component: () => import (/* webpackChunkName: "PutInStorageConent" */ '@/views/PutManagement/PutInStorageOrder/detail'),
            name: 'PutInStorageConent',
            meta: { title: '质检入库', noCache: true },
            hidden: true
        },
        {
            path: 'shelves',
            component: () => import (/* webpackChunkName: "Shelves" */ '@/views/PutManagement/Shelves'),
            name: 'Shelves',
            meta: { title: '上架管理', noCache: false }
        },
        {
            path: 'shelves/detail',
            component: () => import (/* webpackChunkName: "Shelves" */ '@/views/PutManagement/Shelves/detail'),
            name: 'ShelvesDetail',
            hidden: true,
            meta: { title: '上架管理详情', noCache: false },
        },
        // {
        //     path: 'shelves/action',
        //     component: () => import (/* webpackChunkName: "shelvesAction" */ '@/views/PutManagement/Shelves/shelvesAction'),
        //     name: 'shelvesAction',
        //     hidden: true,
        //     meta: { title: '上架', noCache: false },
        // },
        {
            path: 'abnormal',
            component: () => import (/* webpackChunkName: "Abnormal" */ '@/views/PutManagement/Abnormal'),
            name: 'Abnormal',
            meta: { title: '质检异常', noCache: false },
        },
        {
            path: 'abnormal/abnormalcontent',
            component: () => import (/* webpackChunkName: "AbnormalContent" */ '@/views/PutManagement/Abnormal/detail'),
            name: 'AbnormalContent',
            hidden: true,
            meta: { title: '质检异常详情', noCache: true },
        },
    ]
}