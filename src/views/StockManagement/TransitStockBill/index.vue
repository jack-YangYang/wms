<template>
    <main>
        <el-form inline>
            <el-form-item>
                <el-select v-model="whouseId" placeholder="请选择仓库" clearable filterable>
                    <el-option v-for="item in waehouseList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select 
                v-model.trim="search.shopId"
                placeholder="请输入店铺" 
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
            <el-form-item>
                <el-input v-model="sku" placeholder="请输入SKU" clearable />
            </el-form-item>
            <el-form-item>
                <el-date-picker
                    v-model="date"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button @click="getData('data')" size="mini" type="primary">搜索</el-button>
                <el-button @click="doReset" size="mini" type="primary">重置</el-button>
                <el-button @click="exportData({search, whouseId, sku, isTrans: true})" size="mini" type="primary">导出</el-button>
            </el-form-item>
        </el-form>
        <template v-if="!total">
           <table-list 
           :tableData="tableData"
           @selectionChange="selectionChange"
            />
            <!-- <change-page 
            :page="{ page: search.pageNo, size: search.pageSize }" 
            :total="total" 
            @handleCurrentChange="changePage" 
            @handleSizeChange="changeSize" /> -->
        </template>
        <no-data-content v-else />
    </main>
</template>
<script>
import { debounce, message } from '@/utils/common'
import { mixin } from '@/mixins/common'
import tableList from '../StockBill/components/table'
import { mapState, mapActions, mapMutations  } from 'vuex'
export default {
    mixins: [mixin],
    data() {
        return {
            search: {
                // pageNo: 1,
                // pageSize: 20,
                shopId: '',           
            },
            whouseId: '',
            sku: '',
            date: ''
        }
    },
    components: {
        tableList
    },
    watch: {
        date(val) {
            let date = val ? val : ''
            this.$set(this.search, 'startDate', date ? date[0] : date)
            this.$set(this.search, 'endDate', date ? date[1] : date)
        }
    },
    computed: {
        ...mapState({
            total: state => state.StockBill.transTotal,
            tableData: state => state.StockBill.transTable,
            loading: state => state.common.loading,
            shopList: state => state.common.shopList,
            waehouseList: state => state.common.waehouseList,
        }),
    },
    methods: {
        ...mapActions(['getAllShop', 'getAllwarehouse']),
        ...mapActions('StockBill', [
             'getList',
             'exportData'
        ]),
        // ...mapMutations('StockBill', {
        //     exportData: 'EXPORT_DATA'
        // }),
        selectionChange() {

        },
        doReset() {
            this.whouseId = ''
            this.sku = ''
            this.search.shopId = ''
            this.date = ''
        },
        getData(arg) {
            // arg ? this.search.pageNo = 1 : ''
            if (!this.whouseId || !this.date) {
                message('warning', '请选择仓库,时间段或店铺查询出入库记录')
                return
            }
            this.getList({ whouseId: this.whouseId, sku:this.sku || 0, params:this.search, isTrans: true })
        },
        remoteMethod(query) {
            debounce(() => {
                this.getAllShop(query)
            }, 500)
        }
    },
    mounted() {
        this.getAllwarehouse()
        // this.getData()
    }
}
</script>