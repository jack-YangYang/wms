/* 仓库管理 */
import { 
    getWarehourseList, 
    getData, 
    getSearchWarehourseList, 
    addWarehouseSpace,
    getWarehouseSpaceListAll,
    getSingleSkuInfo,
    getSinglepositionsSkuInfo,
    changesWarehouseStatus,
    warehouseSpaceEditSpace,
    changeLocationAPI,
    exportLocation
 } from '@/api/WarehouseManagement'
import { loading, loadingClose, message, downlaod } from '@/utils/common'
import { getButtonList } from '@/api/permision' 
import load from 'jszip/lib/load'
const state = {
    tableData: [],
    warehourseList: [],
    WarehouseSpaceListAll: [],
    location: '',
    spaceCode: '',
    showExportModule: false,
    exportNum: 0,
    showModule: false,
    showSkuInfoModule: false, /* 编辑库位弹窗 */
    showEditLocationModule: false,
    locationNumber: '',
    singleSkuInfo: {},
    showButtons: {
        addWarhourse: false,
        edit: false,
        add: false,
        start: false,
        stop: false
    },
    stateList: [
        {
            label: '启用',
            value: 0
        },
        {
            label: '停用',
            value: 1
        }
    ],
    pickingUserId: '', /* 拣货负责人id */
    warehouseSpaceDetail: [],
    searchList: [
        {
            label: '库位号',
            value: 'spaceCode'
        },
        {
            label: 'SKU',
            value: 'sku'
        },
        {
            label: '拣货人',
            value: 'pickingUser'
        }
    ],
    total: 0
}
const mutations = {
    GET_WAREHOURSELIST(state, data) {
        state.warehourseList = data
    },
    CHANGE_SPACE_CODE(state, code) {
        state.spaceCode = code
    },
    change_table(state, val) {
        console.log(123)
        state.tableData.forEach(item => {
            item.value = val
        })
    },
    GET_DATA(state, data) {
        data.data.forEach(item => {
            item.value = false
        })
        state.tableData = data.data
        state.total = data.total
    },
    CLOSE_SHOWMODULE(state) {
        state.showModule = false
    },
    GET_WAREHOUSE_SPACE_LIST_ALL(state, data) {
        data.data.forEach(item => {
            item.skuStr = item.skuStr ? item.skuStr.split(',') : []
        })
        state.WarehouseSpaceListAll = data.data
        state.total = data.total
    },
    CHABGE_MODAL_STATUS(state, val) {
        state.showSkuInfoModule = val
    },
    CHABGE_LOCATION_MODAL_STATUS(state, val) {
        state.showEditLocationModule = val
    },
    // /* 获取单个的sku信息 */
    // GET_SINGLE_SKU_INFO(state, val) {
    //     state.singleSkuInfo = val
    // },
    /* 获取这个仓位的所有sku信息 */
    GET_SINGLE_POSITIONS_SKU_INFO(state, val) {
        state.warehouseSpaceDetail = val.data
        state.pickingUserId = val.pickingUserId
    },
    /* 删除sku */
    DEL_SINGLE_POSITIONS_SKU_INFO(state, index) {
        console.log(index)
        state.warehouseSpaceDetail.splice(index, 1)
    },
    /* 新增sku */
    ADD_SINGLE_POSITIONS_SKU_INFO(state, info) {
        state.warehouseSpaceDetail.push(info)
        // state.singleSkuInfo = {}
    },
    CHANGE_PICKIMGUSERID(state, val) {
        console.log(val)
        state.pickingUserId = val
    },
    /* 增加库位数 */
    CHANEG_LOCALTION_NUM(state, val) {
        state.locationNumber = val
    },
    /* 修改库位数 */
    CHANGE_EXPORT_NUM(state, val) {
        state.exportNum = val
    },
    /* 修改区位 */
    CHANGE_LOCATION(state, val) {
        state.location = val
    },
    /* 关闭导出弹窗 */
    CLOSE_EXPORT_MODAL(state, flag) {
        state.showExportModule = flag
    },
    GET_BUTTON_LIST(state, list) {
        list.forEach(item => {
            state.showButtons[item.key] = true
        })
    }
}
const getters = {
    // WarehouseSpaceList(state) {
    //     // let list = []
    //     state.WarehouseSpaceListAll.forEach(item => {
    //         item.sku = item.sku ? item.sku : ''
    //         item.pickingUser = item.pickingUser ? item.pickingUser : ''
    //     })
    //     return state.WarehouseSpaceListAll
    // }
}
const actions = {
    async getWarehourseList({ commit }) {
        await getWarehourseList().then(res => {
            commit('GET_WAREHOURSELIST', res.data)
        })
    },
    async getData({ commit }, params) {
        loading()
        await getData(params).then(res => {
            loadingClose()
            if (res.code === 0) {
                console.log(res.data)
                commit('GET_DATA', res.data)
            }
        }).catch(err => {
            loadingClose()
        })
    },
    async getSearchWarehourseList({ commit }, params) {
        await getSearchWarehourseList(params).then(res => {
           commit('GET_WAREHOURSELIST', res.data)
        })
    },
    async addWarehouseSpace({ dispatch, commit }, { data, params }) {
        await addWarehouseSpace(data).then(res => {
            if (res.code === 0) {
                commit('CLOSE_SHOWMODULE')
                commit('CHANEG_LOCALTION_NUM', '')
                message('success', res.msg)
                dispatch('getData', params)
            } else {
                message('error', res.msg)
            }
        })
    },
    async getWarehouseSpaceListAll({ commit }, params) {
        loading()
        await getWarehouseSpaceListAll(params).then(res => {
            commit('GET_WAREHOUSE_SPACE_LIST_ALL', res.data)
            loadingClose()
        }).catch(err => {
            loadingClose()
        })
    },
    async getSingleSkuInfo({ commit }, params) {
        loading()
        await getSingleSkuInfo(params).then(res => {
            loadingClose()
            if (res.code === 0) {
                commit('ADD_SINGLE_POSITIONS_SKU_INFO', res.data)
            } else {
                message('error', res.msg)
            }
        }).catch(err => {
            loadingClose()
        })
    },
    /* 查询单个仓位所含的sku信息 */
    async getSinglepositionsSkuInfo({ commit }, params) {
        loading()
        await getSinglepositionsSkuInfo(params).then(res => {
            loadingClose()
            if (res.code === 0) {
                commit('GET_SINGLE_POSITIONS_SKU_INFO', res.data)
                commit('CHABGE_MODAL_STATUS', true)
            }
        })
    },
    /* 改变仓库的状态 */
    async changesWarehouseStatus({ dispatch }, { data, params }) {
        loading()
        await changesWarehouseStatus(data).then(res => {
            loadingClose()
            if (res.code === 0) {
                message('success', '改变仓库状态成功')
                dispatch('getData',params)
            } else {
                message('error', res.msg)
            }
        }).catch(err => {
            loadingClose()
        })
    },
    /* 仓位编辑保存绑定SKU  */
    async warehouseSpaceEditSpace({ dispatch, commit }, { flag, params }) {
        loading()
        await warehouseSpaceEditSpace(flag).then(res => {
            loadingClose()
            if (res.code === 0) {
                message('success', '绑定成功')
                commit('CHABGE_MODAL_STATUS', false)
                dispatch('getWarehouseSpaceListAll',params)
            } else {
                message('error', res.msg)
            }
        }).catch(err => {
            loadingClose()
        })
    },
    /* 库位导出 */
    async exportLocation({ commit }, params) {
        loading()
        await exportLocation(params).then(res => {
            loadingClose()
            commit('CHANGE_EXPORT_NUM', 0)
            commit('CLOSE_EXPORT_MODAL', false)
            downlaod(res, '库位导出')
        })
    },
    async changeLocation({ commit, dispatch }, { data, params }) {
        loading()
        await changeLocationAPI(data).then(res => {
            loadingClose()
            if (res.code === 0) {
                commit('CHABGE_LOCATION_MODAL_STATUS', false)
                commit('CHANGE_LOCATION', '')
                commit('CHANGE_SPACE_CODE', '')
                dispatch('getWarehouseSpaceListAll', params)
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
    getters,
    mutations,
    actions
}