// 采购回退单
import request from '@/utils/request'
export const getData = params => {
    return request ({
        url: '/warehouse/purchaseOrderBack',
        params
    })
}
// 查询可退回的采购单
export const getOrderList = () => {
    return request ({
        url: '/warehouse/purchaseOrderBack/getTickets',
    })
}
// 通过选择的可回退的采购单查询信息
export const getOrderInfo = ticketCode => {
    return request ({
        url: `/warehouse/ticketIn`,
        params: {
            ticketOrder: ticketCode,
            pageNo: 1,
            pageSize: 100 * 100
        }
    })
}
// 通过入库单号查询sku信息
export const getSkuInfo = ticketCode => {
    return request ({
        url: `/warehouse/ticketIn/back/${ticketCode}`,
    })
}
// 新增回退采购单
export const addOrder = ({ data, ticketCode }) => {
    return request ({
        url: `/warehouse/purchaseOrderBack/${ticketCode}`,
        method: 'post',
        data
    })
}
// 通过选择的可回退的采购单查询信息
export const getTicketInfo = ticketCode => {
    return request ({
        url: `/warehouse/purchaseOrderBack/${ticketCode}`,
    })
}
// 审核
export const check = ({ ticketCode, state }) => {
    return request ({
        url: `/warehouse/purchaseOrderBack/${ticketCode}/${state}`,
        method: 'PUT',
    })
}
// 作废
export const drop = ticketCode => {
    return request ({
        url: `/warehouse/purchaseOrderBack/${ticketCode}`,
        method: 'delete'
    })
}
// 导出
export const exportList = params => {
    return request ({
        url: '/warehouse/purchaseOrderBack/export',
        params,
        responseType: 'blob'
    })
}
// 作废
export const printOrderLog = ticketCode => {
    return request ({
        url: `/warehouse/purchaseOrderBack/print/${ticketCode}`,
    })
}