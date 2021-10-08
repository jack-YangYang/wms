<template>
    <el-dialog
        title="驳回订单"
        :visible.sync="showRejectModule"
        @close="cancel({ type: false })"
        width="980px"
        top="1%"
        :close-on-click-modal="false"
    >
        <el-input 
        type="textarea" 
        v-model="rejectReason" 
        placeholder="请输入驳回原因" />
        <template slot="footer">
            <el-button type="primary" size="mini" @click="cancel({ type: false })">取 消</el-button>
            <el-button type="primary" size="mini" @click="confirmReject({ reason: rejectReason, params })">确 定</el-button>
        </template>
    </el-dialog>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { message } from '@/utils/common'
export default {
    props: ['params'],
    computed: {
        rejectReason: {
            get() {
                return this.$store.state.Order.rejectReason
            },
            set(val) {
                this.$store.state.Order.rejectReason = val
            }
        },
        showRejectModule: {
            get() {
                return this.$store.state.Order.showRejectModule
            },
            set(val) {
                this.$store.state.Order.showRejectModule = val
            }
        },
    },
    methods: {
        ...mapMutations('Order', {
            cancel: 'CHANGE_REJECT_MODULE'
        }),
        ...mapActions('Order', ['confirmReject'])
    }
}
</script>
<style scoped>
.prompt {
    color: #e6a23c;
}
</style>