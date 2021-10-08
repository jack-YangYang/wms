<template>
    <el-dialog
        title="操作日志"
        :visible.sync="showModule"
        @close="handleSubmit(false)"
        width="60%"
        top="3%"
        :close-on-click-modal="false"
    >
        <el-card>
            <log-table :tableData="logTableData" />
            <page
            :page="{size: page.pageSize, 
            page: page.pageNo}" 
            :style="{ position: 'inherit' }"
            :total="total"
            marginTop=""
            @handleCurrentChange="changePage" 
            @handleSizeChange="changeSize"
            />
        </el-card>
        
        <div slot="footer">
            <el-button size="small" @click="handleSubmit(false)">关闭</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapMutations } from 'vuex'
import logTable from './logTable'
import page from '@/components/page'
export default {
    components: {
        logTable,
        page
    },
    props: {
        showLogModule: {
            type: Boolean,
            default: false
        },
        total: {
            type: Number,
            default: 0
        },
        logTableData: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            page: {
                pageSize: 20,
                pageNo: 1
            },
            showModule: this.showLogModule
        }
    },
    methods: {
        handleSubmit(flag) {
            this.page.pageSize = 20
            this.page.pageNo = 1
            this.$emit('handleSubmit', flag)
        },
        changePage(page) {
            this.page.pageNo = page
            this.$emit('getLog', this.page)
        },
        changeSize(size) { 
            if (this.logTableData.length == this.total && (size > this.page.pageSize || size > this.total)) return
            this.page.pageSize = size
            this.page.pageNo = 1
            this.$emit('getLog', this.page)
        }
    }
}
</script>