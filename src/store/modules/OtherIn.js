import {
    getData,
    exportData,
    getContent,
    invalidTransfer,
    /* 作废调拨单 */
    auditTransfer,
    /* 审核调拨单 */
    createTransfer,
} from '@/api/otherIn'
import Vue from 'vue'
import {
    findSkuDetail
} from '@/api/common'
import {
    loading,
    loadingClose,
    downlaod,
    message,
    dateFormat,
    formatDecimal
} from '@/utils/common'
import {
    getButtonList
} from '@/api/permision'
import {
    getActionLog
} from '@/api/common'
import router from '@/router'
import floatNum from '@/vendor/FloatNum'
const state = {
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
    checkData: [],
    otherInTypeList: [{
            name: 'FBA货件入库',
            val: 10
        },
        {
            name: '虚拟入库',
            val: 20
        },
        {
            name: '样品入库',
            val: 30
        },
        {
            name: '赠品入库',
            val: 40
        },
        {
            name: '其他收益入库',
            val: 50
        },
        {
            name: '万邑通海外仓入库',
            val: 70
        },
        {
            name: '谷仓海外仓入库',
            val: 80
        },
        {
            name: '0成本入库',
            val: 90
        },
        {
            name: '其他入库',
            val: 100
        },
    ],
    otherInTypeFormat: {
        10: {
            name: 'FBA货件入库',
            color: '#3498db'
        },
        20: {
            name: '虚拟入库',
            color: '#f39c12'
        },
        30: {
            name: '样品入库',
            color: '#d35400'
        },
        40: {
            name: '赠品入库',
            color: '#c0392b'
        },
        50: {
            name: '其他收益入库',
            color: '#ffa502'
        },
        70: {
            name: '万邑通海外仓入库',
            color: '#82ccdd'
        },
        80: {
            name: '谷仓海外仓入库',
            color: '#3c6382'
        },
        90: {
            name: '0成本入库',
            color: '#2c3e50'
        },
        100: {
            name: '其他入库',
            color: '#f1c40f'
        },
    },
    searchTypeList: {
        'SKU': 'sku',
        '制单人': 'createUser',
        '审核人': 'checkUser'
    },
    tableData: [{}],
    showButtons: {
        add: false,
        log: false,
        audit: false,
        invalid: false
    },
    detail: {
        type: 10,
        typeName: '',
        whouseId: '',
        shopId: '',
        remark: ''
    },
    model: 'OTHER_IN',
    showLogModule: false,
    logTableData: [],
    logTotal: 0,
    auditState: 0,
    auditModal: false,
    auditRemark: '',
    skuDetail: {},
    detailItems: [],
    ticketCodeList: '',
    stateList: [{
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
    typeList: [],
    total: 0,
    billFee: '',
}
const mutations = {
    GET_DATA(state, data) {
        state.tableData = data.data
        state.total = data.total
    },
    CAHNGE_LOG_MODULE(state, type) {
        state.showLogModule = type
    },
    GET_LOG_DATA(state, {
        data,
        total
    }) {
        state.logTableData = data
        state.logTotal = total
    },
    CHANGE_HOUSE(state) {
        state.detail.whouseId = null
    },
    CHANGE_TABLE(state, {
        type,
        remark
    }) {
        state.detailItems.forEach(item => {
            item.outType = state.typeList.find(ele => ele.val === val).name,
                item.remark = remark
        })
    },
    CLEAR_CONTENT(state) {
        state.detail.whouseId = null
        state.detail.type = 10
        state.detail.shopId = null
        state.detail.remark = null
        state.detailItems = []
    },
    GET_CONTENT(state, {
        items,
        detail
    }) {
        detail.typeName = state.otherInTypeFormat[detail.type].name
        items.forEach(ele => {
            if (detail.type === 90) {
                ele.skuPrice = 0
            }
            ele.skuSpaces = ele.skuSpaces ? ele.skuSpaces.join() : ''
            ele.skuAmount = floatNum.add(floatNum.multiply(ele.skuCount, ele.skuPrice), ele.headAmount)
            
            // ele.headAmount = 0
        })
        state.detail = detail
        state.detailItems = items
        //计算账单费用
        items && items.length ? state.billFee = items.reduce((total, value) => {
            return floatNum.add(total, value.headAmount)
        }, 0) : ''
    },
    CHANGE_IN_TYPE(state, type) {
        if (type === 90) {
            state.detailItems.forEach(item => {
                item.skuPrice = 0
                item.skuAmount = 0
            })
        }
    },
    CAHNGE_ITEMS(state, data) {
        try {
            data.forEach(ele => {
                if (state.detail.type === 90) {
                    ele.skuPrice = 0
                }
                ele.skuSpaces = ele.skuSpaces ? ele.skuSpaces.join() : ''
                ele.skuAmount = ele.skuCount * ele.skuPrice
                ele.headAmount == undefined ? Vue.set(ele, 'headAmount', null) : ''
            })
            state.detailItems = data
        } catch (error) {
            console.log(error)
        }
    },
    DELETE_ITEMS(state, index) {
        state.detailItems.splice(index, 1)
    },
    CLOSR_AUDIT_MODAL(state, {
        type,
        code
    }) {
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
    SELECT_TABLE(state, data) {
        state.checkData = data
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
            if (state.detail.type === 90) {
                item.skuPrice = 0
            }
            item.storeAmount = floatNum.multiply(item.count, item.skuPrice)
            item.headAmount = 0
        })
        state.detailItems = data
    },
    ADD_SKU_DETAIL(state, data) {
        if (state.detail.type === 90) {
            data.skuPrice = 0
        }
        data.skuSpaces = data.skuSpaces ? data.skuSpaces.join() : ''
        data.skuAmount = data.skuCount * data.skuPrice
        data.headAmount = 0
        state.detailItems.push(data)
    },
    GET_BUTTON_LIST(state, list) {
        list.forEach(item => {
            state.showButtons[item.key] = true
        })
    },
    SET_LIST(state, {
        label,
        value
    }) {
        state[label] = value
    },
    /**
     * 头程分摊
     * @分摊规则: 按重量比例分摊 前面保留两位小数 最后一个总费用减前面所有费用
     */
    APPORTION_FEE(state) {
        try {
            if (!state.detailItems || !state.detailItems.length) return
            if (!state.billFee) {
                state.detailItems.forEach(item => item.headAmount = '')
                //重新计算入库金额
                state.detailItems.forEach(item => {
                    item.skuAmount = item.skuCount ? formatDecimal(floatNum.add(floatNum.multiply(item.skuCount, item.skuPrice), item.headAmount), 4) : ''
                })
                return
            }
            if (state.detailItems.length == 1) {
                // if (!state.detailItems[0].headAmount) {
                    state.detailItems[0].headAmount = state.detailItems[0].skuCount ? state.billFee : 0
                // }   
                console.log(state.detailItems[0].skuCount ? state.billFee : 0, state.detailItems[0], state.detailItems[0].skuCount)
            } else {
                //总重量
                let weightTotal = state.detailItems.reduce((total, item) => {
                    return floatNum.add(total, floatNum.multiply(item.skuWeight, item.skuCount))
                }, 0)
                //头程分摊（除最后一个）
                for (let i = 0; i < state.detailItems.length - 1; i++) {
                    let item = state.detailItems[i]
                    // if (!item.headAmount) {
                        console.log(item.headAmount)
                        let headFee = item.skuCount ?
                            formatDecimal(floatNum.multiply(state.billFee, floatNum.divide(floatNum.multiply(item.skuWeight, item.skuCount), weightTotal)), 2) :
                            0
                        item.headAmount = headFee
                    // }
                }
                //计算除最后一个的 已分摊总费用
                state.detailItems[state.detailItems.length - 1].headAmount = 0
                let beforeFee = state.detailItems.reduce((total, item) => {
                    return floatNum.add(total, item.headAmount)
                }, 0) //除最后一个的总费用
                //分摊最后一个
                let lastItem = state.detailItems[state.detailItems.length - 1]
                console.log(lastItem.headAmount)
                // if (!lastItem.headAmount) {
                    console.log(lastItem)
                    lastItem.headAmount = lastItem.skuCount ? floatNum.subtract(state.billFee, beforeFee) : 0
                // }
            }
            //重新计算入库金额
            state.detailItems.forEach(item => {
                item.skuAmount = item.skuCount ? formatDecimal(floatNum.add(floatNum.multiply(item.skuCount, item.skuPrice), item.headAmount), 4) : 0
            })
        } catch (error) {
            console.log(error)
        }
    }
}
const actions = {
    async getList({
        commit,
        state
    }, params) {
        loading()
        try {
            const {
                data
            } = await getData(params)
            commit('GET_DATA', data)
            loadingClose()
        } catch (err) {
            loadingClose()
        }
    },
    async exportData({
        state
    }, params) {
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
            downlaod(res, '其他入库单列表明细.xls')
        }).catch(err => {
            loadingClose()
        })
    },
    async getContent({
        commit,
        rootState,
        dispatch
    }, params) {
        loading()
        const {
            data
        } = await getContent(params)
        // dispatch('getAllShopId', data.detail.shopId, { root: true })
        commit('GET_SHOP', [{
            label: data.detail.shopName,
            value: data.detail.shopId
        }], {
            root: true
        })
        commit('GET_CONTENT', data)
        if (!data.items.every(item => item.headAmount)) {
            commit('APPORTION_FEE')
        }
        loadingClose()
    },
    async invalidTransfer({
        dispatch
    }, {
        ticketCode,
        params
    }) {
        const {
            code
        } = await invalidTransfer(ticketCode)
        if (code === 0) {
            dispatch('getList', params)
            message('success', '操作成功')
        }
    },
    /* 审核调拨单 */
    async auditTransfer({
        commit,
        dispatch,
        state
    }, {
        type,
        params
    }) {
        loading()
        try {
            const {
                code
            } = await auditTransfer({
                ticketCode: state.ticketCodeList,
                type
            })
            loadingClose()
            if (code === 0) {
                commit('CLOSR_AUDIT_MODAL', {
                    type: false,
                    code: 1
                })
                dispatch('getList', params)
                message('success', '审核成功')
            }
        } catch (err) {
            loadingClose()
        }
    },
    /* 查找sku */
    async findSkuDetail({
        commit
    }, params) {
        return new Promise(resolve => {
            findSkuDetail(params)
                .then(({
                    code,
                    data
                }) => {
                    if (code === 0) {
                        commit('ADD_SKU_DETAIL', data)
                        resolve()
                    }
                })
        })

        // await findSkuDetail(params).then(res => {
        //     loadingClose()
        //     if (res.code === 0) {
        //        commit('ADD_SKU_DETAIL', res.data)
        //     } else {
        //         message('error', res.msg)
        //     }
        // }).catch(err => {
        //     loadingClose()
        // })
    },
    /* 新增调拨单 */
    async createTransfer({}, {
        data,
        ticketCode
    }) {
        loading()
        try {
            const {
                code,
                msg
            } = await createTransfer({
                data,
                ticketCode
            })
            loadingClose()
            if (code === 0) {
                router.go(-1)
            } else {
                message('error', msg)
            }
        } catch (err) {
            loadingClose()
        }
    },
    async getButtonList({
        commit
    }, params) {
        await getButtonList(params).then(res => {
            commit('GET_BUTTON_LIST', res.data.buttonList)
        })
    },
    async getLog({
        commit,
        state
    }, params) {
        loading()
        const {
            data
        } = await getActionLog(params, state.model)
        if (!state.showLogModule) {
            commit('CAHNGE_LOG_MODULE', true)
        }
        commit('GET_LOG_DATA', data)
        loadingClose()
    },
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}
