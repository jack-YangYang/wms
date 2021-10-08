/* 调拨单 */
import request from '@/utils/request'
/* 获取列表 */
export const getData = params => {
    return request({
        url: '/warehouse/otherIn',
        method: 'get',
        params,
        // baseURL
    })
}
/* 导出调拨单 */
export const exportData = params => {
    return request({
        url: '/warehouse/otherIn/export',
        method: 'get',
        params,
        responseType: 'blob'
    })
}
/* 调拨单详情 */
export const getContent = ticketCode => {
    return request({
        url: `/warehouse/otherIn/${ticketCode}`,
        method: 'get',   
    })
}
/* 新增调拨单 */
export const createTransfer = ( {data, ticketCode } ) => {
    const url = ticketCode ? `/warehouse/otherIn/${ticketCode}` : '/warehouse/otherIn'
    const method = ticketCode ? 'put' :'post'
    return request({
        url,
        method,
        data,
    })
}
/* 作废调拨单 */
export const invalidTransfer = ticketCode => {
    return request({
        url: `/warehouse/otherIn/${ticketCode}`,
        method: 'DELETE',
    })
}
/* 审核调拨单 */
export const auditTransfer = ({ type, ticketCode }) => {
    return request({
        url: `/warehouse/otherIn/check/${type}`,
        method: 'post',
        data: ticketCode
    })
}
// /* 查找sku */
// export const findSkuDetail = ({ whouseId, sku, required }) => {
//     return request({
//         url: `/warehouse/sku/find/${whouseId}/${sku}/${required}`,
//     })
// }
