<template>
    <el-table
    :data="stockTableData"
    :max-height="maxHeight"
    style="width: 100%">
        <el-table-column type="index" align="center" label="序号" width="50" />
        <el-table-column prop="whouseName" label="仓库名" align="center" />
        <el-table-column prop="supplierName" label="供应商" align="center" />
        <el-table-column prop="skuName" label="sku名称" align="center" />
        <el-table-column prop="sku" label="SKU" align="center" />
        <el-table-column prop="spaceCode" label="库位" align="center" />
        <el-table-column prop="sku_occupy_count" label="占用数量" align="center" />
        <el-table-column prop="skuCount" label="sku数量" align="center" />
        <el-table-column prop="skuPrice" label="单价" align="center" />
    </el-table>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
    computed: {
        ...mapState('Warehouse', [
            'stockTableData'
        ]),
    },
    data() {
        return {
            maxHeight: window.innerHeight - 200
        }
    },
    methods: {
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 200
        }
    }
}
</script>