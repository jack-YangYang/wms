import * as Order from '@/api/Order'
import router from '@/router'
import Notification from '@/utils/notification';
import httpPrintPdf from '@/utils/printPdf'
import {
    downlaod,
    loading,
    loadingClose,
    message,
    voicePlay
} from '@/utils/common'
// notify('成功', 'hello')
import {
    getButtonList
} from '@/api/permision'
const demoData = {
    detail: [],
    logistics_mode: '',
    nt_order_id: '',
    shipping_fee: '',
    shop_name: '',
    track_num: '',
    weigh_status: '',
    weight: ''
}
const state = {
    pickingTable: [], // 拣货管理
    autofocus: true, //重量聚焦
    pickingTotal: 0,
    packageTable: [], // 打包核单
    packageTotal: 0,
    deliversTable: [], // 已发货
    deliversTotal: 0,
    batchPickingTable: [], // 批次分拣
    orderCenterTable: [], // 订单中心
    orderCenterTotal: 0,
    stockoutOrderTable: [], // 缺货订单
    stockoutOrdertotal: 0,
    stockoutPackagingTable: [], // 缺货待包装
    stockoutPackagingTotal: 0,
    cutOrderAuditTable: [], // 截单审核
    cutOrderAuditTotal: 0,
    cutOrderSelectData: [],
    showPrintModule: false, // 拣货单module
    pickInfo: null, // 打印拣货单信息
    measurementTotal: 0,
    measurementTableData: [],
    weightDetail: {
        detail: [],
        logistics_mode: '',
        nt_order_id: '',
        shipping_fee: '',
        shop_name: '',
        track_num: '',
        weigh_status: '',
        weight: ''
    },
    statusList: [{
            label: '待拣货',
            value: 0,
            color: '#f1c40f'
        },
        {
            label: '待打包',
            value: 1,
            color: '#e67e22'
        },
        {
            label: '待测量',
            value: 2,
            color: '#f39c12'
        },
        {
            label: '已发货',
            value: 3,
            color: '#2ecc71'
        },
        {
            label: '缺货待包装',
            value: 4,
            color: '#3498db'
        },
        {
            label: '截单成功',
            value: 5,
            color: '#27ae60'
        }
    ],
    pickingStatusList: [{
            label: '待拣货',
            value: 0,
            color: '#3498db'
        },
        {
            label: '拣货完成',
            value: 1,
            color: '#27ae60'
        },
        {
            label: '已作废',
            value: 2,
            color: '#e74c3c'
        }
    ],
    handlerTypeList: [
       '派单人',
       '拣货人',
       '打包人',
       '测量人',
       '发货人'
    ],
    handlerDateTypeList: [
        '派单时间',
        '拣货完成时间',
        '打包完成时间',
        '测量完成时间',
        '发货时间'
    ],
    searchMeasurment: {
        searchWord: '',
        searchKey: 'track_num',
    },
    weightMeasurment: '',
    packageStatusList: [{
            label: '待打包',
            value: 0,
            color: '#3498db'
        },
        {
            label: '打包完成',
            value: 1,
            color: '#2ecc71'
        },
        // {
        //     label: '测量中',
        //     value: 2,
        //     color: '#e67e22'
        // },
        // {
        //     label: '测量完成',
        //     value: 3,
        //     color: '#27ae60'
        // }
    ],
    showButtons: {
        picking: false,
        reject: false,
        audit: false,
        outStockPick: false,
        log: false,
        print: false,
        pickingComplete: false,
        checkComplete: false,
        packaging: false,
        measurement: false,
        printAgain: false,
        invalid: false,
    },
    pick_batch_number:null,
    showLogModule: false,
    logTableData: [],
    type: 'order', // 订单维度获取日志
    goodsTable: [], // 订单中心详情
    ordersTable: [], // 拣货管理详情
    orderCenterSelectData: [],
    curSelectData: [],
    showRejectModule: false,
    rejectReason: null,
    touchingInfo: {
        ticket: {
            batch_number: null,
            total_num: null,
            checked_num: null,
            unchecked_num: null
        },
        list: []
    }, // 打包核单详情
    sku: null, //打包详情中的sku
}
const mutations = {
    GET_ORDER_CENTER_LIST: (state, {
        list,
        total
    }) => {
        state.orderCenterTable = list
        state.orderCenterTotal = total
    },
    CREATE_PICKING_APPLY: (state, data) => {
        if (Array.isArray(data)) return
        state.batchPickingTable = data.list
    },
    SHOW_PRINT_MODULE: (state, {
        flag,
        data = null,
        pick_batch_number = null
    }) => {
        state.pick_batch_number = pick_batch_number
        state.pickInfo = data
        state.showPrintModule = flag
    },
    CAHNGE_ORDERCENTER_DATA: (state, items) => {
        state.orderCenterSelectData = items
    },
    GET_GOODS_INFO: (state, data) => {
        state.goodsTable = data
    },
    GET_ORDERS_INFO: (state, data) => {
        state.ordersTable = data
    },
    GET_PICKING_LIST: (state, {
        list,
        total
    }) => {
        state.pickingTable = list
        state.pickingTotal = total
    },
    GET_PACKAGE_DATA: (state, {
        list,
        total
    }) => {
        state.packageTable = list
        state.packageTotal = total
    },
    GET_CHECK_DETAIL: (state, data) => {
        if (data instanceof Array) return
        // console.log(data)
        // data.ticket.track_ticket.forEach(item => {
        //     item = vuePdf.createLoadingTask(item)
        // })
        // let item  = data.list[0]
        // state.touchingInfo.list = Array.from({ length: 100 }, () => {
        //     return item
        // })
        state.touchingInfo = data
        if (state.sku) {
            state.sku = null
        }
    },
    GET_SHIPPED_LIST: (state, {
        list,
        total
    }) => {
        state.deliversTable = list
        state.deliversTotal = total
    },
    GET_OUT_STOCK_LIST: (state, {
        list,
        total
    }) => {
        console.log(list)
        state.stockoutPackagingTable = list
        state.stockoutPackagingTotal = total
    },
    GET_PREVENT_LIST: (state, {
        list,
        total
    }) => {
        state.cutOrderAuditTable = list
        state.cutOrderAuditTotal = total
        console.log(state.cutOrderAuditTable)
    },
    SELECT_CUT_ORDER_DATA: (state, data) => {
        state.curSelectData = data
        state.cutOrderSelectData = data.map(item => item.nt_order_id)
    },
    GET_BUTTON_LIST(state, list) {
        list.forEach(item => {
            state.showButtons[item.key] = true
        })
    },
    CHANGE_REJECT_MODULE: (state, {
        type
    }) => {
        if (type) {
            if (!state.cutOrderSelectData.length || state.cutOrderSelectData.length > 1) {
                message('warning', '请先勾选数据并且只能勾选一条数据')
                return
            }
        }
        state.showRejectModule = type
        state.rejectReason = null
    },
    CHANGE_LOG_MODULE(state, {
        flag,
        data,
        type
    }) {
        state.showLogModule = flag
        console.log(data)
        state.logTableData = data || []
        state.type = type || 'order'
    },
    GET_WEIGHT_DATA: (state, {
        list,
        total
    }) => {
        state.measurementTableData = list
        state.measurementTotal = total
    },
    GET_WEIGHTY_DETAIL: (state, {
        data,
        type,
        _that,
        code
    }) => {
        console.log(data)
        if (code === 0) {
            if (type === 1) {
                _that.$refs.weight.focus()
            } else {
                _that.$refs.searchWord.focus()
            }
        }
        state.weightDetail = data
    },
    CLEAR_NUM_WEIGHT: (state) => {
        state.searchMeasurment = {
            searchWord: '',
            searchKey: 'track_num',
        }
        state.weightMeasurment = ''
    }
}
const actions = {
    // 获取订单中心的数据
    async getOrderCenerList({
        commit
    }, params) {
        console.log(params)
        loading()
        try {
            const {
                data
            } = await Order['getOrderCenerList'](params)
            commit('GET_ORDER_CENTER_LIST', data)
            loadingClose()
        } catch (e) {
            loadingClose()
            throw new Error(e)
        }
    },
    async getButtonList({
        commit
    }, params) {
        await getButtonList(params).then(res => {
            commit('GET_BUTTON_LIST', res.data.buttonList)
        })
    },
    // 缺货待打包
    async outStockPicking({
        commit,
        state,
        dispatch
    }, params) {
        if (!state.orderCenterSelectData.length) {
            message('warning', '请先勾选数据')
            return
        }
        let list = state.orderCenterSelectData.filter(item => item.order_type !== '已发货').map(item => item.nt_order_id)
        if (!list.length) {
            message('warning', '当前没有符合状态的订单')
            return
        }
        try {
            const { code } = await Order['outStockPick']({ order_id: list.join() })
            if (code === 0) {
                dispatch('getOrderCenerList', params)
            }
        } catch (e) {}
    },
    // 获取商品详情
    async getGoodsInfo({
        commit
    }, params) {
        loading()
        const {
            data
        } = await Order['getGoodsInfo'](params)
        loadingClose()
        commit('GET_GOODS_INFO', data)
    },
    // 获取订单详情
    async getOrdersInfo({
        commit
    }, params) {
        loading()
        const {
            data
        } = await Order['getOrdersInfo'](params)
        loadingClose()
        commit('GET_ORDERS_INFO', data)
    },
    async createPickingOrder({
        commit
    }, params) {
        if (
            (!params.pick_type && typeof params.pick_type !== 'number') ||
            (!params.pack_size && typeof params.pack_size !== 'number') ||
            !params.warehouse_id ||
            !params.part_ids ||
            (!params.order_count)
        ) {
            message('warning', '拣货类型,货件大小和发货仓库必须选择,并且订单数量必须大于0')
            return
        }
        loading()
        try {
            const {
                data
            } = await Order['createPickingApply'](params)
            commit('CREATE_PICKING_APPLY', data)
            loadingClose()
        } catch (e) {
            loadingClose()
        }
    },
    // 打印拣货人
    async printPicking({
        commit,
        dispatch
    }, params) {
        const { pick_batch_number, type, params: search } = params
        const {
            code,
            data
        } = await Order['printPickingTicket']({
            pick_batch_number,
        }, type)
        if (type === 1) {
            if (code === 0) {
                commit('SHOW_PRINT_MODULE', {
                    flag: true,
                    data,
                    pick_batch_number
                })
            }
            return
        }
        if (code === 0)dispatch('getPickingList', search)
    },
    // 获取拣货列表
    async getPickingList({
        commit
    }, params) {
        loading()
        try {
            const {
                data
            } = await Order['getPickingList'](params)
            commit('GET_PICKING_LIST', data)
            loadingClose()
        } catch (e) {
            loadingClose()
        }
    },
    // 拣货完成
    async pickingComplete({
        dispatch
    }, {
        selectData,
        search
    }) {
        if (!selectData.length || selectData.length > 1) {
            message('warning', '请先勾选数据并且只能勾选一条数据')
            return
        }
        const pick_batch_numberList = selectData.filter(item => item.type === '待拣货' && item.is_printed)
        .map(item => item.ticket_num)
        if (!pick_batch_numberList.length) {
            message('warning', '只有待拣货并且已打印的订单才可以拣货完成')
            return
        }
        loading()
        const {
            code
        } = await Order['pickingComplete']({
            pick_batch_number: pick_batch_numberList.join()
        })
        loadingClose()
        if (code === 0) {
            dispatch('getPickingList', search)
        }
    },
    // 确认打印
    async handleSubmitPrint({dispatch, commit, state}, params) {
        const { code } = await Order['confirmPrint']({ pick_batch_number: state.pick_batch_number })
        if (code === 0) {
            message('success', '打印成功')
            commit('SHOW_PRINT_MODULE', {
                flag: false,
            })
            dispatch('getPickingList', params)
        }
    },
    // 作废
    async pickingInvalid({
        dispatch
    }, {
        selectData,
        search
    }) {
        if (!selectData.length || selectData.length > 1) {
            message('warning', '请先勾选数据并且只能勾选一条数据')
            return
        }
        const pick_batch_numberList = selectData.filter(item => item.type === '待拣货')
        .map(item => item.ticket_num)
        if (!pick_batch_numberList.length) {
            message('warning', '当前没有符合条件的数据进行作废')
            return
        }
        loading()
        const {
            code
        } = await Order['pickingInvalid']({
            pick_batch_number: pick_batch_numberList.join()
        })
        loadingClose()
        if (code === 0) {
            dispatch('getPickingList', search)
        }
    },
    // 打包核单列表
    async getPackageList({
        commit
    }, params) {
        loading()
        const {
            data
        } = await Order['getPackageList'](params)
        commit('GET_PACKAGE_DATA', data)
        loadingClose()
    },
    // 打包核单详情
    async getTouchgingInfo({
        commit
    }, params) {
        loading()
        const {
            data,
            code
        } = await Order['getCheckDetail'](params)
        if (code === 0) {
            commit('GET_CHECK_DETAIL', data)
        }
        loadingClose()
    },
    async checkSku({
        commit,
        state
    }, params) {
        // let url = 'http://test.logistics.api.nantang-tech.com/rdp/logistics/storage_label?order_code=GV900563448GB.pdf'
        // httpPrintPdf(url)
        // return
        if (!params.sku) return
        let skuLists = []
        state.touchingInfo.list.forEach(item => {
            item.details.forEach(table => {
                skuLists.push({
                    sku: table.sku,
                    num: table.checked_num,
                    quantity: table.quantity
                })
            })
        })
        if (!skuLists.find(item => item.sku === params.sku)) {
            message('warning', '未能找到当前的sku,请尽量使用扫码枪')
            return
        }
        // const skuItem = skuLists.find(item => item.sku === params.sku)
        if (skuLists.every(item => item.sku === params.sku && item.num === item.quantity)) {
            message('warning', '当前SKU已经全部核单完成')
            return

        }
        // if (skuItem.num === skuItem.quantity) {
        //     message('warning', '当前SKU已经全部核单完成')
        //     return
        // }
        loading()
        const {
            code,
            data
        } = await Order['checkSku'](params)
        if (code === 0) {
            commit('GET_CHECK_DETAIL', data)
            Notification.success({
                title: '核单成功',
                message: `<h3 style="color:#ffffff">当前核单的箱号为${data.list[0].box_num || '未找到'}</h3>`,
                duration: 0,
                dangerouslyUseHTMLString: true
            })
            const { list } = data
            if (list[0].pack_status === '核单完成') {
                if (list[0].track_ticket === "") {
                    message('error', '没有获取到面单链接')
                    return
                }
                setTimeout(() => {      
                    let url = list[0].track_ticket.replace('https','http')
                    httpPrintPdf(url)
                }, 100)
            }   
        }
        loadingClose()
    },
    // 核单详情提交
    async cehckSubmit({}, data) {
        const {
            code
        } = await Order['cehckSubmit'](data)
        if (code === 0) {
            message('success', '提交成功')
            router.push({
                name: 'PackagingMangement'
            })
        }
    },
    // 核单完成
    async checkComplete({
        dispatch
    }, {
        selectData,
        search
    }) {
        if (!selectData.length || selectData.length > 1) {
            message('warning', '请先勾选数据并且只能勾选一条数据')
            return
        }
        const list = selectData.filter(item => item.type === '待打包').map(item => item.ticket_num)
        if (!list.length) {
            message('warning', '当前没有符合条件的数据')
            return
        }
        const {
            code
        } = await Order['checkComplete']({
            batch_number: list[0]
        })
        if (code === 0) {
            dispatch('getPackageList', search)
        }
    },
    // 已发货订单列表
    async getShippedList({
        commit
    }, params) {
        loading()
        const {
            data
        } = await Order['getShippedList'](params)
        commit('GET_SHIPPED_LIST', data)
        loadingClose()
    },
    // 缺货待包装列表
    async getOutStockList({
        commit
    }, params) {
        loading()
        const {
            data
        } = await Order['getOutStockList'](params)
        commit('GET_OUT_STOCK_LIST', data)
        loadingClose()
    },
    // 转至待发货
    async transferredDelivery({
        dispatch
    }, {
        selectData,
        search
    }) {
        if (!selectData.length) {
            message('warning', '请先勾选数据')
            return
        }
        const {
            code
        } = await Order['changeOutStock']({
            nt_order_id: selectData.map(item => item.nt_order_id)
        })
        if (code === 0) {
            dispatch('getOutStockList', search)
        }
    },
    // 截单列表
    async getPreventList({
        commit
    }, params) {
        loading()
        const {
            data
        } = await Order['getPreventList'](params)
        console.log(data)
        commit('GET_PREVENT_LIST', data)
        loadingClose()
    },
    // 审核通过
    async auitPass({
        dispatch,
        state
    }, search) {
        if (!state.cutOrderSelectData.length) {
            message('warning', '请先勾选数据')
            return
        }
        const {
            code
        } = await Order['checkPrevent']({
            nt_order_ids: state.cutOrderSelectData
        })
        if (code === 0) {
            dispatch('getPreventList', search)
        }
    },
    // 驳回订单
    async confirmReject({
        commit,
        dispatch,
        state
    }, {
        reason,
        params
    }) {
        const {
            code
        } = await Order['rejectPrevent']({
            reason,
            nt_order_ids: state.cutOrderSelectData
        })
        if (code === 0) {
            commit('CHANGE_REJECT_MODULE', {
                type: false
            })
            dispatch('getPreventList', params)
        }
    },
    // 导出订单
    async exportOrders({}, {
        search,
        exportModule,
        exportName
    }) {
        loading()
        try {
            const data = await Order['ordersExport']({
                data: search,
                exportModule
            })
            console.log(data)
            downlaod(data, exportName)
            loadingClose()
        } catch (e) {
            loadingClose()
        }
    },
    // 获取订单维度的操作日志
    async getOrderLog({
        commit
    }, params) {
        if (!params.length || params.length > 1) {
            message('warning', '请勾选数据并且只能勾选一条')
            return
        }
        loading()
        const {
            code,
            data
        } = await Order['getLogOrders']({
            nt_order_id: params[0].nt_order_id
        })
        loadingClose()
        if (code === 0) {
            commit('CHANGE_LOG_MODULE', {
                flag: true,
                data,
                type: 'order'
            })
        }
    },
    // 获取批次号维度的操作日志
    async getLogTickets({
        commit
    }, params) {
        if (!params.length || params.length > 1) {
            message('warning', '请勾选数据并且只能勾选一条')
            return
        }
        loading()
        const {
            code,
            data
        } = await Order['getLogTickets']({
            ticket_num: params[0].ticket_num
        })
        loadingClose()
        if (code === 0) {
            commit('CHANGE_LOG_MODULE', {
                flag: true,
                data,
                type: 'tickets'
            })
        }
    },
    // h获取称重列表
    async getMeasurementList({
        commit
    }, params) {
        loading()
        try {
            const {
                data
            } = await Order['getWeightList'](params)
            loadingClose()
            commit('GET_WEIGHT_DATA', data)
        } catch (e) {
            loadingClose()
        }
    },
    // 回去订单信息
    async getWeightDetail({
        commit
    }, {
        params,
        _that,
        type
    }) {
        loading()
        try {
            const {
                code,
                data
            } = await Order['getWeightDetail'](params)
            loadingClose()
            if (code === 0) {
                commit('GET_WEIGHTY_DETAIL', {
                    data,
                    _that,
                    type,
                    code
                })
                return
            }
            commit('GET_WEIGHTY_DETAIL', {
                data: demoData,
                code
            })
        } catch (e) {
            loadingClose()
            commit('GET_WEIGHTY_DETAIL', {
                data: demoData,
                code: -1
            })
        }
    },
    async saveWeight({
        commit
    }, {
        data,
        _that
    }) {
        if (!data.weight || !data.nt_order_id) {
            voicePlay('测量失败')
            message('warning', '必须填写重量并且有订单信息')
            return
        }
        const {
            code
        } = await Order['saveWeight'](data)
        if (!code) {
            commit('GET_WEIGHTY_DETAIL', {
                data: demoData,
                type: 2,
                _that,
                code
            })
            commit('CLEAR_NUM_WEIGHT')
            voicePlay('测量成功')
            message('success', '测量成功')
        } else {
            voicePlay('测量失败')
        }
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}
