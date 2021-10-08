import { 
    getData,
    getOrderList,
    getOrderInfo,
    addOrder,
    getTicketInfo,
    printOrderLog,
    getSkuInfo,
    check,
    drop,
    exportList
 } from '@/api/ProcurementFallback'
 import { getButtonList } from '@/api/permision' 
 import { getActionLog, getPurchaseOrderInfo } from '@/api/common'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import router from '@/router'
import { loading, loadingClose, downlaod, message, confirmMsg } from '@/utils/common'
const state = {
    searchKeyList: {
        sku: 'SKU',
        // asin: 'ASIN',
        // checkUser: '审核人',
        ticketOrder: '关联单号',
        ticketIn: '入库单号',
        // ticketCode: '退回单号',
    },
    model: 'PURCHASE_ORDER_BACK',
    showButtons: {
        add: false,
        audit: false,
        print: false,
        invalid: false,
        log: false
    },
    showLogModule: false,
    showBarcodeModule: false, //打印回退单
    logTableData: [],
    logTotal: 0,
    showModule: false,
    auditState: 0,
    ticketCode: '',
    remark: '',
    filename: '采购退回单详情',
    bookType: 'xls',
    autoWidth: true,
    colorList: {
        1: {
            name: '待审核',
            color: '#f1c40f'
        },
        2: {
            name: '已审核',
            color: '#67C23A'
        },
        3: {
            name: '审核不通过',
            color: '#F56C6C'
        },
        4: {
            name: '作废',
            color: '#909399'
        },
    },
    showShopInfoModule: false,
    shopInfoTable: [],
    items: [],
    inCode: null,
    ticketCodeList: [],
    detail: {
        // ticketCodeList: []
    },
    detailItems: [],
    orderList: [], // 查询可退回的采购单
    tableData: [ {} ],
    total: 0,
    // stateList: {
    //     1: '未审核',
    //     2: '审核通过',
    //     3: '作废'
    // }
}
const mutations = {
    DO_AUDIT: (state, code) => {
        if (code) {
            state.showModule = true
            state.ticketCode = code
        } else {
            state.showModule = false
            state.ticketCode = null
        }
        state.auditState = 0
        
    },
    CHANGE_DETAILS: state => {
        if (state.items.length) {
            state.items = []
        }
        if (state.ticketCodeList.length) {
            state.ticketCodeList = []
        }
        if (state.detail.whouseName) {
            state.detail.whouseName = ''
        }     
    },
    CAHNGE_LOG_MODULE(state, type) {
        state.showLogModule = type
    },
    GET_LOG_DATA(state, { data, total }) {
        state.logTableData = data
        state.logTotal = total
    },
    EXPORT_DATA: (state, bool) => {
        if (!state.items.length) {
            message('warning', '当前没有可以导出的数据')
            return
        }
        let headerList = bool ? ['sku', 'count', 'shopName', 'price',  'amount'] : ['sku', 'inCount', 'shopName', 'price',  'amount']
        function formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        }
        import("@/vendor/Export2Excel").then(excel => {
            // 设置导出表格的头部
            const tHeader = ['SKU', '出库数量', '店铺', '出库单价', '出库金额']
            // 设置要导出的属性
            const filterVal = headerList
            // 获取当前展示的表格数据
            const list = state.items;
            // 将要导出的数据进行一个过滤
            const data = formatJson(filterVal, list);
            // 调用我们封装好的方法进行导出Excel
            excel.export_json_to_excel({
            // 导出的头部
            header: tHeader,
            // 导出的内容
            data,
            // 导出的文件名称
            filename: state.filename,
            // 导出的表格宽度是否自动
            autoWidth: state.autoWidth,
            // 导出文件的后缀类型
            bookType: state.bookType
            });
        });
    },
    GET_BUTTON_LIST(state, list) {
        list.forEach(item => {
            state.showButtons[item.key] = true
        })
    },
    GET_LIST: (state,  result) => {
        state.tableData = result.data
        state.total = result.total
    },
    GET_ORDER_LIST: (state, list) => {
        state.orderList = list
    },
    GET_ORDER_INFO: (state, { data, type = false }) => {
        if (Array.isArray(data)) {
            if (!data.length) {
                message('warning', '没有查询到入库单信息')
                return
            }
            state.ticketCodeList = data.filter(item => item.state === 100)
            return
        }
        const { detail, shops, items } = data
        if (shops) {
            shops.forEach(item => {
                item.inCount = item.count
            })
        } 
        state.showBarcodeModule = type
        state.items = shops
        state.detailItems = items
        state.detail = detail
        state.remark = detail.remark
    },
    GET_SKU_ITEMS: (state, item) => {
        state.items = item
    },
    CLEAR_DATA: state => {
        state.detail = {}
        state.remark = ''
        state.ticketCode = ''
        state.inCode = ''
        state.items = []
        state.showBarcodeModule = false
        state.detailItems = []
    },
    SAVE_CODE: (state, code) => {
        state.inCode = code // 存储的关联单号
    },
    GET_SHOP_INFO_DATA: (state, data) => {
        if (typeof data === 'boolean') {
            state.showShopInfoModule = false
            state.shopInfoTable = []
            return
        }
        state.showShopInfoModule = true
        state.shopInfoTable = data
    },
    GET_TICKET_CODE: (state, { code, remark }) => {
        state.ticketCode = code
        state.remark = remark
    }
}
const actions = {
    async getList({ commit }, params) {
        loading()
        try {
            const { data } = await getData(params)
            commit('GET_LIST', data)
            loadingClose()
        } catch(err) {
            loadingClose()
        }
    },
    async getPurchaseOrderInfo({ commit }, params) {
        loading()
        const { data } = await getPurchaseOrderInfo(params)
        commit('GET_SHOP_INFO_DATA', data)
        loadingClose()
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
    async changeInCode({ commit }, code) {
        commit('GET_TICKET_CODE', { code })
        const { data } = await getSkuInfo(code)
        commit('GET_ORDER_INFO', { data })
    },
    async getOrderList({ commit }) {
        const { data } = await getOrderList()
        commit('GET_ORDER_LIST', data)
    },
    async exportList({}, params) {
        loading()
        const data = await exportList(params)
        console.log(data)
        downlaod(data, '采购回退单列表.xls')
        loadingClose()
    },
    async getOrderInfo({ commit }, ticketCode) {
        loading()
        // commit('GET_TICKET_CODE', { code: ticketCode })
        const { data: { data }, code } = await getOrderInfo(ticketCode)
        if (!code) {
            commit('GET_ORDER_INFO', { data })
        }
        loadingClose()
    },
    async getTicketInfo({ commit }, { ticketCode, type }) {
        loading()
        const { data } = await getTicketInfo(ticketCode)
        const { detail } = data
        commit('GET_TICKET_CODE', { code: detail.purchaseOrder, remark: detail.remark })
        commit('GET_ORDER_INFO',  { data, type })
        loadingClose()
    },
    async getButtonList({ commit }, params) {
        await getButtonList(params).then(res => {
            commit('GET_BUTTON_LIST', res.data.buttonList)
        })
    },
    async printOrderLog({ commit }, ticketCode) {
        const { code } = await printOrderLog(ticketCode)
        if (code === 0) {
            message('success', '打印成功')
            commit('CLEAR_DATA')
        }

    },
    async addOrder({ state }, { ticketCode, remark, checkList  }) {
        if (!state.inCode) {
            message('warning', '请输入需要关联的采购单号')
            return
        }
        if (!ticketCode) {
            message('warning', '请选择入库单号')
            return
        } 
        if (!checkList.length) {
            message('warning', '请先勾选数据')
            return
        }
        if (!checkList.every(item => item.inCount <= item.count && item.count)) {
            message('warning', '出库数量必须小于等于已入库数量')
            return
        }
        let data = {
            ticketCode,
            data: {
                skuList: checkList.map(({ shopId, sku, inCount }) => {
                    return {
                        shopId,
                        count: inCount,
                        sku
                    }
                }),
                remark
            }
        }
        loading()
        try {
            const { code } = await addOrder(data)
            loadingClose()
            if (code === 0) {
                router.go(-1)
            }
        } catch(e) {
            console.log(e)
            loadingClose()
        }
        
    },
    async checkOrder({ commit, state, dispatch }, { type, query }) {
        loading()
        try {
            const { code }  = await check({ ticketCode: state.ticketCode, state: type })
            loadingClose()
            if (code === 0) {
                dispatch('getList', query)
                commit('DO_AUDIT', false)
            }
        } catch(e) {
            loadingClose()
        }
        
    },
    drop({ commit, state, dispatch }, { ticketCode, query }) {
        confirmMsg('warning', '提示', '你确定要作废吗？', async () => {
            try {
                loading()
                const { code }  = await drop(ticketCode)
                loadingClose()
                if (code === 0) {
                    dispatch('getList', query)
                }
            } catch(e) {
                loadingClose()
            }
            
        })
    } 
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}