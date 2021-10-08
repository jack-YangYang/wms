<template> 
    <el-table 
    :data="tableData" 
    style="width: 100%"
    >  
        <el-table-column prop="sku" label="SKU" align="center" />
        <el-table-column prop="product_name" label="商品名称" align="center" />
        <el-table-column prop="quantity" label="数量" align="center"></el-table-column>    
        <!-- <el-table-column prop="weight" label="重量" align="center" /> -->
        <el-table-column prop="checked_num" label="已核数量" align="center" />
        <el-table-column prop="position" label="库位" align="center" />
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
}
</script>