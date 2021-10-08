import { getPurchaseInList, getPutInStorageOrderDetail, shelves, getCodeList } from '@/api/PutInStorageOrder'
import router from '@/router'
import { loading, loadingClose } from '@/utils/common'
import { getButtonList } from '@/api/permision' 
const state = {
    timeList: [
        // {
        //     name: '创建时间',
        //     value: 'createOrder'
        // },
        // {
        //     name: '质检时间',
        //     value: 'qa'
        // },
        // {
        //     name: '贴标时间',
        //     value: 'mark'
        // },
        {
            name: '上架时间',
            value: 'shelf'
        },
        // {
        //     name:'审核时间',
        //     value: 'check'
        // },
    ],
    tableData: [],
    spaceCodelist: [],
    total: 0,
    detail: {},
    detailItems: [ {} ],
    showButtons: {
        shelves: false
    },
    searchList: [
        {
            name: '入库单号',
            val: 'ticketCode'
        },
        // {
        //     name: '采购单号',
        //     val: 'ticketOrder'
        // },
        // {
        //     name: '创建人',
        //     val: 'createUser'
        // },
        // {
        //     name: '质检人',
        //     val: 'qa'
        // },
        // {
        //     name: '贴标人',
        //     val: 'mark'
        // },
        // {
        //     name: 'SKU',
        //     val: 'sku'
        // },
        // {
        //     name: '商品名称',
        //     val: 'name'
        // }
    ],
    stateListForamt: {
        70: {
            name: '待上架',
            color: '#f39c12'
        },
        100: {
            name: '上架完成',
            color: '#2ecc71'
        }
    }
}
const mutations = {
    GET_DATA(state, { data, total }) {
        state.tableData = data
        state.total = total
    },
    GET_BUTTON_LIST(state, list) {
        list.forEach(item => {
            state.showButtons[item.key] = true
        })
    },
    GET_DETAIL(state, { data: { detail, items }, result }) {
        // state.spaceCodelist = result.data
        items.forEach(item => {
            item.space = null
            if (result) {
                item.spaceCode = result.data
            } else {
                item.spaceCode = item.spaceCode.split(',')
                console.log(item.spaceCode)
            }
            item.expressPriceAmount = item.qaCount * item.expressPrice
            item.taxPriceAmount = item.qaCount * item.taxPrice
            item.inAmount = item.qaCount * item.price + item.qaCount * item.expressPrice + item.qaCount * item.taxPrice
        })
        state.detail = detail
        console.log(items)
        state.detailItems = items
    },
}
const actions = {
    async getList({ commit }, params) {
        let arg = JSON.parse(JSON.stringify(params))
        arg.state = arg.state ? arg.state : '70, 100'
        loading()
        try {
            const { data } = await getPurchaseInList(arg)
            commit('GET_DATA', data)
            loadingClose()
        } catch(err) {
            loadingClose()
        }
    },
    async getButtonList({ commit }, params) {
        await getButtonList(params).then(res => {
            commit('GET_BUTTON_LIST', res.data.buttonList)
        })
    },
    async shelvesActioon({}, data) {
        const { code } = await shelves(data)
        if (!code) {
            router.go(-1)
        }
    },
    async getPutInStorageOrderDetail({ commit, dispatch }, { ticketCode, type }) {
        loading()
        try {
            const { data } = await getPutInStorageOrderDetail(ticketCode)
            let result = null
            if (!data.items[0].spaceCode) {
                result = await getCodeList(data.detail.whouseId)
            } 
            commit('GET_DETAIL', { data, result })
            loadingClose()
        } catch(err) {
            loadingClose()
        }
    },
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}