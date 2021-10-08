import { loading, loadingClose, confirmMsg, message, downlaod } from '@/utils/common'
import { getData, getContent, solveAbnormal, addMemo, exportData, startSolve } from '@/api/Abnormal'
import { getActionLog, getPurchaseOrderInfo } from '@/api/common'
import { getButtonList } from '@/api/permision' 
const state = {
    tableData: [ {} ],
    fileList: [],
    total: 0,
    content: {
        detail: {
            reason: ''
        }
    },
    showAbnormalModule: false,
    solveAbnormalForm: {
        memo: '',
        desc: '',
        ticketCode: ''
    },
    showButtons: {
        log: false,
        edit: false,
        solve: false
    },
    showShopInfoModule: false,
    shopInfoTable: [],
    model: 'TICKET_IN_QA_ABNORMAL',
    showLogModule: false,
    logTableData: [],
    logTotal: 0,
    timeList: [
        {
            label: '质检时间',
            value: 'qa'
        },
        {
            label: '解决时间',
            value: 'resolve'
        },
    ],
    searchList: [
        {
            label: '入库单号',
            value: 'ticketCode'
        },
        {
            label: '关联单号',
            value: 'ticketOrder'
        },
        {
            label: '采购员',
            value: 'purchaser'
        }
    ],
}
const mutations = {
    GET_BUTTON_LIST(state, list) {
        list.forEach(item => {
            state.showButtons[item.key] = true
        })
    },
    GET_SHOP_INFO_DATA: (state, data) => {
        if (typeof data === 'boolean') {
            state.showShopInfoModule = false
            state.shopInfoTable = []
            return
        }
        state.showShopInfoModule = true
        state.shopInfoTable = data
    },
    CAHNGE_LOG_MODULE(state, type) {
        state.showLogModule = type
    },
    GET_LOG_DATA(state, { data, total }) {
        state.logTableData = data
        state.logTotal = total
    },
    CAHNGE_MODULE(state, { type, item }) {
        state.showAbnormalModule = type
        if (!type) {
            Object.keys(state.solveAbnormalForm).forEach(key => state.solveAbnormalForm[key] = '')
            return
        }
        state.solveAbnormalForm.ticketCode = item.ticketCode
        state.solveAbnormalForm.desc = item.memo
    },
    GET_DATA(state, data) {
        // data.data.forEach(item => {
        //     item.memo = JSON.parse(item.memo)
        // })
        state.tableData = data.data
        state.total = data.total
    },
    GET_CONTENT(state, data) {
        state.content = data
    }
}
const actions = {
    async getList({ commit }, params) {
        loading()
        const { data } = await getData(params)
        commit('GET_DATA', data)
        loadingClose()
    },
    async getPurchaseOrderInfo({ commit }, params) {
        loading()
        const { data } = await getPurchaseOrderInfo(params)
        commit('GET_SHOP_INFO_DATA', data)
        loadingClose()
    },
    async getContent({ commit }, params) {
        loading()
        const { data } = await getContent(params)
        commit('GET_CONTENT', data)
        loadingClose()
    },
    async solve({ commit, dispatch }, { form, params }) {
        console.log(form)
        if (!form.memo) {
            message('warning', '请填写标签')
            return
        }
        loading()
        try {
            const { code } = await addMemo(form)
            loadingClose()
            if (code === 0) {
                commit('CAHNGE_MODULE', { type:false })
                dispatch('getList', params)
            }
        } catch(e) {
            loadingClose()
        }
    },
    async getButtonList({ commit }, params) {
        await getButtonList(params).then(res => {
            commit('GET_BUTTON_LIST', res.data.buttonList)
        })
    },
    async startSolve({ dispatch }, { ticketCode, params }) {
        loading()
        try {
            const { code } = await startSolve(ticketCode)
            loadingClose()
            if (code === 0) {
                dispatch('getList', params)
            }
        } catch(e) {
            loadingClose()
        }
    },
    async exportData({}, params) {
        loading()
        let data = JSON.parse(JSON.stringify(params))
        data.pageSize = 1000 * 1000
        await exportData(data).then(res => {
            loadingClose()
            downlaod(res, '质检异常.xls')
        }).catch(err => {
            loadingClose()
        })
    },
    async getLog({ commit, state }, params) {
        loading()
        const { data } = await getActionLog(params, state.model)
            if (!state.showLogModule) {
                commit('CAHNGE_LOG_MODULE', true)
            }
        commit('GET_LOG_DATA', data)
        loadingClose()
    },
    solveAbnormalAction({ dispatch }, { item, params }) {
        confirmMsg('warning', '提示', '请确认异常是否已经解决', async () => {
            loading()
            try {
                const { code } = await solveAbnormal(item.ticketCode)
                loadingClose()
                if (code === 0) {
                    dispatch('getList', params)
                }
            } catch(e) {
                loadingClose()
            }
        })
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}