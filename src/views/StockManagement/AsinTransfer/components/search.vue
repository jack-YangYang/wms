<template>
    <el-form ref="form" :model="form" label-width="80px" inline>
        <el-form-item>
            <el-select v-model="form.whouseId" placeholder="请选择仓库" clearable filterable>
                <el-option v-for="item in waehouseList" :label="item.label" :value="item.value" :key="item.value" />
            </el-select>
        </el-form-item>
       <el-form-item prop="shopId">
            <el-select 
            v-model="form.shopId"
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
        </el-form-item>
        <el-form-item>
            <el-input placeholder="请输入调拨单号" clearable v-model.trim="form.ticketCode" />
        </el-form-item>
        <el-form-item>
            <el-select v-model="form.state"  clearable   placeholder="请选择单据状态">
                <el-option
                    v-for="(value, key) in statusList"
                    :key="key"
                    :label="value.label"
                    :value="key"
                />
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-input placeholder="请输入SKU" clearable v-model.trim="form.sku" />
        </el-form-item>
        <el-form-item>
            <el-input placeholder="请输入ASIN" clearable v-model.trim="form.asin" />
        </el-form-item>
        <!-- <el-form-item>
            <el-input placeholder="请输入内容" v-model.trim="searchWord" clearable>
                <template slot="prepend">
                    <el-select v-model="searchKey"  placeholder="请选择" style="width: 120px">
                        <el-option :label="item.label" :value="item.value" v-for="item in searchList" :key="item.value" />
                    </el-select>
                </template>
            </el-input>
        </el-form-item> -->
        <el-form-item>
            <div class="select-date-picker">
                <el-select v-model="timeStatus"   placeholder="请选择时间方式">
                    <el-option label="创建时间" value="create" />
                    <el-option label="审核时间" value="audit" />
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
        <el-form-item>
            <el-button size="mini" type="primary" @click="doFilter">搜 索</el-button>
            <el-button size="mini" type="primary" @click="doReset">重 置</el-button>
            <!-- <el-button size="mini" type="primary" @click="doExport">导 出</el-button> -->
            <router-link to="/stock/asintransfer/add">
                <el-button size="mini" type="primary">新增</el-button>
            </router-link>
            <el-button type="primary" size="mini" @click="auditAllAsin">批量审核</el-button>
            <el-button type="primary" size="mini" @click="filterLog({ pageNo: 1, pageSize: 20 })">操作日志</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { clearSearch } from '@/utils/common'
export default {
    props: {
        form: {
            type: Object,
            required: true
        },
        showButtons: {
            type: Object,
            
        }
    },
    data() {
        return {
            date: '',
            timeStatus: 'create',
            searchWord: '',
            searchKey: 1
        }
    },
    watch: {
        timeStatus(newValue, oldValue) {      
            switch(oldValue) {
                case 'create':
                    this.$delete(this.form, 'startDate')
                    this.$delete(this.form, 'endDate')
                    break;
                case 'audit':
                    this.$delete(this.form, 'checkStartDate')
                    this.$delete(this.form, 'checkEndDate')
                    break;
            }
            this.changeTime(newValue)
        },
        searchWord(val) {
            this.$set(this.search, this.searchKey, val)
        },
        searchKey(newValue, oldValue) {
            this.$delete(this.search, oldValue) // 先删除原来的，避免新增
            this.$set(this.search, newValue, this.searchWord)
        },
        date(val) {
            this.changeTime(this.timeStatus)
        },
    },
    computed: {
        ...mapState({
            loading: state => state.common.loading,
            shopList: state => state.common.shopList,
            waehouseList: state => state.common.waehouseList,
            searchList: state => state.AsinTransfer.searchList,
            statusList: state => state.AsinTransfer.statusList
        }),
    },
    methods: {
        changeTime(val) {
            let startDate = this.date ? this.date[0] : ''
            let endDate = this.date ? this.date[1] : ''
            switch(val) {
                case 'create':
                    this.$set(this.form, 'startDate', startDate)
                    this.$set(this.form, 'endDate', endDate)
                    break;
                case 'audit':
                    this.$set(this.form, 'checkStartDate', startDate)
                    this.$set(this.form, 'checkEndDate', endDate)
            }
        },
        auditAllAsin() {
            this.$emit('auditAllAsin')
        },
        remoteMethod(query) {
            this.getAllShop(query)
        },
        doFilter() {
            this.$emit('doFilter')
        },
        doReset() {
            clearSearch(this.form, ['pageNo', 'pageSize'])
            this.date = ''
            this.searchWord = ''
        },
        doExport() {
            this.$emit('doExport')
        },
        doAdd() {
            this.$emit('doAdd')
        },
        filterLog(params) {
            this.$emit('filterLog', params)
        },
        ...mapActions(['getAllShop']),
        // remoteMethod(query) {
        //     this.getAllShop(query)
        // }
    }
}
</script>