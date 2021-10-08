<template>
    <div class="main">
        <el-form :model="search" inline label-width="90px">
            <el-form-item>
                <el-select v-model="search.whouseId" placeholder="请选择仓库" clearable filterable>
                    <el-option v-for="item in waehouseList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </el-form-item>
            
            <el-form-item>
                <el-input v-model.trim="search.ticketCode" clearable placeholder="请输入盘点单号" />
            </el-form-item>
            <el-form-item>
                <el-input v-model.trim="search.sku" clearable placeholder="请输入SKU" />
            </el-form-item>
            <el-form-item>
                <el-select v-model="search.state" filterable clearable  placeholder="请选择状态">
                    <el-option
                        v-for="item in stateList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <div class="select-date-picker">
                    <el-select v-model="timeStatus"   placeholder="请选择时间方式">
                        <el-option label="制单时间" value="create" />
                        <el-option label="审核时间" value="audit" />
                    </el-select>
                    <el-date-picker
                    v-model="date"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                </div>          
            </el-form-item>
            <el-form-item>
                <search-btn-group @doFilter="getData('data')" @doReset="doReset">
                    <router-link :to="{ name: 'AddInventory' }">
                        <el-button type="primary" size="mini" v-if="showButtons.add">新增盘点单</el-button>
                    </router-link>   
                    <el-button @click="exportData" type="primary"  size="mini">导出</el-button> 
                    <el-button @click="filterLog({ pageNo: 1, pageSize: 20 })" type="primary"  size="mini">操作日志</el-button>  
                </search-btn-group>
            </el-form-item>
        </el-form>
        <div v-if="tableData.length">
           <table-conent 
           :tableData="tableData" 
           @audit="audit" 
           :showButtons="showButtons" 
           @handleSelectionChange="handleSelectionChange"
           @invalid="invalid" />
            <change-page 
            :page="{ page: search.pageNo, size: search.pageSize }" 
            :total="total" 
            @handleCurrentChange="changePage" 
            @handleSizeChange="changeSize" />
        </div>
        <no-data-content v-else />
        <transition name="fade-transform" mode="out-in"> 
            <audit-modal 
            v-if="auditModal" 
            @handleSubmit="handleSubmit"
            :auditRemark="auditRemark"
            :auditState="auditState" 
            :auditModal="auditModal"/>
        </transition>
        <transition name="fade-transform" mode="out-in"> 
            <log-module
            v-if="showLogModule" 
            :total="logTotal"
            @getLog="filterLog"
            :logTableData="logTableData"
            @handleSubmit="CAHNGE_LOG_MODULE"
            :showLogModule="showLogModule"
            />
        </transition>
    </div>
</template>
<script>
import TableConent from './components/table'
import AuditModal from '@/components/auditModal'
import NoDataContent from '@/components/NoDataImages'
import LogModule from '@/components/ActionLog'
import { mixin } from '@/mixins/common'
import { debounce, getMenuID } from '@/utils/common'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
    name: 'Inventory',
    mixins: [ mixin ],
    components: {
        TableConent,
        NoDataContent,
        LogModule,
        AuditModal
    },
    computed: {
        ...mapState('Inventory', [
            'tableData', 'stateList', 'total', 'logTotal', 'logTableData',
            'auditModal', 'showButtons', 'auditState', 'auditRemark'
        ]),
        ...mapState({          
            waehouseList: state => state.common.waehouseList,
            showModule: state => state.Inventory.showAbnormalModule,
            showLogModule: state => state.Inventory.showLogModule,
        }),
    },
    data() {
        return {
            search: {
                ticketCode: '',
                whouseId: '',
                shopId: '',
                state: '',
                sku: '',
                pageNo: 1,
                pageSize: 20
            },
            selectData: [],
            date: '',
            timeStatus: 'create',
            ticketCode: '',
            params: {}
        }
    },
    watch: {
        timeStatus(newValue, oldValue) {      
            switch(oldValue) {
                case 'create':
                    this.$delete(this.search, 'startDate')
                    this.$delete(this.search, 'endDate')
                    break;
                case 'audit':
                    this.$delete(this.search, 'checkStartDate')
                    this.$delete(this.search, 'checkEndDate')
                    break;
            }
            this.changeTime(newValue)
        },
        date(val) {
            this.changeTime(this.timeStatus)
        },
    },
    methods: {
        changeTime(val) {
            let startDate = this.date ? this.date[0] : ''
            let endDate = this.date ? this.date[1] : ''
            switch(val) {
                case 'create':
                    this.$set(this.search, 'startDate', startDate)
                    this.$set(this.search, 'endDate', endDate)
                    break;
                case 'audit':
                    this.$set(this.search, 'checkStartDate', startDate)
                    this.$set(this.search, 'checkEndDate', endDate)
            }
        },
        handleSelectionChange(items) {
            this.selectData = items
        },
        filterLog(params) {
            if (this.selectData.length > 1) {
                message('warning', '只能选择一条单据')
                return
            }
            if (this.selectData.length) {
                params.logId = this.selectData[0].ticketCode
            }
            this.getLog(params)
        },
        ...mapActions('Inventory', [
            'getList', 
            'getButtonList', 
            'invalidIninvetory', 
            'getLog',
            'auditIninvetory']),
        ...mapMutations('Inventory', [
            'CLOSR_AUDIT_MODAL',
            'CAHNGE_LOG_MODULE'
        ]),
        ...mapActions(['getAllwarehouse']),
        audit(code) {
            this.ticketCode = code
            this.CLOSR_AUDIT_MODAL({ type: true })
        },
        invalid(ticketCode) {
            this.invalidIninvetory({ ticketCode, params: this.search })
        },
        /* 确定审核 */
        handleSubmit(state) {
            if (!state && typeof state !== 'number') {
                this.CLOSR_AUDIT_MODAL({ type: state })
                return
            }
            let data = {
                ticketCode: [this.ticketCode],
                type: state
            }
            this.auditIninvetory({ data, params: this.search })
        },
        getData(arg) {
            arg ? this.search.pageNo = 1 : ''
            this.getList(this.search)
        },
        /* 导出 */
        exportData() {
            let params = {
                warehouseId: this.search.warehouseId,
                createUser: this.search.head,
                pageNo: 1,
                pageSize: 1000 * 1000,
                checkCode: this.search.orderNo,
                state: this.search.state
            }
            this.$store.dispatch('Inventory/exportData', params)
        }
    },
    created() {
        const item = getMenuID(this.$route.path)
        this.getButtonList(item)
        this.getData()
        this.getAllwarehouse()
    }
}
</script>
<style scoped lang="scss">
.main {
    Header {
        display: flex;
        flex-direction: row-reverse;
        margin: 15px 0;
        button {
            margin-left: 15px;
        }
    }
}
</style>