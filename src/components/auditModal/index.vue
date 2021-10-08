<template>
    <el-dialog
        title="审核"
        :visible.sync="showModule"
        @close="handleSubmit(false)"
        width="40%"
        top="3%"
        :close-on-click-modal="false"
    >
        <div class="add-content">
            <div>
                <el-radio-group v-model="state">
                    <el-radio :label="0">审核通过</el-radio>
                    <el-radio :label="1">{{ value }}</el-radio>
                </el-radio-group>
            </div>
        </div>
        <!-- <div class="remake">
            <span>备注:</span>
            <el-input type="textarea" v-model="remark" :rows="3"/>
        </div> -->
        <div class="btn">
            <el-button size="small" @click="handleSubmit(false)">取消</el-button>
            <el-button size="small" type="primary" @click="handleSubmit(true)">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { message } from '@/utils/common'
import { mapState } from 'vuex'
export default {
    name: 'AddLocaltionModal',
    props: {
        auditModal: {
            type: Boolean,
            default: false
        },
        auditRemark: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: '驳回'
        },
        auditState: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            state: this.auditState,
            // remark: this.auditRemark,
            showModule: this.auditModal
        }
    },
    watch: {
        state(val) {
            this.$emit('change_state', val)
        },
        // remark(val) {
        //     this.$emit('Transfers/CHANGE_AUDIT_REMARK', val)
        // }
    },
    methods: {
        handleSubmit(flag) {
            if (!flag) {
                console.log(flag)
                this.$emit('handleSubmit', flag)
                return false
            }
            this.$emit('handleSubmit', this.state)
        }
    },
}
</script>
<style scoped lang="scss">
.add-content {
    display: flex;
    justify-content: center;
    height:160px;
    align-items: center;
    // margin-bottom: 100px;
    & > div {
        display: flex;
        align-items: center;
    }
}
.remake {
    display: flex;
    margin-bottom: 15px;
    span {
        width: 80px;
        text-align: right;
        padding-right: 15px;
    }
}
.btn {
    text-align: center;
}
</style>