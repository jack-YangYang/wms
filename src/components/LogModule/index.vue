<template>
    <el-dialog
        title="操作日志"
        :visible.sync="show"
        @close="handleSubmit(false)"
        :modal="false"
        :destroy-on-close="true"
        width="50%"
        top="3%"
        :close-on-click-modal="false"
    >
        <el-card>
            <log-table :logTableData="tableData" />
        </el-card>
        <div slot="footer">
            <el-button size="small" @click="handleSubmit(false)">关闭</el-button>
        </div>
    </el-dialog>
</template>
<script>
import logTable from './logTable'
export default {
    props: {
        showLogModule: {
            type: Boolean,
            default: false
        },
        tableData: {
            type: Array,
            default: () => []
        }
    },
    components: {
        logTable
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