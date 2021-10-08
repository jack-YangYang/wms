import * as AsinTransfer from '@/api/AsinTransfer'
import { findSkuDetail } from '@/api/common'
import router from '@/router'
import { clearObjValue, confirmMsg, loading, loadingClose, message } from '@/utils/common'
import { getActionLog } from '@/api/common'
export default {
    namespaced: true,
    state: {
        logTotal: 0,
        logTableData: [], // c操作日志表格数据
        showLogModule: false, // 操作日志dialog
        model: 'WAREHOUSE_TRANSFER_SHOP',
        statusList: {
            1: {
                label: '待审核',
                color: '#f1c40f'
            },
            2: {
                label: '审核通过',
                color: '#2ecc71'
            },
            3: {
                label: '审核不通过',
                color: '#e74c3c'
            },
            4: {
                label: '作废',
                color: '#2c3e50'
            }
        },
        searchList: [
            {
                label: '创建人',
                value: 1
            },
            {
                label: '审核人',
                value: 2
            }
        ],
        checkData: [],
        ticketCode: '',
        remark: '',
        auditModal: false,
        tableData: [],
        auditState: 0,
        total:0,
        detailItems: [],
        detail: {
            shopId: '',
            whouseId: '',
            remark: ''
        }
    },
    actions: {
        async getList({ commit }, params) {
            loading()
            const { data } = await AsinTransfer['getList'](params)
            commit('GET_LIST', data)
            loadingClose()
        },
        async findSkuDetail({ commit }, params) {
            loading()
            try {
                const { data, code } = await findSkuDetail(params)
                if (data && code === 0) {
                    const { data: { list } } = await AsinTransfer['getAssins']({ shop_id: params.shopId, product_sku : params.sku })
                    commit('get_DETAIL_SKU_ASSIN', { data, list })
                }      
                loadingClose()
            } catch(e) {
                loadingClose()
            }
        },
        invalid({ dispatch }, { ticketCode, params }) {
            confirmMsg('warning', '提示', '你确定要作废吗？', async () => {
                const { code } = await AsinTransfer['invalidTransferShop'](ticketCode)
                if (!code) {
                    dispatch('getList', params)
                }
            })
        },
        async audit({ commit, dispatch, state }, { params, status, type }) {
            loading()
            let result
            try {
                if (!status) {
                    console.log(state.ticketCode)
                    result = await AsinTransfer['auditTransferShop'](state.ticketCode, type)
                } else {
                    result = await AsinTransfer['auditTransferShopAll'](state.ticketCode.split(','), type)
                }              
                loadingClose()
                if (!result.code) {
                    commit ('CLOSR_AUDIT_MODAL', { flag: false })
                    dispatch('getList', params)
                }
            } catch(e) {
                loadingClose(0)
            }
        },
        async getAsinDetail({ commit }, { ticketCode, state }) {
            loading()
            const { data } = await AsinTransfer['getDetail'](ticketCode)
            commit('GET_DETAIL', data)
            console.log(data)
            if (state == 1) {
                commit(
                    'GET_SHOP', 
                    [
                        { 
                            value: data.detail.shopId,
                            label: data.detail.shopName
                        }, 
                    ],
                    { root: true }
                )
            }
            loadingClose()
        },
        async createASinShop({}, data) {
            loading()
            const { code } = await AsinTransfer['createTransferShop'](data)
            loadingClose()
            if (!code) {
                message('success','创建成功')
                router.go(-1)
            }
        },
        async editASinShop({}, data) {
            loading()
            const { code } = await AsinTransfer['editTransferShop'](data)
            loadingClose()
            if (!code) {
                message('success','修改成功')
                router.go(-1)
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
    },
    mutations: {
        CAHNGE_ITEMS: (state, items = []) => {
            state.detailItems = items
        },
        // 改变日志弹窗状态
        CAHNGE_LOG_MODULE(state, status) {
            state.showLogModule = status
        },
        GET_LOG_DATA(state, { data, total }) {
            state.logTotal = total
            state.logTableData = data
        },
        SELECT_DATA: (state, items) => {
            console.log(items)
            if (Array.isArray(items)) {
                state.checkData = items
                state.ticketCode = items.filter(item => item.state === 1).map(({ ticketCode }) => ticketCode).join()
                return
            }          
            state.ticketCode = items
        },
        CLOSR_AUDIT_MODAL: (state, { flag, code }) => {
            state.auditModal = flag
            if (!flag) {
                state.ticketCode = ''
                state.auditState = 0
                state.remark = ''
            }
        },
        CHANGE_DETAIL: (state) => {
            clearObjValue(state.detail)
        },
        DEL_ITEMS: (state, index) => {
            state.detailItems.splice(index, 1)
        },
        GET_DETAIL: (state, { detail, items }) => {
            state.detail = detail
            items.forEach(item => {
                item.count = item.skuCount
                item.skuUsableCount = item.usableCount
                item.sourceSkuCount = item.sourceCount
                item.distSkuCount = item.distCount
                item.skuOccupyCount = item.occupyCount
                item.asinList = item.asins
            })
            state.detailItems = items
        },
        get_DETAIL_SKU_ASSIN: (state, { data, list }) => {
            // const { data: { asins } } = result
            const asinList = []
            list.reduce((obj, item) => {
                obj[item.asin] ? obj[item.asin] = obj[item.asin] + 1 : obj[item.asin] = 1 && asinList.push(item)
                return obj
            }, {})
            console.log(asinList, 'asinlist')
            data.count = 0
            data.asinList = asinList
            data.sourceAsin = ''
            data.distAsin = ''
            data.distAsinCount = 0
            data.skuUsableCount = 0
            data.sourceSkuCount = 0
            data.distSkuCount = 0
            data.skuOccupyCount = 0
            state.detailItems.push(data)
        },
        GET_LIST: (state, { data, total }) => {
            state.tableData = data
            state.total = total
        }
    }
}