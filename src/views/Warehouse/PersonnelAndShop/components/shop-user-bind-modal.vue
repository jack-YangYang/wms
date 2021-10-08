<template>
    <el-dialog
        :title="title"
        :visible.sync="showModule"
        @close="cancel('form')"
        width="980px"
        top="1%"
        :close-on-click-modal="false"
    >
        <el-form :model="form" :rules="shopUserRules" label-width="60px" ref="form">
            <el-form-item label="店铺:" v-if="showSearch">
                <el-select 
                v-model="form.shopIds"
                placeholder="请输入店铺名称" 
                filterable 
                style="width: 80%" 
                multiple 
                collapse-tags 
                remote
                :loading="loading"
                :remote-method="remoteMethod"
                reserve-keyword
                >
                    <el-option v-for="item in shopList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </el-form-item>
        <div>
                <div v-if="showSearch">
                    <el-form-item label="店铺名:">
                        <el-input style="width: 180px" v-model="shopName" clearable placeholder="请输入店铺名称" />
                        <el-button type="primary" size="mini" @click="handleClick(staffId)">查 找</el-button>
                        <span class="prompt">{{ prompt }}</span>
                    </el-form-item>
                </div>
                <shop-table />
                <page 
                :page="{size: search.pageSize, 
                page: search.pageNo}" 
                style="position:inherit"
                :total="shopDataTotal"
                @handleCurrentChange="changePage" 
                @handleSizeChange="changeSize" />
        </div>
        </el-form>
        <template slot="footer">
            <el-button type="primary" size="mini" @click="cancel('form')">取 消</el-button>
            <el-button type="primary" size="mini" @click="confirm(form)">确 定</el-button>
        </template>
    </el-dialog>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { message } from '@/utils/common'
import shopTable from './shop-table'
import page from '@/components/page'
export default {
    props: ['params'],
    components: {
        shopTable,
        page
    },
    data() {
        return {
            prompt: '选中表格数据点击确定即解绑'
        }
    },
    computed: {
        ...mapState('Warehouse', [
            'title',
            'showSearch',
            'search',
            'staffId',
            'shopDataTotal',
            'shopUserRules'
        ]),
        ...mapState({
            loading: state => state.common.loading,
            shopList: state => state.common.shopList,
        }),
        shopName: {
            get() {
                return this.$store.state.Warehouse.shopName
            },
            set(val) {
                this.$store.state.Warehouse.shopName = val
            }
        },
        showModule: {
            get() {
                return this.$store.state.Warehouse.showShopUserModule
            },
            set(val) {
                this.$store.state.Warehouse.showShopUserModule = val
            }
        },
        form: {
            get() {
                return this.$store.state.Warehouse.shopUserForm
            },
            set(val) {
                this.$store.state.Warehouse.shopUserForm = val
            }
        },
    },
    beforeDestroy() {
        this.CAHNGE_LOADING(false)
        this.GET_SHOP([])
    },
    methods: {
        remoteMethod(query) {
            this.getAllShop(query)
        },
        changePage(page) {
            this.findShipList({ staffId:this.staffId, page })
        },
        changeSize(size) {
            this.findShipList({ staffId:this.staffId, size, arg: 'data' })
        },
        handleClick(staffId) {
            this.findShipList({ staffId, arg: 'data' })
        },
        ...mapMutations(['CAHNGE_LOADING', 'GET_SHOP']),
        ...mapMutations('Warehouse', [
            'CHANGE_SHOP_USER'
        ]),
        ...mapActions(['getAllShop']),
        ...mapActions('Warehouse', [
            'shopAndEserBind',
            'findShipList',
            'findShipList'
        ]),
        confirm(form) {
                this.shopAndEserBind({ form, search: this.params })
        },
        cancel(form) {
            this.$refs[form].resetFields();
            this.$nextTick(() => {
                this.CHANGE_SHOP_USER({ type: false })
            })
        },
    }
}
</script>
<style scoped>
.prompt {
    color: #e6a23c;
}
</style>