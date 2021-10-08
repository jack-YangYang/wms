import {
    getData,
    exportData
} from '@/api/StockData'
import { loading, loadingClose, downlaod, message } from '@/utils/common'
const state = {
    tableData: [
    ],
    /* 搜索类型 */
    seatchTyleList: [
        {
            label: 'SKU',
            value: 'sku'
        },
        {
            label: '商品名称',
            value: 'skuName'
        }
    ],
    /* 商品状态 */
    productTypeList: [
        {
            label: '在售',
            value: 1
        },
        {
            label: '停售',
            value: 0
        }
    ],
    total: 0
}
const mutations = {
    GET_DATA(state, data) {
        data.data.forEach(item => {
            item.stockStock = item.skuCount - item.skuOccupyCount
        })
        state.tableData  = data.data
        state.total = data.total
    },
}
const actions = {
    async getData({ commit }, parmas) {
        loading()
        await getData(parmas).then(res => {
            loadingClose()
            commit('GET_DATA', res.data)
        }).catch(err => {
            loadingClose()
        })
    },
    async exportData({}, parmas) {
        loading()
        await exportData(parmas).then(res => {
            loadingClose()
            downlaod(res, '库存列表数据.xls')
        }).catch(err => {
            loadingClose()
        })
    },
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}