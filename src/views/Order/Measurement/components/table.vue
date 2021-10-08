<template> 
    <el-table 
    :data="tableData" 
    :max-height="maxHeight"
    style="width: 100%"
    @selection-change="selectionChange"
    >  
        <el-table-column type="selection" width="50" align="center" />
        <!-- <el-table-column prop="nt_order_id" label="订单编号" align="center"></el-table-column>   -->
        <el-table-column prop="nt_order_id" label="订单编号" align="center">
            <template slot-scope="{row}">
                <router-link :to="`/order/ordercenter/goods/${row.nt_order_id}`">
                    <span class="blue-color" type="text">{{ row.nt_order_id }}</span>
                </router-link>
            </template>
        </el-table-column>  
        <el-table-column prop="shop_order_id" label="店铺单号" align="center" />
        <el-table-column prop="pick_batch_number" label="批次号" align="center" show-overflow-tooltip />
        <el-table-column prop="order_type" label="订单状态" align="center">
            <template slot-scope="{row}">
                <span :style="{ color: getColor(row.order_type) }">{{ row.order_type }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="logistics_mode_code" label="物流方式" align="center" show-overflow-tooltip />
        <el-table-column prop="logistics_provider_code" label="物流公司" align="center" />
        <el-table-column prop="warehouse" label="出货仓库" align="center" show-overflow-tooltip />
        <el-table-column prop="order_weight" label="重量（KG）" align="center" />
        <el-table-column prop="shop_name" label="卖家店铺简称" align="center" show-overflow-tooltip></el-table-column>    
        <!-- <el-table-column prop="sku_count" label="SKU种类" align="center" />
        <el-table-column prop="skus" label="SKU数量" align="center" show-overflow-tooltip />
        <el-table-column prop="shipping_fee" label="运费（RMB）" align="center" />
        <el-table-column prop="dispatch_staff_name" label="派单人" align="center"  />
        <el-table-column prop="dispatch_date" label="派单时间" align="center" show-overflow-tooltip />
        <el-table-column prop="shipped_date" label="发货时间" align="center" /> -->
        <!-- <el-table-column prop="weigh_staff_name" label="测量人" align="center"  /> -->
        <!-- <el-table-column prop="weigh_date" label="测量完成时间" align="center" show-overflow-tooltip /> -->
        <!-- <el-table-column prop="ship_staff_name" label="发货人" align="center" /> -->
        <!-- <el-table-column prop="pick_staff_name" label="拣货人" align="center" /> -->
        <!-- <el-table-column prop="pick_date" label="拣货完成时间" align="center" /> -->
        <el-table-column prop="pack_staff_name" label="打包人" align="center" />
        <el-table-column prop="pack_date" label="打包完成时间" align="center" />
        <el-table-column prop="track_num" label="物流跟踪号" align="center" />
  </el-table>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
export default {
    name: 'TableContent',
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
    },
    computed: {
        ...mapState('Order', ['statusList']),
        getColor() {
            return type => {
                const item = this.statusList.find(item => item.label === type)
                if (item) {
                    return item.color
                }
            }
        }
    },
    data() {
        return {
            maxHeight: window.innerHeight - 230
        }
    },
    methods: {
        selectionChange(data) {
            this.$emit('selectionChange', data)
        },
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 230
        }
    }
}
</script>