<template>
    <el-dialog
        :title="title"
        :visible.sync="showContentMdoal"
        @close="cancel('configForm')"
        :width="width"
        top="5%"
        :close-on-click-modal="false"
    >
        <component :is="component" ref="configForm" :name="name" />
        <template slot="footer"></template>
    </el-dialog>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import partitionForm from './partition-form'
import spaceForm from './space-form'
import spaceSkuTable from './space-sku-table'
import { message } from '@/utils/common'
export default {
    props: ['params', 'name'],
    computed: {
        ...mapState('Warehouse', [
            'title',
            'component'
        ]),
        width() {
            return this.component === 'spaceSkuTable' ? '40%' : '30%'
        },
        showContentMdoal: {
            get() {
                return this.$store.state.Warehouse.showContentMdoal
            },
            set(val) {
                this.$store.state.Warehouse.showContentMdoal = val
            }
        },
    },
    components: {
        partitionForm,
        spaceSkuTable,
        spaceForm
    },
    methods: {
        ...mapMutations('Warehouse', [
            'CHANGE_PARTITION_MODAL'
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
            if (this.component !== 'spaceSkuTable') {
                if (this.$refs[form].$refs.partitionForm) {
                    this.$refs[form].$refs.partitionForm.resetFields()
                } else {
                    this.$refs[form].$refs.spaceForm.resetFields()
                }
            }
            this.$nextTick(() => {
                this.CHANGE_PARTITION_MODAL({ type: false })
            })
        },
    }
}
</script>