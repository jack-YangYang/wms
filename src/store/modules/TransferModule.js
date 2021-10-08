import { getData, 
    getContent, 
    invalidOrder, 
    auditTransfer, 
    getLogList, 
    getDataPy,
    auditTransferPY,
    invalidOrderPY
 } from '@/api/TransferModule'
import { loading, loadingClose, message } from '@/utils/common'
const state = {
    operatingForm: {
        sourceWhouseId: '',
        distWhouseId: '',
        transferCode: '',
        createUser: '',
        state: ''
    },
    GroupLeaderForm: {
        sourceWhouseId: '',
        distWhouseId: '',
        transferCode: '',
        createUser: '',
        state: ''
    },
    OperatingDirectorForm: {
        sourceWhouseId: '',
        distWhouseId: '',
        transferCode: '',
        createUser: '',
        state: ''
    },
    SecondmentDirectorForm: {
        sourceWhouseId: '',
        distWhouseId: '',
        transferCode: '',
        createUser: '',
        state: ''
    },
    WarehouseAuditForm: {
        sourceWhouseId: '',
        distWhouseId: '',
        transferCode: '',
        createUser: '',
        state: ''
    },
    OperatorLeaderPy: {
        sourceWhouseId: '',
        distWhouseId: '',
        transferCode: '',
        createUser: '',
        state: ''
    },
    statusList: {
        1: '待运营组长审核',
        2: '待运营主管审核',
        // 3: '待借调组长审核',
        4: '待借调主管审核',
        5: '运营组长驳回',
        6: '运营主管驳回',
        // 7: '借调组长驳回',
        8: '借调主管驳回',
        9: '待仓库审核',
        10: '仓库驳回',
        11: '审核通过',
        12: '已作废',
    },
    newStatusList: {
        1: '待审核',
        2: '已审核',
        3: '审核不通过',
        4: '已作废'
    },
    typeList: {
        1: '已审核',
        2: '未审核'
    },
    typeListPY: {
        2: '已审核',
        1: '未审核',
        4: '已作废'
    },
    codeList: [],
    transferIdList: [],
    auditState: 0,
    auditModal: false,
    auditRemark: '',
    operatingTotal: 0,
    WarehouseAuditTotal: 0,
    GroupLeaderTotal: 0,
    SecondmentDirectorTotal: 0,
    OperatingDirectorTotal: 0,
    tableDataOperating: [  ],
    tableDataWarehouseAudit: [],
    tableDataGroupLeader: [  ],
    tableDataSecondmentDirector: [],
    tableDataOperatingDirector: [],
    logTableData: [],
    tableOperatorLeaderPy: [],
    OperatorLeaderPyTotal: 0,
    showModuleLog: false
}
const mutations = {
    CLOSE_LOG_MODAL(state, flag) {
        if (!flag) {
            state.logTableData = []
            state.showModuleLog = false
        } else {
            state.logTableData = flag
            state.showModuleLog = true
        }
        
    },
    SELECTTION_DATA(state, { list, item }) {
        state.codeList = item
        state.transferIdList = list
    },
    CLOSR_AUDIT_MODAL(state, flag) {
        state.auditState = 0
        state.auditRemark = ''
        state.auditModal = flag
        console.log(state.auditModal)
    },
    OPEN_AUDIT_MODAL(state, flag) {
        
        state.auditModal = flag
        console.log(state.auditModal)
    },
    CHANGE_OPERATIINS_FORM(state, val) {
        state.operatingForm = val
    },
    CLEAR_OPERATIINS_FORM(state) {
        Object.keys(state.operatingForm).forEach(key => state.operatingForm[key] = '')
    },
    CHANGE_GROUPLEADEER_FORM(state, val) {
        state.GroupLeaderForm = val
    },
    CLEAR_GROUPLEADEER_FORM(state) {
        Object.keys(state.GroupLeaderForm).forEach(key => state.GroupLeaderForm[key] = '')
    },
    CHANGE_OPERATORDIRECTOR_FORM(state, val) {
        state.OperatingDirectorForm = val
    },
    CLEAR_OPERATORDIRECTOR_FORM(state) {
        Object.keys(state.OperatingDirectorForm).forEach(key => state.OperatingDirectorForm[key] = '')
    },
    CHANGE_SECONDMENTDIRACTOR_FORM(state, val) {
        state.SecondmentDirectorForm = val
    },
    CLEAR_SECONDMENTDIRACTOR_FORM(state) {
        Object.keys(state.SecondmentDirectorForm).forEach(key => state.SecondmentDirectorForm[key] = '')
    },
    CHANGE_WAREHOUSEAUDIT_FORM(state, val) {
        state.WarehouseAuditForm = val
    },
    CLEAR_WAREHOUSEAUDIT_FORM(state) {
        Object.keys(state.WarehouseAuditForm).forEach(key => state.WarehouseAuditForm[key] = '')
    },
    GET_OPERATING_DATA(state, data) {
        console.log(data)
        state.tableDataOperating = data.data
        state.operatingTotal = data.total
    },
    GET_OPERATING_DIRECTOR_DATA(state, data) {
        state.tableDataOperatingDirector = data.data
        state.OperatingDirectorTotal = data.total
    },
    GET_GROUPLEADER_DATA(state, data) {
        state.tableDataGroupLeader = data.data
        state.GroupLeaderTotal = data.total
    },
    GET_SECONDMENTDIRECTOR_DATA(state, data) {
        state.tableDataSecondmentDirector = data.data
        state.SecondmentDirectorTotal = data.total
    },
    GET_WARSEHOUEAUDIT_DATA(state, data) {
        state.tableDataWarehouseAudit = data.data
        state.WarehouseAuditTotal = data.total
    },
    GET_DATA_PY(state, data) {
        state.tableOperatorLeaderPy = data.data
        state.OperatorLeaderPyTotal = data.total
    }
}
const actions = {
    async getData({ commit }, params) {
        loading()
        await getData(params).then(response => {
            if (response.code === 0) {
                const { data } = response
                loadingClose()
                switch(params.type) {
                    case 1:
                        commit('GET_OPERATING_DATA', data)
                        return
                    case 2:
                        commit('GET_OPERATING_DIRECTOR_DATA', data)
                        return
                    case 3:
                        commit('GET_GROUPLEADER_DATA', data)
                        return
                    case 4:
                        commit('GET_SECONDMENTDIRECTOR_DATA', data)
                        return
                    case 5:
                        commit('GET_WARSEHOUEAUDIT_DATA', data)
                        return
                }
            }      
        }).catch(err => {
            loadingClose()
        })
    },
    async getDataPy({ commit }, params) {
        loading()
        await getDataPy(params).then(res => {
            loadingClose()
            if (res.code === 0) {
                commit('GET_DATA_PY', res.data)
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
                dispatch('getData', params)
                commit('CLOSR_AUDIT_MODAL', false)
                commit('SELECTTION_DATA', { list: [], item: [] })
                message('success', '审核成功')
            } else {
                message('error', res.msg)
            }
        }).catch(err => {
            loadingClose()
        })
    },
    /* 临时调拨单审核 */
    async auditTransferPY({ commit, dispatch }, { transferCode, params }) {
        loading()
        await auditTransferPY(transferCode).then(res => {
            loadingClose()
            if (res.code === 0) {
                commit('CLOSR_AUDIT_MODAL', false)
                dispatch('getDataPy', params)
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
    /* 获取操作日志 */
    async getLogList({ commit }, transferId) {
        loading()
         await getLogList(transferId).then(res => {
             if (res.code === 0) {
                commit('CLOSE_LOG_MODAL', res.data)
             }
             loadingClose()
         }).catch(err => {
             loadingClose()
         })
    },
    /* 作废 */
    async invalidOrder({ dispatch }, { checkCode, params }) {
        loading()
        await invalidOrder(checkCode).then(res => {
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
    /* 作废 */
    async invalidOrderPY({ dispatch }, { checkCode, params }) {
        loading()
        await invalidOrderPY(checkCode).then(res => {
            loadingClose()
            if (res.code === 0) {
                dispatch('getDataPy', params)
            } else {
                message('error', res.msg)
            }
        }).catch(err => {
            loadingClose()
        })
    },
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}