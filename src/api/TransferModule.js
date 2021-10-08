/* 运营调拨 */
import request from '@/utils/request'

export const getData = params => {
    return request ({
        url: '/warehouseTransferOperate',
        method: 'get',
        params
    })
}
/* 运营组长调拨普源库存 */
export const getDataPy = params => {
    return request ({
        url: '/warehouseTransferTmp',
        method: 'get',
        params
    })
}
/* 临时调拨单获取详情 */
export const getContentPy = params => {
    return request ({
        url: `/warehouseTransferTmp/${params}`,
        method: 'get',
    })
}
/* 获取详情 */
export const getContent = parmas => {
    return request({
        url: `/warehouseTransferOperate/${parmas}`,
        method: 'get',
    })
}
/* 作废 */
export const invalidOrder = transferCode => {
    return request ({
        url: `/warehouseTransferOperate/drop/${transferCode}`,
        method: 'get',
    })
} 
/* 临时调拨单作废 */
export const invalidOrderPY = transferCode => {
    return request ({
        url: `/warehouseTransferTmp/drop/${transferCode}`,
        method: 'get',
    })
} 
// /* 查找sku */
// export const findSkuDetail = ({ sourceWhouseId, distWhouseId, sku }) => {
//     return request({
//         url: `/warehouseTransferOperate/findSku/${sourceWhouseId}/${distWhouseId}/${sku}`,
//         method: 'get',
//         // baseURL,
//     })
// }
/* 临时调拨单查找sku */
export const findSkuDetailPY = ({ sourceWhouseId, distWhouseId, sku }) => {
    return request({
        url: `/warehouseTransferTmp/findSku/${sourceWhouseId}/${distWhouseId}/${sku}`,
        method: 'get',
        // baseURL,
    })
}
/* 审核调拨单 */
export const auditTransfer = data => {
    return request({
        url: `/warehouseTransferOperate/check`,
        method: 'post',
        data,
        // baseURL,
    })
}
/* 临时调拨单审核 */
export const auditTransferPY = transferCode => {
    return request({
        url: `/warehouseTransferTmp/check/${transferCode}`,
        method: 'GET',
        // baseURL,
    })
}
/* 修改调拨单 */
export const updateTransfers = data => {
    return request({
        url: `/warehouseTransferOperate`,
        method: 'put',
        data,
        // baseURL,
    })
}
/* 临时调拨单修改调拨单 */
export const updateTransfersPY = data => {
    return request({
        url: `/warehouseTransferTmp`,
        method: 'put',
        data,
        // baseURL,
    })
}
/* 导出调拨单 */
export const exportData = params => {
    return request({
        url: '/warehouseTransferOperate/export',
        method: 'get',
        params,
        responseType: 'blob'
    })
}
/* 临时调拨单导出调拨单 */
export const exportDataPY = params => {
    return request({
        url: '/warehouseTransferTmp/export',
        method: 'get',
        params,
        responseType: 'blob'
    })
}
/* 新增调拨单 */
export const createTransfer = data => {
    return request({
        url: `/warehouseTransferOperate`,
        method: 'post',
        data,
        // baseURL,
    })
}
/* 临时调拨单新增调拨单 */
export const createTransferPY = data => {
    return request({
        url: `/warehouseTransferTmp`,
        method: 'post',
        data,
        // baseURL,
    })
}
/* 获取操作日志 */
export const getLogList = transferId => {
    return request({
        url: `/warehouseTransferOperate/log/${transferId}`,
        method: 'get',
        // baseURL,
    })
}
/* 获取运营组长调拨的全部仓库 */
export const getAllWarehouse = () => {
    return request ({
        url: '/warehouseTransferTmp/outwhs',
        method:'get'
    })
}