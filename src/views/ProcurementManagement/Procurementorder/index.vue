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
            <el-form-item>
                <el-select v-model="search.state" filterable clearable  placeholder="请选择采购单状态">
                    <el-option
                        v-for="item in stateList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="search.instate" filterable clearable  placeholder="请选择入库状态">
                    <el-option
                        v-for="item in instateList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="" prop="" label-width="0">
                <el-input placeholder="请输入内容" v-model.trim="searchWord" clearable>
                    <template slot="prepend">
                        <el-select v-model="searchKey" placeholder="请选择" style="width: 120px">
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
            <el-form-item prop="sku">
                <el-input v-model.trim="search.sku" clearable placeholder="请输入SKU" />
            </el-form-item>
            <!-- <el-form-item prop="asin">
                <el-input v-model="search.asin" clearable placeholder="请输入ASIN" />
            </el-form-item> -->
            <el-form-item prop="supplier">
                <el-input v-model.trim="search.supplierName" placeholder="请输入供应商名称" clearable/>
            </el-form-item>
            <el-form-item>
                <div class="select-date-picker">
                    <el-select v-model="timeStatus"   placeholder="请选择时间方式">
                        <el-option label="制单时间" value="create" />
                        <el-option label="审核时间" value="audit" />
                        <el-option label="预计到货时间" value="arrivalDate" />
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
            <!-- <el-form-item prop="date">
                <el-date-picker
                    v-model="date"
                    type="daterange"
                    placeholder="请选择制单日期"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="制单日期"
                    end-placeholder="制单日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="checkDate">
                <el-date-picker
                    v-model="checkDate"
                    type="daterange"
                    placeholder="请选择审核时间"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="审核时间"
                    end-placeholder="审核时间">
                </el-date-picker>
            </el-form-item> -->
            <el-form-item label="" label-width="0">
                <search-btn-group @doFilter="getData('data')" @doReset="doReset(search)">
                    <el-button type="primary" size="mini" v-if="showButtons.log" style="margin-left: 0" @click="filterLog({ pageNo: 1, pageSize: 20 })">查看操作日志</el-button>
                    <el-button type="primary" size="mini" style="margin-left: 0" @click="exportData({ selectData })">导出</el-button>
                    <!-- <el-button type="primary" size="mini" style="margin-left: 0" @click="audit(selectData)">审核</el-button> -->
                </search-btn-group>
            </el-form-item>
        </el-form>
        <div v-if="tableData.length">
            <procurementorder-table 
            :tableData="tableData" 
            @handleSelectionChange="handleSelectionChange"
            :showButtons="showButtons"/>
            <change-page 
            :page="{size: search.pageSize, 
            page: search.pageNo}" 
            :total="total"
             @handleCurrentChange="changePage" 
             @handleSizeChange="changeSize" />
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
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import LogModule from '@/components/ActionLog'
import procurementorderTable from './components/table'
import auditModal from '@/components/auditModal'
import SearchBtnGroup from '@/components/SearchAction'
import { mixin } from '@/mixins/common'
import { message, getMenuID } from '@/utils/common'
import { toggleClass } from '@/utils'
export default {
    name: 'Procurementorder',
    mixins: [mixin],
    data() {
        return {
            search: {
                shopId: '', 
                // asin: '',
                whouseId: '',
                pageNo: 1,
                pageSize: 20,
                sku: '',
                supplierName: '',
            },
            timeStatus: 'create',
            ticketCode: null,
            searchWord: '',
            date: '',
            selectData: [],
            searchKey: 'ticketCode'
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
                case 'arrivalDate':
                    this.$delete(this.search, 'estimateArrivalDate1')
                    this.$delete(this.search, 'estimateArrivalDate2')
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
    components: {
        SearchBtnGroup,
        auditModal,
        LogModule,
        procurementorderTable
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
                    break;
                case 'arrivalDate':
                    this.$set(this.search, 'estimateArrivalDate1', startDate)
                    this.$set(this.search, 'estimateArrivalDate2', endDate)
            }
        },
        remoteMethod(query) {
            this.getAllShop(query)
        },
        handleSubmit(type) {
            if (!type && typeof type !== 'number') {
                this.CHANGE_MODULE(false)
                return
            }
            const data = {
                ticketCode: this.ticketCode,
                type,
                params: this.search
            }
            this.auditOrder(data)
        },
        audit(data) {
            if (!data.length) {
                message('warning', '请选择需要操作的单据')
                return
            }
            const list = data.filter(item => item.state === 10).map(item => item.ticketCode)
            if (!list.length || list.length > 1) {
                message('warning', '当前选择的单据不允许执行此项操作并且只能选择一条单据')
                return
            }
            this.ticketCode = list[0]
            this.CHANGE_MODULE(true)
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
        ...mapMutations('Procurementorder', [
            'CAHNGE_LOG_MODULE',
            'CHANGE_MODULE',
        ]),
        ...mapActions(['getAllShop', 'getAllwarehouse']),
        ...mapActions('Procurementorder', [
            'getLog',
            'getButtonList',
            'invalid',
            'exportData',
            'getPurchaseOrderList'
        ]),
        doReset(search) {
            for (let key in search) {
                if (key !== 'pageNo' && key !== 'pageSize') {
                    this.search[key] = ''
                }
            }
            this.date = ''
            this.searchWord = ''
        },
        getData(arg) {
            arg ? this.search.pageNo = 1 : ''
            this.getPurchaseOrderList(this.search)
        },
        handleSelectionChange(data) {
            this.selectData = data
        },     
    },
    computed: {
        ...mapState({
            loading: state => state.common.loading,
            shopList: state => state.common.shopList,
            waehouseList: state => state.common.waehouseList
        }),
        ...mapState('Procurementorder', [
            'tableData',
            'auditState',
            'logTotal',
            'showModule',
            'logTableData',
            'showLogModule',
            'total',
            'showButtons',
            'searchList',
            'instateList',
            'stateList',
        ]),
    },
    mounted() {
        const item = getMenuID(this.$route.path)
        this.getButtonList(item)
        this.getAllwarehouse()
        this.getData()
    }
}
</script>
