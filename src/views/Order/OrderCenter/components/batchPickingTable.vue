<template> 
    <el-table 
    :data="tableData" 
    style="width: 100%"
    @selection-change="selectionChange"
    >  
        <!-- <el-table-column type="selection" width="50" align="center" /> -->
        <el-table-column prop="nt_order_id" label="订单编号" align="center"></el-table-column>  
        <el-table-column prop="pick_batch_number" label="批次号" align="center" />
        <el-table-column prop="order_date" label="交易时间（中国）" align="center"></el-table-column>          
        <el-table-column prop="skus" label="商品明细" align="center" />
        <el-table-column prop="position" label="库位明细" align="center" />
        <el-table-column prop="box_num" label="箱号" align="center" />
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
    },
    methods: {
        selectionChange(items) {
            this.$emit('selectionChange', items)
        }
    }
}
</script>