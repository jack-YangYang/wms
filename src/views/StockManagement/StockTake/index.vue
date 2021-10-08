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
            <el-form-item prop="shopId">
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
            </el-form-item>
            <!-- <el-form-item>
                <el-input v-model="search.sku" placeholder="请输入SKU" clearable />
            </el-form-item> -->
            <el-form-item>
                <el-input v-model.trim="search.ticketCode" placeholder="请输入单号" clearable />
            </el-form-item>
            <el-form-item>
                <el-select v-model="search.type" placeholder="请选择占用类型" clearable>
                    <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model.trim="search.sku" placeholder="请输入SKU" clearable />
            </el-form-item>
            <el-form-item>
                <search-btn-group @doFilter="getData('data')" @doReset="doReset" />
            </el-form-item>
        </el-form>
        <div v-if="takeTotal">
           <table-data :tableData="tableData"/>
            <change-page 
            :page="{ page: search.pageNo, size: search.pageSize }" 
            :total="takeTotal" 
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
import { clearSearch } from '@/utils/common'
export default {
    name: 'StockTake',
    computed: {
        ...mapState({
            loading: state => state.common.loading,
            shopList: state => state.common.shopList,
            tableData: state => state.Stock.takeTableData,
            waehouseList: state => state.common.waehouseList,
        }),
        ...mapState('Stock', [
            'typeList',
            'takeTotal'
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
                shopId: '',
                pageSize: 20,
                whouseId: '',
                ticketCode: '',
                type: '',
                sku: ''
            }
        }
    },
    methods: {
        remoteMethod(query) {
            this.getAllShop(query)
        },
        doReset() {
            clearSearch(this.search, [
                'pageNo',
                'pageSize'
            ])
        },
        ...mapActions(['getAllwarehouse', 'getAllShop']),
        ...mapActions('Stock', [
            'getTakeList'
        ]),
        getData(arg) {
            arg ? this.search.pageNo = 1 : ''
            this.getTakeList(this.search)
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
