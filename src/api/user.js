import request from '@/utils/request'
const baseURL = process.env.VUE_APP_AUTH_API_DOMAIN
export function login(data) {
    return request({
        url: '/vue-element-admin/user/login',
        method: 'post',
        data
    })
}

export function getInfo() {
    return request({
        url: '/listing/base/get_user_info',
        method: 'get',
    })
}

export function logout() {
    return request({
        url: '/vue-element-admin/user/logout',
        method: 'post'
    })
}