<template>
    <main>
        <el-form :model="search" inline>
            <el-form-item>
                <el-input
                    v-model="search.batch_number"
                    placeholder="请输入批次号"
                    clearable
                />
            </el-form-item>
            <el-form-item>
                <el-select
                    placeholder="请选择拣货状态"
                    v-model="search.type"
                    clearable
                >
                    <el-option
                        v-for="item in pickingStatusList"
                        :value="item.value"
                        :label="item.label"
                        :key="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input
                    v-model="search.pick_staff_name"
                    placeholder="请输入拣货人"
                    clearable
                />
            </el-form-item>
            <el-form-item>
                <el-select
                    placeholder="请选择是否大件"
                    v-model="search.pack_size"
                >
                    <el-option label="小件" :value="0" />
                    <el-option label="大件" :value="1" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select
                    placeholder="是否打印拣货单"
                    v-model="search.is_printed"
                >
                    <el-option label="是" :value="1" />
                    <el-option label="否" :value="0" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select
                    placeholder="请选择仓库"
                    v-model="search.warehouse_id"
                >
                    <el-option
                        v-for="(item, key) in deliveryWarehouseList"
                        :key="key"
                        :label="item.label"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select
                    placeholder="请选择分区"
                    no-data-text="请先选择仓库"
                    v-model="search.part_id"
                    multiple
                    filterable
                    collapse-tags
                    clearable
                >
                    <el-option
                        v-for="(item, key) in partList"
                        :key="key"
                        :label="item.label"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <div class="select-date-picker">
                    <el-select
                        v-model="search.date_type"
                        placeholder="请选择时间方式"
                    >
                        <el-option label="开始拣货时间" value="开始拣货时间" />
                        <el-option label="拣货完成时间" value="拣货完成时间" />
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
            <el-form-item>
                <search-btn-group
                    @doFilter="getData('data')"
                    @doReset="doReset"
                >
                    <el-button
                        type="primary"
                        size="mini"
                        @click="pickingComplete({ selectData, search })"
                        v-if="showButtons.pickingComplete"
                        >拣货完成</el-button
                    >
                    <el-button
                        type="primary"
                        size="mini"
                        @click="pickingInvalid({ selectData, search })"
                        v-if="showButtons.invalid"
                        >作废</el-button
                    >
                    <el-button type="primary" size="mini" @click="exportData"
                        >导出</el-button
                    >
                    <el-button
                        type="primary"
                        size="mini"
                        @click="getLogTickets(selectData)"
                        v-if="showButtons.log"
                        >操作日志</el-button
                    >
                </search-btn-group>
            </el-form-item>
        </el-form>
        <template v-if="total">
            <table-content
                :tableData="tableData"
                @selectionChange="selectionChange"
                :params="search"
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
            <print-picking-module 
            v-if="showPrintModule"
            @handleSubmitPrint="handleSubmitPrint(search)"
             />
        </transition>
        <transition name="fade-transform" mode="out-in">
            <log-module v-if="showLogModule" />
        </transition>
    </main>
</template>
<script>
import { orderMixin } from '@/mixins/common'
import tableContent from './components/table'
import logModule from '../components/logModule'
import printPickingModule from '../OrderCenter/components/printPicking'
import { mapActions, mapState } from 'vuex'
import { message, getMenuID, setTime } from '@/utils/common'
import { deepClone } from '@/utils'
export default {
    name: 'PickingManagement',
    mixins: [orderMixin],
    data() {
        return {
            search: {
                batch_number: '',
                is_printed: '',
                date_type: '开始拣货时间',
                type: '',
                pick_staff_name: '',
                pack_size: '',
                warehouse_id: '',
                part_id: '',
                page_size: 20,
                page_num: 1,
            },
            date: '',
            selectData: [],
            partList: [],
        }
    },
    watch: {
        date(val) {
            this.$set(this.search, 'date_start', val ? val[0] : '')
            this.$set(this.search, 'date_end', setTime(val))
        },
        'search.warehouse_id': function (n) {
            this.search.part_id = []
            this.partList = n
                ? this.deliveryWarehouseList.find((item) => item.id == n)
                      .partition
                : []
        },
    },
    computed: {
        ...mapState({
            deliveryWarehouseList: (state) =>
                state.common.deliveryWarehouseList,
        }),
        ...mapState('Order', {
            tableData: 'pickingTable',
            showButtons: 'showButtons',
            showPrintModule: 'showPrintModule',
            total: 'pickingTotal',
            showLogModule: 'showLogModule',
            pickingStatusList: 'pickingStatusList',
        }),
    },
    components: {
        tableContent,
        printPickingModule,
        logModule,
    },
    methods: {
        ...mapActions(['getDeliveryWarehouseList']),
        ...mapActions('Order', [
            'getPickingList',
            'getButtonList',
            'pickingComplete',
            'pickingInvalid',
            'getLogTickets',
            'exportOrders',
            'handleSubmitPrint'
        ]),
        getData(arg) {
            arg ? (this.search.page_num = 1) : ''
            this.getPickingList(this.search)
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
            const exportModule = 'pickingExport'
            const exportName = '拣货管理.xls'
            this.exportOrders({ search, exportModule, exportName })
        },
    },
    mounted() {
        const item = getMenuID(this.$route.path)
        this.getButtonList(item)
        this.getData()
        this.getDeliveryWarehouseList()
    },
}
</script>