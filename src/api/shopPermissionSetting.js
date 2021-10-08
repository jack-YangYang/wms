import request from '@/utils/request'
export const getData = params => {
    return request({
        url: '/userShop/pageList',
        method: 'get',
        params
    })
}
/* 删除店铺与仓库的绑定关系 */
export const delShopRole = recordId => {
    return request({
        url: `/userShop/del/${recordId}`,
        method: 'post',
    })
}
/* 获取所有的角色下拉列表 */
export const getRoleList = () => {
    return request({
        url: `/warehouse/shopRole/queryAllRoleList`,
        method: 'get',
    })
}
/* 新增店铺角色绑定 */
export const addShopRole = data => {
    return request({
        url: `/warehouse/shopRole/addUser`,
        method: 'post',
        data
    })
}
/* 编辑店铺角色绑定 */
export const updateShopRole = data => {
    return request({
        url: `/userShop/update`,
        method: 'post',
        data
    })
}

