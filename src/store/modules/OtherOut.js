import { 
    getData,
    exportData,
    getContent,
    invalidTransfer, /* 作废调拨单 */
    auditTransfer, /* 审核调拨单 */
    createTransfer,
} from '@/api/otherOutbound'
import { findSkuDetail, getActionLog  } from '@/api/common'
import { loading, loadingClose, downlaod, message } from '@/utils/common'
import { getButtonList } from '@/api/permision' 
import router from '@/router'
import floatNum from '@/vendor/FloatNum'
const state = {
    // documentsStatusList: {
    //     1: '待审核',
    //     2: '已审核',
    //     3: '审核不通过',
    //     4: '作废'
    // },
    ticketCodeList: '',
    outboundTypeObj: {
        1: '配件防伪码出库',
        2: 'FBA货件出库'
    },
    outTypeList: [{
            name: 'FBA货件出库',
            val: 10
        },
        {
            name: '销售出库',
            val: 20
        },
        {
            name: '海外仓运输损失出库',
            val: 30
        },
        {
            name: '弃置出库',
            val: 40
        },
        {
            name: '领用出库',
            val: 50
        },
        {
            name: '其他损失出库',
            val: 60
        },
        {
            name: '大件直发出库',
            val: 70
        },
        {
            name: '万邑通海外仓出库',
            val: 80
        },
        {
            name: '谷仓海外仓出库',
            val: 90
        },
        {
            name: '其他出库',
            val: 100
        },
    ],
    outTypeFormat: {
        10: {
            name: 'FBA货件出库',
            color: '#3498db'
        },
        20: {
            name: '销售出库',
            color: '#1abc9c'
        },
        30: {
            name: '海外仓运输损失出库',
            color: '#2ecc71'
        },
        40: {
            name: '弃置出库',
            color: '#e67e22'
        },
        50: {
            name: '领用出库',
            color: '#9b59b6'
        },
        60: {
            name: '其他损失出库',
            color: '#2980b9'
        },
        70: {
            name: '大件直发出库',
            color: '#f1c40f'
        },
        80: {
            name: '万邑通海外仓出库',
            color: '#f1c40f'
        },
        90: {
            name: '谷仓海外仓出库',
            color: '#f1c40f'
        },
        100: {
            name: '其他出库',
            color: '#f1c40f'
        },
    },
    model: 'OTHER_OUT',
    documentsStatusList: {
        1: {
            color: '#909399',
            type: '待审核'
        },
        2: {
            color: '#67C23A',
            type: '已审核'
        },
        3: {
            color: '#E6A23C',
            type: '审核不通过'
        },
        4: {
            color: '#F56C6C',
            type: '作废'
        }
    },
    searchTypeList: {
        'SKU': 'sku',
        '制单人': 'createUser',
        '审核人': 'checkUser'
    },
    outboundTypeList: [
        {
            label: '配件防伪码出库',
            value: 1
        },
        {
            label: 'FBA货件出库',
            value: 2
        },
    ],
    form: {
        warehouseId: '',
        ticketCode: '',
        date: '',
        state: '',
        searchContent: '',
        remark: '',
        type: '',
        searchKey: 'sku'
    },
    tableData: [
        
    ],
    showLogModule: false,
    logTableData: [],
    logTotal: 0,
    showButtons: {
        add: false,
        log: false,
        audit: false,
        invalid: false
    },
    detail: {
        whouseId: '',
        type: 10,
        shopId: '',
        typeName: '',
        remark: ''
    },
    checkData: [],
    auditState: 0,
    auditModal: false,
    auditRemark: '',
    skuDetail: {},
    typeList: [],
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
    GET_DATA(state, data) {
        console.log(data)
        state.tableData  = data.data
        state.total = data.total
    },
    CHANGE_HOUSE(state) {
        state.detail.whouseId = null
    },
    CLEAR_CONTENT(state) {
        state.detail.whouseId = null
        state.detail.remark = null
        state.detail.type = 10
        state.detail.shopId = null
        state.detailItems = []
    },
    CHANGE_TABLE(state, { type, remark }) {
        state.detailItems.forEach(item => {
            item.outType = state.typeList.find(ele => ele.val === type ).name
            item.remark = remark
        })
    },
    GET_CONTENT(state, { items, detail }) {
        items.forEach(ele => {
            ele.skuSpaces = ele.skuSpaces ? ele.skuSpaces.join() : ''
            ele.headAmount = floatNum.multiply(ele.headPrice, ele.skuCount)
            ele.skuAmount = floatNum.add(floatNum.multiply(ele.skuCount, ele.skuPrice), ele.headAmount)
            
        })
        detail.typeName = state.outTypeFormat[detail.type].name
        state.detail = detail
        state.detailItems = items
    },
    DELETE_ITEMS(state, index) {
        console.log(index)
        state.detailItems.splice(index, 1)
    },
    CLOSR_AUDIT_MODAL(state, { type, code }) {
        if (type) {
            if (!code) {
                if (!state.checkData.length) {
                    message('warning', '请先选择单据')
                    return
                }
                let list = state.checkData.filter(item => item.state === 1).map(item => item.ticketCode)
                if (!list.length) {
                    message('warning', '当前没有单据可以进行此项操作')
                    return
                }
                state.ticketCodeList = list
            } else {
                state.ticketCodeList = [code]
            }
        }
        state.auditState = 0
        state.auditModal = type
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
            item.storeAmount = floatNum.multiply(item.count, item.skuPrice)
            // item.headAmount = 0 
        })
        state.detailItems = data
    },
    ADD_SKU_DETAIL(state, data) {
        data.headAmount = floatNum.multiply(data.headPrice, data.skuCount)
        data.skuAmount = floatNum.add(floatNum.multiply(data.skuCount, data.skuPrice), data.headAmount)
        data.skuSpaces = data.skuSpaces ? data.skuSpaces.join() : ''
        state.detailItems.push(data)
    },
    CAHNGE_ITEMS(state, data) {
        data.forEach(ele => {
            ele.headAmount = floatNum.multiply(ele.headPrice, ele.skuCount)
            ele.skuAmount = floatNum.add(floatNum.multiply(ele.skuCount, ele.skuPrice), ele.headAmount)
        })
        state.detailItems = data
    },
    GET_BUTTON_LIST(state, list) {
        list.forEach(item => {
            state.showButtons[item.key] = true
        })
    },
    CHANGE_FORM: (state, form) => {
        state.form = form
    },
    SELECT_TABLE(state, data) {
        state.checkData = data
    },
    CAHNGE_LOG_MODULE(state, type) {
        state.showLogModule = type
    },
    GET_LOG_DATA(state, { data, total }) {
        state.logTableData = data
        state.logTotal = total
    },
    DO_RESET(state) {
        for (let key in state.form) {
            if (key !== 'searchKey') {
                state.form[key] = ''
            }
        }
    },
}
const actions = {
    async getLog({ commit, state }, params) {
        loading()
        const { data } = await getActionLog(params, state.model)
            if (!state.showLogModule) {
                commit('CAHNGE_LOG_MODULE', true)
            }
        commit('GET_LOG_DATA', data)
        loadingClose()
    },
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
    async exportData({ state }, params) {
        // let params = {}
        // if (state.ticketCodeList) { // 已勾选数据
        //     params = { ticketCode: state.ticketCodeList }
        // } else {
        //     const form = state.form
        //     for (let key in form) {
        //         if (key !== 'searchKey' && key !== 'searchContent') {
        //             params[key] = form[key]
        //         }
        //     }
        //     params[form.searchKey] = form.searchContent
        // }
        loading()
        await exportData(params).then(res => {
            loadingClose()
            downlaod(res, '其他出库单列表明细.xls')
        }).catch(err => {
            loadingClose()
        })
    },
    async getContent({ commit, dispatch }, params) {
        loading()
        const { data }  = await getContent(params)
        commit('GET_SHOP', [
            {
                label: data.detail.shopName,
                value: data.detail.shopId
            }
        ], { root: true })
        commit('GET_CONTENT', data)
        loadingClose()
    },
    async invalidTransfer({ dispatch }, { ticketCode, params }) {
        loading()
        try {
            const { code } = await invalidTransfer(ticketCode)
            loadingClose()
            if (code === 0) {
                dispatch('getList', params)
            }
        } catch(e) {
            loadingClose()
        }
    },
    /* 审核调拨单 */
    async auditTransfer({ commit, dispatch }, { type, params }) {
        loading()
        try {
            const { code } = await auditTransfer({ ticketCode: state.ticketCodeList, type})
            loadingClose()
            if (code === 0) {
                commit('CLOSR_AUDIT_MODAL', { type: false, code: 1 })
                dispatch('getList', params)
                message('success', '审核成功')
            }
        } catch(err) {
            loadingClose()
        }
    },
    /* 查找sku */
    async findSkuDetail({ commit }, params) {
        try {
            params.required = true
            const { code, data } = await findSkuDetail(params)
            if (code === 0) {
                commit('ADD_SKU_DETAIL', data)
            }
        } catch(err) {

        }
    },
    /* 新增调拨单 */
    /* 新增调拨单 */
    async createTransfer({}, { data, ticketCode }) {
        loading()
        try {
            const { code } = await createTransfer({ data, ticketCode })
            loadingClose()
            if (code === 0) {
                router.go(-1)
            }
        } catch(err) {
            loadingClose()
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