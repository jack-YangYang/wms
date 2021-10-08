<template>
    <main>
        <el-form :model="search" inline>
            <el-form-item>
                <el-select v-model="search.whouseId" placeholder="请选择仓库" clearable filterable>
                    <el-option v-for="item in waehouseList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item prop="shopId">
                <el-select 
                v-model.trim="search.shopId"
                placeholder="请输入店铺名" 
                filterable 
                style="width: 100%" 
                clearable 
                remote
                :loading="loading"
                :remote-method="remoteMethod"
                >
                    <el-option v-for="item in shopList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </el-form-item> -->
            <el-form-item>
                <el-select v-model="search.state" clearable placeholder="请选择入库单状态">
                    <el-option v-for="(value, key) in stateListForamt" :key="key" :label="value.name" :value="key" />
                </el-select>
            </el-form-item>
            <el-form-item label-width="0">
                <el-input v-model.trim="searchWord" clearable placeholder="搜索内容">
                    <template slot="prepend">
                        <el-select v-model="searchKey"    placeholder="请选择搜索条件" style="width: 120px">
                            <el-option
                            v-for="item in searchList"
                            :key="item.val"
                            :label="item.name"
                            :value="item.val"
                            ></el-option>
                        </el-select>
                    </template>
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="timeStatus">
                <div class="select-date-picker">
                    <el-select v-model="timeStatus"   placeholder="请选择时间方式">
                        <el-option
                            v-for="item in timeList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                            ></el-option>
                    </el-select>
                    <el-date-picker
                    v-model="date"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                </div>
                
            </el-form-item>
            <el-form-item label-width="0">
                 <search-btn-group @doFilter="getData('data')" @doReset="doReset" />
            </el-form-item>
        </el-form>
        <div v-if="total">
            <table-content :tableData="tableData" :showButtons="showButtons" />
            <change-page 
            :page="{ page:search.pageNo, size: search.pageSize }"
            :total="total" 
            @handleCurrentChange="changePage" 
            @handleSizeChange="changeSize"  />
        </div>
        <no-data-content v-else />
    </main>
</template>
<script>
import tableContent from './components/table'
import { mapActions, mapState } from 'vuex'
import { getMenuID } from '@/utils/common'
import { mixin } from '@/mixins/common'
export default {
    mixins: [mixin],
    data() {
        return {
            search: {
                whouseId: '',
                shopId: '',
                state: '',
                pageNo: 1,
                pageSize: 20
            },
            date: '',
            timeStatus: 'shelf',
            searchWord: '',
            searchKey: 'ticketCode'
        }
    },
    components: {
        tableContent
    },
    watch: {
        searchWord(val) {
            this.$set(this.search, this.searchKey, val)
        },
        searchKey(newValue, oldValue) {
            this.$delete(this.search, oldValue) // 先删除原来的，避免新增
            this.$set(this.search, newValue, this.searchWord)
        },
        timeStatus(newValue, oldValue) {      
            switch(oldValue) {
                case 'createOrder':
                    this.$delete(this.search, 'startDate')
                    this.$delete(this.search, 'endDate')
                    break;
                case 'qa':
                    this.$delete(this.search, 'qaStartDate')
                    this.$delete(this.search, 'qaEndDate')
                    break;
                case 'mark':
                    this.$delete(this.search, 'markStartDate')
                    this.$delete(this.search, 'markEndDate')
                    break;
                case 'shelf':
                    this.$delete(this.search, 'shelfStartDate')
                    this.$delete(this.search, 'shelfEndDate')
                    break;
                case 'check':
                    this.$delete(this.search, 'checkStartDate')
                    this.$delete(this.search, 'checkEndDate')
            }
            this.changeTime(newValue)
        },
        date(val) {
            this.changeTime(this.timeStatus)
        },
    },
    computed: {
        ...mapState('Shelves', [
            'timeList',
            'tableData',
            'showButtons',
            'total',
            'searchList',
            'stateListForamt'
        ]),
        ...mapState({
            loading: state => state.common.loading,
            shopList: state => state.common.shopList,
            waehouseList: state => state.common.waehouseList,
        })
    },
    methods: {
        ...mapActions('Shelves', [
            'getList',
            'getButtonList'
        ]),
        changeTime(val) {
            let startDate = this.date ? this.date[0] : ''
            let endDate = this.date ? this.date[1] : ''
            switch(val) {
                case 'createOrder':
                    this.$set(this.search, 'startDate', startDate)
                    this.$set(this.search, 'endDate', endDate)
                    break;
                case 'qa':
                    this.$set(this.search, 'qaStartDate', startDate)
                    this.$set(this.search, 'qaEndDate', endDate)
                    break;
                case 'mark':
                    this.$set(this.search, 'markStartDate', startDate)
                    this.$set(this.search, 'markEndDate', endDate)
                    break;
                case 'shelf':
                    this.$set(this.search, 'shelfStartDate', startDate)
                    this.$set(this.search, 'shelfEndDate', endDate)
                    break;
                case 'check':
                    this.$set(this.search, 'checkStartDate', startDate)
                    this.$set(this.search, 'checkEndDate', endDate)
            }
        },
        ...mapActions(['getAllShop', 'getAllwarehouse']),
        remoteMethod(query) {
            this.getAllShop(query)
        },
        getData(arg) {
            arg ? this.search.pageNo = 1 : ''
            this.getList(this.search)
        },
    },
    mounted() {
        const item = getMenuID(this.$route.path)
        this.getButtonList(item)
        this.getData()
    }
}
</script>