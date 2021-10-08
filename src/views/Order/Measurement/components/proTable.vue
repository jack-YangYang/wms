<template>
    <el-table
    :data="tableData"
    >
        <el-table-column label="SKU" prop="sku" />
        <el-table-column label="MSKU" prop="msku" />
        <el-table-column label="商品名称" prop="product_name_zh" />
        <el-table-column label="中文报关" prop="declare_name_zh" />
        <el-table-column label="英文报关" prop="declare_name_en" />
        <el-table-column label="商品属性" prop="trans_attr" />
        <el-table-column label="数量" prop="quantity" />
    </el-table>
</template>
<script>
export default {
    props: {
        tableData: {
            type: Array,
            default: () => []
        }
    }
}
</script>