import request from '@/utils/request'
import { downlaod, loading, loadingClose, message } from '@/utils/common'
const getList = ({ whouseId, sku, params, isTrans }) => request({
    url: `/warehouse/stock/detail/${isTrans}/${whouseId}/${sku}`,
    params
})
const exportData = ({ whouseId, sku = 0, search, isTrans }) => request({
    url: `/warehouse/stock/detail/export/${isTrans}/${whouseId}/${sku}`,
    params: search,
    responseType: 'blob'
})
const state = {
    total: 0,
    tableData: [],
    transTable: [],
    transTotal: 0
}
const actions = {
    async getList({ commit }, data) {
        const { isTrans } = data
        loading()
        try {
            const { data: result, code } = await getList(data)
            if (code === 0) {
                commit('GET_DATA', { result, isTrans })
            }
            else {
                commit('GET_DATA', { isTrans })
            }
            loadingClose()
        } catch(e) {
            loadingClose()
            commit('GET_DATA', { isTrans })
        }
    },
    async exportData({}, params) {
        const { whouseId, search: { startDate }, isTrans } = params
        if (!whouseId || !startDate) {
            message('warning', '请选择仓库,时间段或店铺查询出入库记录')
            return
        }
        params.sku = params.sku || 0
        loading()
        const data = await exportData(params)
        downlaod(data, isTrans ? '在途明细账.xls' :'库存明细账.xls')
        loadingClose()
    }
}
const mutations = {
    GET_DATA: (state, { result = [], isTrans }) => {
        if (isTrans) { // 在途明细
            state.transTable = result
            return
        }
        state.tableData = result
    },
    EXPORT_DATA: (state) => {
        if (!state.tableData.length) {
            message('warning', '当前没有数据可以导出')
            return
        }
        function  formatJson(filterVal, list) {
            return list.map(v => filterVal.map(j => v[j]))
        }
        import("@/vendor/Export2Excel").then(excel => {
            // 设置导出表格的头部
            const tHeader = ['单据号', '日期', 'SKU', '出库数量', '出库单价', '出库金额', '入库数量', '入库单价', '入库金额', '期末数量', '期末单价', '期末数量']
            // 设置要导出的属性
            const filterVal = ['ticketCode', 'ticketDate', 'sku', 'outCount', 'outPrice', 'outAmount', 'inCount', 'inPrice', 'inAmount', 'stockCount', 'stockPrice', 'stockAmount']
            // 获取当前展示的表格数据
            const list = state.tableData;
            // 将要导出的数据进行一个过滤
            const data = formatJson(filterVal, list);
            // 调用我们封装好的方法进行导出Excel
            excel.export_json_to_excel({
            // 导出的头部
            header: tHeader,
            // 导出的内容
            data,
            // 导出的文件名称
            filename: '库存明细账',
            // 导出的表格宽度是否自动
            autoWidth: true,
            // 导出文件的后缀类型
            bookType: 'xls'
            });
        });
    } 
}
export default {
    namespaced: true,
    state,
    actions,
    mutations
}