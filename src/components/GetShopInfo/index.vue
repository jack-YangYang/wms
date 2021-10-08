<template>
    <el-dialog
    title="SKU详情"
    :visible.sync="show"
    @close="handleSubmit(false)"
    width="50%"
    top="3%"
    :close-on-click-modal="false"
    >
    <table-data :tableData="tableData" :type="type" />
    </el-dialog>
</template>
<script>
import tableData from './table'
export default {
    props: {
        showModule: {
            type: Boolean,
            default: false
        },
        tableData: {
            type: Array,
            default: () => []
        },
        type: {
            type: Number
        }
    },
    components: {
        tableData
    },
    data() {
        return {
            show: this.showModule
        }
    },
    methods: {
        handleSubmit(flag) {
            this.$emit('handleSubmit', flag)
        }
    }
}
</script>