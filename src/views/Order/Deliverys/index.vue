<template>
    <main>
        <search :search="search">
            <el-form-item>
                    <el-input placeholder="请输入SKU" v-model="search.sku" clearable />
            </el-form-item>
            <el-form-item>
                <el-input v-model="search.handler_staff_name" placeholder="请输入处理人">
                    <el-select placeholder="请选择处理人" v-model="search.handler_type" filterable slot="prepend" style="width: 120px">
                        <el-option v-for="(item, index) in handlerTypeList" :value="item" :label="item" :key="index" />
                    </el-select>
                </el-input>
            </el-form-item>
            <el-form-item>
                <div class="select-date-picker">
                    <el-select v-model="search.handler_date_type"   placeholder="请选择时间方式">
                        <el-option v-for="(item, index) in handlerDateTypeList" :value="item" :label="item" :key="index" />          
                    </el-select>
                    <el-date-picker
                    v-model="date"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                </div>          
            </el-form-item>
            <search-btn-group @doFilter="getData('data')" @doReset="doReset">
                <el-button type="primary" size="mini" @click="exportData">导出</el-button>
                <el-button type="primary" size="mini" @click="getOrderLog(selectData)" v-if="showButtons.log">操作日志</el-button>
            </search-btn-group>
        </search>
        <template v-if="total">
                <table-content :tableData="tableData" @selectionChange="selectionChange" />
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
import TableContent from './components/table'
import logModule from '../components/logModule'
import { orderMixin } from '@/mixins/common'
import { mapState, mapActions } from 'vuex'
import { message, getMenuID, setTime } from '@/utils/common'
export default {
    name: 'Deliverys',
    components: {
        search,
        TableContent,
        logModule
    },
    mixins: [orderMixin],
    computed: {
        ...mapState('Order', {
            tableData: 'deliversTable',
            handlerTypeList: 'handlerTypeList',
            handlerDateTypeList: 'handlerDateTypeList',
            showButtons: 'showButtons',
            total: 'deliversTotal',
            showLogModule: 'showLogModule'
        })
    },
    watch: {
        date(val) {
            this.$set(this.search, 'handler_date_start', val ? val[0] : '')
            this.$set(this.search, 'handler_date_end', setTime(val))
        }
    },
    data() {
        return {
            search: {
                nt_order_id: null,
                handler_date_type: '派单时间',
                handler_type: '派单人',
                handler_staff_name: '',
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
            date: '',
            selectData: []
        }
    },
    methods: {
        ...mapActions([
            'getAllProvideList',
            'getAllShipList'
        ]),
        ...mapActions('Order', [
            'getShippedList',
            'getButtonList',
            'getOrderLog',
            'exportOrders'
        ]),
        getData(arg) {
            arg ? this.search.page_num = 1 : ''
            this.getShippedList(this.search)
        },
        selectionChange(items) {
            this.selectData = items
        },
        exportData() {
            if (!this.total) {
                message('warning', '当前没有数据可以导出')
                return
            }
            const search = JSON.parse(JSON.stringify(this.search))
            search.page_size = 1000 * 1000
            const exportModule = 'shippedExport'
            const exportName = '已发货.xls'
            this.exportOrders({ search, exportModule, exportName })
        }
    },
    mounted() {
        const item = getMenuID(this.$route.path)
        this.getButtonList(item)
        this.getAllProvideList()
        this.getAllShipList()
        this.getData()
    }
}
</script>