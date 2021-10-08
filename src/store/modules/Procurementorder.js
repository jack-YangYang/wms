
import { 
  getPurchaseOrderList, 
  getPurchaseOrderDetail, 
  prepare,
  exportData,
  generatePurchaseIn, 
  // getLog,
  invalidOrder,
  auditOrder,
} from '@/api/Procurementorder'
import { loading, loadingClose, message, downlaod } from '@/utils/common'
import { getButtonList } from '@/api/permision' 
import { getActionLog, getPurchaseOrderInfo } from '@/api/common'
import router from '@/router'
const state = {
    tableData: [
      {}
        
    ],
    model: 'PURCHASE_ORDER',
    searchList: [
        {
          label: '快递单号',
          value: 'shipCode'
        },
        {
          label: '采购单号',
          value: 'ticketCode'
        },
        {
          label: '采购员',
          value: 'purchaser'
        },
        {
          label: '1688订单号',
          value: 'alibabaCode'
        },
        {
          label: 'PO单号',
          value: 'poCode'
        }
    ],
    showModule:false,
    showShopInfoModule: false,
    shopInfoTable: [],
    auditState: 0,
    total: 0,
    detail: {
      remark: ''
    },
    detailItems: [],
    showLogModule: false,
    logTableData: [],
    logTotal: 0,
    showButtons: {
      create: false,
      log: false
    },
    typeList: {
      0: '尚未完全入库',
      1: '尚未入库',
      2: '部分到货',
      3: '完全到货',
      4: '采购回退'
    },
    instateList: [
      {
        label: '未入库',
        value: 10,
        color: '#feca57'
      },
      {
        label: '部分入库',
        value: 20,
        color: '#0abde3'
      },
      {
        label: '完全入库',
        value: 30,
        color: '#10ac84'
      }
    ],
    stateList: [
      {
        label: '待审核',
        color: '#feca57',
        value: 10
      },
      {
        label: '已审核',
        color: '#1dd1a1',
        value: 20
      },
      {
        label: '审核不通过',
        color: '#ee5253',
        value: 30
      },
      {
        label: '作废',
        color: '#ff6b6b',
        value: 40
      },
      {
        label: '已归档',
        color: '#27ae60',
        value: 50
      },
    ]
}
const mutations = {
  CAHNGE_LOG_MODULE(state, flag) {
    state.showLogModule = flag  
  },
  CHANGE_MODULE(state, flag) {
    state.showModule = flag
    if (!flag) {
      state.auditState = 0
    }
  },
  GET_LOG_DATA(state, { data, total }) {
      state.logTableData = data
      state.logTotal = total
  },
  GET_DATA: (state, data) => {
    state.total = data.total
    state.tableData = data.data
  },
  GET_BUTTON_LIST(state, list) {
    list.forEach(item => {
        state.showButtons[item.key] = true
    })
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
  GET_DATA_DETAIL: (state, { data, type }) => {
    const { detail, items } = data
    detail.qa = 1
    detail.unit = 0
    detail.supplement = 0
    items.forEach(item => {
      item.count = 0
      item.index = Math.floor(Math.random() * 100 * 100) + 1
      item.hasChildren = true
      item.taxPriceAmount = 0 // 总税费
      item.expressPriceAmount = 0 // 总运费
      item.inAmount = 0
    })
    console.log(items)
    state.detail = detail
    state.detailItems = items
  }
}
const actions = {
  async getPurchaseOrderList({ commit }, params) {
    loading()
    await getPurchaseOrderList(params).then(res => {
      if (res.code === 0) {
        commit('GET_DATA', res.data)
      }
      loadingClose()
    }).catch(err => {
      loadingClose()
    })
  },
  async exportData({}, { selectData }) {
    const ticketCodes = selectData.map(item => item.ticketCode).join(',')
    if (!ticketCodes) {
      message('warning', '请先勾选数据')
      return
    }
    loading()
    try {
      const data = await exportData(ticketCodes)
      downlaod(data, '采购单列表.xls')
      loadingClose()
    } catch (err) {
      loadingClose()
    }
  },
  async getPurchaseOrderInfo({ commit }, params) {
    loading()
    const { data } = await getPurchaseOrderInfo(params)
    commit('GET_SHOP_INFO_DATA', data)
    loadingClose()
  },
  async invalid({ dispatch }, { selectData, search }) {
    if (!selectData.length) {
      message('warning', '请选择要作废的单据')
      return
    }
    const list = selectData.filter(item => item.state === 10 || item.state === 30).map(item => item.ticketCode)
    if (!list.length || list.length > 1) {
      message('warning', '当前选择的单据不允许执行此项操作并且只能选择一条单据')
      return
    }
    confirmMsg('warning', '提示', '你确定要作废吗？', async() => {
      const { code } = await invalidOrder(list[0]) 
      if (code === 0) {
        dispatch('getPurchaseOrderList', search)
      }
    })
  },
  async auditOrder({ commit, dispatch }, { ticketCode, type, params }) {
    const { code } = await auditOrder({ ticketCode, type }) 
    if (code === 0) {
      dispatch('getPurchaseOrderList', params)
      commit('CHANGE_MODULE', false)
    }
  },
  async getPurchaseOrderDetail({ commit, dispatch }, { ticketCode, type }) {
    if (!ticketCode) {
      message('warning', '采购单号丢失')
      return
    }
    loading()
    try {
      const { data } = await getPurchaseOrderDetail(ticketCode)
    //   commit('GET_SHOP', {
    //     label: data.detail.shopName,
    //     value: data.detail.shopId
    // }, { root: true })
      commit('GET_DATA_DETAIL', { data, type })
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
  async fn({}, details) {
    const result = await generatePurchaseIn(details)
      loadingClose()
      if (!result.code) {
        message('success', '生成入库单成功')
        router.push({
          name: 'PutInStorageOrder'
        })
      }
  },
  async generatePurchaseIn({ dispatch }, { details, prepareData, childList }) {
    loading()
    if (childList.length) {
      try {
        details['skuList'] = childList.map(({ shopId, childSku, count }) => {
          return { shopId, sku: childSku, count }
        })
        dispatch('fn', details)
      } catch (e) {
        loadingClose()
      }
      return
    }
    try {
      const { code, data } = await prepare({ ticketCode: details.ticketOrder, data: prepareData })
      if (code === 0) {
        details['skuList'] = data
        dispatch('fn', details)
      } else {
        loadingClose()
      }
    } catch(e) {
      loadingClose()
    }
    
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
