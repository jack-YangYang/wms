/* 添加仓库 */
import request from '@/utils/request'
export const getWarehouse = params => {
    return request({
        url: '/warehouse',
        params
    })
}
export const getStockData = params => {
    return request({
        url: '/warehouse/data',
        params
    })
}
export const addWarehouse = data => {
    return request({
        url: '/warehouse',
        method: 'post',
        data
    })
}
export const editWareHouse = data => {
    return request({
        url: '/warehouse',
        method: 'put',
        data
    })
}
// 仓库查分区（分页列表）
export const getPartitionList = ( { whouseId, name } ) => {
    return request({
        url: `/warehouse/partition/${whouseId}`,
        method: 'get',
        params: { name }
    })
}
// 分区查库位（分页）
export const getSpaceList = ({ params, partitionId, whouseId}) => {
    return request({
        url: `/warehouse/space/${whouseId}/${partitionId}`,
        method: 'get',
        params
    })
}
// 添加区位
export const addPartition = data => {
    return request({
        url: '/warehouse/partition',
        method: 'post',
        data
    })
}
// 编辑区位
export const editPartition = data => {
    return request({
        url: '/warehouse/partition',
        method: 'put',
        data
    })
}
// 库位编辑
export const editSpacecode = ({ whouseId, spaceCode, data }) => {
    return request({
        url: `/warehouse/space/edit/${whouseId}/${spaceCode}`,
        method: 'post',
        data
    })
}
// 下载库位导入模板
export const downloadTemplate = () => {
    return request({
        url: `/warehouse/space/download/template`,
        responseType: 'blob'
    })
}
// 导出所有库位
export const exportSpacecode = whouseId => {
    return request({
        url: `/warehouse/space/export/${whouseId}`,
        responseType: 'blob'
    })
}
// 库位查sku（分页）
export const getSpaceSku = ({ whouseId, spaceCode }) => {
    return request({
        url: `/warehouse/space/sku/${whouseId}/${spaceCode}`,
        params: {
            pageNo:1,
            pageSize: 100 * 100
        }
    })
}
// 仓库店铺列表
export const getHouseShop = params => {
    return request({
        url: `/warehouse/shop`,
        params
    })
}
// 下载导入模板
export const downloadShopTemplate = () => {
    return request({
        url: `/warehouse/shop/download/template`,
        responseType: 'blob'
    })
}
// 添加一条绑定关系
export const bindShopAndHouse = (data) => {
    return request({
        url: `/warehouse/shop`,
        method: 'post',
        data
    })
}
// 仓库店铺列表
export const getShopuser = params => {
    return request({
        url: `/warehouse/shop/user`,
        params
    })
}
// 设置取消全选
export const settingSelectAll = data => {
    return request({
        url: `/warehouse/shop/user`,
        method: 'post',
        data
    })
}
// 一键绑定所有店铺
export const quickBindAll = params => {
    return request({
        url: `/warehouse/shop/user/quickBindAll`,
        params
    })
}
// 修改全选属性
export const changeCheck = data => {
    return request({
        url: `/warehouse/shop/user`,
        method: 'post',
        data
    })
}

// 修改全选属性
export const shopAndUserBind = ({ staffId, data }) => {
    return request({
        url: `/warehouse/shop/user/edit/${staffId}`,
        method: 'post',
        data
    })
}
// 修改全选属性
export const getUserShop = ({ staffId, params }) => {
    return request({
        url: `/warehouse/shop/user/${staffId}`,
        method: 'GET',
        params
    })
}
// 查询sku
export const getSkuInfo = sku => {
    return request({
        url: `/warehouse/sku/search/one/${sku}`,
    })
}
/* 获取仓库详情 */
export const getWarehouseContent = params => {
    return request({
        url: '/warehouse/findDetails',
        method: 'get',
        params
    })
}