/* 调拨单 */
import request from '@/utils/request'
/* 获取列表 */
export const getData = params => {
    return request({
        url: '/warehouse/otherOut',
        method: 'get',
        params,
        // baseURL
    })
}
/* 导出调拨单 */
export const exportData = params => {
    return request({
        url: '/warehouse/otherOut/export',
        method: 'get',
        params,
        responseType: 'blob'
    })
}
/* 调拨单详情 */
export const getContent = params => {
    return request({
        url: `/warehouse/otherOut/${params}`,
        method: 'get',
    })
}
/* 新增调拨单 */
export const createTransfer = ( {data, ticketCode } ) => {
    const url = ticketCode ? `/warehouse/otherOut/${ticketCode}` : '/warehouse/otherOut'
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
        url: `/warehouse/otherOut/${ticketCode}`,
        method: 'DELETE',
    })
}
/* 审核调拨单 */
export const auditTransfer = ({ ticketCode, type }) => {
    return request({
        url: `/warehouse/otherOut/check/${type}`,
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
