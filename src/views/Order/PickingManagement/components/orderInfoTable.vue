<template> 
    <el-table 
    :data="tableData" 
    style="width: 100%"
    >  
        <el-table-column prop="nt_order_id" label="订单编号" align="center">
            <template slot-scope="{row}">
               <router-link :to="`/order/ordercenter/goods/${row.nt_order_id}`">
                    <el-button type="text">{{ row.nt_order_id }}</el-button>
                </router-link>
            </template>
        </el-table-column>  
        <el-table-column prop="shop_order_id" label="店铺编号" align="center" />
        <el-table-column prop="logistics_provider_code" label="物流公司" align="center"></el-table-column>          
        <!-- <el-table-column prop="sku" label="SKU" align="center" /> -->
        <el-table-column prop="logistics_mode_code" label="物流方式" align="center" />

        <el-table-column prop="warehouse" label="出货仓库" align="center" />
        <el-table-column prop="shop_name" label="卖家店铺" align="center" />
        <el-table-column prop="order_weight" label="重量（KG）" align="center" />
        <el-table-column prop="shipping_fee" label="运费（RMB）" align="center"></el-table-column>    
        <el-table-column prop="sku_count" label="SKU种类" align="center" />
        <el-table-column prop="skus" label="SKU数量" align="center" />
        <el-table-column prop="track_num" label="跟踪号" align="center" />
  </el-table>
</template>
<script>
export default {
    name: 'TableContent',
    props: {
        tableData: {
            type: Array,
            default: () => [{}]
        },
    },
}
</script>