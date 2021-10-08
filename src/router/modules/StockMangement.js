import Layout from '@/layout'
export default {
    path: '/stock',
    redirect: '/stock/inventory',
    component: Layout,
    alwaysShow: true,
    meta: {
        title: '库存管理',
        icon: 'stock',
    },
    children: [
        {
            path: 'inventory',
            name: 'Inventory',
            component: () => import (/* webpackChunkName: 'Inventory' */ '@/views/StockManagement/Inventory'),
            meta: {
                title: '库存盘点',
                noCache: true
            },
        },
        {
            path: 'inventory/addinventory',
            component: () => import (/* webpackChunkName: 'addinventory' */ '@/views/StockManagement/Inventory/AddInventory'),
            name: 'AddInventory',
            meta: {
                title: '新增盘点',
                noCache: true
            },
            hidden: true
        },
        {
            path: 'inventory/editinventory',
            component: () => import (/* webpackChunkName: 'EditInventory' */ '@/views/StockManagement/Inventory/EditInventory'),
            name: 'Editinventory',
            meta: {
                title: '修改盘点',
                noCache: true
            },
            hidden: true
        },
        {
            path: 'transfers',
            name: 'Transfers',
            component: () => import (/* webpackChunkName: 'Transfers' */ '@/views/StockManagement/Transfers'),
            meta: {
                title: '库存调拨',
                noCache: true
            }
        },
        {
            path: 'transfers/addtransfers',
            name: 'AddTransfers',
            component: () => import (/* webpackChunkName: 'AddTransfers' */ '@/views/StockManagement/Transfers/AddTransfers'),
            hidden: true,
            meta: {
                title: '新增调拨单'
            }
        },
        {
            path: 'transfers/edittransfers',
            name: 'EditTransfers',
            component: () => import (/* webpackChunkName: 'EditTransfers' */ '@/views/StockManagement/Transfers/EditTransfers'),
            hidden: true,
            meta: {
                title: '修改调拨单'
            }
        },
        {
            path: 'otherin',
            name: 'OtherIn',
            component: () => import (/* webpackChunkName: 'OtherIn' */ '@/views/StockManagement/OtherIn'),
            meta: {
                title: '其他入库单'
            }
        },
        {
            path: 'otherin/addotherin',
            name: 'AddOtherIn',
            component: () => import (/* webpackChunkName: 'AddOtherIn' */ '@/views/StockManagement/OtherIn/addOtherIn'),
            hidden: true,
            meta: {
                title: '新增其他入库单'
            }
        },
        {
            path: 'otherin/editotherin',
            name: 'EditOtherIn',
            component: () => import (/* webpackChunkName: 'EditOtherIn' */ '@/views/StockManagement/OtherIn/editOtherIn'),
            hidden: true,
            meta: {
                title: '修改其他入库单'
            }
        },
        {
            path: 'otherout',
            name: 'OtherOut',
            component: () => import (/* webpackChunkName: 'OtherOut' */ '@/views/StockManagement/OtherOut'),
            meta: {
                title: '其他出库单'
            }
        },
        {
            path: 'otherout/addotherout',
            name: 'AddOtherOut',
            component: () => import (/* webpackChunkName: 'addOtherOut' */ '@/views/StockManagement/OtherOut/addOtherOut'),
            hidden: true,
            meta: {
                title: '新增其他出库单'
            }
        },
        {
            path: 'otherout/editotherout',
            name: 'EditOtherOut',
            component: () => import (/* webpackChunkName: 'editOtherOut' */ '@/views/StockManagement/OtherOut/editOtherOut'),
            hidden: true,
            meta: {
                title: '修改其他出库单'
            }
        },
        {
            path: 'operationaltransfers',
            name: 'OperationalTransfers',
            component: () => import (/* webpackChunkName: 'OperationalTransfers' */ '@/views/StockManagement/OperationalTransfers'),
            meta: {
                title: '运营调拨'
            }
        },
        {
            path: 'leadertransfers',
            name: 'LeaderTransfers',
            component: () => import (/* webpackChunkName: 'leaderTransfer' */ '@/views/StockManagement/OperationalTransfers/leaderTransfer'),
            meta: {
                title: '运营组长审核'
            }
        },
        {
            path: 'storetransfers',
            name: 'Storetransfers',
            component: () => import (/* webpackChunkName: 'Storetransfers' */ '@/views/StockManagement/OperationalTransfers/storeTransfers'),
            meta: {
                title: '仓库审核'
            }
        },
        {
            path: 'operationaltransfers/add',
            name: 'OperationalAddTransfers',
            component: () => import (/* webpackChunkName: 'addTransfers' */ '@/views/StockManagement/OperationalTransfers/addTransfers'),
            hidden: true,
            meta: {
                title: '新增运营调拨单'
            }
        },
        {
            path: 'operationaltransfers/detail',
            name: 'OperationalTransfersDetail',
            component: () => import (/* webpackChunkName: 'OperationalTransfersDetail' */ '@/views/StockManagement/OperationalTransfers/detail'),
            hidden: true,
            meta: {
                title: '调拨详情'
            }
        },
        {
            path: 'stocklist',
            name: 'Stocklist',
            component: () => import (/* webpackChunkName: 'StockList' */ '@/views/StockManagement/StockList'),
            meta: {
                title: '仓库库存',
                noCache: false
            }
        },
        {
            path: 'shopstock',
            name: 'ShopStock',
            component: () => import (/* webpackChunkName: 'ShopStock' */ '@/views/StockManagement/ShopStock'),
            meta: {
                title: '店铺库存',
                noCache: false
            }
        },
        {
            path: 'shopstock/detail/:whouseId/:shopId/:sku',
            name: 'ShopStockDetail',
            component: () => import (/* webpackChunkName: 'ShopStock' */ '@/views/StockManagement/ShopStock/detail'),
            hidden: true,
            meta: {
                title: '店铺库存详情',
                noCache: true
            }
        },
        {
            path: 'stocktake',
            name: 'StockTake',
            component: () => import (/* webpackChunkName: 'StockTake' */ '@/views/StockManagement/StockTake'),
            meta: {
                title: '库存占用列表',
                noCache: false
            }
        },
        {
            path: 'asintransfer',
            name: 'AsinTransfer',
            component: () => import (/* webpackChunkName: 'StockTake' */ '@/views/StockManagement/AsinTransfer'),
            meta: {
                title: 'Asin调拨',
                noCache: false
            }
        },
        {
            path: 'stockBill',
            name: 'StockBill',
            component: () => import (/* webpackChunkName: 'StockBill' */ '@/views/StockManagement/StockBill'),
            meta: {
                title: '库存明细账',
                noCache: false
            }
        },
        {
            path: 'transitstockBill',
            name: 'TransitStockBill',
            component: () => import (/* webpackChunkName: 'TransitStockBill' */ '@/views/StockManagement/TransitStockBill'),
            meta: {
                title: '在途明细账',
                noCache: false
            }
        },
        {
            path: 'asintransfer/add',
            name: 'AddAsinTransfer',
            component: () => import (/* webpackChunkName: 'StockTake' */ '@/views/StockManagement/AsinTransfer/AddAsinTransfer'),
            hidden: true,
            meta: {
                title: '新增调拨单',
                noCache: true
            }
        },
    ]
}