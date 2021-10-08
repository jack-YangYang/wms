<template>
    <main>
        <search-content 
        class="search-content" 
        @allAudit="allAudit"
        @filterLog="filterLog"
        @doFilter="getData('data')"
        :showButtons="showButtons"
        @doExport="doExport"
        :form="search" />
        <div v-if="tableData.length">
           <table-content :tableData="tableData"  @invalid="invalid" @audit="audit" />
            <change-page 
            :page="{ page:search.pageNo, size: search.pageSize }" 
            :total="total"
            @handleCurrentChange="changePage"
            @handleSizeChange="changeSize"  />
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
import TableContent from './components/table'
import SearchContent from './components/search'
import AuditModal from '@/components/auditModal'
import LogModule from '@/components/ActionLog'
import NoDataContent from '@/components/NoDataImages'
import { mixin } from '@/mixins/common'
import { mapState, mapMutations, mapActions } from 'vuex'
import { message, getMenuID } from '@/utils/common'
export default {
    components: {
        SearchContent,
        TableContent,
        NoDataContent,
        LogModule,
        AuditModal
    },
    data() {
        return {
            search: {
                pageSize: 20,
                pageNo: 1,
                ticketCode: '',
                createUserName: '',
                checkUserName: '',
                remark: '',
                shopId: '',
                whouseId: '',
                state: '',
                type: '',
                sku: '',
            }
        }
    },
    mixins: [ mixin ],
    computed: {
        ...mapState('OtherOut', ['total', 
        'tableData', 
        'showLogModule',
        'logTotal',
        'logTableData',
        'auditState', 
        'checkData',
        'auditModal', 
        'showButtons',
        'ticketCode' ])
    },
    methods: {
        ...mapMutations('OtherOut', {
            changeModule: 'CLOSR_AUDIT_MODAL',
            CAHNGE_LOG_MODULE: 'CAHNGE_LOG_MODULE'
        }),
        ...mapActions(['getAllwarehouse']),
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
        ...mapActions('OtherOut', ['getList', 'auditTransfer', 'getLog', 'invalidTransfer', 'getButtonList']),
        doExport() {
            let data = JSON.parse(JSON.stringify(this.search))
            data.pageSize = 1000 * 1000
            this.$store.dispatch('OtherOut/exportData', data)
        },
        doAdd() {
            this.$router.push({
                name: 'AddOtherOut',
            })
        },
        /* 批量审核 */
        allAudit() {
            this.changeModule({ type: true })     
        },
        invalid(ticketCode) {
            this.invalidTransfer({ ticketCode, params: this.search })
        },
        /* 确定审核 */
        handleSubmit(type) {
            if (!type && typeof type !== 'number') {
                this.changeModule({ flag: false })
                return
            }
            this.auditTransfer({ type, params: this.search })
        },
        audit(code) {
            this.changeModule({ type: true, code })
        },
        getData(arg) {
            arg ? this.search.pageNo = 1 : ''
            this.getList(this.search)
        }
    },
    async mounted() {
        const item = getMenuID(this.$route.path)
        this.getButtonList(item)
        this.getData()  
        this.getAllwarehouse()  
    }
}
</script>
<style scoped lang="scss">
.main {
    .search-content {
        button {
            margin-left: 0;
        }
    }
}
</style>