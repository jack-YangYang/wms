<template>
    <main>
        <el-form :model="search" inline>
            <el-form-item label="人员名称:">
                <el-input v-model.trim="search.staffName" placeholder="请输入人员名称" clearable />
            </el-form-item>
            <el-form-item>
                <action-group @doFilter="getData('data')" @doReset="doReset">
                    <!-- <el-button type="primary" size="mini" @click="bindShopAction(search)">一键绑定所有店铺</el-button> -->
                    <el-button type="primary" size="mini" @click="configAllcheck({ search, type: 1 })" v-if="showButtonsShop.binding">一键绑定所有店铺</el-button>
                    <el-button type="primary" size="mini" @click="configAllcheck({ search, type: 0 })" v-if="showButtonsShop.unBinding">一键解绑所有店铺</el-button>
                    <el-button type="primary" size="mini" @click="confirmSelectAll({ search, type: 1 })" v-if="showButtonsShop.confirmSelectAll">设置全选</el-button>
                    <el-button type="primary" size="mini" @click="confirmSelectAll({ search, type: 0 })" v-if="showButtonsShop.cancelSelectAll">取消全选</el-button>
                </action-group>
            </el-form-item>
        </el-form>
        <div  v-if="personnerTotal" >
            <table-list :showButtons="showButtonsShop" /> 
            <change-page 
            :page="{size: search.pageSize, 
            page: search.pageNo}" 
            :total="personnerTotal"
             @handleCurrentChange="changePage" 
             @handleSizeChange="changeSize" />
        </div>
        <no-data-content v-else />
        <transition name="fade-transform" mode="out-in">
            <module-config v-if="showShopUserModule" :params="search" />
        </transition>
    </main>    
</template>
<script>
import ActionGroup from '@/components/SearchAction'
import moduleConfig from './components/shop-user-bind-modal'
import NoDataContent from "@/components/NoDataImages"
import upload from '@/components/Upload'
// import page from '@/components/page'
import { mixin } from '@/mixins/common'
import tableList from './components/table-list'
import { mapState, mapActions, mapMutations } from 'vuex'
import { promptMessage, getMenuID } from '@/utils/common'
export default {
    components: {
        ActionGroup,
        upload,
        moduleConfig,
        NoDataContent,
        // page,
        tableList
    },
    mixins: [mixin],
    computed: {
        ...mapState('Warehouse', [
            'personnerTableData',
            'showButtonsShop',
            'showShopUserModule',
            'personnerTotal'
        ])
    },
    data() {
        return {
            search: {
                staffName: '',
                pageNo:  1,
                pageSize: 20
            },
            baseUrl: process.env.VUE_APP_FBA_API
        }
    },
    methods: {
        ...mapActions('Warehouse', [
            'getShopuser',
            'bindShopAction',
            'confirmSelectAll',
            'getButtonListShop',
            'configAllcheck'
        ]),
        // ...mapActions(['getAllShop']),
        ...mapMutations('Warehouse',[
            'CAHNGE_HOUSE_SHOP_MODULE'
        ]),
        uploadSuccess(res) {
            if (res.data.success) {
                this.getData()
            }
            promptMessage(res)
        },
        changeSize(size) {
            if (this.personnerTableData.length === this.personnerTotal && (size > this.search.pageSize || size > this.personnerTotal)) return
            this.search.pageSize = size
            this.getData('data')
        },
        getData(arg) {
            arg ? this.search.pageNo = 1 : ''
            this.getShopuser(this.search)
        },
    },
    async mounted() {
        const item = getMenuID(this.$route.path)
        this.getButtonListShop(item)
        this.getData()
        // this.getAllShop()
    }
}
</script>