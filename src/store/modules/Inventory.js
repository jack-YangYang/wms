/* 盘点单 */
import {
    getData,
    getContent,
    exportData,
    addIninventory,
    auditIninvetory,
    invalidIninvetory
} from '@/api/Inventory'
import { findSkuDetail, getActionLog } from '@/api/common'
import { getButtonList } from '@/api/permision' 
import { loading, loadingClose, message, dateFormat, downlaod } from '@/utils/common'
import router from '@/router'
const state = {
    tableData: [
        {}
    ],
    showButtons: {
        add: false,
        audit: false,
        invalid: false
    },
    logTotal: 0,
    logTableData: [], // c操作日志表格数据
    showLogModule: false, // 操作日志dialog
    total: 0,
    model: 'WAREHOUSE_CHECK',
    detail:{
        whouseId: null,
        ticketCode: '',
        checkDate: '',
        whouseName: '',
        remark: ''
    },
    detailItems: [],
    auditState: 0, /* 是否通过 */
    auditModal: false, /* 审核弹窗 */
    auditRemark: '',
    stateList: [
        {
            label: '待审核',
            value: 1
        },
        {
            label: '审核通过',
            value: 2
        },
        {
            label: '已驳回',
            value: 3
        },
        {
            label: '作废',
            value: 4
        }
    ],
    skuDetail: {},
}
const mutations = {
    GET_DATA(state, data) {
        state.tableData = data.data
        data.data.forEach(item => {
            item.createDate = item.createDate ? dateFormat(item.createDate) : ''
        })
        state.total = data.total
    },
    DEL_ITEIMS(state, index) {
        state.detailItems.splice(index, 1)
    },
    GET_CONTENT(state, { detail, items }) {
        items.forEach(ele => {
            ele.skuSpaces = ele.skuSpaces ? ele.skuSpaces.join() : ''
        })
        state.detail = detail
        state.detailItems = items
    },
    CAHNGE_ITEMS(state, data) {
        data.forEach(item => {
            item.skuSpaces = item.skuSpaces ? item.skuSpaces.join() : ''
            item.skuAmount = item.skuCount * item.skuPrice
            item.originalCount = item.currentCount
        })
        state.detailItems = data
    },
    CLEAR_CONTENT(state) {
        state.detail.whouseId = null
        state.detail.remark = null
        state.detailItems = []
    },
    CLOSR_AUDIT_MODAL(state, { type }) {
        state.auditRemark = ''
        state.auditModal = type
        state.auditState = 0
    },
    CHANGE_AUDIT_STATE(state, flag) {
        state.auditState = flag
    },
    ADD_SKU_DETAIL(state, data) {
        data.skuAmount = data.skuCount * data.skuPrice
        data.originalCount = data.currentCount
        state.detailItems.push(data)
    },
    // 改变日志弹窗状态
    CAHNGE_LOG_MODULE(state, status) {
        state.showLogModule = status
    },
    GET_LOG_DATA(state, { data, total }) {
        state.logTotal = total
        state.logTableData = data
    },
    GET_BUTTON_LIST(state, list) {
        list.forEach(item => {
            state.showButtons[item.key] = true
        })
    }
}
const actions = {
    async getList({ commit }, params) {
        loading()
        try {
            const { data } = await getData(params)
            commit('GET_DATA', data)
            loadingClose()
        } catch(err) {
            loadingClose()
        }
    },
    async getLog({ commit, state }, params) {
        loading()
        const { data, code } = await getActionLog(params, state.model)
            if (code === 0) {
                if (!state.showLogModule) {
                    commit('CAHNGE_LOG_MODULE', true)
                }
                commit('GET_LOG_DATA', data)
            }
        loadingClose()
    },
    async getContent({ commit }, params) {
        loading()
        try {
            const { data } = await getContent(params)
            commit('GET_CONTENT', data)
            loadingClose()
        } catch(err) {
            loadingClose()
        }
    },
    async exportData({}, params) {
        loading()
        await exportData(params).then(res => {
            loadingClose()
            downlaod(res, '盘点单.xls')
        })
    },
    async addIninventory({}, data) {
        loading()
        try {
            const { code } = await addIninventory(data)
            loadingClose()
            if (code === 0) {
                router.go(-1)
            }
        } catch(err) {
            loadingClose()
        }
    },
    /* 审核盘点单 */
    async auditIninvetory({ commit, dispatch }, { data, params }) {
        loading()
        const { code } = await auditIninvetory(data)
        loadingClose()
        if (code === 0) {
            commit('CLOSR_AUDIT_MODAL', { type: false })
            dispatch('getList', params)
            message('success', '审核成功')
        }
    },
    async findSkuDetail({ commit }, params) {
        try {
            params.required = true
            const { code, data } = await findSkuDetail(params)
            if (code === 0) {
                commit('ADD_SKU_DETAIL', data)
            }
        } catch(err) {
        }
        // await findSkuDetail(data).then(res => {
        //     loadingClose()
        //     if (res.code === 0) {
        //         commit('ADD_SKU_DETAIL', res.data)
        //     } else {
        //         message('error', res.msg)
        //     }
        // }).catch(err => {
        //     loadingClose()
        // })
    },
    async invalidIninvetory({ dispatch }, { ticketCode, params }) {
        const { code, data } = await invalidIninvetory(ticketCode)
        if (code === 0) {
            dispatch('getList', params)
        } else {
            message('error', data.msg)
        }
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