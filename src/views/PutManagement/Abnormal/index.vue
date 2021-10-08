<template>
    <div class="main">
        <el-form :model="search" inline label-width="100px">
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
            <el-form-item label-width="0">
                <el-input v-model.trim="searchWord" clearable placeholder="搜索内容">
                    <template slot="prepend">
                        <el-select v-model="searchKey"    placeholder="请选择" style="width: 120px">
                            <el-option
                            v-for="item in searchList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            ></el-option>
                        </el-select>
                    </template>
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="timeStatus">
                <div class="select-date-picker">
                    <el-select v-model="timeStatus"   placeholder="请选择时间方式">
                        <el-option
                            v-for="item in timeList"
                            :key="item.value"
                            :label="item.label"
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
                <el-select v-model="search.resolved" clearable  placeholder="请选择异常状态">
                    <el-option label="已解决" :value="1"/>
                    <el-option label="未解决" :value="0"/>
                </el-select>
            </el-form-item>
            <el-form-item prop="supplier">
                <el-input v-model.trim="search.supplierName" placeholder="请输入供应商名称" clearable/>
            </el-form-item>
            <el-form-item label-width="0">
                 <search-btn-group @doFilter="getData('data')" @doReset="doReset">
                     <el-button type="primary" size="small" @click="exportData(search)">导出</el-button>
                     <el-button type="primary" size="mini" @click="filterLog({ pageNo: 1, pageSize: 20 })" v-if="showButtons.log">操作日志</el-button>
                 </search-btn-group>
            </el-form-item>
        </el-form>
        <div v-if="tableData.length">
            <procurementorder-table 
            :showButtons="showButtons"
            @startSoveAbnormal="startSoveAbnormal"
            :tableData="tableData"
            @selectionChange="selectionChange"
            @doEdit="doEdit"
            @solveAbnormal="solveAbnormal"
            />
            <change-page 
            :page="{ page:search.pageNo, size: search.pageSize }"
            :total="total" 
            @handleCurrentChange="changePage" 
            @handleSizeChange="changeSize"  />
        </div>
        <no-data-content v-else />
        <transition name="fade-transform" mode="out-in"> 
            <solve-abnormal-module 
            @handleSolveAbnormal="handleSolveAbnormal"
            v-if="showModule"/>
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
import { mixin } from '@/mixins/common'
import LogModule from '@/components/ActionLog'
import solveAbnormalModule from './components/solve-abnormal-module'
import procurementorderTable from './components/abnormal-table'
import NoDataContent from '@/components/NoDataImages'
import { message, debounce, getMenuID } from '@/utils/common'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
    name: 'Procurementorder',
    mixins: [ mixin ],
    components: {
        procurementorderTable,
        LogModule,
        NoDataContent,
        solveAbnormalModule
    },
    watch: {
        timeStatus(newValue, oldValue) {      
            switch(oldValue) {
                case 'qa':
                    this.$delete(this.search, 'qaStartDate')
                    this.$delete(this.search, 'qaEndDate')
                    break;
                case 'reslove':
                    this.$delete(this.search, 'resolvedStartDate')
                    this.$delete(this.search, 'resolvedEndDate')
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
    computed: {
        ...mapState('Abnormal', [
            'tableData',
            'showButtons',
            'logTotal',
            'logTableData',
            'showLogModule',
            'timeList',
            'total',
            'searchList'
        ]),
        ...mapState({
            loading: state => state.common.loading,
            shopList: state => state.common.shopList,
            waehouseList: state => state.common.waehouseList,
            showModule: state => state.Abnormal.showAbnormalModule,
        }),
    },
    data() {
        return {
            search: {
                pageNo: 1,
                pageSize: 10,
                supplierName: '',
                shopId: '',
                resolved: '',
                whouseId: '',         
            },
            selectData: [],
            date: '',
            timeStatus: 'resolve',
            searchWord: '',
            searchKey: 'ticketCode',
        }
    },
    methods: {
        changeTime(val) {
            let startDate = this.date ? this.date[0] : ''
            let endDate = this.date ? this.date[1] : ''
            switch(val) {
                case 'qa':
                    this.$set(this.search, 'qaStartDate', startDate)
                    this.$set(this.search, 'qaEndDate', endDate)
                    break;
                case 'resolve':
                    this.$set(this.search, 'resolvedStartDate', startDate)
                    this.$set(this.search, 'resolvedEndDate', endDate)
            }
        },
        startSoveAbnormal(ticketCode) {
            this.startSolve({ ticketCode, parmas: this.search })
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
        remoteMethod(query) {
            this.getAllShop(query)
        },
       /* 获取数据 */
        handleSelect(item) {
            this.search.warehouseName = item.whouseName
            this.search.warehouseId = item.whouseId
        },
        ...mapMutations('Abnormal', {
            doEdit: 'CAHNGE_MODULE',
            CAHNGE_LOG_MODULE: 'CAHNGE_LOG_MODULE'
        }),
        handleSolveAbnormal(form) {
            this.solve({ form, params: this.search })
        },
        /* 修改 */
        ...mapActions(['getAllwarehouse', 'getAllShop']),
        ...mapActions('Abnormal', [
            'solveAbnormalAction', 
            'exportData', 
            'solve', 
            'getButtonList', 
            'startSolve',
            'getList', 
            'getLog']),
        /* 解决异常 */
        solveAbnormal(item) {
            this.solveAbnormalAction({item, params: this.search})
        },
        getData(arg) {
            arg ? this.search.pageNo = 1 : ''
            this.getList(this.search)
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
        align-items: center;
         & > div {
            display: flex;
            align-items: center;
            margin-right: 15px;
         }
    }
}
</style>