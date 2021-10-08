/* 仓库管理 */
import request from '@/utils/request'
// const baseURL = process.env.NODE_ENV === 'development' ? '/admin' : process.env.VUE_APP_ERP_JAVA_DOMAIN
import { data } from 'autoprefixer'
/* 获取全部仓库的下拉框列表 */
export const getWarehourseList = () => {
    return request({
        url: '/warehouse/pullDownList',
        method: 'get'
    })
}
/* 获取仓库列表 */
export const getData = (params) => {
    return request({
        url: '/warehouse/previewList',
        method: 'get',
        params
    })
}
/* 输入框获取仓库列表 */
export const getSearchWarehourseList = (params) => {
    return request({
        url: '/warehouse/searchByName',
        method: 'get',
        params,
        // baseURL
    })
}
/* 新增库位 */
export const addWarehouseSpace = (data) => {
    return request({
        url: '/warehouseSpace/add',
        method: 'post',
        data
    })
}
/* 编辑库位获取列表数据 */
export const getWarehouseSpaceListAll = params => {
    return request({
        url: '/warehouseSpace/pageList',
        method: 'get',
        params
    })
}
/* 查询单个SKU的信息 */
export const getSingleSkuInfo = params => {
    return request({
        url: '/product/searchSku',
        method: 'get',
        params
    })
}
/* 查询单个仓位索包含sku的信息 */
export const getSinglepositionsSkuInfo = params => {
    return request({
        url: '/warehouseSpace/findDetail',
        method: 'get',
        params
    })
}
/* 改变仓库的状态 */
export const changesWarehouseStatus = data => {
    return request({
        url: '/warehouse/switchState',
        method: 'post',
        data
    })
}
/* 仓位编辑保存绑定SKU */
export const warehouseSpaceEditSpace = data => {
    return request({
        url: '/warehouseSpace/editSpace',
        method: 'post',
        data
    })
}
/* 导出库位 */
export const exportLocation = params => {
    return request({
        url: '/warehouseSpace/exportSpace',
        method: 'get',
        params,
        responseType: 'blob'
    })
}
/* 编辑区位 */
export const changeLocationAPI = params => {
    return request({
        url: '/warehouseSpace/updateSpaceLocation',
        method: 'post',
        data: params,
    })
}
