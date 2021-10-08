<template>
    <main>
        <search-content 
        class="search-content" 
        @doExport="doExport"
        @doFilter="getData('data')"
        @filterLog="filterLog"
        @doAdd="doAdd"
        @allAudit="allAudit"
        :showButtons="showButtons"
        :form="search"/>
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
import NoDataContent from '@/components/NoDataImages'
import LogModule from '@/components/ActionLog'
import { mixin } from '@/mixins/common'
import { mapState, mapMutations, mapActions } from 'vuex'
import { message, getMenuID } from '@/utils/common'
export default {
    components: {
        SearchContent,
        TableContent,
        LogModule,
        NoDataContent,
        AuditModal
    },
    data() {
        return {
            search: {
                ticketCode: '',
                createUserName: '',
                checkUserName: '',
                shopId: '',
                remark: '',
                whouseId: '',
                state: '',
                sku: '',
                pageNo: 1,
                pageSize: 20
            }
        }
    },
    mixins: [ mixin ],
    computed: {
        ...mapState('OtherIn', ['total', 
        'tableData', 
        'logTotal',
        'logTableData',
        'showLogModule',
        'auditState', 
        'checkData',
        'auditModal', 
        'showButtons',
        'ticketCode' ])
    },
    methods: {
        ...mapMutations('OtherIn', {
            doReset: 'DO_RESET',
            CAHNGE_LOG_MODULE: 'CAHNGE_LOG_MODULE',
            changeModule: 'CLOSR_AUDIT_MODAL'
        }),
        ...mapActions('OtherIn', [
            'auditTransfer',
            'getLog',
            'invalidTransfer'
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
        ...mapActions(['getAllwarehouse']),
        ...mapActions('Outbound', ['getTypeList']),
        ...mapActions('OtherIn', ['getList', 'getButtonList']),
        doExport() {
            let data = JSON.parse(JSON.stringify(this.search))
            data.pageSize = 1000 * 1000
            this.$store.dispatch('OtherIn/exportData', data)
        },
        doAdd() {
            this.$router.push({
                name: 'AddOtherIn',
                query: {
                    type: 'add'
                }
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
                this.changeModule({ type: false })
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
            // this.$store.dispatch('OtherIn/getData', this.newPages)
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