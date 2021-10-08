import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const StaffIdKey = 'staff-id'
const StaffNameKey = 'name'
const ToMenus = 'Admin-Menu'
export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}
export function removeToken() {
    return Cookies.remove(TokenKey)
}
// 将当前的菜单权限存入到session

export const setMenus = (menus) => sessionStorage.setItem(ToMenus, menus)
export const getMenus = () => sessionStorage.getItem(ToMenus)

export const setStaffName = (name) => sessionStorage.setItem(StaffNameKey, name)
export const getStaffName = () => sessionStorage.getItem(StaffNameKey)

export const setStaffId = (id) => sessionStorage.setItem(StaffIdKey, id)
export const getStaffId = () => sessionStorage.getItem(StaffIdKey)