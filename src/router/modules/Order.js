import layout from '@/layout'
export default {
    path: '/order',
    redirect: '/order/ordercenter',
    component: layout,
    alwaysShow: true,
    meta: {
        title: '订单处理',
        icon: 'order',
    },
    children: [
        {
            path: 'ordercenter',
            component: () => import (/* webpackChunkName: "OrderCenter" */'@/views/Order/OrderCenter'),
            name: 'OrderCenter',
            meta: {
                title: '订单中心',
                noCache: false
            }
        },
        {
            path: 'ordercenter/goods/:orderId?',
            component: () => import (/* webpackChunkName: "GoodsInfo" */'@/views/Order/OrderCenter/GoodsInfo'),
            name: 'GoodsInfo',
            hidden: true,
            props: true,
            meta: {
                title: '商品明细'
            }
        },
        {
            path: 'ordercenter/batchpicking',
            component: () => import (/* webpackChunkName: "BatchPicking" */'@/views/Order/OrderCenter/BatchPicking'),
            name: 'BatchPicking',
            hidden: true,
            meta: {
                title: '批次分拣'
            }
        },
        {
            path: 'picking',
            component: () => import (/* webpackChunkName: "PickingManagement" */'@/views/Order/PickingManagement'),
            name: 'PickingManagement',
            meta: {
                title: '拣货管理',
                noCache: false
            }
        },
        {
            path: 'picking/orderinfo/:orderId?',
            component: () => import (/* webpackChunkName: "OrderInfo" */'@/views/Order/PickingManagement/OrderInfo'),
            name: 'OrderInfo',
            hidden: true,
            props: true,
            meta: {
                title: '订单明细'
            }
        },
        {
            path: 'packaging',
            component: () => import (/* webpackChunkName: "PackagingMangement" */'@/views/Order/PackagingMangement'),
            name: 'PackagingMangement',
            meta: {
                title: '打包核单',
                noCache: false,
            }
        },
        {
            path: 'packaging/touching/:orderId',
            component: () => import (/* webpackChunkName: "Touching" */'@/views/Order/PackagingMangement/Touching'),
            name: 'Touching',
            hidden: true,
            props: true,
            meta: {
                title: '打包核单'
            }
        },
        {
            path: 'deliverys',
            component: () => import (/* webpackChunkName: "Deliverys" */'@/views/Order/Deliverys'),
            name: 'Deliverys',
            meta: {
                title: '已发货'
            }
        },
        {
            path: 'stockoutorder',
            component: () => import (/* webpackChunkName: "StockoutOrder" */'@/views/Order/StockoutOrder'),
            name: 'StockoutOrder',
            meta: {
                title: '缺货订单',
                noCache: false
            }
        },
        {
            path: 'stockoutpackaging',
            component: () => import (/* webpackChunkName: "StockoutPackaging" */'@/views/Order/StockoutPackaging'),
            name: 'StockoutPackaging',
            meta: {
                title: '缺货待打包',
                noCache: false
            }
        },
        {
            path: 'cutorder',
            component: () => import (/* webpackChunkName: "CutOrderAudit" */'@/views/Order/CutOrderAudit'),
            name: 'CutOrderAudit',
            meta: {
                title: '截单审核',
                noCache: false
            }
        },
        {
            path: 'measurement',
            component: () => import (/* webpackChunkName: "Measurement" */'@/views/Order/Measurement'),
            name: 'Measurement',
            meta: {
                title: '测量称重',
                noCache: false
            }
        },
        {
            path: 'measurement/measurementcontent/:id?',
            component: () => import (/* webpackChunkName: "MeasurementContent" */'@/views/Order/Measurement/MeasurementContent'),
            name: 'MeasurementContent',
            hidden:true,
            meta: {
                title: '测量称重详情'
            }
        },
    ]
}