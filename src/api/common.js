//php baseURL
const orderBaseURL = process.env.NODE_ENV === 'development' ? '/php' : process.env.VUE_APP_ORDER_API
const shopAPI = process.env.NODE_ENV  === 'development' ? '/admin' : process.env.VUE_APP_SHOP_API
import { getStaffIdSession, getStaffNameSession } from '@/utils/auth'
/* 权限中心接口 */
// const permisssonURL = VUE_APP_ERP_OA_DOMAIN
/* java api 公共下拉框接口 */
import request from '@/utils/request'
let params = {
  offset: 0,
  size: 1000
}
const baseURL = process.env.VUE_APP_AUTHORITY_API_DOMAIN
export const getCommonData = () => {
  return request({
    method: 'get',
    url: '/sysDic/queryAllDic',
    // baseURL
  })
}
export const getFbaShopDept = () => {
  return request({
    method: 'get',
    url: '/rest/ding/dept',
    baseURL
  })
}
/* 获取库位中OA人员列表 */
export const getOAUserList = () => {
  console.log(sessionStorage.getItem('OA-Token'))
  return request({
    url: '/rest/ding/user',
    method: 'get',
    params,
    baseURL,
  })
}
/* 后去oa的toekn */
export const getOAUserToken = (params) => {
  return request({
    url: '/rest/authorization/authorize',
    method: 'get',
    params,
    baseURL
  })
}
/* 获取用户staffId */
export const getStaffId = () => {
  return request({
    url: '/rest/auth/user/staffid',
    method: 'get',
    baseURL,
  })
}
/* 获取用户名称 */
export const getStaffName = () => {
  return request({
    url: '/rest/auth/user/name',
    method: 'get',
    baseURL
  })
}
//获取权限店铺列表
export function reqGetShopList() {
  return request({
    url: "/userShop/queryUserShop",
    method: "get",
  })
}
/* 根据店铺名获取所有店铺 */
export const getAllShop = (shopName) => {
  return request({
    url: '/shop/account',
    params: { 
      shopName,
      size: 1000 * 1000,
      offset: 0
     },
    baseURL: shopAPI
  })
}
/* 根据店铺ID获取所有店铺 */
export const getAllIdShop = (shopId) => {
  return request({
    url: `/warehouse/shop/${shopId}`,
  })
}
/* 获取所有仓库 */
export const getAllwarehouse = (params) => {
  return request({
    url: '/warehouse/listAll',
    params,
  })
}
/* 获取中转仓列表 */
export const gettransitWarehoureList = () => {
  return request({
    url: "/warehouse/queryTransfer",
    method: "get",
  })
}
/* 获取所有的仓库 */
export const getAllWarehoureList = () => {
  return request({
    url: "/warehouse/queryAll",
    method: "get",
  })
}
export const getownWarehouses = () => {
  return request({
    url: "/warehouseTransferOperate/ownWarehouses",
    method: "get",
  })
}
// 根据店铺查询仓库
export const getshopBindHouse = params => {
  return request({
    url: '/warehouse/findByShop',
    params
  })
}
/* 查找sku */
export const findSkuDetail = ({ whouseId, sku, shopId, required=true }) => {
  return request({
      url: `/warehouse/sku/find/${whouseId}/${shopId}/${sku}/${required}`,
  })
}
// 查看操作日志
export const getActionLog = (params, model) => {
  console.log(params)
  return request({
      url: `/warehouse/log/${model}`,
      params
  })
}
// 物流公司下拉框
export const getAllProvideList = () => {
  return request({
    url: '/api/logistics/provide_list',
    baseURL: orderBaseURL
  })
}
// 物流方式下拉框
export const getAllShipList = () => {
  return request({
    url: '/api/logistics/ship_method_list',
    baseURL: orderBaseURL
  })
}
// 店铺运输方式
export const getShopShipList = () => {
  return request({
    url: '/api/logistics/shop_ship_method_list',
    baseURL: orderBaseURL
  })
}
// 发货仓库
export const getDeliveryWarehouseList = () => {
  return request({
    url: '/api/warehouse/list',
    baseURL: orderBaseURL
  })
}
// 销售平台
export const getPlatform = () => {
  return request({
    url: '/api/order_filter/platform',
    baseURL: orderBaseURL
  })
}
// 获取店铺详情
export const getPurchaseOrderInfo = params => {
  const { type, ticketCode, sku } = params
    const urlConfig= {
      1: `/warehouse/purchaseOrder/${ticketCode}/${sku}`,
      2: `/warehouse/ticketIn/${ticketCode}/${sku}`,
      3: `/warehouse/purchaseOrderBack/${ticketCode}/${sku}`,
      4: `/warehouse/ticketInQaAbnormal/${ticketCode}/${sku}`
    }
  return request({
    url: urlConfig[type]
  })
}