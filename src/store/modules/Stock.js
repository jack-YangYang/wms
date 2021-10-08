import { getData, getTakelist, getShopStock, getShopStockContent, exportData, exportDataShop } from "@/api/StockData"
import { downlaod, loading, loadingClose } from "@/utils/common"

const state = {
    tableData: [],
    takeTableData: [],
    takeTotal: 0,
    total: 0,
    shopTableData: [],
    shopTotal: 0,
    asins: [],
    detail: [],
    typeList: [
        {
            label: '调拨占用',
            color: '#1abc9c',
            value: 10
        },
        {
            label: '订单',
            color: '#2ecc71',
            value: 20
        },
        {
            label: '其他出库',
            color: '#3498db',
            value: 100
        },
        {
            label: '采购退回',
            color: '#3498eb',
            value: 3
        }
    ]
}
const mutations = {
    GET_DATA(state, { data, total }) {
        state.tableData = data
        state.total = total
    },
    GET_TAKE_DATA(state, { data, total }) {
        state.takeTableData = data
        state.takeTotal = total
    },
    GET_SHOP_DATA(state, { data, total }) {
        state.shopTableData = data
        state.shopTotal = total
    },
    GET_SHOP_CONTENT(state, { detail, asins }) {
        console.log(asins)
        state.asins = asins
        state.detail = [detail]
    }
}
const actions = {
    async getList({ commit }, params) {
        loading()
        try {
            const { data } = await getData(params)
            commit('GET_DATA', data)
            loadingClose()
        } catch(e) {
            loadingClose()
        }
    },
    async exportData({}, params) {
        const { whouseId, sku } = params
        loading()
        const data = await exportData({ whouseId, sku, pageSize: 1000 * 1000 })
        loadingClose()
        downlaod(data, '仓库库存.xls')
    },
    async exportDataShop({}, params) {
        const { whouseId, sku, shopId2 } = params
        loading()
        const data = await exportDataShop({ whouseId, sku, shopId2: shopId2.join() || '', pageSize: 1000 * 1000 })
        loadingClose()
        downlaod(data, '店铺库存.xls')
    },
    async getTakeList({ commit }, params) {
        loading()
        try {
            const { data } = await getTakelist(params)
            commit('GET_TAKE_DATA', data)
            loadingClose()
        } catch(e) {
            loadingClose()
        }
    },
    async getShopStockList({ commit }, params) {
        loading()
        try {
            const { data } = await getShopStock({...params, shopId2: params.shopId2.join() || ''});
            commit('GET_SHOP_DATA', data)
            loadingClose()
        } catch(e) {
            loadingClose()
        }
    },
    async getContent({ commit }, params) {
        loading()
        const { data } = await getShopStockContent(params)
        commit('GET_SHOP_CONTENT', data)
        loadingClose()
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}