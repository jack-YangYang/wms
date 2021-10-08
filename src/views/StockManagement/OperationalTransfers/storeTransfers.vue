<template>
    <main>
        <el-form inline>
            <el-form-item>
                <el-input v-model="search.ticketCode" placeholder="请输入单号" clearable />
            </el-form-item>
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
            <el-form-item>
                <el-select 
                v-model="search.sourceShopId"
                placeholder="请输入调出店铺" 
                filterable 
                style="width: 100%" 
                clearable 
                remote
                :loading="loading"
                :remote-method="remoteMethod"
                >
                    <el-option v-for="item in shopList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select 
                v-model="search.distShopId"
                placeholder="请输入调入店铺" 
                filterable 
                style="width: 100%" 
                clearable 
                remote
                :loading="loading"
                :remote-method="remoteMethod"
                >
                    <el-option v-for="item in shopList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item>
                <el-select v-model="search.state" placeholder="请选择状态" clearable filterable>
                    <el-option v-for="(value, key) in stateList" :label="value.name" :value="key" :key="key" />
                </el-select>
            </el-form-item> -->
            <!-- <el-form-item>
                <el-select v-model="search.brother" placeholder="请选择是否为同胞店铺" clearable>
                    <el-option v-for="item in brotherList" :label="item.name" :value="item.val" :key="item.val" />
                </el-select>
            </el-form-item> -->
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
                    <!-- <el-button size="mini" type="primary">导出</el-button> -->
                    <!-- <router-link to="/stock/operationaltransfers/add">
                        <el-button size="mini" type="primary">新增</el-button>
                    </router-link> -->
                    <!-- <el-button size="mini" type="primary">操作日志</el-button> -->
                </search-btn-group>
            </el-form-item>
        </el-form>
        <div v-if="storeTotal">
           <table-list 
           @doAudit="doAudit"
           :showButtons="showButtons"
           :tableData="storeTableData"
            />
            <change-page 
            :page="{ page: search.pageNo, size: search.pageSize }" 
            :total="storeTotal" 
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
    </main>
</template>
<script>
import tableList from './components/table'
import AuditModal from '@/components/auditModal'
import { mapState, mapActions, mapMutations } from 'vuex'
import { mixin } from '@/mixins/common'
import { confirmMsg, getMenuID, clearSearch } from '@/utils/common'
export default {
    computed: {
        ...mapState('OperationalTransfers', [
            'stateList',
            'showButtons',
            'auditState',
            'auditModal',
            'brotherList',
            'storeTotal',
            'storeTableData'
        ]),
        ...mapState({
            loading: state => state.common.loading,
            shopList: state => state.common.shopList,
            waehouseList: state => state.common.waehouseList,
        }),
    },
    components: {
        tableList,
        AuditModal
    },
    mixins: [mixin],
    data() {
        return {
            search: {
                ticketCode: '',
                distWhouseId: '',
                sourceWhouseId: '',
                sourceShopId: '',
                distShopId: '',
                state: 30,
                // brother: '',
                sku: '',
                asin: '',
                pageNo: 1,
                pageSize: 20
            },
            ticketCode: null,
            timeStatus: 'create',
            date: ''
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
        handleSubmit(state) {
            if (!state && typeof state !== 'number') {
                this.CAHNGE_AUDIT_MODAL(state)
                return
            }
            let data = {
                ticketCode: this.ticketCode,
                type: state
            }
            this.storeAudit({ data, params: this.search })
        },
        doReset() {
            this.date = null
            this.searchWord = null
            clearSearch(this.search, ['pageNo', 'pageSize', 'state'])
        },
        doAudit(ticketCode) {
            this.ticketCode = ticketCode
            this.CAHNGE_AUDIT_MODAL(true)
        },  
        remoteMethod(query) {
            this.getAllShop(query)
        },
        getData(arg) {
            arg ? this.search.pageNo = 1 : ''
            this.getStoreData(this.search)
        },

        ...mapActions(['getAllShop', 'getAllwarehouse']),
        ...mapActions('OperationalTransfers', ['getStoreData', 'storeAudit', 'getButtonList']),
        ...mapMutations('OperationalTransfers', ['CAHNGE_AUDIT_MODAL']),
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
    },
    mounted() {
        const item = getMenuID(this.$route.path)
        this.getButtonList(item)
        this.getAllwarehouse()
        this.getData()
    }
}
</script>