/* 调拨单 */
import request from '@/utils/request'
/* 获取列表 */
export const getData = params => {
    return request({
        url: '/warehouse/transfer',
        method: 'get',
        params,
    })
}
/* 导出调拨单 */
export const exportData = params => {
    return request({
        url: '/warehouse/transfer/export',
        method: 'get',
        params,
        responseType: 'blob'
    })
}
/* 调拨单详情 */
export const getContent = params => {
    return request({
        url: `/warehouse/transfer/${params}`,
        method: 'get',
    })
}
/* 新增调拨单 */
export const createTransfer = ( {data, ticketCode } ) => {
    const url = ticketCode ? `/warehouse/transfer/${ticketCode}` : '/warehouse/transfer/'
    const method = ticketCode ? 'put' :'post'
    return request({
        url,
        method,
        data,
    })
}
/* 修改调拨单 */
export const updateTransfers = data => {
    return request({
        url: `/warehouse/transfer`,
        method: 'put',
        data,
    })
}
/* 作废调拨单 */
export const invalidTransfer = ticketCode => {
    return request({
        url: `/warehouse/transfer/${ticketCode}`,
        method: 'DELETE',
    })
}
/* 审核调拨单 */
export const auditTransfer = ({ ticketCode, type }) => {
    return request({
        url: `/warehouse/transfer/check/${type}`,
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
/* 打印拣货单 */
export const printTransfers = ({ transferCode, type }) => {
    return request({
        url: `/warehouse/transfer/print/${transferCode}/${type}`,
        method: 'get',
    })
}
/* 查询调拨单日志 */
export const getTransferLog = (transferId) => {
    return request({
        url: `/warehouse/transfer/log/${transferId}`,
        method: 'get',
    })
}