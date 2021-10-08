<template>
    <el-table
    :data="tableData"
    max-height="480px"
    >
        <el-table-column label="店铺" prop="shopName" align="center" />
        <el-table-column label="SKU" prop="sku" align="center" />
        <el-table-column label="asin" prop="asin" align="center" />
        <el-table-column label="数量" prop="" align="center">
            <template slot-scope="{row}">
                {{ getNum(row) }}
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
export default {
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
        type: {
            type: Number
        }
    },
    computed: {
        getNum() {
            return item => {
                if (this.type === 1) {
                    return item.asinPurchaseCount
                }
                if (this.type === 2) {
                    return item.asinPlanCount
                }
                if (this.type ===3) {
                    return item.asinCount
                }
            }
        }
    }
}
</script>