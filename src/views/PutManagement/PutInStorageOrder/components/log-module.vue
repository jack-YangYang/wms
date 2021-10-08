<template>
    <el-dialog
        title="操作日志"
        :visible.sync="showModule"
        @close="handleSubmit(false)"
        width="50%"
        top="3%"
        :close-on-click-modal="false"
    >
        <el-card>
            <log-table :tableData="logTableData" />
        </el-card>
        <div slot="footer">
            <el-button size="small" @click="handleSubmit(false)">关闭</el-button>
            <!-- <el-button size="small"  type="primary" @click="handleSubmit(false)">保存</el-button> -->
        </div>
    </el-dialog>
</template>
<script>
import { mapMutations } from 'vuex'
import logTable from '@/components/LogTable'
export default {
    components: {
        logTable
    },
    props: {
        showLogModule: {
            type: Boolean,
            default: false
        },
        logTableData: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            showModule: this.showLogModule
        }
    },
    methods: {
        handleSubmit(flag) {
            this.$emit('handleSubmit', flag)
        },
    }
}
</script>