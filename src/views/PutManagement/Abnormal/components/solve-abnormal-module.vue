<template>
    <el-dialog
        title="编辑内部标签"
        :visible.sync="showModule"
        @close="close({ type: false })"
        width="40%"
        top="3%"
        :close-on-click-modal="false"
    >
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="编辑内部标签:">
                <el-input v-model="form.memo"></el-input>
            </el-form-item>
        <el-form-item label="">
            <el-input 
            :autosize="{ minRows: 4, maxRows: 10}"
            type="textarea" 
            v-model="form.desc" 
            disabled></el-input>
        </el-form-item>
        </el-form>
        <div class="btn">
            <el-button size="small" @click="close({ type: false })">取消</el-button>
            <el-button size="small" type="primary" @click="handleSubmit(form)">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { message } from '@/utils/common'
import { mapMutations, mapActions } from 'vuex'
export default {
    computed: {
        form: {
            get() {
                return this.$store.state.Abnormal.solveAbnormalForm
            },
            set(val) {
                this.$store.state.Abnormal.solveAbnormalForm = val
            }
        },
        showModule: {
            get() {
                return this.$store.state.Abnormal.showAbnormalModule
            },
            set() {
                this.$store.state.Abnormal.showAbnormalModule = val
            }
        }
    },
    methods: {
        ...mapMutations('Abnormal', {
            close: 'CAHNGE_MODULE'
        }),
        handleSubmit(form) {
            this.$emit('handleSolveAbnormal', form)
        }
        // ...mapActions('Abnormal', {
        //     handleSubmit: 'handleSolveAbnormal'
        // })
    },
}
</script>
<style scoped>
.btn {
    padding: 12px 0;
    text-align: center;
}
</style>
