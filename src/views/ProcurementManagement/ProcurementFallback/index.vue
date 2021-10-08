<template>
    <main>
        <el-form ref="form" :model="search"  inline>
            <el-form-item>
                <el-select v-model="search.whouseId" placeholder="请选择仓库" clearable filterable>
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
                <el-input placeholder="请输入内容" v-model.trim="searchWord" clearable>
                    <template slot="prepend">
                        <el-select v-model="searchKey"  placeholder="请选择" style="width: 120px">
                            <el-option :label="value" :value="key" v-for="(value, key) in searchKeyList" :key="key" />
                        </el-select>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="search.state" placeholder="请选择单据状态" clearable>
                    <el-option :label="value.name" :value="key" v-for="(value, key) in stateList" :key="key" />
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
                <el-input placeholder="请输入供应商名称" clearable v-model.trim="search.supplierName" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" @click="getData('data')">搜 索</el-button>
                <el-button type="primary" size="mini" @click="doRest(search)">重 置</el-button>
                <el-button type="primary" size="mini" @click="doExport(search)">导 出</el-button>
                <el-button type="primary" size="mini" @click="filterLog({ pageNo: 1, pageSize: 20 })" v-if="showButtons.log">操作日志</el-button>
                <el-button 
                type="primary" 
                v-if="showButtons.add"
                size="mini" 
                @click="$router.push({ name: 'fallbackContent', query: { type: 'add' } })">新 增</el-button>
            </el-form-item>
        </el-form>
        <div v-if="tableData.length">
            <fallback-table 
            @doAudit="doAudit"
            @printOrder="printOrder"
            @selectionChange="selectionChange"
            :showButtons="showButtons"
            @doInvalid="doInvalid"
            :tableData="tableData"
             />
            <change-page 
            :page="{ size: search.pageSize, page: search.pageNo }" 
            :total="total" 
            @handleCurrentChange="changePage" 
            @handleSizeChange="changeSize"  />
        </div>
        <no-data-content v-else />
        <transition name="fade-transform" mode="out-in"> 
            <log-module
            v-if="showLogModule" 
            @getLog="filterLog"
            :total="logTotal"
            :logTableData="logTableData"
            @handleSubmit="CAHNGE_LOG_MODULE"
            :showLogModule="showLogModule"
            />
        </transition>
        <transition name="fade-transform" mode="out-in">
            <procurement-documents 
            @handleChangeModule="handleChangeModule"
            @confirmPrint="confirmPrint"
            title="采购回退单"
            v-if="showBarcodeModule" 
            component="fallbackTable"
            :showModule="showBarcodeModule" 
            :detail="detail" 
            :detailItems="detailItems" 
            :date="printDate" />
        </transition>
        <transition name="fade-transform" mode="out-in"> 
            <audit-modal
            v-if="showModule" 
            value="审核不通过"
            @handleSubmit="handleSubmit"
            :auditState="auditState"
            :auditModal="showModule"
            />
        </transition>
    </main>
</template>
<script>
import fallbackTable from './components/fallbackTable'
import auditModal from '@/components/auditModal'
import LogModule from '@/components/ActionLog'
import { mixin } from '@/mixins/common'
import NoDataContent from '@/components/NoDataImages'
import ProcurementDocuments from '@/components/ProcurementDocuments/PutInStorageOrderPrint'
import { mapState, mapActions, mapMutations } from 'vuex'
import { clearSearch, getMenuID, dateFormat  } from '@/utils/common'
export default {
    computed: {

         ...mapState({
            stateList: state => state.ProcurementFallback.colorList,
            loading: state => state.common.loading,
            shopList: state => state.common.shopList,
            waehouseList: state => state.common.waehouseList,
        }),
        ...mapState('ProcurementFallback', [
            'tableData',
            'detail',
            'detailItems',
            'showBarcodeModule',
            'showLogModule',
            'logTotal',
            'logTableData',
            'showModule',
            'showButtons',
            'searchKeyList',
            'total',
            'auditState'
        ])
    },
    mixins: [ mixin ],
    components: {
        fallbackTable,
        ProcurementDocuments,
        auditModal,
        LogModule,
        NoDataContent
    },
    data() {
        return {
            search: {     
                pageNo: 1,
                whouseId: '',
                shopId: '',
                pageSize: 10,
                state: '',
                whouseId: '',
            },
            printDate: '',
            selectData: [],
            timeStatus: 'create',
            date: '',
            searchWord: '',
            searchKey: 'ticketOrder'
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
        searchWord(val) {
            this.$set(this.search, this.searchKey, val)
        },
        searchKey(newValue, oldValue) {
            this.$delete(this.search, oldValue) // 先删除原来的，避免新增
            this.$set(this.search, newValue, this.searchWord)
        }
    },
    methods: {
        selectionChange(data) {
            this.selectData = data
        },
        handleChangeModule() {
            this.changeBarcoeModule()
        },
        confirmPrint(ticketCode) {
            this.printOrderLog(ticketCode)
        },
        printOrder(ticketCode) {
            this.printDate = dateFormat(new Date())
            this.getTicketInfo({ ticketCode, type: true })
        },
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
        ...mapActions(['getAllwarehouse', 'getAllShop']),
        ...mapActions('ProcurementFallback', ['getList', 
        'checkOrder', 
        'drop', 
        'exportList', 
        'getLog', 
        'getButtonList', 
        'printOrderLog',
        'getTicketInfo']),
        ...mapMutations('ProcurementFallback', {
            doAudit: 'DO_AUDIT',
            changeBarcoeModule: 'CLEAR_DATA',
            CAHNGE_LOG_MODULE: 'CAHNGE_LOG_MODULE'
        }),
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
        remoteMethod(query) {
            this.getAllShop(query)
        },
        doRest(form) {
            clearSearch(form, ['pageSize', 'pageNo'])
            this.date = ''
            this.searchWord = ''
        },
        getData(params) {
            params ? this.search.pageNo = 1 : ''
            this.getList(this.search)
        },
        doExport(params) {
            let data = JSON.parse(JSON.stringify(params))
            data.pageSize = 1000 * 1000
            this.exportList(data)
        },
        handleSubmit(type) {
            if (!type && typeof type !== 'number') {
                this.doAudit(type)
                return
            }
            this.checkOrder({ type, query: this.search })
        },
        doInvalid(ticketCode) {
            this.drop({ ticketCode, query: this.search })
        },
    },
    async mounted() {
        const item = getMenuID(this.$route.path)
        this.getButtonList(item)
        this.getAllwarehouse()
        this.getData()
    }
}
</script>