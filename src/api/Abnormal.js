import request from '@/utils/request'
/* 质检异常 */
export const getData = params => {
    return request({
        url: '/warehouse/ticketInQaAbnormal',
        method: 'get',
        params,
    })
}
/* 导出盘点单  */
export const exportData = params => {
    return request({
        url: `/warehouse/ticketInQaAbnormal/export`,
        method: 'get',
        params,
        responseType: 'blob'
    })
}
export const startSolve = ticketCode => {
    return request({
        url: `/warehouse/ticketInQaAbnormal/followed/${ticketCode}`,
        method: 'put',
    })
}
export const getContent = ticketCode => {
    return request({
        url: `/warehouse/ticketInQaAbnormal/${ticketCode}`,
        method: 'get',
    })
}
// 入库差异解决
export const solveAbnormal = ticketCode => {
    return request({
        url: `/warehouse/ticketInQaAbnormal/resolved/${ticketCode}`,
        method: 'put'
    })
}
// 入库差异-内部标签
export const addMemo = (params) => {
    let formData = new FormData()
    formData.append('memo', params.memo)
    return request({
        url: `/warehouse/ticketInQaAbnormal/memo/${params.ticketCode}`,
        method: 'post',
        data:formData
    })
}


