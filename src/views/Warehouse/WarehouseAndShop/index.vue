<template>
    <main>
        <el-form :model="search" inline>
            <el-form-item label="仓库名称:">
                <el-select v-model.trim="search.whouseId" placeholder="请选择仓库" clearable filterable>
                    <el-option v-for="item in waehouseList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="店铺:" prop="shopId">
                <el-select 
                v-model.trim="search.shopId"
                placeholder="请输入店铺名" 
                filterable 
                style="width: 80%" 
                clearable 
                remote
                :loading="loading"
                :remote-method="remoteMethod"
                >
                    <el-option v-for="item in shopList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <action-group @doFilter="getData('data')" @doReset="doReset">
                    <el-button type="primary" size="mini" @click="CAHNGE_HOUSE_SHOP_MODULE({ type: true })">添加绑定</el-button>
                    <el-button type="primary" size="mini" @click="downloadShopTemplate">下载导入模板</el-button>
                    <upload 
                        :uploaddUrl="`${baseUrl}/warehouse/shop/import`" 
                        title="仓库店铺关系导入" 
                        @handleImageSuccess="uploadSuccess"
                    />
                </action-group>
            </el-form-item>
        </el-form>
        <div  v-if="houseAndShopTableTotal" >
            <table-list /> 
            <change-page 
            :page="{size: search.pageSize, 
            page: search.pageNo}" 
            :total="houseAndShopTableTotal"
             @handleCurrentChange="changePage" 
             @handleSizeChange="changeSize" />
        </div>
        <no-data-content v-else />
        <transition name="fade-transform" mode="out-in">
            <module-config v-if="showHouseShopModule" :params="search" />
        </transition>
    </main>    
</template>
<script>
import ActionGroup from '@/components/SearchAction'
import moduleConfig from './components/shop-bing-modal'
import NoDataContent from "@/components/NoDataImages"
import upload from '@/components/Upload'
// import page from '@/components/page'
import { mixin } from '@/mixins/common'
import tableList from './components/table-list'
import { mapState, mapActions, mapMutations } from 'vuex'
import { promptMessage } from '@/utils/common'
export default {
    components: {
        ActionGroup,
        upload,
        moduleConfig,
        NoDataContent,
        tableList
    },
    mixins: [mixin],
    computed: {
        ...mapState('Warehouse', [
            'houseAndShopTableData',
            'showHouseShopModule',
            'houseAndShopTableTotal'
        ]),
        ...mapState({
            shopList: state => state.common.shopList,
            loading: state => state.common.loading,
            waehouseList: state => state.common.waehouseList
        })
        // ...mapState(['shopList', 'waehouseList'])
    },
    data() {
        return {
            search: {
                whouseId: '',
                shopId: '',
                pageNo:  1,
                pageSize: 20
            },
            baseUrl: process.env.VUE_APP_FBA_API
        }
    },
    methods: {
        ...mapActions('Warehouse', [
            'getHouseShop',
            'downloadShopTemplate'
        ]),
        remoteMethod(query) {
            this.getAllShop(query)
        },
        ...mapActions(['getAllShop', 'getAllwarehouse']),
        ...mapMutations('Warehouse',[
            'CAHNGE_HOUSE_SHOP_MODULE'
        ]),
        uploadSuccess(res) {
            this.getData()
            promptMessage(res)
        },
        changeSize(size) {
            if (this.houseAndShopTableData.length >= this.total && size > this.search.pageSize) return
            this.search.pageSize = size
            this.getData('data')
        },
        getData(arg) {
            arg ? this.search.pageNo = 1 : ''
            this.getHouseShop(this.search)
        },
    },
    async mounted() {
        await this.getData()
        this.getAllwarehouse()
    }
}
</script>