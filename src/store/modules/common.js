import {
    setToken,
    setStaffId,
    setStaffName
} from '@/utils/auth'
import {
    getStaffId,
    getStaffName,
    getOAUserToken,
    getFbaShopDept,
    getAllShop,
    getAllwarehouse,
    getAllIdShop,
    getshopBindHouse,
    getAllProvideList,
    getAllShipList,
    getShopShipList,
    getDeliveryWarehouseList,
    getPlatform
} from '@/api/common'
let loading = false
const state = {
    countryList: [],
    department: [],
    provideList: [], // 物流公司
    shipList: [], // 物流方式
    shopShipList: [], // 店铺运输方式
    deliveryWarehouseList: [], // 发货仓库
    platformList: [], // 销售平台
    colorList: {
        0: {
            color: '#E6A23C',
            type: '待审核'
        },
        1: {
            color: '#E6A23C',
            type: '待审核'
        },
        2: {
            color: '#67C23A',
            type: '审核通过'
        },
        3: {
            color: '#F56C6C',
            type: '已驳回'
        },
        4: {
            color: '#909399',
            type: '作废'
        }
    },
    shopBindHouse: [],
    loading: false,
    shopList: [],
    shopIdlist: [],
    waehouseList: [],
    username: '',
    logistics: []
}
const mutations = {
    GET_SHOP_DEPT(state, data) {
        state.department = data.depts
    },
    CAHNGE_LOADING: (state, type) => {
        state.loading = type
    },
    GET_COUNTRY_LIST: (state, data) => {
        state.countryList = data
    },
    GET_LOGISTICS: (state, data) => {
        state.logistics = data
    },
    GET_STAFFNAME: (state, name) => {
        state.username = name
    },
    GET_SHOP: (state, data) => {
        data.forEach(item => {
            item.label = item.shopName
            item.value = item.id
        })
        state.shopList = data
    },
    GET_WAREHOUSE: (state, data) => {
        state.waehouseList = data
    },
    GET_BY_HOUSE: (state, data) => {
        state.shopBindHouse = data
    },
    GET_PROVIDE_LIST: (state, data) => {
        state.provideList = data
    },
    GET_SHIP_LIST: (state, data) => {
        state.shipList = data
    },
    GET_SHOP_SHIP_LIST: (state, data) => {
        state.shopShipList = data
    },
    GET_DELIVERY_WAREHOUSE_LIST: (state, data) => {
        state.deliveryWarehouseList = data
    },
    GET_PLATFORM: (state, data) => {
        state.platformList = data
    }
}
const actions = {
    async getFbaShopDept({
        commit
    }) {
        const {
            data
        } = await getFbaShopDept()
        commit('GET_SHOP_DEPT', res.data)
    },
    // 根据店铺名称获取店铺
    async getAllShop({
        commit,
        state
    }, name) {
        if (!name) {
            return
        }
        commit('CAHNGE_LOADING', true)
        const {
            data: {
                accounts
            }
        } = await getAllShop(name)
        commit('GET_SHOP', accounts)
        commit('CAHNGE_LOADING', false)
    },
    // 根据店铺id获取店铺
    async getAllShopId({
        commit
    }, id) {
        if (!id) {
            commit('CAHNGE_LOADING', false)
            return
        }
        commit('CAHNGE_LOADING', true)
        const {
            data
        } = await getAllIdShop(id)
        // let list = [
        //     {
        //         label: data.name,
        //         value: data.id
        //     }
        // ]
        commit('GET_SHOP', data)
        commit('CAHNGE_LOADING', false)
    },
    async getAllwarehouse({
        commit
    }, params) {
        const {
            data
        } = await getAllwarehouse(params)
        commit('GET_WAREHOUSE', data)
    },
    async getStaffId({
        commit
    }) {
        const {
            data
        } = await getStaffId()
        setStaffId(data.staffId)
    },
    async getshopBindHouse({
        commit
    }, params) {
        const {
            data
        } = await getshopBindHouse(params)
        commit('GET_BY_HOUSE', data)
    },
    async getStaffName({
        commit
    }) {
        const {
            data
        } = await getStaffName()
        setStaffName(data.name)
        commit('GET_STAFFNAME', data.name)
    },
    async getOAUserToken({
        commit
    }) {
        const {
            data
        } = await getOAUserToken()
        console.log(data)
    },
    async getAllProvideList({
        commit
    }) {
        const {
            data
        } = await getAllProvideList()
        commit('GET_PROVIDE_LIST', data)
    },
    async getAllShipList({
        commit
    }) {
        const {
            data
        } = await getAllShipList()
        commit('GET_SHIP_LIST', data)
    },
    async getShopShipList({
        commit
    }) {
        const {
            data
        } = await getShopShipList()
        commit('GET_SHOP_SHIP_LIST', data)
    },
    async getDeliveryWarehouseList({
        commit
    }) {
        const {
            data
        } = await getDeliveryWarehouseList()
        commit('GET_DELIVERY_WAREHOUSE_LIST', data)
    },
    async getPlatform({
        commit
    }) {
        const {
            data
        } = await getPlatform()
        commit('GET_PLATFORM', data)
    }
}
export default {
    state,
    actions,
    mutations
}
