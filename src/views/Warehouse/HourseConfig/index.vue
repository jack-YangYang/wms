<template>
    <main>
        <el-form :model="search" inline>
            <el-form-item label="仓库名:">
                <el-input v-model.trim="search.name" clearable placeholder="请输入仓库名" />
            </el-form-item>
            <el-form-item>
                <action-group @doFilter="getData('data')" @doReset="doReset">
                    <el-button type="primary" size="mini" @click="CAHNGE_MODULE({ type: true })" v-if="showButtons.add">添加仓库</el-button>
                </action-group>
            </el-form-item>
        </el-form>
        <div  v-if="listTableData.length" >
            <table-list :showButtons="showButtons" />
            <change-page 
            :page="{size: search.pageSize, 
            page: search.pageNo}" 
            :total="listTotal"
             @handleCurrentChange="changePage" 
             @handleSizeChange="changeSize" />
        </div>
        <no-data-content v-else />
        <transition name="fade-transform" mode="out-in">
            <module-config v-if="showModule" :params="search" />
        </transition>
    </main>    
</template>
<script>
import ActionGroup from '@/components/SearchAction'
import moduleConfig from './components/warehouse-module'
import NoDataContent from "@/components/NoDataImages"
import tableList from './components/list-table'
import { mixin } from '@/mixins/common'
import { mapState, mapActions, mapMutations } from 'vuex'
import { getMenuID } from '@/utils/common'
export default {
    components: {
        ActionGroup,
        moduleConfig,
        NoDataContent,
        tableList
    },
    mixins: [mixin],
    computed: {
        ...mapState('Warehouse', [
            'listTableData',
            'showButtons',
            'showModule',
            'listTotal'
        ])
    },
    data() {
        return {
            search: {
                name: '',
                pageNo:  1,
                pageSize: 20
            }
        }
    },
    methods: {
        ...mapActions('Warehouse', [
            'getWarehouseList',
            'getButtonList'
        ]),
        ...mapMutations('Warehouse',[
            'CAHNGE_MODULE'
        ]),
        changeSize(size) {
            if (this.listTableData.length >= this.total && size > this.search.pageSize) return
            this.search.pageSize = size
            this.getData('data')
        },
        getData(arg) {
            arg ? this.search.pageNo = 1 : ''
            this.getWarehouseList(this.search)
        },
    },
    mounted() {
        const item = getMenuID(this.$route.path)
        this.getButtonList(item)
        this.getData()
    }
}
</script>