import request from '@/utils/request'
const baseURL = process.env.NODE_ENV === 'development' ? '/api' : process.env.VUE_APP_AMAZON_PHP
export const getData = params => {
    return request({
        url: '/api/fba/report_inbound_amount_list',
        data: params,
        method: 'POST',
        baseURL
    })
}
export const exportData = params => {
    return request({
        url: '/api/fba/export_inbound_amount_list',
        params,
        method: 'get',
        responseType: 'blob',
        baseURL
    })
}
//获取销售部门
export function reqGetSalerDepartment() {
    return request({
      url: '/api/basic/get_sales_dept',
      method: "get",
      baseURL
    })
}
  //获取部门运营人员
export function reqGetDepartmentSalers(arg) {
    return request({
      url: "/api/basic/get_staff",
      method: 'post',
      data: arg,
      baseURL
    })
}