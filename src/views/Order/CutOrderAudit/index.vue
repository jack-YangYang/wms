<template>
    <main>
        <el-form inline>
            <el-form-item>
                <el-input placeholder="请输入订单编号" v-model="search.nt_order_id" clearable filterable />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="请输入店铺编号" v-model="search.shop_order_id" clearable filterable />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="请输入操作人姓名" v-model="search.handler_staff_name" clearable>
                    <el-select v-model="search.handler_type"   placeholder="请选择处理人" slot="prepend" style="width:120px">
                        <el-option label="发起人" value="发起人" />   
                        <el-option label="审核人" value="审核人" />         
                    </el-select>
                </el-input>
            </el-form-item>
            <!-- <el-form-item>
                
            </el-form-item> -->
            <el-form-item>
                <el-input placeholder="请输入SKU" v-model="search.sku" clearable />
            </el-form-item>
            <el-form-item>
                <div class="select-date-picker">
                    <el-select v-model="search.handler_date_type"   placeholder="请选择时间方式">
                        <el-option label="发起时间" value="发起时间" />   
                        <el-option label="审核时间" value="审核时间" />         
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
                <el-select v-model="search.prevent_status" placeholder="请选择单据状态" clearable>
                    <el-option label="待审核" :value="2" />
                    <el-option label="审核通过" :value="3" />
                    <el-option label="驳回" :value="4" />
                </el-select>
            </el-form-item>
            <search-btn-group @doFilter="getData('data')" @doReset="doReset">
                <el-button type="primary" size="mini" @click="auitPass(search)" v-if="showButtons.audit">审核通过</el-button>
                <el-button type="primary" size="mini" @click="getOrderLog(curSelectData)" v-if="showButtons.log">操作日志</el-button>
                <el-button type="primary" size="mini" @click="reject({ type: true })" v-if="showButtons.reject">驳回</el-button>
            </search-btn-group>
        </el-form>
        <template v-if="total">
                <table-content :tableData="tableData" @selectionChange="selectionChange" :showshippedDate="false" />
                <change-page 
                :page="{ page: search.page_num, size: search.page_size }" 
                :total="total" 
                @handleCurrentChange="changePage" 
                @handleSizeChange="changeSize" />
        </template>
        <no-data-content v-else />
         <transition name="fade-transform" mode="out-in">
            <reject-module v-if="showRejectModule" :params="search" />
        </transition>
        <transition name="fade-transform" mode="out-in">
            <log-module v-if="showLogModule" />
        </transition>
    </main>
</template>
<script>
import search from '../components/search'
import TableContent from './components/table'
import rejectModule from './components/rejectModule'
import logModule from '../components/logModule'
import { orderMixin } from '@/mixins/common'
import { mapState, mapActions, mapMutations } from 'vuex'
import { getMenuID, setTime } from '@/utils/common'
export default {
    name: 'CutOrderAudit',
    components: {
        search,
        TableContent,
        rejectModule,
        logModule
    },
    watch: {
        date(val) {
            this.$set(this.search, 'handler_date_start', val ? val[0] : '')
            this.$set(this.search, 'handler_date_end', setTime(val))
        }
    },
    mixins: [orderMixin],
    computed: {
        ...mapState('Order', {
            tableData: 'cutOrderAuditTable',
            showButtons: 'showButtons',
            showRejectModule: 'showRejectModule',
            total: 'cutOrderAuditTotal',
            curSelectData: 'curSelectData',
            showLogModule: 'showLogModule'
        })
    },
    data() {
        return {
            search: {
                nt_order_id: null,
                handler_type: '发起人',
                handler_date_type: '发起时间',
                prevent_status: null,
                handler_staff_name: null,
                shop_order_id: null,
                // logistics_provider_code: null,
                // logistics_mode_code: null,
                // pick_batch_number: null,
                // track_num: null,
                // order_type: null,
                sku: null,
                page_num: 1,
                page_size: 20
            },
            date: '',
        }
    },
    methods: {
        ...mapActions([
            'getAllProvideList',
            'getAllShipList'
        ]),
        ...mapActions('Order', [
            'getPreventList',
            'getButtonList',
            'auitPass',
            'getOrderLog'
        ]),
        ...mapMutations('Order', {
            reject: 'CHANGE_REJECT_MODULE',
            selectionChange: 'SELECT_CUT_ORDER_DATA'
        }),
        getData(arg) {
            arg ? this.search.page_num = 1 : ''
            this.getPreventList(this.search)
        }
    },
    mounted() {
        const item = getMenuID(this.$route.path)
        this.getButtonList(item)
        this.getAllProvideList()
        this.getAllShipList()
        this.getData()
    }
}
</script>