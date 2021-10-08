<template>
    <main>
        <search :search="search">
            <search-btn-group @doFilter="getData('data')" @doReset="doReset">
                <el-button type="primary" size="mini">转至待拣货</el-button>
                <el-button type="primary" size="mini">导出</el-button>
                <el-button type="primary" size="mini">操作日志</el-button>
            </search-btn-group>
      </search>
      <template v-if="total">
            <table-content :tableData="tableData" />
            <change-page 
            :page="{ page: search.pageNo, size: search.pageSize }" 
            :total="total" 
            @handleCurrentChange="changePage" 
            @handleSizeChange="changeSize" />
      </template>
      <no-data-content v-else />
    </main>
</template>
<script>
import search from '../components/search'
import TableContent from '../components/table'
import { mixin } from '@/mixins/common'
import { mapState } from 'vuex'
export default {
    components: {
        search,
        TableContent
    },
    mixins: [mixin],
    computed: {
        ...mapState('Order', {
            tableData: 'stockoutOrderTable',
            total: 'stockoutOrdertotal'
        })
    },
    data() {
        return {
            search: {
                orderNumber: null,
                sku: null,
                pageNo: 1,
                pageSize: 20
            }
        }
    },
    methods: {
        getData(arg) {

        }
    }
}
</script>