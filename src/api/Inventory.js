/* 盘点单模块 */
import request from '@/utils/request'
/* 获取列表 */
export const getData = params => {
    return request({
        url: '/warehouse/check',
        method: 'get',
        params,
    })
}
/* 获取盘点单详情 */
export const getContent = ticketCode => {
    return request({
        url: `/warehouse/check/${ticketCode}`,
    })
}
/* 导出盘点单  */
export const exportData = params => {
    return request({
        url: `/warehouse/check/export`,
        method: 'get',
        params,
        responseType: 'blob'
    })
}
/* 新增修改盘点单 */
export const addIninventory = ( {data, ticketCode } ) => {
    const url = ticketCode ? `/warehouse/check/${ticketCode}` : '/warehouse/check/'
    const method = ticketCode ? 'put' :'post'
    return request({
        url,
        method,
        data,
    })
}
/*
/* 审核盘点单 */
export const auditIninvetory = ({ ticketCode, type }) => {
    return request({
        url: `/warehouse/check/check/${type}`,
        method: 'post',
        data: ticketCode
    })
}
// /*查询sku */
// export const findSkuDetail = ({ whouseId, sku, required }) => {
//     return request({
//         url: `/warehouse/sku/find/${whouseId}/${sku}/${required}`,
//     })
// }
/* 作废盘点单 */
export const invalidIninvetory = ticketCode => {
    return request({
        url: `/warehouse/check/${ticketCode}`,
        method: 'delete',
    })
}