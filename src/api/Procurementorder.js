/* 采购订单 */
import requerst from '@/utils/request'

export const getPurchaseOrderList = params => {
    return requerst({
        url: '/warehouse/purchaseOrder',
        method: 'get',
        params,
    })
}
/* 获取查询采购单详情 */
export const getPurchaseOrderDetail = ticketCode => {
    return requerst({
        url: `/warehouse/purchaseOrder/${ticketCode}`,
    })
}
/* 作废采购单 */
export const invalidOrder = ticketCode => {
    return requerst({
        url: `/warehouse/purchaseOrder/${ticketCode}`,
        method: 'delete'
    })
}
/* 审核采购单 */
export const auditOrder = ({ ticketCode, type }) => {
    return requerst({
        url: `/warehouse/purchaseOrder/${ticketCode}/${type}`,
        method: 'PUT'
    })
}
/* 预处理生成入库单 */
export const prepare = ({ data, ticketCode }) => {
    return requerst({
        url: `/warehouse/purchaseOrder/prepare/${ticketCode}`,
        method: 'post',
        data,
    })
}
/* 生成入库单 */
export const generatePurchaseIn = data => {
    return requerst({
        url: `/warehouse/ticketIn`,
        method: 'post',
        data,
    })
}
/* 获取操作日志 */
export const getLog = inCode => {
    return requerst({
        url: `/purchaseOrder/log/${inCode}`,
        method: 'get',
    })
}
/* 导出 */
export const exportData = ticketCodes => {
    return requerst({
        url: `/warehouse/purchaseOrder/export?ticketCode=${ticketCodes}`,
        method: 'get',
        responseType: 'blob'
    })
}