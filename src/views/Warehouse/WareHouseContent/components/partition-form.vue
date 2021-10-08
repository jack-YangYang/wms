<template>
    <el-form :model="form" :rules="partitionRules" label-width="88px" ref="partitionForm">
        <el-form-item label="区位名称:" prop="name">
                <el-input v-model="form.name" placeholder="请输入区位名称" />
        </el-form-item>
        <el-form-item label-width="0">
            <div style="text-align: center">
                <el-button type="primary" size="mini" @click="cancel('partitionForm')">取 消</el-button>
                <el-button type="primary" size="mini" @click="confirm('partitionForm')">确 定</el-button>
            </div>
        </el-form-item>
    </el-form>
</template>
<script>
import { message } from '@/utils/common'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
    computed: {
        ...mapState('Warehouse', [
            'partitionRules'
        ]),
        form: {
            get() {
                return this.$store.state.Warehouse.partitionForm
            },
            set(val) {
                this.$store.state.Warehouse.partitionForm = val
            }
        }
    },
    props: ['name'],
    methods: {
        ...mapMutations('Warehouse', [
            'CHANGE_PARTITION_MODAL'
        ]),
        ...mapActions('Warehouse', [
            'addOrEditPartition'
        ]),
        confirm(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.addOrEditPartition({ form: this.form, name:this.name })
                } else {
                    message('error', '请填写必填信息')
                    return false;
                }
            });
        },
        cancel(form) {
            this.$refs[form].resetFields();
            this.$nextTick(() => {
                this.CHANGE_PARTITION_MODAL({ type: false })
            })
        }
    }
}
</script>