<template>
    <main>
        <search-content 
        :form="search"
        @doFilter="getData('data')"
        @doExport="doExport"
        @filterLog="filterLog"
        @auditAllAsin="auditAllAsin"
         />
        <div v-if="tableData.length">
           <table-content 
           :tableData="tableData" 
            @selectionData="selectionData"
           @auditAsin="auditAsin" 
           @invalidAsin="invalidAsin"/>
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
            :auditState="auditState" 
            :auditRemark="auditRemark"
            :auditModal="auditModal"
            />
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
    </main>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import AuditModal from '@/components/auditModal'
import SearchContent from './components/search'
import LogModule from '@/components/ActionLog'
import tableContent from './components/table'
import { mixin } from '@/mixins/common'
import { message } from '@/utils/common'
export default {
    name: 'AsinTransfer',
    mixins: [mixin],
    computed: {
        ...mapState('AsinTransfer', [
            'tableData',
            'logTableData',
            'checkData',
            'logTotal',
            'showLogModule',
            'ticketCode',
            'auditState',
            'total',
            'auditModal'
        ]),
        auditRemark: {
            get() {
                return this.$store.state.AsinTransfer.remark
            },
            set(val) {
                this.$store.state.AsinTransfer.remark = val
            }
        },
    },
    data() {
        return {
            search: {
                ticketCode: '',
                whouseId: '',
                shopId: '',
                asin: '',
                state: '',
                sku: '',
                pageNo: 1,
                pageSize: 20
            },
            status: 0
        }
    },
    components: {
        SearchContent,
        LogModule,
        tableContent,
        AuditModal
    },
    methods: {
        ...mapActions('AsinTransfer', [
            'getList',
            'getLog',
            'invalid',
            'audit'
        ]),
        ...mapMutations('AsinTransfer', [
            'CLOSR_AUDIT_MODAL',
            'CAHNGE_LOG_MODULE',
            'SELECT_DATA'
        ]),
        filterLog(params) {
            if (this.checkData.length > 1) {
                message('warning', '只能选择一条单据')
                return
            }
            if (this.checkData.length) {
                params.logId = this.checkData[0].ticketCode
            }
            this.getLog(params)
        },
        handleSubmit(state) {
            if (!state && typeof state !== 'number') {
                this.CLOSR_AUDIT_MODAL({ flag: state })
                return
            }
            this.audit({ params: this.search, status: this.status, type: state })
        },
        auditAllAsin() {
            if (!this.ticketCode) {
                message('warning', '请选择待审核的数据数据')
                return 
            }
            this.status = 1
            this.CLOSR_AUDIT_MODAL({ flag: true })
        },
        selectionData(items) {
            this.SELECT_DATA(items)
        },
        auditAsin(ticketCode) {
            console.log(ticketCode)
            this.status = 0
            this.SELECT_DATA(ticketCode)
            this.CLOSR_AUDIT_MODAL({ flag: true })
        },
        invalidAsin(ticketCode) {
            this.invalid({ ticketCode, params: this.search })
        },
        getData(arg) {
            arg ? this.search.pageNo = 1 : ''
            this.getList(this.search)
        },
        doExport() {

        },
    },
    mounted() {
        this.getData()
    }
}
</script>