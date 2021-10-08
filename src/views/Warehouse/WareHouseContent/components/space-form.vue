<template>
    <el-form :model="form" :rules="spaceRules" label-width="88px" ref="spaceForm">
        <el-form-item label="库位名称:" prop="spaceCode">
                <el-input v-model="form.spaceCode" placeholder="请输入库位名称" disabled />
        </el-form-item>
        <el-form-item label="SKU:">
                <el-input v-model.trim="form.sku" placeholder="请输入SKU回车进行查询" clearable @keyup.enter.native="filterSku(form.sku)" />
        </el-form-item>
        <sku-table :show="true" />
        <el-form-item label-width="0">
            <div style="text-align: center">
                <el-button type="primary" size="mini" @click="cancel('spaceForm')">取 消</el-button>
                <el-button type="primary" size="mini" @click="confirm('spaceForm')">确 定</el-button>
            </div>
        </el-form-item>
    </el-form>
</template>
<script>
import { message } from '@/utils/common'
import skuTable from './space-sku-table'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
    inject: ['params'],
    components: {
        skuTable
    },
    computed: {
        ...mapState('Warehouse', [
            'spaceRules',
            'spaceSkuTableData',
            'spaceSkuParseData'
        ]),
        form: {
            get() {
                return this.$store.state.Warehouse.spaceForm
            },
            set(val) {
                this.$store.state.Warehouse.spaceForm = val
            }
        }
    },
    methods: {
        ...mapMutations('Warehouse', [
            'CHANGE_PARTITION_MODAL'
        ]),
        ...mapActions('Warehouse', [
            'addOrEditSpacecode',
            'filterSku'
        ]),
        filterSkuFunc(newArr, oldArr) {
            let newSkus =  newArr.map(item => item.sku) 
            let oldSkus = oldArr.map(item => item.sku) 
            let removes = oldArr.filter(item => !newSkus.includes(item.sku)).map(item => {
                return {
                    sku: item.sku,
                    id: item.id
                }
            })
            let adds = newArr.filter(item => !oldSkus.includes(item.sku)).map(item => {
                return {
                    sku: item.sku,
                    id: 0
                }
            })
            return { adds, removes }
        },
        confirm(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    const { adds, removes} = this.filterSkuFunc(this.spaceSkuTableData, this.spaceSkuParseData)
                    this.addOrEditSpacecode({ spaceCode: this.form.spaceCode, params: this.params, data: { adds, removes }  })
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