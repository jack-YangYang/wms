import request from '@/utils/request'
const orderBaseURL = process.env.NODE_ENV === 'development' ? '/php' : process.env.VUE_APP_ORDER_API
// 订单中心列表
export const getOrderCenerList = data => {
    return request({
        url: '/api/order/list',
        method: 'POST',
        data,
        baseURL: orderBaseURL
    })
}
// 缺货待包装
export const outStockPick = params => {
    return request({
        url: '/api/order/out_stock',
        params,
        baseURL: orderBaseURL
    })
}
// 获取商品信息
export const getGoodsInfo = params => {
    return request({
        url: '/api/order/detail',
        params,
        baseURL: orderBaseURL
    })
}
// 获取订单明细
export const getOrdersInfo = params => {
    return request({
        url: '/api/shipment/picking/order_list',
        params,
        baseURL: orderBaseURL
    })
}
// 创建拣货批次
export const createPickingApply = data => {
    return request({
        url: '/api/shipment/picking/apply',
        method:'post',
        data,
        baseURL: orderBaseURL
    })
}
// 获取拣货信息
export const getPickingInfo = params => {
    return request({
        url: '/api/shipment/picking/info',
        params,
        baseURL: orderBaseURL
    })
}
// 拣货完成
export const pickingComplete = params => {
    return request({
        url: '/api/shipment/picking/complete',
        params,
        baseURL: orderBaseURL
    })
}
// 作废
export const pickingInvalid = params => {
    return request({
        url: '/api/shipment/picking/invalid',
        params,
        baseURL: orderBaseURL
    })
}
// 打印拣货单（获取信息）
export const printPickingTicket = (params, type) => {
    const url = type === 1 ? '/api/shipment/picking/ticket' : '/api/shipment/picking/sec_print'
    // const method = type === 1 ? 'post' : 'get'
    // const params = type === 1 ? 'data' : 'params'
    return request({
        url,
        params,
        baseURL: orderBaseURL
    })
}
// 确认打印
export const confirmPrint = data => {
    return request({
        url: '/api/shipment/picking/print_status',
        method: 'post',
        data,
        baseURL: orderBaseURL
    })
}
// 获取拣货列表数据
export const getPickingList = params => {
    return request({
        url: '/api/shipment/picking/list',
        params,
        baseURL: orderBaseURL
    })
}
// 获取打包核单列表
export const getPackageList = params => {
    return request({
        url: '/api/shipment/check/list',
        params,
        baseURL: orderBaseURL
    })
}
// 打包核单详情
export const getCheckDetail = params => {
    return request({
        url: '/api/shipment/check/detail',
        params,
        baseURL: orderBaseURL
    })
}
// 核验sku信息
export const checkSku = data => {
    return request({
        url: '/api/shipment/check/sku',
        method: 'post',
        data,
        baseURL: orderBaseURL
    })
}
// 分拣单详情页提交
export const cehckSubmit = data => {
    return request({
        url: '/api/shipment/check/submit',
        method: 'post',
        data,
        baseURL: orderBaseURL
    })
}
// 核单完成
export const checkComplete = data => {
    return request({
        url: '/api/shipment/check/complete',
        method: 'post',
        data,
        baseURL: orderBaseURL
    })
}
// 已发货订单列表
export const getShippedList = params => {
    return request({
        url: '/api/shipment/shipped/list',
        params,
        baseURL: orderBaseURL
    })
}
// 缺货列表
export const getOutStockList = params => {
    return request({
        url: '/api/shipment/out_stock/list',
        params,
        baseURL: orderBaseURL
    })
}
// 转至待发货
export const changeOutStock = data => {
    return request({
        url: '/api/shipment/out_stock/change',
        method: 'post',
        data,
        baseURL: orderBaseURL
    })
}
// 截单审核列表
export const getPreventList = params => {
    return request({
        url: '/api/shipment/prevent/list',
        params,
        baseURL: orderBaseURL
    })
}
// 审核通过
export const checkPrevent = data => {
    return request({
        url: '/api/shipment/prevent/check',
        data,
        method: 'post',
        baseURL: orderBaseURL
    })
}
// 驳回订单
export const rejectPrevent = data => {
    return request({
        url: '/api/shipment/prevent/reject',
        data,
        method: 'post',
        baseURL: orderBaseURL
    })
}
// 订单导出
export const ordersExport = ({ data, exportModule }) => {
    const exportUrl = {
        orderCenter: '/api/order/export', // 订单中心
        pickingExport: '/api/shipment/picking/export', // 拣货管理列表导出
        checkExport: '/api/shipment/check/export', // 打包核单列表导出
        shippedExport: '/api/shipment/shipped/export', // 已发货订单列表导出
        outStockExport: '/api/shipment/out_stock/export', // 缺货列表导出
        weightExport: '/api/shipment/weigh/export'
    }
    const arg = exportUrl[exportModule] === '/api/order/export' ? 'data' : 'params'
    return request({
        url: exportUrl[exportModule],
        [arg]: data,
        method: exportUrl[exportModule] === '/api/order/export' ? 'post' : 'get',
        responseType: 'blob',
        baseURL: orderBaseURL
    })
}
// 获取订单号维度日志
export const getLogOrders = params => {
    return request({
        url: '/api/shipment/log_list/order',
        params,
        baseURL: orderBaseURL
    })
}
// 获取批次号维度日志
export const getLogTickets = params => {
    return request({
        url: '/api/shipment/log_list/ticket',
        params,
        baseURL: orderBaseURL
    })
}
// 测量称重列表
export const getWeightList = params => {
    return request({
        url: '/api/shipment/weigh/list',
        params,
        baseURL: orderBaseURL
    })
}
// 获取订单信息
export const getWeightDetail = params => {
    return request({
        url: '/api/shipment/weigh/detail',
        params,
        baseURL: orderBaseURL
    })
}
// 测量称重接口
export const saveWeight = data => {
    return request({
        url: '/api/shipment/weigh/save_weight',
        method: 'post',
        data,
        baseURL: orderBaseURL
    })
}
// 获取测量称重条件
export const getOrderCondition = () => {
    return request({
        url: '/openapi/order/cache/condition',
    })
}
// 存储测量条件
export const saveOrderCondition = (data) => {
    return request({
        url: '/openapi/order/cache/condition',
        method: 'post',
        data
    })
}