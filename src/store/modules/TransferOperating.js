import { 
    exportData,
    exportDataPY,
    getContent,
    getContentPy, /* 临时调拨单获取详情 */
    invalidTransfer, /* 作废调拨单 */
    auditTransfer, /* 审核调拨单 */
    findSkuDetailPY, /* 临时调拨单查找sku */
    createTransfer,
    createTransferPY,
    updateTransfers,
    updateTransfersPY, /* 临时调拨单修改调拨单 */
    getAllWarehouse /* 获取全部仓库 */
} from '@/api/TransferModule'
import { findSkuDetail } from '@/api/common'
import { loading, loadingClose, downlaod, message } from '@/utils/common'
import { getButtonList } from '@/api/permision' 
import router from '@/router'
const state = {
    detail: {},
    auditState: 0,
    auditModal: false,
    auditRemark: '',
    skuDetail: {},
    detailItems: [],
    showButtons: {
        audit: false,
        add: false,
        invalid: false
    },
    allWarehouse: []
}
const mutations = {
    GET_CONTENT(state, data) {
        data.items.forEach(item => {
            item.skuPriceCopy = JSON.stringify(JSON.parse(item.skuPrice))
        })
        state.detail = data.detail
        state.detailItems = data.items
    },
    GET_ALL_WAREHOUSE(state, data) {
        state.allWarehouse = data
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
        // data.skuPrice = 0
        data.skuPriceCopy = JSON.stringify(JSON.parse(data.skuPrice))
        data.totalAmount = 0
        state.detailItems.push(data)
    },
    GET_BUTTON_LIST(state, list) {
        list.forEach(item => {
            state.showButtons[item.key] = true
        })
    },
}
const actions = {
    async exportData({}, params) {
        loading()
        await exportData(params).then(res => {
            loadingClose()
            downlaod(res, '调拨单明细.xls')
        }).catch(err => {
            loadingClose()
        })
    },
    async exportDataPY({}, params) {
        loading()
        await exportDataPY(params).then(res => {
            loadingClose()
            downlaod(res, '调拨单明细.xls')
        }).catch(err => {
            loadingClose()
        })
    },
    async getContent({ commit }, {transferCode, name }) {
        loading()
        console.log(transferCode, name)
        if (name === 'OperatorLeader') {
            await getContentPy(transferCode).then(res => {
                loadingClose()
                commit('GET_CONTENT', res.data)
            }).catch(err => {
                loadingClose()
            })
        } else {
            await getContent(transferCode).then(res => {
                loadingClose()
                commit('GET_CONTENT', res.data)
            }).catch(err => {
                loadingClose()
            })
        }    
    },
    async invalidTransfer({ dispatch }, { checkCode, params }) {
        loading()
        await invalidTransfer(checkCode).then(res => {
            loadingClose()
            if (res.code === 0) {
                dispatch('getData', params)
            } else {
                message('error', res.msg)
            }
        }).catch(err => {
            loadingClose()
        })
    },
    /* 审核调拨单 */
    async auditTransfer({ commit, dispatch }, { data, params }) {
        loading()
        await auditTransfer(data).then(res => {
            loadingClose()
            if (res.code === 0) {
                commit('CLOSR_AUDIT_MODAL', false)
                dispatch('getData', params)
                message('success', '审核成功')
                // router.push({
                //     name: 'Transfers'
                // })
            } else {
                message('error', res.msg)
            }
        }).catch(err => {
            loadingClose()
        })
    },
    
    /* 查找sku */
    async findSkuDetail({ commit }, params) {
        loading()
        await findSkuDetail(params).then(res => {
            loadingClose()
            if (res.code === 0) {
               commit('ADD_SKU_DETAIL', res.data)
            } else {
                message('error', res.msg)
            }
        }).catch(err => {
            loadingClose()
        })
    },
    /* 查找sku */
    async findSkuDetailPY({ commit }, params) {
        loading()
        await findSkuDetailPY(params).then(res => {
            loadingClose()
            if (res.code === 0) {
               commit('ADD_SKU_DETAIL', res.data)
            } else {
                message('error', res.msg)
            }
        }).catch(err => {
            loadingClose()
        })
    },
    /* 新增调拨单 */
    async createTransfer({}, { data, routerName }) {
        loading()
        if (routerName === 'OperatingTransfer') {
            await createTransfer(data).then(res => {
                loadingClose()
                if (res.code === 0) {
                   router.push({
                       name: routerName
                   })
                } else {
                    message('error', res.msg)
                }
            }).catch(err => {
                loadingClose()
            })
        } else {
            await createTransferPY(data).then(res => {
                loadingClose()
                if (res.code === 0) {
                   router.push({
                       name: routerName
                   })
                } else {
                    message('error', res.msg)
                }
            }).catch(err => {
                loadingClose()
            })
        }
        
    },
    async updateTransfers({}, { data, routerName }) {
        loading()
        if (routerName === 'OperatorLeader') {
            await updateTransfersPY(data).then(res => {
                loadingClose()       
                if (res.code === 0) {
                    router.push({
                        name: routerName
                    })
                } else {
                    message('error', res.msg)
                }
            }).catch(err => {
                loadingClose()
            }) 
        } else {
            await updateTransfers(data).then(res => {
                loadingClose()       
                if (res.code === 0) {
                    router.push({
                        name: routerName
                    })
                } else {
                    message('error', res.msg)
                }
            }).catch(err => {
                loadingClose()
            }) 
        }
        
    },
    /* 获取运营组长新增调拨单*/
    async getAllWarehouse({ commit }) {
        await getAllWarehouse().then(res => {
            commit('GET_ALL_WAREHOUSE', res.data)
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