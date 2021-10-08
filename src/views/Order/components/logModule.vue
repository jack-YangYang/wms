<template>
    <el-dialog
        title="订单日志"
        :visible.sync="showLogModule"
        @close="CHANGE_LOG_MODULE({ type: false })"
        :modal-append-to-body="false"
        width="980px"
        top="1%"
        :close-on-click-modal="false"
    >
        <log-table />
        <template slot="footer">
            <el-button type="primary" size="mini" @click="CHANGE_LOG_MODULE({ type: false })">关闭</el-button>
        </template>
    </el-dialog>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import logTable from './orderLogTable'
export default {
    computed: {
        ...mapState('Order', ['showLogModule'])
    },
    components: {
        logTable
    },
    methods: {
        ...mapMutations('Order', ['CHANGE_LOG_MODULE'])
    }
}
</script>