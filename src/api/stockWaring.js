import request from '@/utils/request'
export const getData = params => {
    return request({
        method: 'get',
        params,
        url: '/warehouseSkuPurchase'
    })
}