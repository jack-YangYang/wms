/* 店铺与角色 */
import request from '@/utils/request'
export const getData = params => {
    return request({
        url: '/warehouse/shopRole/pageList',
        method: 'get',
        params
    })
}
/* 删除店铺与仓库的绑定关系 */
export const delShopRole = relationId => {
    return request({
        url: `/warehouse/shopRole/del/${relationId}`,
        method: 'post',
    })
}
/* 新增店铺角色绑定 */
export const addShopRole = data => {
    return request({
        url: `/warehouse/shopRole/add`,
        method: 'post',
        data
    })
}
/* 编辑店铺角色绑定 */
export const updateShopRole = data => {
    return request({
        url: `/warehouse/shopRole/update`,
        method: 'post',
        data
    })
}

