import request from '@/utils/request'
const shopAPI = process.env.NODE_ENV  === 'development' ? '/admin' : process.env.VUE_APP_SHOP_API
export const getList = params => request({
    url: '/warehouse/transferShop',
    params
})
export const getDetail = ticketCode => request({
    url: `/warehouse/transferShop/${ticketCode}`,
})
export const createTransferShop = data => request({
    url: `/warehouse/transferShop`,
    data,
    method: 'post'
})
export const editTransferShop = ({ ticketCode, data }) => request({
    url: `/warehouse/transferShop/${ticketCode}`,
    data,
    method: 'put'
})
export const invalidTransferShop = ticketCode => request({
    url: `/warehouse/transferShop/${ticketCode}`,
    method: 'delete'
})
export const auditTransferShop = (ticketCode, type) => request({
    url: `/warehouse/transferShop/${ticketCode}/${type}`,
    method: 'put'
})
export const auditTransferShopAll = (data, type) => request({
    url: `/warehouse/transferShop/check/${type}`,
    method: 'POST',
    data
})
export const getAssins = (params) => request({
    url: `/shop/asin`,
    params,
    baseURL: shopAPI
})
export const getAssinsStock = ({ whouseId, shopId, sku, asin }) => request({
    url: `/warehouse/stock/${whouseId}/${shopId}/${sku}/${asin}`,
})




