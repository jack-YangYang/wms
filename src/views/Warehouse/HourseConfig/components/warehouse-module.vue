<template>
    <el-dialog
        :title="title"
        :visible.sync="showModule"
        @close="cancel('form')"
        width="30%"
        top="10%"
        :close-on-click-modal="false"
    >
        <el-form :model="form" :rules="rules" label-width="88px" ref="form">
            <el-form-item label="仓库名称:" prop="name">
                <el-input v-model="form.name" placeholder="请输入仓库名称" />
            </el-form-item>
            <el-form-item label="仓库类型:" prop="type">
                <el-select v-model="form.type" placeholder="请选择仓库类型" multiple style="width: 100%">
                    <el-option label="虚拟仓-海外" value="1"/>
                    <el-option label="中转仓" value="2"/>
                    <el-option label="直发仓" value="3"/>
                    <el-option label="虚拟仓-FBA" value="4"/>
                    <el-option label="虚拟仓-Lazada" value="5"/>
                    <el-option label="样品仓" value="6"/>
                </el-select>
            </el-form-item>
            <el-form-item label="备注:" prop="remark">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
        </el-form>
        <template slot="footer">
            <el-button type="primary" size="mini" @click="cancel('form')">取 消</el-button>
            <el-button type="primary" size="mini" @click="confirm('form')">确 定</el-button>
        </template>
    </el-dialog>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { message } from '@/utils/common'
export default {
    props: ['params'],
    computed: {
        ...mapState('Warehouse', [
            'title',
            'rules'
        ]),
        showModule: {
            get() {
                return this.$store.state.Warehouse.showModule
            },
            set(val) {
                this.$store.state.Warehouse.showModule = val
            }
        },
        form: {
            get() {
                return this.$store.state.Warehouse.form
            },
            set(val) {
                this.$store.state.Warehouse.form = val
            }
        },
    },
    methods: {
        ...mapMutations('Warehouse', [
            'CAHNGE_MODULE'
        ]),
        ...mapActions('Warehouse', [
            'addOrEditwarehouse'
        ]),
        confirm(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.addOrEditwarehouse({ form: this.form, params: this.params })
                } else {
                    message('error', '请填写必填信息')
                    return false;
                }
            });
        },
        cancel(form) {
            this.$refs[form].resetFields();
            this.$nextTick(() => {
                this.CAHNGE_MODULE({ type: false })
            })
        },
    }
}
</script>