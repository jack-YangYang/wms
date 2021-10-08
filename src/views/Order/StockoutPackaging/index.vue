<template>
    <main>
        <search :search="search" :showbatchNunber="false">
            <search-btn-group @doFilter="getData('data')" @doReset="doReset">
                <el-button type="primary" size="mini" @click="transferredDelivery({ selectData, search })">转至待拣货</el-button>
                <el-button type="primary" size="mini" @click="exportData">导出</el-button>
                <el-button type="primary" size="mini" @click="getOrderLog(selectData)" v-if="showButtons.log">操作日志</el-button>
            </search-btn-group>
        </search>
        <template v-if="total">
                <table-content :tableData="tableData" @selectionChange="selectionChange" :show="false" />
                <change-page 
                :page="{ page: search.page_num, size: search.page_size }" 
                :total="total" 
                @handleCurrentChange="changePage" 
                @handleSizeChange="changeSize" />
        </template>
        <no-data-content v-else />
        <transition name="fade-transform" mode="out-in">
            <log-module v-if="showLogModule" />
        </transition>
    </main>
</template>
<script>
import search from '../components/search'
import TableContent from '../components/table'
import logModule from '../components/logModule'
import { orderMixin } from '@/mixins/common'
import { mapState, mapActions } from 'vuex'
import { message, getMenuID } from '@/utils/common'
export default {
    name: 'StockoutPackaging',
    components: {
        search,
        TableContent,
        logModule
    },
    mixins: [orderMixin],
    computed: {
        ...mapState('Order', {
            tableData: 'stockoutPackagingTable',
            showButtons: 'showButtons',
            total: 'stockoutPackagingTotal',
            showLogModule: 'showLogModule'
        })
    },
    data() {
        return {
            search: {
                nt_order_id: null,
                shop_order_id: null,
                logistics_provider_code: null,
                logistics_mode_code: null,
                pick_batch_number: null,
                track_num: null,
                order_type: null,
                sku: null,
                page_num: 1,
                page_size: 20
            },
            selectData: []
        }
    },
    methods: {
        ...mapActions([
            'getAllProvideList',
            'getAllShipList'
        ]),
        ...mapActions('Order', [
            'getOutStockList',
            'getButtonList',
            'transferredDelivery',
            'getOrderLog',
            'exportOrders'
        ]),
        selectionChange(items) {
            this.selectData=  items
        },
        getData(arg) {
            arg ? this.search.page_num = 1 : ''
            this.getOutStockList(this.search)
        },
        exportData() {
            if (!this.total) {
                message('warning', '当前没有数据可以导出')
                return
            }
            const search = JSON.parse(JSON.stringify(this.search))
            search.page_size = 1000 * 1000
            const exportModule = 'outStockExport'
            const exportName = '缺货待包装.xls'
            this.exportOrders({ search, exportModule, exportName })
        }
    },
    mounted() {
        const item = getMenuID(this.$route.path)
        this.getButtonList(item)
        this.getData()
        this.getAllProvideList()
        this.getAllShipList()
    }
}
</script>