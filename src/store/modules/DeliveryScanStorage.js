import { loading, loadingClose, message } from '@/utils/common'
import Vue from 'vue'
import requset from '@/utils/request'
const getOurchaseOrderInfo = (ticketCode, sku) => requset({
    url: `/warehouse/purchaseOrder/info/${ticketCode}/${sku}`
})
import httpPrinterBarcode from '@/utils/print'
const SHOWCODETILE = '采购单号选择'
const SHOWSKUTILE = 'SKU选择'
import { getPurchaseOrderList, getPurchaseOrderDetail, prepare, generatePurchaseIn, printPro } from '@/api/Procurementorder'
const ticketInInfo = {
    productDetail: {
        mainPics: [],
        otherPics: [],
        partPics: []
    },
    detail: {},
    skuDetail: {}
}
export default {
    namespaced: true,
    state: {
        ticketInInfo: {
            productDetail: {
                mainPics: [],
                otherPics: [],
                partPics: []
            },
            detail: {},
            skuDetail: {}
        },
        printComponent: null, // 打印组件实例
        showModule: false,
        ticketCode: null, //采购单号
        ticketCodeList: [],
        skusList: [],
        title: SHOWCODETILE,
        sku: '',
        skuName: '',
        rkdCode: '', // 入库单号
        ticketInInfoFormat: {
            count: 0, // 实际入库数量
            planIncount: 0, // 计划入库数量
            fileList: [],
            remark: ''
        },
    },
    mutations: {
        GET_TICKET_INFO: (state, data) => {
            state.ticketInInfo = data
            state.ticketCode = data.detail.ticketCode
            state.ticketInInfoFormat.count = data.skuDetail.purchaseCount - data.skuDetail.signCount // 入库数量
            state.ticketInInfoFormat.planIncount = data.skuDetail.purchaseCount - data.skuDetail.signCount // 计划入库数量
        },
        CAHNGE_ticketInInfoFormat: state => {
            state.ticketInInfoFormat.count = 0
            state.ticketInInfoFormat.planIncount = 0
            state.ticketInInfoFormat.fileList = []
            state.ticketInInfoFormat.remark = ''
            state.rkdCode = null
            state.ticketCode = null
            state.sku = null
        },
        CAHNGE_IN_COUNT: (state, count) => {
            state.ticketInInfoFormat.count = count
        },
        SAVE_COMPONENT: (state, that) => {
            state.printComponent = that
        },
        SAVE_RKD: (state, code) => {
            state.rkdCode = code
        },
        SAVE_SKU: (state, sku) => {
            state.sku = sku
        },
        SAVE_SKU_NAME: (state, name) => {
            state.skuName = name
        },
        //展示选择采购单号弹窗
        CHANGE_SELECT_MODULE: (state, { title = SHOWCODETILE, data = [], showModule = false, ticketCode = null }) => {
            state.showModule = showModule
            state.title = title
            if (showModule) {
                state.ticketCode = ticketCode
                state.sku = null
                if (title === SHOWCODETILE) {
                    state.ticketCodeList = data
                    console.log(state.ticketCodeList)
                    return
                }
                state.skusList = data
            }
            
        }
    },
    actions: {
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
        async handleChangeTicketCode({ commit, dispatch }, ticketCode) {
            loading()
            try {
                const { data: { items, detail }, code } = await getPurchaseOrderDetail(ticketCode)
                loadingClose()
                if (code === 0) {
                    commit('CHANGE_SELECT_MODULE', {})
                }
                if (items.length === 1) {
                    const { sku } = items[0]
                    const { data, code } = await getOurchaseOrderInfo(ticketCode, sku)
                    if (code === 0) {
                        commit('GET_TICKET_INFO', data)
                        dispatch('purchaseOrderPrepare', { ticketCode, skusList: items, sku, detail })
                    } else {
                        commit('GET_TICKET_INFO', ticketInInfo)
                        commit('CAHNGE_ticketInInfoFormat')
                    }
                } else {
                    commit('CHANGE_SELECT_MODULE', { title: SHOWSKUTILE, data: items, showModule: true })
                }
            } catch(e) {
                loadingClose()
            }
        },
        async handleChangeSku({ commit, state, dispatch }, sku) {
            loading()
            const { data, code } = await getOurchaseOrderInfo(state.ticketCode, sku)
            try {
                if (code === 0) {
                    loadingClose()
                    commit('GET_TICKET_INFO', data)
                    commit('SAVE_SKU', sku)
                    commit('CHANGE_SELECT_MODULE', {})
                    dispatch('purchaseOrderPrepare', { ticketCode: state.ticketCode, skusList: state.skusList, sku, detail: data.detail })
                } else {
                    commit('GET_TICKET_INFO', ticketInInfo)
                    commit('CAHNGE_ticketInInfoFormat')
                }
            } catch(e) {
                loadingClose()
            }
        },
        // 进行预处理
        async purchaseOrderPrepare({ dispatch, commit, state }, { ticketCode, skusList, sku, detail }) {
            // loading()
            let params = skusList.find(item => item.sku === sku)
            const { purchaseCount, signCount, taxPrice, price, expressPrice, skuName, spaceCode } = params
            commit('SAVE_SKU_NAME', skuName)
            const { whouseId  } = detail
            const { code, data, msg } = await prepare({ ticketCode, data: [{ sku, count: purchaseCount - signCount }] })
            let printCount = purchaseCount - signCount
            if (code !== 0) {
                message('error', msg)        
                // loadingClose()
                return
            }
            if (code === 0) {
                let info = {
                    whouseId,
                    type: 0,
                    mark: 1,
                    qa: 0,
                    supplement: 0,
                    unit: 0,
                    ticketOrder: ticketCode,
                    skuList: data,
                    priceList: [{
                        sku,
                        taxPrice,
                        price,
                        expressPrice
                    }]
                }
                const result = await generatePurchaseIn(info)
                // loadingClose()
                if (!result.code) {
                    message('success', '贴标成功')
                    commit('SAVE_RKD', result.data)
                    if (purchaseCount - signCount === 0) {
                        message('error', '没有可以入库的数量')
                        return
                    }
                    setTimeout(async () => {
                        // httpPrinterBarcode([
                        //     { rkd: result.data, no: sku, SKUName: skuName, spaceCode }
                        // ],printCount, 0) // 打印类容，打印份数，是否预览
                        // state.printComponent.toImage(purchaseCount - signCount)
                        const { code: codePrint } = await printPro(result.data, sku, skuName, spaceCode, printCount)
                        if (codePrint === 0) {
                            message('success', `打印成功，应打印${printCount}份`)
                        }
                    }, 100)
                } else {
                    console.log(result)
                    message('error', result.msg)
                }
            }
        },
        async getProcurementorder({ commit, dispatch }, { params, _that }) {
            loading()
            try {
                const { data: { data }, code } = await getPurchaseOrderList({...params, pageSize: 10000 * 10000})
                if (!Array.isArray(data) || !data.length) {
                    message('error', '查询的数据不存在或输入有误')
                    loadingClose()
                    return
                }
                const { length } = data
                if (length === 1) {
                    const { ticketCode } = data[0]
                    const { data: { items, detail } } = await getPurchaseOrderDetail(ticketCode)
                    if (items.length === 1) {
                        const { sku, skuName } = items[0]
                        const { data, code } = await getOurchaseOrderInfo(ticketCode, sku)
                        if (code === 0) {
                            commit('GET_TICKET_INFO', data)
                            commit('SAVE_SKU', sku)
                            commit('SAVE_SKU_NAME', skuName)
                            dispatch('purchaseOrderPrepare', { ticketCode, skusList: items, sku, detail })
                        } else {
                            commit('GET_TICKET_INFO', ticketInInfo)
                            commit('CAHNGE_ticketInInfoFormat')
                        }
                    } else {
                        commit('CHANGE_SELECT_MODULE', { title: SHOWSKUTILE, data: items, showModule: true, ticketCode })
                    }
                } else {
                    commit('CHANGE_SELECT_MODULE', { title: SHOWCODETILE, data, showModule: true })
                }

                loadingClose()
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
    }
}