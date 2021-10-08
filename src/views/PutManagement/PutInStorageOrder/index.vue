<template>
    <main>
        <el-form ref="form" :model="search" inline>
            <el-form-item>
                <el-select v-model="search.whouseId" placeholder="请选择仓库" clearable filterable>
                    <el-option v-for="item in waehouseList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item prop="shopId">
                <el-select 
                v-model.trim="search.shopId"
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
            <el-form-item prop="state">
                <el-select v-model="search.state" filterable clearable  placeholder="请选择入库单状态">
                    <el-option
                        v-for="item in stateList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="timeStatus">
                <div class="select-date-picker">
                    <el-select v-model="timeStatus"   placeholder="请选择时间方式">
                        <el-option
                            v-for="item in timeList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                            ></el-option>
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
                <el-select v-model="search.qa" clearable placeholder="是否需要质检">
                    <el-option label="是" :value="1" />
                    <el-option label="否" :value="0" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="search.supplement" clearable placeholder="是否补单">
                    <el-option label="是" :value="1" />
                    <el-option label="否" :value="0" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model.trim="search.sku" placeholder="请输入SKU" clearable />
            </el-form-item>
            <!-- <el-form-item>
                <el-input v-model="search.asin" placeholder="请输入ASIN" clearable />
            </el-form-item> -->
            <el-form-item label="" prop="searchWord">
                <el-input placeholder="部分类型支持自动搜索和扫描搜索" v-model="searchWord">
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                    <template slot="prepend">
                        <el-select v-model.trim="searchKey"    placeholder="请选择" style="width: 120px">
                            <el-option
                            v-for="item in searchList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            ></el-option>
                        </el-select>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item label="">
                <search-btn-group @doFilter="getData('arg')" @doReset="doReset">
                    <!-- <el-button type="primary" @click="printStorage(selectData)" size="mini" style="margin-left: 0" v-if="showButtons.print">打印入库单</el-button> -->
                    <el-button type="primary" size="mini" @click="filterLog({ pageNo: 1, pageSize: 20 })" v-if="showButtons.log">操作日志</el-button>
                    <el-button type="primary" size="mini" style="margin-left: 0" @click="doExportData(search)">导 出</el-button>
                    <!-- <el-button type="primary" size="mini" style="margin-left: 0" @click="invalid({ selectData, search })">作废</el-button>
                    <el-button type="primary" size="mini" style="margin-left: 0" @click="audit(selectData)">审核</el-button> -->
                </search-btn-group>      
            </el-form-item>
        </el-form>
        <div v-if="tableData.length">
            <put-in-storage-order-table 
            :tableData="tableData" 
            :showButtons="showButtons" 
            @doInvalid="doInvalid"
            @startInspection="(ticketCode)=> startInspection({ticketCode, search})"
            @handleSelectionChange="handleSelectionChange"
            @printStorage="printStorage"
            @printSkuLabel="printSkuLabel"
            @secondPrint="printSure"
            @mark="mark" />
             <change-page 
            :page="{size: search.pageSize, 
            page: search.pageNo}" 
            :total="total"
             @handleCurrentChange="changePage" 
             @handleSizeChange="changeSize" />
        </div>
        <no-data-content v-else />
        <transition name="fade-transform" mode="out-in"> 
            <audit-modal 
            v-if="auditModal" 
            @handleSubmit="handleSubmit"
            :auditState="auditState" 
            :auditModal="auditModal"/>
        </transition>
        <transition name="fade-transform" mode="out-in">
            <procurement-documents 
            @handleChangeModule="handleChangeModule"
            @confirmPrint="printSure({ type: 0, ticketCode: printData.ticketCode })"
            v-if="showModule" 
            :showModule="showModule" 
            :detail="detail" 
            :detailItems="detailItems" 
            :date="printDate" />
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
        <transition name="fade-transform" mode="out-in">
            <print-label
                ref="printLabel"
                @printSure="printSure({ type: 1, ticketCode: printData.ticketCode })"
            />
        </transition>
    </main>
</template>
<script>
import { mixin } from '@/mixins/common'
import PutInStorageOrderTable from './components/PutInStorageOrderTable'
import LogModule from '@/components/ActionLog'
import ProcurementDocuments from '@/components/ProcurementDocuments/PutInStorageOrderPrint'
import NoDataContent from '@/components/NoDataImages'
import PrintLabel from './components/printLabel'
import AuditModal from '@/components/auditModal'
import { message, dateFormat, getMenuID } from '@/utils/common'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
    name: 'PutInStorageOrder',
    mixins: [ mixin ],
    components: {
        PutInStorageOrderTable,
        ProcurementDocuments,
        NoDataContent,
        PrintLabel,
        LogModule,
        AuditModal
    },
    computed: {
        ...mapState('PutInStorageOrder', [
            'tableData',
            'timeList',
            'logTotal',
            'detail',
            'logTableData',
            'showLogModule',
            'detailItems',
            'auditModal',
            'auditState',
            'total',
            'stateList',
            'showButtons',
            'searchList',
        ]),
        ...mapState({
            loading: state => state.common.loading,
            shopList: state => state.common.shopList,
            waehouseList: state => state.common.waehouseList
        }),
    },
    data() {
        return {
            search: {
                // purchaseOrderStatus: '',
                whouseId: '',
                pageNo: 1,
                pageSize: 20,
                shopId: '',
                sku: '', 
                // asin: '',
                supplement: '',
                qa: ''
            },
            printData: {}, //当前打印对应的一条表格数据
            searchWord: '',
            timeStatus: 'createOrder',
            date: '',
            printDate: '',
            selectData: [],
            showModule:false,
            ticketCode: '',
            searchKey: 'ticketCode',
            params: {},
        }
    },
    watch: {
        timeStatus(newValue, oldValue) {      
            switch(oldValue) {
                case 'createOrder':
                    this.$delete(this.search, 'startDate')
                    this.$delete(this.search, 'endDate')
                    break;
                case 'qa':
                    this.$delete(this.search, 'qaStartDate')
                    this.$delete(this.search, 'qaEndDate')
                    break;
                case 'mark':
                    this.$delete(this.search, 'markStartDate')
                    this.$delete(this.search, 'markEndDate')
                    break;
                case 'shelf':
                    this.$delete(this.search, 'shelfStartDate')
                    this.$delete(this.search, 'shelfEndDate')
                    break;
                case 'check':
                    this.$delete(this.search, 'checkStartDate')
                    this.$delete(this.search, 'checkEndDate')
            }
            this.changeTime(newValue)
        },
        date(val) {
            this.changeTime(this.timeStatus)
        },
        searchWord(val) {
            this.$set(this.search, this.searchKey, val)
        },
        searchKey(newValue, oldValue) {
            this.$delete(this.search, oldValue) // 先删除原来的，避免新增
            this.$set(this.search, newValue, this.searchWord)
        }
    },
    methods: {
        // 打印入库单
        async printStorage(data) {
            this.printData = data
            await this.$store.dispatch(
                'PutInStorageOrder/getPutInStorageOrderDetail',
                { ticketCode: data.ticketCode, state: data.state }
            )
            this.printDate = dateFormat(new Date())
            this.showModule = true
        },
        //打印商品标签
        printSkuLabel(arg) {
            this.printData = arg
            this.$refs.printLabel.setModule(arg)
        },
        //打印确认
        printSure(arg) {
            this.confirmPrint(arg).then(() => {
                this.getData(this.search)
            })
            if (!arg.type) {
                this.showModule = false
                return
            }
            this.$refs.printLabel.changeProductModuleType(false)
        },
        remoteMethod(query) {
            this.getAllShop(query)
        },
        doInvalid(ticketCode) {
            this.invalid({ ticketCode, params: this.search })
        },
        changeTime(val) {
            let startDate = this.date ? this.date[0] : ''
            let endDate = this.date ? this.date[1] : ''
            switch(val) {
                case 'createOrder':
                    this.$set(this.search, 'startDate', startDate)
                    this.$set(this.search, 'endDate', endDate)
                    break;
                case 'qa':
                    this.$set(this.search, 'qaStartDate', startDate)
                    this.$set(this.search, 'qaEndDate', endDate)
                    break;
                case 'mark':
                    this.$set(this.search, 'markStartDate', startDate)
                    this.$set(this.search, 'markEndDate', endDate)
                    break;
                case 'shelf':
                    this.$set(this.search, 'shelfStartDate', startDate)
                    this.$set(this.search, 'shelfEndDate', endDate)
                    break;
                case 'check':
                    this.$set(this.search, 'checkStartDate', startDate)
                    this.$set(this.search, 'checkEndDate', endDate)
            }
        },
        getData(arg) {
            arg ? this.search.pageNo = 1 : ''
            
            this.getPurchaseInList(this.search)
        },
        doExportData(params) {
            let data = JSON.parse(JSON.stringify(params))
            data.pageSize = 1000 * 1000
            this.exportData(data)
        },
        ...mapMutations('PutInStorageOrder', [
            'CAHNGE_LOG_MODULE',
            'CLOSR_AUDIT_MODAL',
        ]),
        ...mapActions(['getAllwarehouse', 'getAllShop']),
        ...mapActions('PutInStorageOrder', [
            'getLog',
            'getButtonList',
            'invalid',
            'auditOrder',
            'confirmMark',
            'confirmPrint',
            'getPurchaseInList',
            'exportData',
            'startInspection'
        ]),
        // 打印入库单
        // async printStorage(data) {
        //     if (!data.length || data.length > 1) {
        //         message('warning', '请选择入库单并且只能选择一条!')
        //         return
        //     }
        //     let item = data[0]
        //     await this.$store.dispatch('PutInStorageOrder/getPutInStorageOrderDetail', { ticketCode: item.ticketCode, state: item.state })
        //     this.date = dateFormat(new Date())
        //     this.showModule = true
        // },
        handleChangeModule(show) {
            this.showModule = show
        },
        handleSelectionChange(data) {
            this.selectData = data
        },
        mark(ticketCode) {
            this.confirmMark({ ticketCode, params: this.search })
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
        handleSubmit(state) {
            if (!state && typeof state !== 'number') {
                 this.CLOSR_AUDIT_MODAL(state)
                return
            }
            const data = {
                ticketCode: this.ticketCode,
                type: state,
                params: this.search
            }
            this.auditOrder(data)
        }
    },
    // beforeRouteEnter(to, from ,next) {
    //     if (from.name === 'PutInStorageConent') {
    //         next(vm => {
    //             vm.search.pageNo = 1
    //             vm.getData()
    //         })
    //     }
    //     next()
    // },
    async created() {
        const item = getMenuID(this.$route.path)
        this.getButtonList(item)
        this.getData()
        this.getAllwarehouse()
    }
}
</script>
<style scoped lang="scss">

</style>