import request from '@/utils/request'
/* 库存数据 */
export const getData = params => {
    return request({
        url: '/warehouse/stock',
        params,
    })
}
export const exportData = params => {
    return request({
        url: '/warehouse/stock/export',
        params,
        responseType: 'blob'
    })
}
 // 库存占用列表
export const getTakelist = params => {
    return request({
        url: '/warehouse/stock/occupy',
        params,
    })
}
// 店铺库存数据
export const getShopStock = params => {
    return request({
        url: '/warehouse/stock/shop',
        params,
    })
}
export const exportDataShop = params => {
    return request({
        url: '/warehouse/stock/shop/export',
        params,
        responseType: 'blob'
    })
}
// 店铺库存数据详情
export const getShopStockContent = ({ whouseId, sku, shopId }) => {
    return request({
        url: `/warehouse/stock/${whouseId}/${shopId}/${sku}`,
    })
}