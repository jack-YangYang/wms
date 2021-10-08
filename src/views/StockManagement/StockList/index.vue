<template>
    <main>
        <el-form ref="form" :model="search" label-width="80px" inline >
            <el-form-item>
                <el-select v-model="search.whouseId" filterable clearable  placeholder="请选择仓库">
                    <el-option
                        v-for="item in waehouseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model.trim="search.sku" placeholder="请输入SKU" clearable />
            </el-form-item>
            <el-form-item>
                <search-btn-group @doFilter="getData('data')" @doReset="doReset">
                    <el-button type="primary" size="mini" @click="exportData(search)">导出</el-button>
                </search-btn-group>
            </el-form-item>
        </el-form>
        <div v-if="total">
           <table-data :tableData="tableData"/>
            <change-page 
            :page="{ page: search.pageNo, size: search.pageSize }" 
            :total="total" 
            @handleCurrentChange="changePage" 
            @handleSizeChange="changeSize" />
        </div>
        <no-data-content v-else />
    </main>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import tableData from './components/table'
import { mixin } from '@/mixins/common'
export default {
    name: 'Stocklist',
    computed: {
        ...mapState({
            waehouseList: state => state.common.waehouseList,
        }),
        ...mapState('Stock', [
            'tableData',
            'total'
        ])
    },
    mixins: [mixin],
    components: {
        tableData
    },
    data() {
        return {
            search: {
                pageNo: 1,
                pageSize: 20,
                whouseId: '',
                sku: ''
            }
        }
    },
    methods: {
        ...mapActions(['getAllwarehouse']),
        ...mapActions('Stock', [
            'getList',
            'exportData'
        ]),
        getData(arg) {
            arg ? this.search.pageNo = 1 : ''
            this.getList(this.search)
        }
    },
    mounted() {
        this.getAllwarehouse()
        this.getData()
    }
}
</script>

<style>

</style>
