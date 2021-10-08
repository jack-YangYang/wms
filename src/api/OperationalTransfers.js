import request from '@/utils/request'
export const getData = params => {
    return request({
        url: '/warehouse/transferOperate',
        params
    })
}
export const exportData = data => {
    let params = JSON.parse(JSON.stringify(data))
    params.pageSize = 1000 * 1000
    return request({
        url: '/warehouse/transferOperate/export',
        params,
        responseType: 'blob'
    })
}
export const getLeaderData = params => {
    return request({
        url: '/warehouse/transferOperate',
        params
    })
}
export const getStoreData = params => {
    return request({
        url: '/warehouse/transferOperate',
        params
    })
}
export const createTransfers = ({ data, ticketCode }) => {
    const url = ticketCode ? `/warehouse/transferOperate/${ticketCode}` : '/warehouse/transferOperate'
    const method = ticketCode ? 'put' : 'post'
    return request({
        url,
        method,
        data
    })
}
// 获取详情
export const getContent = ticketCode => {
    return request({
        url: `/warehouse/transferOperate/${ticketCode}`,
    })
}
export const invalid = ticketCode => {
    return request({
        url: `/warehouse/transferOperate/${ticketCode}`,
        method: 'DELETE'
    })
}
export const leaderAudit = ({ ticketCode, type }) => {
    return request({
        url: `/warehouse/transferOperate/leader/${ticketCode}/${type}`,
        method: 'PUT'
    })
}
export const storeAudit = ({ ticketCode, type }) => {
    return request({
        url: `/warehouse/transferOperate/store/${ticketCode}/${type}`,
        method: 'PUT'
    })
}