import request from '@/utils/request'
export const getData = params => {
    return request({
        url: '/warehouseTicket',
        method: 'get',
        params,
    })
}
/* 导出 */
export const exportData = params => {
    return request({
        url: `/warehouseTicket/export`,
        method: 'get',
        params,
        responseType: 'blob'
    })
}
/* 获取详情 */
export const getContent = ( { type, ticketCode } ) => {
    return request({
        url: `/warehouseTicket/${type}/${ticketCode}`,
        method: 'get',
    })
}
/* 查询出入库单据类型 */
export const getTypeListApi = () => {
    return request({
        url: `/warehouseTicket/types`,
        method: 'get',
    })
}
