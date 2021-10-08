<template> 
    <el-table 
    :data="tableData" 
    :max-height="maxHeight"
    @selection-change="selectionChange"
    style="width: 100%"
    >  
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="nt_order_id" label="订单编号" align="center">
            <template slot-scope="{row}">
                <router-link :to="`/order/ordercenter/goods/${row.nt_order_id}`">
                    <span class="blue-color">{{ row.nt_order_id }}</span>
                </router-link>
            </template></el-table-column>  
        <!-- <el-table-column prop="sku" label="SKU" align="center">    
        </el-table-column>   -->
        <el-table-column prop="shop_order_id" label="店铺单号" align="center" />
        <el-table-column prop="pick_batch_number" label="批次号" align="center" v-if="show"></el-table-column>          
        <el-table-column prop="logistics_mode_code" label="物流方式" align="center" />
        <el-table-column prop="logistics_provider_code" label="物流公司" align="center" />

        <el-table-column prop="warehouse" label="出货仓库" align="center" />
        <el-table-column prop="order_weight" label="重量（KG）" align="center" />
        <el-table-column prop="shop_name" label="卖家店铺简称" align="center"></el-table-column>    
        <el-table-column prop="sku_count" label="SKU种类" align="center" />
        <el-table-column prop="skus" label="SKU数量" align="center" />
        <el-table-column prop="shipping_fee" label="运费（RMB）" align="center" />
        <el-table-column prop="shipped_date" label="发货时间" align="center" v-if="showDate" />
        <el-table-column prop="track_num" label="物流跟踪号" align="center" />
        <el-table-column prop="dispatch_staff_name" label="派单人" align="center" />
        <el-table-column prop="dispatch_date" label="派单时间" align="center" />
  </el-table>
</template>
<script>
export default {
    name: 'TableContent',
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
        show: {
            type: Boolean,
            default: true
        },
        showshippedDate: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        showDate() {
            return this.show && this.showshippedDate
        }
    },
    data() {
        return {
            maxHeight: window.innerHeight - 230
        }
    },
    methods: {
        selectionChange(items) {
            this.$emit('selectionChange', items)
        }
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 230
        }
    }
}
</script>