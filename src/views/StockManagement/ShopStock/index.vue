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
            <el-form-item prop="shopId2">
                <el-select 
                v-model.trim="search.shopId2"
                placeholder="请输入店铺名" 
                filterable 
                multiple
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
                <el-input v-model.trim="search.sku" placeholder="请输入SKU" clearable />
            </el-form-item>
            <el-form-item>
                <search-btn-group @doFilter="getData('data')" @doReset="doReset">
                    <el-button type="primary" size="mini" @click="exportDataShop(search)">导出</el-button>
                </search-btn-group>
            </el-form-item>
        </el-form>
        <div v-if="shopTotal">
           <table-data :tableData="tableData"/>
            <change-page 
            :page="{ page: search.pageNo, size: search.pageSize }" 
            :total="shopTotal" 
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
    name: 'ShopStock',
    computed: {
        ...mapState({
            loading: state => state.common.loading,
            shopList: state => state.common.shopList,
            tableData: state => state.Stock.shopTableData,
            waehouseList: state => state.common.waehouseList,
        }),
        ...mapState('Stock', [
            'shopTotal'
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
                shopId2: '',
                whouseId: '',
                sku: ''
            }
        }
    },
    methods: {
        remoteMethod(query) {
            this.getAllShop(query)
        },
        ...mapActions(['getAllwarehouse', 'getAllShop']),
        ...mapActions('Stock', [
            'getShopStockList',
            'exportDataShop'
        ]),
        getData(arg) {
            arg ? this.search.pageNo = 1 : ''
            this.getShopStockList(this.search)
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
