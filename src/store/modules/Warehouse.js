
/* 添加仓库 */
import { 
    getWarehouse, 
    getStockData, 
    addWarehouse, 
    editWareHouse,
    getPartitionList,
    getSpaceSku,
    getSpaceList,
    addPartition,
    editPartition,
    exportSpacecode,
    downloadTemplate,
    getHouseShop,
    downloadShopTemplate,
    bindShopAndHouse,
    getShopuser,
    quickBindAll,
    changeCheck,
    shopAndUserBind,
    getSkuInfo,
    getUserShop,
    settingSelectAll,
    editSpacecode
} from '@/api/Warehouse'
import { message, loading, loadingClose, clearObjValue, downlaod, confirmMsg  } from '@/utils/common'
import { getButtonList } from '@/api/permision' 
const state = {
    listTableData: [],
    stateColor: {    
        1: '#2ecc71',
        0: '#e74c3c'
    },
    typeColor: {
        1: '#3498db',
        2: '#9b59b6',
        3: '#16a085',
        4: '#f1c40f',
        5: '#9b59b6',
        6: '#2980b9'
    },
    shopDataList: [],
    shopDataTotal: 0,
    shopName: '',
    search: {
        pageNo: 1,
        pageSize: 20
    },
    showSearch: true,
    shopIds: [],
    SAVE_STFF_ID: null,
    houseAndShopTableData: [],
    personnerTableData: [],
    personnerTotal: 0,
    houseAndShopTableTotal: 0,
    spaceSkuTableData: [],
    spaceSkuParseData: [],
    partitionTableData: [],
    spaceTableData: [],
    spaceTotal: 0,
    title: '添加仓库',
    showContentMdoal: false,
    component: 'partitionForm',
    showModule: false,
    showHouseShopModule: false,
    showShopUserModule: false,
    listTotal: 0,
    stockTableData: [],
    stockTotal: 0,
    form: {
        name: '',
        type: [],
        remark: ''
    },
    showButtons: {
        add: false,
        edit: false
    },
    showButtonsShop: {
        binding: false,
        unBinding: false,
        edit: false,
        confirmSelectAll: false,
        cancelSelectAll: false
    },
    partitionForm: {
        name: ''
    },
    spaceForm: {
        spaceCode: '',
        sku: ''
    },
    shopAndHouseForm: {
        whouseId: null,
        shopId: null
    },
    shopUserForm: {
        shopIds: []
    },
    selectUserShopData: '',
    whouseId: null,
    partitionId: null,
    rules: {
        name: [
            { required: true, message: '请输入仓库名称', trigger: 'blur' },
        ],
        type: [
            { required: true, message: '请选择仓库类型', trigger: 'change' },
        ],
    },
    partitionRules: {
        name: [
            { required: true, message: '请输入区位名称', trigger: 'blur' },
        ],
    },
    spaceRules: {
        spaceCode: [
            { required: true, message: '请输入库位名称', trigger: 'blur' },
        ],
    },
    shopHouseRules: {
        whouseId: [
            { required: true, message: '请选择仓库', trigger: 'change' },
        ],
        shopId: [
            { required: true, message: '请选择店铺', trigger: 'change' },
        ],
    },
    shopUserRules: {
        shopIds: [
            { required: true, message: '请选择店铺', trigger: 'change' },
        ],
    },
    checkUserList: [],
    checkData: [],
    checkDataList: []
}
const mutations = {
    SELECT_DATA: (state, data) => {
        state.checkUserList = data.map(item => item.staffId)
        state.checkData = data
    },
    GET_BUTTON_LIST(state, list) {
        list.forEach(item => {
            state.showButtons[item.key] = true
        })
    },
    GET_BUTTON_LIST_SHOP(state, list) {
        list.forEach(item => {
            state.showButtonsShop[item.key] = true
        })
    },
    GET_WAREHOUSE_DATA: (state, result) => {
        const { data, total } = result
        data.forEach(item => {
            item.type = item.type.split(',')
        })
        state.listTableData = data
        state.listTotal = total
    },
    GET_STOCK_DATA: (state, result) => {
        const { data, total } = result
        state.stockTableData = data
        state.stockTotal = total
    },
    CAHNGE_MODULE: (state, { type, row }) => {
        state.showModule = type
        if (!type) {
            if ('id' in state.form) {
                delete state.form.id
            }
            clearObjValue(state.form)
            state.form.type = []
            return
        }
        if (row) {
            state.title = '修改仓库'
            for (let key in state.form) {
                state.form[key] = row[key]
            }
            state.form['id'] = row.id
        } else {
            state.title = '添加仓库'
        }
    },
    GET_PARTITION_DATA: (state, result) => {
        const { data } = result
        state.partitionTableData = data
    },
    GET_SPACE_DATA: (state, { result, whouseId, partitionId }) => {
        console.log(whouseId)
        const { data, total } = result
        state.spaceTableData = data
        state.whouseId = whouseId
        state.partitionId = partitionId
        state.spaceTotal = total
    },
    // CLEAR_SPACE_DATA: (state)=> {

    // },
    SAVE_WHOUSEID: (state, id) => {
        state.whouseId = id
    },
    CHANGE_PARTITION_MODAL: (state, { type, title, row, data }) => {
        state.showContentMdoal = type
        if (!type) {
            if ('id' in state.partitionForm) {
                delete state.partitionForm.id
            }
            clearObjValue(state.spaceForm)
            clearObjValue(state.partitionForm)
            return
        }
        state.title = title
        if (title.indexOf('区') > 0) {
            if (row) {
                state.partitionForm.name = row.name
                state.partitionForm.id = row.id
            }
            state.component = 'partitionForm'
        } else {
            if (row) {
                state.spaceSkuTableData = data
                state.spaceSkuParseData = JSON.parse(JSON.stringify(data))
                state.spaceForm.spaceCode = row.spaceCode
            }
            state.component = 'spaceForm'
        }
    },
    CAHNGE_SPACE_SKU_DATA: (state, data) => {
        if (typeof data === 'number') {
            confirmMsg('warning', '提示', '你确定要解除绑定吗？', () => {
                state.spaceSkuTableData.splice(data, 1)       
            })
            return
        }
        state.spaceSkuTableData.push(data)
    },
    CHANGE_MODULE: (state, { type, title, data }) => {
        state.showContentMdoal = type
        state.title = title
        state.spaceSkuTableData = data
        state.component = 'spaceSkuTable'
    },
    GET_HOUSE_SHOP_DATA: (state, { data, total }) => {
        state.houseAndShopTableData = data
        state.houseAndShopTableTotal = total
    },
    CAHNGE_HOUSE_SHOP_MODULE: (state, { type }) => {
        state.showHouseShopModule = type
        if (!type) {
            state.shopAndHouseForm.shopId = null
            state.shopAndHouseForm.whouseId = null
        }
        state.title = '添加仓库店铺绑定关系'
    },
    GET_USER_SHOP: (state, { data, total }) => {
        state.personnerTableData = data
        state.personnerTotal = total
    },
    CHANGE_SHOP_USER: (state, { type, row, flag }) => {
        state.showShopUserModule  = type
        if (!type) {
            state.search.pageNo = 1
            state.staffId = null
            state.search.pageSize = 20
            state.shopName = ''
            state.shopUserForm.shopIds = []
            state.selectUserShopData = ''
            return
        }
        if (flag) {
            state.title = '编辑人员店铺绑定关系'
            state.showSearch = true
        } else {
            state.title = '查看人员绑定店铺集合'
            state.showSearch = false
        }
        
    },
    CHANGE_PAGE: (state, { page, size }) => {
        if (page) {
            state.search.pageNo = page
        }
        if (size) {
            state.search.pageSize = size
        }
    },
    GET_USER_SHOP_MODULE: (state, result) => {
        const {  data, total } = result
        state.shopDataList = data
        state.shopDataTotal = total
    },
    SAVE_STFF_ID: (state, id) => {
        console.log(id)
        state.staffId = id
    },
    SELECT_SHOP_USER_TABLE: (state, data) => {
        state.selectUserShopData = data.map(item => item.shopId).join()
    }
}
const actions = {
    async getWarehouseList({ commit }, params) {
        loading()
        const { data } = await getWarehouse(params)
        commit('GET_WAREHOUSE_DATA', data)
        loadingClose()
    },
    confirmSelectAll({ dispatch, state }, { search, type }) {
        if (!state.checkUserList.length) {
            message('warning', '请先勾选数据')
            return
        }
        const title = type ? '确定设置全选吗？' : '确定取消全选吗？'
        const checkData = state.checkData.filter(item => item.isSelectAll !== type).map(item => item.staffId)
        confirmMsg('warning', '提示', title, async() => {
            loading()
            const { code } = await settingSelectAll({ staffIds: checkData, isSelectAll: type })
            loadingClose()
            if (!code) {
                dispatch('getShopuser', search)
            }
        })
    },
    async addOrEditwarehouse({ commit, dispatch }, { form, params }) {
        let result;
        loading()
        let newForm = JSON.parse(JSON.stringify(form))
        newForm.type = newForm.type.join()
        try {
            if (newForm.id) {
                result = await editWareHouse(newForm)
            } else {
                result = await addWarehouse(newForm)
            }
            loadingClose()
        } catch(err) {
            loadingClose()
        }
        if (!result.code) {
            dispatch('getWarehouseList', params)
            commit('CAHNGE_MODULE', { type:  false })
        }
    },
    async getStockData({ commit }, params) {
        loading()
        try {
            const { code, data } = await getStockData(params)
            commit('GET_STOCK_DATA', data)
            loadingClose()
        } catch(err) {
            loadingClose()
        }
    },
    async partitionList({ commit }, params) {
        loading()
        const { data } = await getPartitionList(params)
        commit('GET_PARTITION_DATA', data)
        loadingClose()
    },
    async findSku({ commit }, spaceCode) {
        loading()
        const { data: { data } } = await getSpaceSku({ spaceCode, whouseId: state.whouseId})
        console.log(data)
        commit('CHANGE_MODULE', ({ type: true, title: '库位SKU', data }))
        loadingClose()
    },
    async editSpaceCode({ commit }, { title, row }) {
        const { spaceCode } = row
        loading()
        const { data: { data } } = await getSpaceSku({ spaceCode, whouseId: state.whouseId})
        loadingClose()
        commit('CHANGE_PARTITION_MODAL', { type: true, title, row,  data })
    },
    // 查询sku
    async filterSku({ commit, state }, sku) { 
        if (!sku) {
            message('warning', '请先输入sku')
            return
        }
        if (state.spaceSkuTableData.find(item => item.sku === sku)) {
            message('warning', '当前已有重复的sku')
            return
        }
        loading()
        try {
            const { data, code } = await getSkuInfo(sku)
            if (code === 0 && data) {
                commit('CAHNGE_SPACE_SKU_DATA', data)
            }
            loadingClose()
        } catch(err) {
            loadingClose()
        }
    },
    async downloadTemplate({}) {
        const result = await downloadTemplate()
        downlaod(result, '库位导入模板.xls')
    },
    async exportSpacecode({}, whouseId) {
        loading()
        try {
            const result = await exportSpacecode(whouseId)
            downlaod(result, '所有库位.xls')
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
    async getButtonListShop({ commit }, params) {
        await getButtonList(params).then(res => {
            commit('GET_BUTTON_LIST_SHOP', res.data.buttonList)
        })
    },
    async getSpaceData({ commit }, { params, partitionId, whouseId}) {
        loading()
        const { data } = await getSpaceList({ params, partitionId, whouseId})
        commit('GET_SPACE_DATA', { result: data, whouseId, partitionId})
        loadingClose()
    },
    async addOrEditSpacecode({ commit, state, dispatch }, { spaceCode, params, data}) {
        data.partitionId = state.partitionId
        const { code } = await editSpacecode({ spaceCode, whouseId: state.whouseId, data })
        if (code === 0) {
            dispatch('getSpaceData', { params, partitionId: state.partitionId, whouseId: state.whouseId })
            commit('CHANGE_PARTITION_MODAL', { type: false })
        }
    },
    async addOrEditPartition({ commit, dispatch, state }, { form, name }) {
        let result
        form.whouseId = state.whouseId
        try {
            if (!form.id) {
                result = await addPartition(form)
            } else {
                result = await editPartition(form)
            }
            
        } catch(err) {
            throw new Error('未知错误')
        }
        if (result.code === 0) {
            dispatch('partitionList', { whouseId: state.whouseId, name })
            commit('CHANGE_PARTITION_MODAL', { type: false })
        } else {
            // message('error', result.msg)
        }
    },
    async getHouseShop({ commit }, params) {
        loading()
        try {
            const { data: { data, total } } = await getHouseShop(params)
            commit('GET_HOUSE_SHOP_DATA', { data, total })
            loadingClose()
        } catch(err) {
            loadingClose()
        }
    },
    async downloadShopTemplate() {
        const result =  await downloadShopTemplate()
        downlaod(result, '仓库店铺关系导入.xls')
    },
    async shopAndHouseBind({ commit, dispatch }, { form, params }) {
        loading()
        try {
            const { code } = await bindShopAndHouse(form)
            loadingClose()
            if (code === 0) {
                dispatch('getHouseShop', params)
                commit('CAHNGE_HOUSE_SHOP_MODULE', { type: false })
            }
        } catch(err) {
            loadingClose()
        }
    },
    async getShopuser({ commit }, params) {
        loading()
        try {
            const { data: { data, total } } = await getShopuser(params)
            commit('GET_USER_SHOP', { data, total })
            loadingClose()
        } catch(err) {
            loadingClose()
        }
    },
    async bindShopAction({ commit }, params) {
        loading()
        try {
            const { code } = await quickBindAll(params)
            if (code === 0) {
                dispatch('getShopuser', params)
                message('success', '绑定成功')
            }
        } catch(err) {
            loadingClose()
        }
    },
    async configAllcheck({ state, dispatch }, { search, type }) {
        let staffIds = state.checkData.filter(item => item.isSelectAll !== type).map(item => item.staffId)
        if (type === 0) {
            if (!staffIds.length) {
                message('warning', '当前选中的数据不支持此项操作')
                return
            }
        }  
        loading()
        let result
        try {
            if (type === 1) {
                result = await quickBindAll()
            } else {
                result =  await changeCheck({ isSelectAll: type, staffIds })
            }       
            loadingClose()
            if (result.code === 0) {
                dispatch('getShopuser', search)
                message('success', '操作成功')
            }
        } catch(err) {
            loadingClose()
        }
    },
    async shopAndEserBind({ commit, dispatch, state }, { form, search }) {
        console.log(form)
        const { shopIds } = form
        if (!shopIds.length && !state.selectUserShopData) {
            message('warning', '当前没有任何数据可以保存')
            return
        }
        loading()
        try {
            let formData = new FormData()
            formData.append('adds', shopIds.join())
            formData.append('dels', state.selectUserShopData)
            const { code } = await shopAndUserBind({ data: formData, staffId: state.staffId })
            loadingClose()
            if (code === 0) {
                dispatch('getShopuser', search)
                commit('CHANGE_SHOP_USER', { type: false })
            }
        } catch(err) {
            loadingClose()
        }
    },
    async findShipList({ commit, state }, {staffId, arg, page, size, type, count}) {
        if (!state.staffId) {
            commit('SAVE_STFF_ID', staffId)
        }
        if (type === 0) {
            if (!count) {
                message('warning', '当前未绑定任何数据')
                return
            }
        }
        loading()
        try {
            const { data } = await getUserShop({ staffId, params: { 
                pageNo: arg || size ? 1 : page ? page : state.search.pageNo,
                shopName: state.shopName,
                pageSize: size ? size :state.search.pageSize
            }})
            if (!state.showShopUserModule) {
                commit('CHANGE_SHOP_USER', { type: true, flag: type })
            }
            commit('CHANGE_PAGE', { page : arg || size ? 1 : page ? page : state.search.pageNo, size })
            commit('GET_USER_SHOP_MODULE', data)
            loadingClose()
        } catch(err) {
            loadingClose()
        }
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}