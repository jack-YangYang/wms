<template>
    <main>
        <el-form :model="search" inline>
            <el-form-item>
                <el-input v-model="search.batch_number" placeholder="请输入批次号" clearable />
            </el-form-item>
            <el-form-item>
                <el-select placeholder="请选择打包状态" v-model="search.type" clearable>
                    <el-option 
                    v-for="item in packageStatusList" 
                    :value="item.value" 
                    :label="item.label" 
                    :key="item.value"/>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="search.pack_staff_name" placeholder="请输入打包人" clearable />
            </el-form-item>
            <el-form-item>
                <div class="select-date-picker">
                    <el-select v-model="search.date_type"   placeholder="请选择时间方式">
                        <el-option label="拣货完成时间" value="拣货完成时间" />   
                        <el-option label="打包完成时间" value="打包完成时间" />         
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
            <el-form-item>
                <search-btn-group @doFilter="getData('data')" @doReset="doReset">
                    <el-button type="primary" size="mini" @click="checkComplete({ selectData, search })" v-if="showButtons.checkComplete">核单完成</el-button>
                    <el-button type="primary" size="mini" @click="exportData">导出</el-button>
                    <el-button type="primary" size="mini" @click="getLogTickets(selectData)" v-if="showButtons.log">操作日志</el-button>
                </search-btn-group>
            </el-form-item>
        </el-form>
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
import { orderMixin } from '@/mixins/common'
import tableContent from './components/table'
import logModule from '../components/logModule'
import { mapActions, mapState } from 'vuex'
import { message, getMenuID, setTime } from '@/utils/common'
export default {
    name: 'PackagingMangement',
    mixins: [orderMixin],
    data() {
        return {
            search: {
                batch_number: '',
                date_type: '拣货完成时间',
                type: '',
                pack_staff_name: '',
                page_size: 20,
                page_num: 1
            },
            date: '',
            selectData: []
        }
    },
    watch: {
        date(val) {
            this.$set(this.search, 'date_start', val ? val[0] : '')
            this.$set(this.search, 'date_end', setTime(val))
        }
    },
    computed: {
        ...mapState('Order', {
            tableData: 'packageTable',
            showButtons: 'showButtons',
            showPrintModule: 'showPrintModule',
            packageStatusList: 'packageStatusList',
            showLogModule: 'showLogModule',
            total: 'packageTotal'
        })
    },
    components: {
        tableContent,
        logModule
    },
    methods: {
        ...mapActions('Order', ['getPackageList', 'checkComplete', 'getLogTickets', 'exportOrders', 'getButtonList']),
        selectionChange(items) {
            this.selectData = items
        },
        getData(arg) {
            arg ? this.search.page_num = 1 : ''
            this.getPackageList(this.search)
        },
        exportData() {
            if (!this.total) {
                message('warning', '当前没有数据可以导出')
                return
            }
            const search = JSON.parse(JSON.stringify(this.search))
            search.page_size = 1000 * 1000
            const exportModule = 'checkExport'
            const exportName = '打包核单.xls'
            this.exportOrders({ search, exportModule, exportName })
        }
    },
    mounted() {
        const item = getMenuID(this.$route.path)
        this.getButtonList(item)
        this.getData()
    }
}
</script>