import { 
    getData,
    exportData,
    getContent,
    invalidTransfer, /* 作废调拨单 */
    auditTransfer, /* 审核调拨单 */
    createTransfer,
    getTransferLog // 获取日志
} from '@/api/Transfers'
import { findSkuDetail } from '@/api/common'
import { loading, loadingClose, downlaod, message, dateFormat } from '@/utils/common'
import { getButtonList } from '@/api/permision' 
import router from '@/router'
import { getActionLog } from '@/api/common'
const state = {
    tableData: [
        
    ],
    model: 'TRANSFER',
    logTotal: 0,
    logTableData: [], // c操作日志表格数据
    showLogModule: false, // 操作日志dialog
    showPrintModule: false, // 拣货单
    showButtons: {
        add: false,
        log: false,
        audit: false,
        invalid: false
    },
    createUser: null,
    date: dateFormat(new Date()),
    detail: {
        sourceWhouseId: '',
        remark: '',
        distWhouseId: ''
    },
    auditState: 0,
    auditModal: false,
    auditRemark: '',
    skuDetail: {},
    detailItems: [],
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
    total: 0
}
const mutations = {
    CHNAGE_CREATER_USER(state, name) {
        state.createUser = name
    },
    CAHNGE_ITEMS(state, data) {
        data.forEach(item => {
            item.skuSpaces = item.skuSpaces ? item.skuSpaces.join() : ''
        })
        state.detailItems = data
    },
    CLEAR_CONTENT(state) {
        state.detail.sourceWhouseId = null
        state.detail.remark = null
        state.detail.distWhouseId = null
        state.detailItems = []
    },
    GET_DATA(state, data) {
        state.tableData  = data.data
        state.total = data.total
    },
    GET_CONTENT(state, { detail, items}) {   
        items.forEach(item => {
            item.skuSpaces = item.skuSpaces ? item.skuSpaces.join() : ''
        })
        state.detail = detail
        state.detailItems = items
    },
    DELETE_ITEMS(state, index) {
        state.detailItems.splice(index, 1)
    },
    CLOSR_AUDIT_MODAL(state, flag) {
        state.auditState = 0
        state.auditRemark = ''
        state.auditModal = flag
    },
    CHANGE_AUDIT_STATE(state, auditState) {
        state.auditState = auditState
    },
    CHANGE_AUDIT_REMARK(state, val) {
        state.auditRemark = val
    },
    // GET_SKU_CONTENT(state, data) {
    //     data.count = 0
    //     state.skuDetail = data
    // },
    change_detailItems(state, data) {
        data.forEach(item => {
            item.totalAmount = (item.count * item.skuPrice).toFixed(4)
            item.skuPriceCopy = JSON.stringify(JSON.parse(item.skuPrice))
        })
        state.detailItems = data
    },
    ADD_SKU_DETAIL(state, data) {
        data.skuSpaces = data.skuSpaces.join()
        state.detailItems.push(data)
    },
    GET_BUTTON_LIST(state, list) {
        list.forEach(item => {
            state.showButtons[item.key] = true
        })
    },
    // 改变日志弹窗状态
    CAHNGE_LOG_MODULE(state, status) {
        state.showLogModule = status
    },
    // 改变打印拣货单状态
    CAHNGE_PRINT_MODULE(state, status) {
        state.showPrintModule = status
    },
    GET_LOG_DATA(state, { data, total }) {
        state.logTotal = total
        state.logTableData = data
    },
}
const actions = {
    async getList({ commit }, params) {
        loading()
        try {
            const { data } =  await getData(params)
            loadingClose()
            commit('GET_DATA', data)
        } catch(err) {
            loadingClose()
        }
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
    async exportData({}, params) {
        loading()
        let data = JSON.parse(JSON.stringify(params))
        data.pageSize = 1000 * 1000
        await exportData(data).then(res => {
            loadingClose()
            downlaod(res, '调拨单明细.xls')
        }).catch(err => {
            loadingClose()
        })
    },
    async getContent({ commit }, params) {
        loading()
        const { data } = await getContent(params)
        loadingClose()
        commit('GET_CONTENT', data)
    },
    async getPrintContent({ commit }, params) {
        loading()
        const { data } = await getContent(params)
        loadingClose()
        commit('GET_CONTENT', data)
        commit('CAHNGE_PRINT_MODULE', true)
    },
    async invalidTransfer({ dispatch }, { ticketCode, params }) {
        const { code } = await invalidTransfer(ticketCode)
        if (code === 0) {
            dispatch('getList', params)
        } 
    },
    /* 审核调拨单 */
    async auditTransfer({ commit, dispatch }, { data, params }) {
        const { code } = await auditTransfer(data)
        if (code === 0) {
            commit('CLOSR_AUDIT_MODAL', false)
            dispatch('getList', params)
            message('success', '审核成功')
        }
    },
    /* 查找sku */
    async findSkuDetail({ commit }, params) {
        loading()
        try {
            const { data, code } = await findSkuDetail(params)
            loadingClose()
            if (code === 0) {
                commit('ADD_SKU_DETAIL', data)
             }
        } catch(err) {
            loadingClose()
        }
    },
    /* 新增调拨单 */
    async createTransfer({}, data) {
        const { code, msg } = await createTransfer(data)
        if (code === 0) {
            router.go(-1)
         } else {
            // message('error', msg)
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