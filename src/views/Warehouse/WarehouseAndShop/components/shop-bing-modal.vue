<template>
    <el-dialog
        :title="title"
        :visible.sync="showModule"
        @close="cancel('form')"
        width="30%"
        top="10%"
        :close-on-click-modal="false"
    >
        <el-form :model="form" :rules="shopHouseRules" label-width="88px" ref="form">
            <el-form-item label="店铺:" prop="shopId">
                <el-select 
                v-model="form.shopId"
                placeholder="请选择店铺" 
                filterable 
                style="width: 100%" 
                remote
                :loading="loading"
                :remote-method="remoteMethod"
                >
                    <el-option v-for="item in shopList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="仓库:" prop="whouseId">
                <el-select v-model="form.whouseId" placeholder="请选择仓库" filterable style="width: 100%">
                    <el-option v-for="item in waehouseList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="店铺:" prop="shopId">
                <el-select v-model="form.shopId" placeholder="请选择仓库" filterable style="width: 100%">
                    <el-option v-for="item in shopList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </el-form-item> -->  
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
            'shopHouseRules'
        ]),
        ...mapState({
            loading: state => state.common.loading,
            shopList: state => state.common.shopList,
            waehouseList: state => state.common.waehouseList
        }),
        showModule: {
            get() {
                return this.$store.state.Warehouse.showHouseShopModule
            },
            set(val) {
                this.$store.state.Warehouse.showHouseShopModule = val
            }
        },
        form: {
            get() {
                return this.$store.state.Warehouse.shopAndHouseForm
            },
            set(val) {
                this.$store.state.Warehouse.shopAndHouseForm = val
            }
        },
    },
    beforeDestroy() {
        this.CAHNGE_LOADING(false)
        this.GET_SHOP([])
    },
    methods: {
        ...mapMutations('Warehouse', [
            'CAHNGE_HOUSE_SHOP_MODULE'
        ]),
        ...mapMutations(['CAHNGE_LOADING', 'GET_SHOP']),
        remoteMethod(query) {
            this.getAllShop(query)
        },
        ...mapActions('Warehouse', [
            'shopAndHouseBind'
        ]),
        ...mapActions(['getAllShop']),
        confirm(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.shopAndHouseBind({ form: this.form, params: this.params })
                } else {
                    message('error', '请填写必填信息')
                    return false;
                }
            });
        },
        cancel(form) {
            this.$refs[form].resetFields();
            this.$nextTick(() => {
                this.CAHNGE_HOUSE_SHOP_MODULE({ type: false })
            })
        },
    }
}
</script>