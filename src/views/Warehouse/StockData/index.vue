<template>
    <main>
        <el-form :model="search" inline>
            <el-form-item label="仓库名称:">
                <el-input v-model.trim="search.whouseName" clearable placeholder="请输入仓库名称" />
            </el-form-item>
            <el-form-item label="sku:">
                <el-input v-model.trim="search.sku" clearable placeholder="请输入sku" />
            </el-form-item>
            <el-form-item label="库位编号:">
                <el-input v-model.trim="search.spaceCode" clearable placeholder="请输入库位编号" />
            </el-form-item>
            <el-form-item label="供应商:">
                <el-input v-model.trim="search.supplierName" clearable placeholder="请输入供应商" />
            </el-form-item>
            <el-form-item>
                <action-group @doFilter="getData" @doReset="doReset" />
            </el-form-item>
        </el-form>
        <div  v-if="stockTotal" >
            <table-list />
            <change-page 
            :page="{size: search.pageSize, 
            page: search.pageNo}" 
            :total="stockTotal"
             @handleCurrentChange="changePage" 
             @handleSizeChange="changeSize" />
        </div>
        <no-data-content v-else />
    </main>
</template>
<script>
import ActionGroup from '@/components/SearchAction'
import NoDataContent from "@/components/NoDataImages"
// import page from '@/components/page'
import { mixin } from '@/mixins/common'
import tableList from './components/list-table'
import { mapState, mapActions } from 'vuex'
export default {
    components: {
        ActionGroup,
        NoDataContent,
        tableList
    },
    mixins: [mixin],
    computed: {
        ...mapState('Warehouse', ['stockTableData', 'stockTotal'])
    },
    data() {
        return {
            search: {
                supplierName: '',
                spaceCode: '',
                pageSize: 20,
                pageNo: 1,
                sku: '',
                whouseName: '',
            }
        }
    },
    methods: {
        getData(arg) {
            arg ? this.search.pageNo = 1 : ''
            this.getStockData(this.search)
        },
        changeSize(size) {
            if (this.stockTableData.length >= this.total && size > this.search.pageSize) return
            this.search.pageSize = size
            this.getData('data')
        },
        ...mapActions('Warehouse', [
            'getStockData'
        ])
    },
    mounted() {
        this.getData()
    }
}
</script>