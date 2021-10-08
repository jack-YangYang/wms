import request from '@/utils/request'
/* FBA订单 */
export const getData = params => {
    return request({
        url: '/fbaOrder',
        method: 'get',
        params,
    })
}
export const getContent = params => {
    return request({
        url: `/fbaOrder/${params}`,
        method: 'get',
    })
}
/* 导出 */
export const exportData = params => {
    return request({
        url: `/fbaOrder/export`,
        method: 'get',
        params,
        responseType: 'blob'
    })
}