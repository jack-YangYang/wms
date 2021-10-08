import request from '@/utils/request'
/* 店铺与仓库绑定关系 */

export const getData = (params) => {
    return request({
        url: '/warehouse/shopRelation/pageList',
        method: 'get',
        params
    })
}
/* 删除 */
export const delContent = data => {
    return request({
        url: `/warehouse/shopRelation/del/${data}`,
        method: 'post',
    })
}
/*获取获取店铺仓库绑定仓库下拉框 */
export const getWarehouseToShopRelation = () => {
    return request({
        url: `/warehouse/queryToShopRelation`,
        method: 'get',
    })
}
/* 添加/修改-店铺仓库绑定关系 */
export const addOrEditWarehouse = data => {
    return request({
        url: `/warehouse/shopRelation/addRelation`,
        method: 'post',
        data
    })
}
/* 导出列表 */
export const exportData = params => {
    return request({
        url: `/warehouse/shopRelation/exportShopRelation`,
        method: 'get',
        params,
        responseType: 'blob'
    })
}