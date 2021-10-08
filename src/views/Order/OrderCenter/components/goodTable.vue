<template> 
    <el-table 
    :data="tableData" 
    style="width: 100%"
    >  
        <el-table-column prop="m_sku" label="店铺SKU" align="center"></el-table-column>  
        <el-table-column prop="sku" label="SKU" align="center" />
        <el-table-column prop="asin" label="ASIN" align="center"></el-table-column>          
        <!-- <el-table-column prop="sku" label="SKU" align="center" /> -->
        <el-table-column prop="product_name_zh" label="商品名称" align="center" />

        <el-table-column prop="declare_name_zh" label="中文报关" align="center" />
        <el-table-column prop="declare_name_en" label="英文报关" align="center" />
        <el-table-column prop="ship_attr" label="商品属性" align="center" />
        <el-table-column prop="quantity" label="数量" align="center"></el-table-column>    
        <el-table-column prop="weight" label="重量（KG）" align="center" />
        <el-table-column prop="declared_value" label="申报价（$）" align="center" />
        <el-table-column prop="store_count" label="库存数量" align="center" />
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