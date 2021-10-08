<template>
    <main>
        <search :search="search">
            <template slot="search">
                <el-form-item>
                    <el-select
                        placeholder="请选择订单状态"
                        v-model="search.order_type"
                        clearable
                    >
                        <el-option
                            v-for="item in statusList"
                            :value="item.value"
                            :label="item.label"
                            :key="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input
                        placeholder="请输入SKU"
                        v-model="search.sku"
                        clearable
                    />
                </el-form-item>
                <el-form-item>
                    <el-select
                        placeholder="请选择销售平台"
                        v-model="search.platform"
                        clearable
                    >
                        <el-option
                            v-for="item in platformList"
                            :value="item"
                            :label="item"
                            :key="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input
                        v-model="search.handler_staff_name"
                        placeholder="请输入处理人"
                    >
                        <el-select
                            placeholder="请选择处理人"
                            v-model="search.handler_type"
                            filterable
                            slot="prepend"
                            style="width: 120px"
                        >
                            <el-option
                                v-for="(item, index) in handlerTypeList"
                                :value="item"
                                :label="item"
                                :key="index"
                            />
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <div class="select-date-picker">
                        <el-select
                            v-model="search.handler_date_type"
                            placeholder="请选择时间方式"
                        >
                            <el-option
                                v-for="(item, index) in handlerDateTypeList"
                                :value="item"
                                :label="item"
                                :key="index"
                            />
                        </el-select>
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </div>
                </el-form-item>
            </template>
            <search-btn-group @doFilter="getData('data')" @doReset="doReset">
                <router-link to="/order/ordercenter/batchpicking">
                    <el-button
                        type="primary"
                        size="mini"
                        v-if="showButtons.picking"
                        >批次分拣</el-button
                    >
                </router-link>
                <!-- <el-button type="primary" size="mini">拣货完成</el-button> -->
                <!-- <el-button type="primary" size="mini">缺货订单</el-button> -->
                <el-button
                    type="primary"
                    size="mini"
                    @click="outStockPicking(search)"
                    v-if="showButtons.outStockPick"
                    >缺货待包装</el-button
                >
                <el-button type="primary" size="mini" @click="exportData"
                    >导出</el-button
                >
                <el-button
                    type="primary"
                    size="mini"
                    @click="getOrderLog(orderCenterSelectData)"
                    v-if="showButtons.log"
                    >操作日志</el-button
                >
            </search-btn-group>
        </search>
        <template v-if="total">
            <table-content
                :tableData="tableData"
                @selectionChange="selectionChange"
            />
            <change-page
                :page="{ page: search.page_num, size: search.page_size }"
                :total="total"
                @handleCurrentChange="changePage"
                @handleSizeChange="changeSize"
            />
        </template>
        <no-data-content v-else />
        <transition name="fade-transform" mode="out-in">
            <log-module v-if="showLogModule" />
        </transition>
    </main>
</template>

<script>
import search from '../components/search'
import TableContent from './components/pickTable'
import logModule from '../components/logModule'
import { orderMixin } from '@/mixins/common'
import { mapState, mapActions, mapMutations } from 'vuex'
import { message, getMenuID, setTime } from '@/utils/common'
export default {
    name: 'OrderCenter',
    components: {
        search,
        TableContent,
        logModule,
    },
    computed: {
        ...mapState({
            platformList: (state) => state.common.platformList,
        }),
        ...mapState('Order', {
            tableData: 'orderCenterTable',
            handlerDateTypeList: 'handlerDateTypeList',
            handlerTypeList: 'handlerTypeList',
            statusList: 'statusList',
            showButtons: 'showButtons',
            total: 'orderCenterTotal',
            showLogModule: 'showLogModule',
            orderCenterSelectData: 'orderCenterSelectData',
        }),
    },
    watch: {
        date(val) {
            this.$set(this.search, 'handler_date_start', val ? val[0] : '')
            this.$set(this.search, 'handler_date_end', setTime(val))
        },
    },
    mixins: [orderMixin],
    data() {
        return {
            search: {
                nt_order_id: null,
                handler_date_type: '派单时间',
                handler_staff_name: '',
                handler_type: '派单人',
                shop_order_id: null,
                logistics_provider_code: null,
                logistics_mode_code: null,
                pick_batch_number: null,
                track_num: null,
                order_type: null,
                sku: null,
                platform: null,
                page_num: 1,
                page_size: 20,
            },
            date: '',
        }
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            if (from.fullPath === '/order/ordercenter/batchpicking') {
                // 从批次分拣过来的
                vm.getData()
            }
            console.log(from.fullPath)
        })
    },
    methods: {
        ...mapActions(['getAllProvideList', 'getAllShipList', 'getPlatform']),
        ...mapActions('Order', [
            'getOrderCenerList',
            'getButtonList',
            'outStockPicking',
            'exportOrders',
            'getOrderLog',
        ]),
        ...mapMutations('Order', {
            selectionChange: 'CAHNGE_ORDERCENTER_DATA',
        }),
        getData(arg) {
            arg ? (this.search.page_num = 1) : ''
            this.getOrderCenerList(this.search)
        },
        exportData() {
            if (!this.total) {
                message('warning', '当前没有数据可以导出')
                return
            }
            const search = JSON.parse(JSON.stringify(this.search))
            search.page_size = 1000 * 1000
            const exportModule = 'orderCenter'
            const exportName = '订单中心.xls'
            this.exportOrders({ search, exportModule, exportName })
        },
    },
    async mounted() {
        const item = getMenuID(this.$route.path)
        this.getButtonList(item)
        this.getData()
        this.getAllProvideList()
        this.getAllShipList()
        this.getPlatform()
    },
}
</script>

<style>
</style>