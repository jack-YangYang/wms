import {
    getData,
    exportData,
    getContent,
    getTypeListApi
} from '@/api/Outbound'
import { loading, loadingClose, messagem,  downlaod } from '@/utils/common'
import { getButtonList } from '@/api/permision' 
const state = {
    tableData: [

    ],
    typeList: [],
    putTypeList: [], // 其他入库单所有状态
    outTypeList: [], // 其他出库单所有状态
    outTypeListObj: {}, // 其他出库单所有状态映射
    putTypeListObj: {}, // 其他入库单所有状态映射
    /* 搜索类型 */
    searchTypeList: [
        {
            label: '单号',
            value: 'ticketCode'
        },
        {
            label: 'SKU',
            value: 'sku'
        }
    ],
    showButtons: {
        exportData: false,
    },
    // kindList: {
    //     0: '出库',
    //     1: '入库',
    // },
    kindList: [
        {
            label: '出库',
            value: 0
        },
        {
            label: '入库',
            value: 1
        }
    ],
    itypeList1: [
        {
            label: '采购入库',
            value: 1
        },
        {
            label: '调拨入库',
            value: 2
        },
        {
            label: 'FBA货件入库',
            value: 3
        },
        {
            label: '盘点入库',
            value: 4
        },
        {
            label: '运营调拨入库',
            value: 5
        }
    ],
    itypeList0: [
        // {
        //     label: '订单出库',
        //     value: 1
        // },
        {
            label: '调拨出库',
            value: 2
        },
        {
            label: 'FBA出库',
            value: 3
        },
        {
            label: '盘点出库',
            value: 4
        },
        {
            label: 'FBA货件出库',
            value: 1
        },
        {
            label: '运营调拨出库',
            value: 5
        }
    ],
    stateList: [
        {
            label: '待审核',
            value: 1
        },
        {
            label: '已审核',
            value: 2
        },
        {
            label: '审核不通过',
            value: 3
        },
        {
            label: '作废',
            value: 4
        }
    ],
    detail: {},
    detailItems: [],
    total: 0
}
const mutations = {
    GET_DATA: (state, data) => {
        state.total = data.total
        state.tableData = data.data
    },
    GET_CONTENT(state, data) {
        console.log(data)
        state.detail = data.detail
        state.detailItems = data.items
    },
    GET_BUTTON_LIST(state, list) {
        list.forEach(item => {
            state.showButtons[item.key] = true
        })
    },
    GET_TYPE_LIST(state, data) {
        state.typeList = data
        state.putTypeList = data.filter(item => item.type === 3)
        state.outTypeList = data.filter(item => item.type === 2)
        data.filter(item => item.type === 2).forEach(item => {
            state.outTypeListObj[item.val] = item.name
        })
        data.filter(item => item.type === 3).forEach(item => {
            state.putTypeListObj[item.val] = item.name
        })
    }
}
const actions = {
    async getTypeList({ commit }) {
        const { data } = await getTypeListApi()
        commit('GET_TYPE_LIST', data)
    },
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
    async exportData({}, params) {
        loading()
        await exportData(params).then(res => {
            loadingClose()
            downlaod(res, '出入库列表')
        }).catch(err => {
            loadingClose()
        })
    },
    async getContent({ commit }, { type, ticketCode }) {
        loading()
        await getContent({ type, ticketCode }).then(res => {
            loadingClose()
            if (res.code === 0) {
                commit('GET_CONTENT', res.data)
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