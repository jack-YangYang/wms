<template>
    <main>
        <search-form :search="search">
            <el-date-picker
                v-model="date"
                type="daterange"
                value-format="yyyy-MM-dd"
                style="width: 350px"
                range-separator="至"
                start-placeholder="打包完成时间开始"
                end-placeholder="打包完成时间结束">
            </el-date-picker>
            <search-btn-group @doFilter="getData('data')" @doReset="doReset">
                    <router-link to="/order/measurement/measurementcontent">
                        <el-button type="primary" size="mini" v-if="showButtons.measurement">测量称重</el-button>
                    </router-link>
                    <el-button type="primary" size="mini" @click="exportData">导出</el-button>
                    <el-button type="primary" size="mini" @click="getOrderLog(selectData)" v-if="showButtons.log">操作日志</el-button>
                </search-btn-group>
        </search-form>
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
import searchForm from '../components/search'
import TableContent from './components/table'
import logModule from '../components/logModule'
import { orderMixin } from '@/mixins/common'
import { mapActions, mapState } from 'vuex'
import { getMenuID, setTime } from '@/utils/common'
export default {
    name: 'Measurement',
    components: {
        searchForm,
        logModule,
        TableContent
    },
    mixins: [orderMixin],
    computed: {
        ...mapState('Order', {
            total: 'measurementTotal',
            showButtons: 'showButtons',
            showLogModule: 'showLogModule',
            tableData: 'measurementTableData'
        })
    },
    watch: {
        date(val) {
            this.$set(this.search, 'pack_date_start', val ? val[0] : '')
            this.$set(this.search, 'pack_date_end', setTime(val))
        }
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
                page_num: 1,
                page_size: 20
            },
            date: '',
            flag: false,
            selectData: []
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (from.fullPath === '/order/measurement/measurementcontent') { // 从批次分拣过来的
                if (vm.flag) {
                    vm.getData()
                }
                
            }
            console.log(vm.flag)
            console.log(from.fullPath)
        })
    },
    activated() {
        this.flag = true
    },
    methods: {
        ...mapActions([
            'getAllProvideList',
            'getAllShipList'
        ]),
         selectionChange(items) {
            this.selectData = items
        },
        ...mapActions('Order', [
            'getMeasurementList',
            'getButtonList',
            'exportOrders',
            'getOrderLog'
        ]),
        getData(arg) { 
            arg ? this.search.page_num = 1 : ''
            this.getMeasurementList(this.search)
        },
        exportData() {
            if (!this.total) {
                message('warning', '当前没有数据可以导出')
                return
            }
            const search = JSON.parse(JSON.stringify(this.search))
            search.page_size = 1000 * 1000
            const exportModule = 'weightExport'
            const exportName = '测量称重.xls'
            this.exportOrders({ search, exportModule, exportName })
        }
    },
    mounted() {
        const item = getMenuID(this.$route.path)
        this.getButtonList(item)
        this.getAllProvideList()
        this.getAllShipList()
        this.getMeasurementList()
    }
}
</script>