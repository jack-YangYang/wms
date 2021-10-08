import { 
    getData, 
    createTransfers, 
    exportData,
    getContent, 
    invalid, 
    getLeaderData, 
    getStoreData,
    leaderAudit,
    storeAudit
} from "@/api/OperationalTransfers"
import { downlaod, loading, loadingClose } from "@/utils/common"
import { getAllIdShop, getshopBindHouse, getAllShop, findSkuDetail, getActionLog  } from '@/api/common'
import { getButtonList } from '@/api/permision' 
import  router from '@/router'
const state = {
    tableData: [],
    total: 0,
    leaderTableData: [],
    leadertoTal: 0,
    storeTableData: [],
    storeTotal: 0,
    brotherList: [
        {
            name: '同胞店铺',
            val: 0
        },
        {
            name: '不为同胞店铺',
            val: 1
        }
    ],
    showButtons: {
        add: false,
        audit: false,
        invalid: false,
        log: false,
        edit: false
    },
    auditState: 0,
    auditModal: false,
    sourceShopLoading: false,
    distShopLoading: false,
    sourceWhouseList: [], // 来源仓库列表
    distWhouseList: [], // 目标仓库列表
    sourceShopList: [], // 来源店铺仓库
    distShopList: [], // 目标店铺列表
    detail: {
        sourceWhouseId: '', // 来源仓库id
        distWhouseId: '', // 目标仓库id
        sourceShopId: '', // 来源店铺id
        distShopId: '', // 目标仓库id
        remark: ''
    },
    showLogModule: false,
    logTotal: 0,
    logTableData: [],
    model: 'TRANSFER_OPERATE',
    detailItems: [],
    stateList: {
        10: {
            name: '待运营组长审核',
            color: '#ffb142'
        },
        20: {
            name: '运营组长驳回',
            color: '#b33939'
        },
        30: {
            name: '待仓库审核',
            color: '#ff793f'
        },
        40: {
            name: '仓库驳回',
            color: '#ff5252'
        },
        50: {
            name: '审核通过',
            color: '#33d9b2'
        },
        60: {
            name: '已作废',
            color: '#84817a'
        }
    }
}
const mutations = {
    GET_BUTTON_LIST(state, list) {
        list.forEach(item => {
            state.showButtons[item.key] = true
        })
    },
    GET_DATA(state, { data, total }) {
        state.tableData = data
        state.total = total
    },
    GET_LEADER_DATA(state, { data, total }) {
        state.leaderTableData = data
        state.leadertoTal = total
    },
    GET_STORE_DATA(state, { data, total }) {
        console.log(data)
        state.storeTableData = data
        state.storeTotal = total
    },
    DEL_ITEMS(state, index) {
        state.detailItems.splice(index, 1)
    },
    CAHNGE_SOURCE_LOADING(state, flag) {
        state.sourceShopLoading = flag
    },
    CAHNGE_DIST_LOADING(state, flag) {
        state.distShopLoading = flag
    },
    GET_SOURCE_SHOP_LIST(state, data) {
        console.log(data)
        state.sourceShopList = data
    },
    GET_DIST_SHOP_LIST(state, data) {
        state.distShopList = data
    },
    GET_SOURCE_HOUSE(state, data) {
        console.log(data)
        state.sourceWhouseList = data.filter(item => item.type === 2)
    },
    GET_DIST_HOUSE(state, data) {
        state.distWhouseList = data.filter(item => item.type === 2)
    },
    CAHNGE_DETAIL(state) {
        state.detail.remark = null
        state.detail.sourceWhouseId = null
        state.detail.sourceShopId = null
        state.detail.distWhouseId = null
        state.detail.distShopId = null
    },
    CHANGE_CONFIG_LIST(state) {
        state.distShopList = []
        state.sourceShopList = []
        state.sourceWhouseList = []
        state.distWhouseList = []
    },
    CAHNGE_ITEMS(state, data) {
        state.detailItems = data
    },
    GET_SKU_DETAIL(state, data) {
        state.detailItems.push(data)
    },
    GET_CONTENT(state, { detail, items }) {
        state.detail = detail
        state.detailItems = items
    },
    CAHNGE_AUDIT_MODAL(state, flag) {
        if (!flag) {
            state.auditState = 0
        }
        state.auditModal = flag
    },
    CAHNGE_LOG_MODULE(state, type) {
        state.showLogModule = type
    },
    GET_LOG_DATA(state, { data, total }) {
        state.logTotal = total
        state.logTableData = data
    },
}
const actions = {
    async  getList({ commit }, params) {
        loading()
        try {
            const { data } = await getData(params)
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
    async getLeaderData({ commit }, params) {
        loading()
        try {
            const { data } = await getLeaderData(params)
            commit('GET_LEADER_DATA', data)
            loadingClose()
        } catch(err) {
            loadingClose()
        }
    },
    async getStoreData({ commit }, params) {
        loading()
        try {
            const { data } = await getStoreData(params)
            commit('GET_STORE_DATA', data)
            loadingClose()
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
    // 根据初始id获取来源店铺
    async getSourceShopList({ commit }, id) {
        const { data } = await getAllIdShop(id)
        commit('GET_SOURCE_SHOP_LIST', data)
    },
    // 根据初始id获取目标店铺
    async getDistShopList({ commit }, id) {
        const { data } = await getAllIdShop(id)
        commit('GET_DIST_SHOP_LIST', data)
    },
     // 根据名称获取来源店铺
    async getAllSourceShopList({ commit }, name) {
        if (!name) {
            return
        }
        commit('CAHNGE_SOURCE_LOADING', true)
        const { data: { accounts } } = await getAllShop(name)
        commit('CAHNGE_SOURCE_LOADING', false)
        commit('GET_SOURCE_SHOP_LIST', accounts)
    },
     // 根据名称获取目标店铺
    async getAllDistShopList({ commit }, name) {
        if (!name) {
            return
        }
        commit('CAHNGE_DIST_LOADING', true)
        const { data: { accounts } } = await getAllShop(name)
        commit('CAHNGE_DIST_LOADING', false)
        commit('GET_DIST_SHOP_LIST', accounts)
    },
    // 根据来源店铺获取来源仓库
    async getSourceShopBindHouse({ commit }, shopId) {
        const { data } = await getshopBindHouse({ shopId })
        commit('GET_SOURCE_HOUSE', data)
    },
    // 根据目标店铺获取目标仓库
    async getDistShopBindHouse({ commit }, shopId) {
        const { data } = await getshopBindHouse({ shopId })
        commit('GET_DIST_HOUSE', data)
    },
    async findSkuDetail({ commit }, arg) {
        try {
            const { data, code } = await findSkuDetail(arg)
            if (!code) {
                commit('GET_SKU_DETAIL', data)
            }
        } catch(err) {
            throw new Error('异常错误')
        }
    },
    async createTransfers({}, data) {
        loading()
        try {
            const { code } = await createTransfers(data)
            loadingClose()
            if (code === 0) {
                router.go(-1)
            }
        } catch(err) {
            loadingClose()
            throw new Error('异常错误')
        }
    },
    async exportData({}, params) {
        loading()
        const data = await exportData(params)
        loadingClose()
        downlaod(data, '运营调拨单xls')
    },
    // 详情
    async getContent({ commit }, ticketCode) {
        loading()
        try {
            const { data, code } = await getContent(ticketCode)
            loadingClose()
            if (code === 0) {
                commit('GET_CONTENT', data)
            }
        } catch(err) {
            loadingClose()
        }
    },
    // 编辑
    async getContentDetail({ commit, dispatch }, ticketCode) {
        loading()
        try {
            const { data, code } = await getContent(ticketCode)
            if (code === 0) {
                const { sourceShopId, distShopId, distShopName, sourceShopName  } = data.detail
                commit('GET_SOURCE_SHOP_LIST', [{
                    shopName: sourceShopName,
                    id: sourceShopId
                }])
                commit('GET_DIST_SHOP_LIST', [
                    {
                        shopName: distShopName,
                        id: distShopId
                    }
                ])
                commit('GET_CONTENT', data)
            }
            loadingClose()
        } catch(err) {
            loadingClose()
        }
    },
    async doInvalid({ dispatch }, { ticketCode, params }) {
        const { code } = await invalid(ticketCode)
        if (!code) {
            dispatch('getList', params)
        }
    },
    async leaderAudit({ commit, dispatch }, { data, params }) {
        loading()
        try {
            const { code } = await leaderAudit(data)
            loadingClose()
            if (!code) {
                dispatch('getLeaderData', params)
                commit('CAHNGE_AUDIT_MODAL', false)
            }
        } catch(err) {
            loadingClose()
        }
    },
    async storeAudit({ commit, dispatch }, { data, params }) {
        loading()
        try {
            const { code } = await storeAudit(data)
            loadingClose()
            if (!code) {
                dispatch('getStoreData', params)
                commit('CAHNGE_AUDIT_MODAL', false)
            }
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