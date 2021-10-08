<template>
    <main>
        <el-form inline :model="search" label-width="90px">
            <el-form-item>
                <el-select v-model="search.sourceWhouseId" placeholder="请选择调出仓库" clearable filterable>
                    <el-option v-for="item in waehouseList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="search.distWhouseId" placeholder="请选择调入仓库" clearable filterable>
                    <el-option v-for="item in waehouseList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item prop="shopId">
                <el-select 
                v-model="search.shopId"
                placeholder="请输入店铺名" 
                filterable 
                style="width: 100%" 
                clearable 
                remote
                :loading="loading"
                :remote-method="remoteMethod"
                >
                    <el-option v-for="item in shopList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </el-form-item> -->
            <el-form-item>
                <el-input v-model.trim="search.ticketCode" clearable placeholder="请输入单号" />
            </el-form-item>
            <el-form-item>
                <el-input v-model.trim="search.sku" clearable placeholder="请输入SKU" />
            </el-form-item>
            <el-form-item>
                <el-select v-model="search.state" filterable clearable  placeholder="请选择单据状态">
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
                        <!-- <el-option label="审核时间" value="audit" /> -->
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
            <!-- <el-form-item>
                    <el-select v-model="search.printState" filterable clearable  placeholder="请选择拣货单状态">
                        <el-option
                        label="未打印"
                        :value="0"
                        />
                        <el-option
                        label="已打印"
                        :value="1"
                        />
                    </el-select>
                </el-form-item> -->
            <!-- <div> -->
                <el-form-item label-width="0">
                    <el-button size="mini" @click="getData('data')" type="primary" >搜索</el-button>
                    <el-button size="mini" type="primary" @click="doReset">重置</el-button>
                    <router-link :to="{ name: 'AddTransfers', query: { name: 'Transfers' } }">
                        <el-button type="primary" size="mini" v-if="showButtons.add">新增调拨单</el-button>
                    </router-link>    
                    <el-button type="primary" size="mini" style="margin-left: 0" @click="filterLog({ pageNo: 1, pageSize: 20 })" v-if="showButtons.log">查看操作日志</el-button>
                    <el-button size="mini" type="primary" @click="exportData(search)">导出</el-button>      
                </el-form-item>
            <!-- </div> -->
        </el-form>
        <div v-if="tableData.length">
           <table-conent 
           :tableData="tableData" 
           @selectionChange="selectionChange"
           @invalid="invalid"
           @audit="audit" 
           @doPrint="doPrint"

           :showButtons="showButtons"/>
            <change-page 
            :page="{ page:search.pageNo, size: search.pageSize }"
            :total="total"
            @handleCurrentChange="changePage" 
            @handleSizeChange="changeSize" 
            />
        </div>
        <no-data-content v-else />
        <transition name="fade-transform" mode="out-in"> 
            <audit-modal
            v-if="auditModal" 
            @handleSubmit="handleSubmit"
            :auditState="auditState" 
            :auditRemark="auditRemark"
            :auditModal="auditModal"
            />
        </transition>
        <!-- <transition name="fade-transform" mode="out-in"> 
            <print-module
            v-if="showPrintModule" 
            @confirmPrint="confirmPrint"
            />
        </transition> -->
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
    </main>
</template>
<script>
import TableConent from './components/table'
import NoDataContent from '@/components/NoDataImages'
import AuditModal from '@/components/auditModal'
import LogModule from '@/components/ActionLog'
// import PrintModule from './components/print-module'
import { mixin } from '@/mixins/common'
import { debounce, message, getMenuID } from '@/utils/common'
import { printTransfers } from '@/api/Transfers'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
    name: 'Transfers',
    mixins: [ mixin ],
    components: {
        TableConent,
        NoDataContent,
        LogModule,
        AuditModal,
        // PrintModule
    },
    computed: {
        ...mapState('Transfers', [
            'tableData',
            'logTotal',
            'detail',
            'detailItems',
            'showLogModule',
            'showPrintModule',
            'stateList',
            'total',
            'showButtons',
            'auditState',
            'auditRemark',
            'auditModal',
            'logTableData'
        ]),
        ...mapState({
            // loading: state => state.common.loading,
            // shopList: state => state.common.shopList,
            waehouseList: state => state.common.waehouseList,
        }),
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
    data() {
        return {
            search: {
                sourceWhouseId: '',
                distWhouseId: '',
                // shopId: '',
                state: '',
                pageNo: 1,
                pageSize: 20,
                ticketCode: '',
            },
            selectData: [],
            date: '',
            timeStatus: 'create',
            ticketCode: '',
            type: 0,
        }
    },
    beforeDestroy() {
        this.$store.commit('Transfers/change_detailItems', [])
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
        selectionChange(data) {
            this.selectData = data
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
        ...mapActions('Transfers', [
            'getLog', 
            'getButtonList',
            'getList', 
            'invalidTransfer',
            'getPrintContent', 
            'auditTransfer',
            'exportData'
            ]),
        ...mapMutations('Transfers', ['CLOSR_AUDIT_MODAL', 'CAHNGE_LOG_MODULE']),
        // remoteMethod(query) {
        //     this.getAllShop(query)
        // },
        ...mapActions(['getAllwarehouse']),
        audit(code) {
            this.ticketCode = code
            this.CLOSR_AUDIT_MODAL(true)
        },
        // 打印拣货单
        doPrint(code, type) {
            this.ticketCode = code
            this.type = type
            this.getPrintContent(code)
        },
        // 点击打印按钮
        async confirmPrint() {
            const { code } = await printTransfers({ ticketCode: this.ticketCode, type: this.type })
            if (code === 0) {
                this.getData()
            }
        },
        invalid(ticketCode) {
            this.invalidTransfer({ ticketCode, params: this.search })
        },
        /* 确定审核 */
        handleSubmit(state) {
            if (!state && typeof state !== 'number') {
                this.CLOSR_AUDIT_MODAL(state)
                return
            }
            let data = {
                ticketCode: [this.ticketCode],
                type: state
            }
            this.auditTransfer({ data, params: this.search })
        },
        /* 获取数据 */
        getData(arg) {
            arg ? this.search.pageNo = 1 : ''
            console.log(this.search)
            this.getList(this.search)
        },
        /* 导出 */
        // exportData() {
        //     this.exportData()
        // }
    },
    mounted() {
        const item = getMenuID(this.$route.path)
        this.getButtonList(item)
        this.getData()
        this.getAllwarehouse()
    }
}
</script>
