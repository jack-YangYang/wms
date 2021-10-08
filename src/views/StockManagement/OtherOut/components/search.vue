<template>
    <el-form ref="form" :model="form" label-width="80px" inline style="margin-bottom: 10px">
        <el-form-item>
            <el-select v-model="form.whouseId" filterable clearable  placeholder="请选择仓库">
                <el-option
                    v-for="item in waehouseList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
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
            <el-input placeholder="请输入出库单号" clearable v-model.trim="form.ticketCode" />
        </el-form-item>
        <el-form-item>
            <el-select v-model="form.state"  clearable   placeholder="请选择单据状态">
                <el-option
                    v-for="(value, key) in documentsStatusList"
                    :key="key"
                    :label="value.type"
                    :value="key"
                />
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-input placeholder="请输入SKU" clearable v-model.trim="form.sku" />
        </el-form-item>
        <el-form-item>
            <el-input placeholder="请输入制单人" clearable v-model.trim="form.createUserName" />
        </el-form-item>
        <el-form-item>
            <el-input placeholder="请输入审核人" clearable v-model.trim="form.checkUserName" />
        </el-form-item>
        <el-form-item>
            <el-input placeholder="请输入备注" clearable v-model="form.remark" />
        </el-form-item>
        <!-- <el-form-item>
            <el-input placeholder="请输入ASIN" clearable v-model="form.asin" />
        </el-form-item> -->
        <el-form-item>
            <el-select v-model="form.type"  clearable   placeholder="请选择出库类别">
                    <el-option
                        v-for="item in outTypeList"
                        :key="item.val"
                        :label="item.name"
                        :value="item.val"
                    />
                </el-select>
        </el-form-item>
        <el-form-item>
            <div class="select-date-picker">
                <el-select v-model="timeStatus"   placeholder="请选择时间方式">
                    <el-option label="制单时间" value="create" />
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
            <el-button size="mini" type="primary" @click="doExport">导 出</el-button>
            <el-button size="mini" type="primary" @click="doAdd" v-if="showButtons.add">新 增</el-button>
            <el-button size="mini" type="primary" @click="allAudit" v-if="showButtons.audit">批量审核</el-button>
            <el-button type="primary" size="mini" @click="filterLog({ pageNo: 1, pageSize: 20 })" v-if="showButtons.log">操作日志</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import { mapState, mapActions  } from 'vuex'
import { clearSearch } from '@/utils/common'
export default {
    computed: {
        ...mapState({
            loading: state => state.common.loading,
            shopList: state => state.common.shopList,
            waehouseList: state => state.common.waehouseList,
            outTypeList: state => state.OtherOut.outTypeList,
            documentsStatusList: state => state.OtherOut.documentsStatusList
        })
    },
    props: {
        form: {
            type: Object,
            required: true
        },
        showButtons: {
            type: Object,
            required: true
        }
    },  
    components: {
        clearSearch
    },
    data() {
        return {
            timeStatus: 'create',
            date: ''
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
        date(val) {
            this.changeTime(this.timeStatus)
        },
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
        doFilter() {
            this.$emit('doFilter')
        },
        doReset() {
            clearSearch(this.form, ['pageNo', 'pageSize'])
            this.date = ''
        },
        filterLog(params) {
            this.$emit('filterLog', params)
        },
        doExport() {
            this.$emit('doExport')
        },
        doAdd() {
            this.$router.push({
                name: 'AddOtherOut',
                query: {
                    type: 'view'
                }
            })
        },
        allAudit() {
            this.$emit('allAudit')
        },
        ...mapActions(['getAllShop']),
        remoteMethod(query) {
            this.getAllShop(query)
        }
    }
}
</script>