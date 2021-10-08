/* 入库订单 */
import requerst from '@/utils/request'
const baseURL = process.env.NODE_ENV === 'development' ? '/print' : 'http://192.168.1.115:8080'
export const getPurchaseInList = params => {
    return requerst({
        url: '/warehouse/ticketIn',
        method: 'get',
        params,
    })
}
/* 开始质检 */
export const startInspection = ticketCode => {
    return requerst({
        url: `/warehouse/ticketIn/start/qa/${ticketCode}`,
    })
}
/* 查询采购入库单详情 */
export const getPutInStorageOrderDetail = ticketCode => {
    return requerst({
        url: `/warehouse/ticketIn/${ticketCode}`,
    })
}
/* 根据仓库id查询库位列表 */
export const getQuerySpace = params => {
    return requerst({
        url: `/warehouseSpace/querySpace/${ params }`,
        method: 'get',
    })
}
// 质检/修改
export const purchaseInStockIn = ({ data, ticketCode, state }) => {
    const url = state === 10 ? `/warehouse/ticketIn/qa/${ticketCode}` : `/warehouse/ticketIn/${ticketCode}`
    const method = state === 10 ? 'post' : 'put'
    return requerst({
        url,
        method,
        data,
    })
}
/* 作废 */
export const invalidOrder = ticketCode => {
    return requerst({
        url: `/warehouse/ticketIn/${ticketCode}`,
        method: 'DELETE',
    })
}
/* 审核 */
export const auditOrder = data => {
    return requerst({
        url: `/purchaseIn/check`,
        method: 'post',
        data,
    })
}
/* 上架 */
export const shelves = data => {
    return requerst({
        url: `/warehouse/ticketIn/shelf`,
        method: 'post',
        data,
    })
}
/* 采购入库单贴标 */
export const mark = ticketCode => {
    return requerst({
        url: `/warehouse/ticketIn/mark/${ticketCode}`,
        method: 'POST',
    })
}
/* 入库单-打印 */
export const print = ({ type, ticketCode }) => {
    return requerst({
        url: `/warehouse/ticketIn/print/${ticketCode}/${type}`,
        method: 'get',
    })
}
/* 获取操作日志 */
export const getLog = inCode => {
    return requerst({
        url: `/purchaseIn/log/${inCode}`,
        method: 'get',
    })
}
/* 导出数据· */
export const exportData = params => {
    return requerst({
        url: `/warehouse/ticketIn/export`,
        method: 'get',
        params,
        responseType: 'blob',
    })
}
// 获取仓库下面的库位
export const getCodeList = whouseId => {
    return requerst({
        url: `/warehouse/space/all/${whouseId}`,
    })
}
// 获取质检管理的详情
export const getTicketInInfo = ({ ticketCode, sku }) => {
    return requerst({
        url: `/warehouse/ticketIn/qa/${ticketCode}/${sku}`,
    })
}
// 确认质检
export const ticketIn = ({ ticketCode, data }) => {
    return requerst({
        url: `/warehouse/ticketIn/qa/${ticketCode}`,
        data,
        method: 'post'
    })
}
// // 确认质检
// export const ticketInEdit = ({ ticketCode, data }) => {
//     return requerst({
//         url: `/warehouse/ticketIn/${ticketCode}`,
//         data,
//         method: 'put'
//     })
// }
export const printDemo = (num, data) => {
    return requerst({
        url: `/pdf/print/${910}/${num}`,
        data,
        method: 'post',
        baseURL: 'http://localhost:8080',
    })
}