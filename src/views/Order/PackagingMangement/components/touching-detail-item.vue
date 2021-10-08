<template>
    <el-card class="touching-card" shadow="hover">
        <top-item :item="item" />
        <number-item :item="item" />
        <table-item :tableData="item.details" />
    </el-card>
</template>
<script>
import topItem from './touching-detail-item-top'
import numberItem from './toucing-item-number'
import tableItem from './touchint-item-table'
export default {
    props: {
        item: {
            type: Object,
            required: true,
        }
    },
    components: {
        topItem,
        numberItem,
        tableItem
    },
}
</script>
<style lang="scss">
.touching-card {
    margin-bottom: 15px;
    .el-card__body {
        padding: 6px 4px !important;
    }
}
</style>