/* 入库单 */
import { 
    getPurchaseInList, 
    getPutInStorageOrderDetail, 
    getQuerySpace, 
    purchaseInStockIn, 
    exportData,
    dropPurchaseIn,
    auditOrder,
    invalidOrder,
    getTicketInInfo,
    startInspection,
    ticketIn,
    print,
    mark
 } from '@/api/PutInStorageOrder'
import { confirmMsg, downlaod, loading, loadingClose, message } from '@/utils/common'
import { getActionLog, getPurchaseOrderInfo } from '@/api/common'
import floatNumber from '@/vendor/FloatNum'
import { getButtonList } from '@/api/permision' 
import router from '@/router'
const ticketInInfo = {
    productDetail: {
        mainPics: [],
        otherPics: [],
        partPics: []
    },
    detail: {},
    skuDetail: {}
}
const state = {
    tableData: [ {} ],
    detail: {
        remark: '',
        qaUserName: '',
    },
    showShopInfoModule: false,
    shopInfoTable: [],
    logTotal: 0,
    ticketInInfo: {
        productDetail: {
            mainPics: [],
            otherPics: [],
            partPics: []
        },
        detail: {},
        skuDetail: {}
    },
    ticketInInfoFormat: {
        count: 0,
        fileList: [],
        remark: ''
    },
    timeList: [
        {
            name: '创建时间',
            value: 'createOrder'
        },
        {
            name: '质检时间',
            value: 'qa'
        },
        {
            name: '贴标时间',
            value: 'mark'
        },
        {
            name: '上架时间',
            value: 'shelf'
        },
        // {
        //     name:'审核时间',
        //     value: 'check'
        // },
    ],
    model: 'TICKET_IN',
    detailItems: [],
    showLogModule: false,
    logTableData: [],
    spaceList: [], /* 库位列表 */
    auditModal: false,
    auditState: 0,
    GRNStatus: [
        {
            label: '已作废',
            value: 2,
        },
        {
            label: '待质检',
            value: 1
        },
        {
            label: '上架完成',
            value: 10
        },
        {
            label: '贴标完成',
            value: '4'
        },
        {
            label: '质检完成',
            value: 3
        }
    ],
    colorStateList: {
        10: '#e67e22',
        20: '#95a5a6',
        50: '#f39c12',
        60: '#27ae60',
        70: '#9b59b6',
        100: '#55E6C1',
        110: '#FD7272'
    },
    stateList: [
        // {
        //     label: '待审核',
        //     value: 10,
        // },
        // {
        //     label: '审核通过',
        //     value: 20,
        // },
        // {
        //     label: '审核不通过',
        //     value: 30,
        // },
        {
            label: '已作废',
            value: 20,
        },
        {
            label: '待质检',
            value: 10,
        },
        {
            label: '质检完成',
            value: 60,
        },
        {
            label: '贴标完成',
            value: 70,
        },
        {
            label: '上架完成',
            value: 100,
        },
        {
            label: '采购退回',
            value: 110,
        },
    ],
    showButtons: {
        invalid: false,
        edit: false,
        log: false,
        print: false,
        true: false,
        testing: false,
        printOrder: false,
        printLabel:false,
        againprintLabel:false
    },
    searchList: [
        {
            label: '入库单号',
            value: 'ticketCode'
        },
        {
            label: '关联单号',
            value: 'ticketOrder'
        },
    ],
    total: 0
}
const mutations = {
    GET_DATA(state, data) {
        state.tableData = data.data
        state.total = data.total
    },
    CAHNGE_LOG_MODULE(state, flag) {
        state.showLogModule = flag  
    },
    GET_LOG_DATA(state, { data, total }) {
        state.logTotal = total
        state.logTableData = data
    },
    CLOSR_AUDIT_MODAL(state, status) {
        state.auditModal = status
    },
    CHANGE_AUDIT_STATE(state, val) {
        state.auditState = val
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
    GET_DETAIL(state, { data, type }) {
        console.log(type)
        const { detail, items } = data
        state.detail = detail
        let label = type == 60 ? 'planCount' : 'qaCount'
        console.log(label)
        items.forEach(item => {         
            item.taxPriceAmount = item.taxPrice * item[label] // 总税费
            item.expressPriceAmount = item.expressPrice * item[label] // 总运费
            item.inAmount = item.taxPriceAmount + item.expressPriceAmount + item.price * item[label]
        })
        state.detailItems = items
    },
    GET_SPACE(state, data) {
        state.spaceList = data
    },
    GET_BUTTON_LIST(state, list) {
        console.log(list)
        list.forEach(item => {
            state.showButtons[item.key] = true
        })
    },
    GET_TICKET_INFO: (state, data) => {
        state.ticketInInfo = data
    },
    CAHNGE_ticketInInfoFormat: state => {
        state.ticketInInfoFormat.count = 0
        state.ticketInInfoFormat.fileList = []
        state.ticketInInfoFormat.remark = ''
    }
}
const actions = {
    async getPurchaseInList({ commit }, params) {
        loading()
        try {
            const { data } = await getPurchaseInList(params)
            loadingClose()
            commit('GET_DATA', data)
        } catch(e) {
            loadingClose()
        }
    },
    async startInspection({ dispatch }, { ticketCode, search }) {
        const { code } = await startInspection(ticketCode)
        if (code === 0) {
            message('success', '开始质检成功')
            dispatch('getPurchaseInList', search)
        }
    },
    getSimpleOrderDetail({}, inCode) {
        return new Promise(resolve => {
          getPutInStorageOrderDetail(inCode)
            .then(res => {
              loadingClose()
              if (res.code === 0) {
                resolve(res.data)
              }
            }).catch(err => {
              loadingClose()
            })
        })
      },
    async getPurchaseOrderInfo({ commit }, params) {
        loading()
        const { data } = await getPurchaseOrderInfo(params)
        commit('GET_SHOP_INFO_DATA', data)
        loadingClose()
    },
    async getPutInStorageOrderDetail({ commit }, { ticketCode, state, type }) {
        loading()
        try {
            const { data } = await getPutInStorageOrderDetail(ticketCode)
            commit('GET_DETAIL', { data, type: state })
            loadingClose()
        } catch(err) {
            loadingClose()
        }
    },
    // 作废
    async invalid({ dispatch }, { ticketCode, params }) {
        const { code } = await invalidOrder(ticketCode) 
        if (code === 0) {
            dispatch('getPurchaseInList', params)
        }
    },
    async getQuerySpace({ commit }, params) {
        await getQuerySpace(params).then(res => {
            commit('GET_SPACE', res.data)
        })
    },
    async purchaseInStockIn({ }, { data, state, ticketCode }) {
        loading()
        try {
            const { code } = await purchaseInStockIn({ data, state, ticketCode })
            loadingClose()
            if (code === 0) {
                router.go(-1)
                message('success', '操作成功')
            }
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
    async auditOrder({ dispatch, commit }, { ticketCode, type, params }) {
        const { code } = await auditOrder({ ticketCode, type }) 
        if (code === 0) {
            dispatch('getPurchaseOrderList', params)
            commit('CLOSR_AUDIT_MODAL', false)
            commit('CHANGE_AUDIT_STATE', 0) 
        }
      },
    async getButtonList({ commit }, params) {
        await getButtonList(params).then(res => {
            commit('GET_BUTTON_LIST', res.data.buttonList)
        })
    },
    async getButtonList({ commit }, params) {
        await getButtonList(params).then(res => {
            commit('GET_BUTTON_LIST', res.data.buttonList)
        })
    },
    async confirmPrint({}, { type, ticketCode }) {
        const { code } = await print({ type, ticketCode })
        if (code === 0) {
            message('success', '打印成功')
        }
    },

    async confirmMark({ dispatch }, { ticketCode, params }) {
        loading()
        try {
            loadingClose(0)
            const { code } = await mark(ticketCode)
            if (code === 0) {
                dispatch('getPurchaseInList', params)
                message('success', '操作成功')
            }
        } catch(e) {
            loadingClose()
            return false
        }
    },
    async getTicketInInfo({ commit }, params) {
        loading()
        try {
            const { data, code } = await getTicketInInfo(params)
            if (code === 0) {
                commit('GET_TICKET_INFO', data)
            } else {
                commit('GET_TICKET_INFO', ticketInInfo)
                commit('CAHNGE_ticketInInfoFormat')
            }
            loadingClose()
            console.log(data)
        } catch(e) {
            loadingClose()
            commit('GET_TICKET_INFO', ticketInInfo)
            commit('CAHNGE_ticketInInfoFormat')
        }
    },
    async ticketIn({ commit }, data) {
        loading()
        try {
            const { code } = await ticketIn(data)
            if (!code) {
                commit('GET_TICKET_INFO', ticketInInfo)
            }
            loadingClose()
        } catch(e) {
            loadingClose()
        }
    },
    async exportData({ }, arg) {
        loading()
        try {
            loadingClose()
            const data = await exportData(arg)
            downlaod(data, '采购入库单列表.xls')
        } catch(e) {
            loadingClose()
            return false
        }
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}
