import Layout from '@/layout'
export default {
    path: '/warehousemanagement',
    redirect: '/warehousemanagement/warehouselist',
    component: Layout,
    alwaysShow: true,
    meta: {
        title: '仓库管理',
        icon: 'warehouse',
    },
    children: [
        {
            path: 'warehouselist',
            name: 'Warehouselist',
            component: () => import (/* webpackChunkName: 'Warehouselist' */ '@/views/Warehouse/HourseConfig'),
            meta: {
                title: '仓库管理',
                noCache: false
            }
        },
        {
            path: 'warehouselist/warehousecontent/:id',
            name: 'WareHouseContent',
            component: () => import (/* webpackChunkName: 'WareHouseContent' */ '@/views/Warehouse/WareHouseContent'),
            hidden: true,
            meta: {
                noCache: true,
                title: '仓库详情',
            }
        },
        // {
        //     path: 'stockdata',
        //     name: 'Stockdata',
        //     component: () => import (/* webpackChunkName: 'StockData' */ '@/views/Warehouse/StockData'),
        //     meta: {
        //         title: '库存数据',
        //         noCache: false
        //     }
        // },
        // {
        //     path: 'warehouseandshop',
        //     name: 'WarehouseAndShop',
        //     component: () => import (/* webpackChunkName: 'WarehouseAndShop' */ '@/views/Warehouse/WarehouseAndShop'),
        //     meta: {
        //         title: '仓库-店铺',
        //         noCache: false
        //     }
        // },
        // {
        //     path: 'personnelshop',
        //     name: 'PersonnelAndShop',
        //     component: () => import (/* webpackChunkName: 'PersonnelAndShop' */ '@/views/Warehouse/PersonnelAndShop'),
        //     meta: {
        //         title: '店铺-人员',
        //         noCache: false
        //     }
        // },
    ]
}