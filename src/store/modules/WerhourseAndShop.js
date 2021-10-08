import {
    getData,
    delContent,
    getWarehouseToShopRelation,
    addOrEditWarehouse,
    exportData
} from '@/api/WerhourseAndShop'
import { message, loading ,loadingClose, downlaod } from '@/utils/common'
import { getButtonList } from '@/api/permision' 
const state = {
    tableData: [
    ],
    showBandingModal: false,
    parentForm: {
        shopId: '',
        virtId: '',
        site: '',
        transferId: '',
        airTransitionId: '',
        seaTransitionId: ''
    },
    showButtons: {
        edit: false,
        exportData: false,
        download: false,
        importData: false,
        del: false
    },
    seaTransition: [], /* 海运过渡仓 */
    airTransition: [], /* 空运过渡仓 */
    virtList: [], /* 虚拟仓 */
    total: 0,
    searchList: [
        {
            value: 'transitWarehoure',
            label: '中转仓'  
        },
        {
            value: 'virtualWarehoure',
            label: '虚拟仓'
        }
    ],
    checkDataList: []
}
const mutations = {
    change_CheckDataList(state, val) {
        state.checkDataList = val
    },
    CHANGE_MODAL_TYPE(state, flag) {
        state.showBandingModal = flag
    },
    CAHNGE_PARENT_FORM(state, val = undefined) {
        if (val) {
            state.parentForm = val
        } else {
            Object.keys(state.parentForm).forEach(key => state.parentForm[key] = '')
        }
    },
    GET_DATA(state, data) {
        state.tableData = data.data
        state.total = data.total
    },
    get_COMMON_CONTENT(state, res) {
        state.seaTransition = res.seaTransition
        state.airTransition = res.airTransition
        state.virtList = res.virt
    },
    GET_BUTTON_LIST(state, list) {
        list.forEach(item => {
            state.showButtons[item.key] = true
        })
    }
}
const actions = {
    async getData({ commit }, params) {
        loading()
        await getData(params).then(res => {
            loadingClose()
            if (res.code === 0) {
                commit('GET_DATA', res.data)
            }
        }).catch(err => {
            loadingClose()
        })
    },
    async delContent({ dispatch }, { relationId, params }) {
        console.log(relationId)
        await delContent(relationId).then(res => {
            if (res.code === 0) {
                message('success', '删除成功')
                dispatch('getData', params)
            } else {
                message('warning', res.msg)
            }
        })
    },
    async getWarehouseToShopRelation({ commit }) {
        await getWarehouseToShopRelation().then(res => {
            commit('get_COMMON_CONTENT', res.data)
        })
    },
    async exportData({}, params) {
        loading()
        await exportData(params).then(res => {
            loadingClose()
            downlaod(res, '店铺与仓库绑定关系.xls')
        }).catch(err => {
            loadingClose()
        })
    },
    async addOrEditWarehouse({ commit, dispatch }, { data, params }) {
        loading()
        await addOrEditWarehouse(data).then(res => {
            loadingClose()
            if (res.code === 0) {
                commit('CHANGE_MODAL_TYPE', false)
                commit('CAHNGE_PARENT_FORM')
                dispatch('getData', params)
            } else {
                message('warning', res.msg)
            }
        }).catch(err => {
            loadingClose()
        })
    },
    async getButtonList({ commit }, params) {
        await getButtonList(params).then(res => {
            commit('GET_BUTTON_LIST', res.data.buttonList)
        })
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}