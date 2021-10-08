<template>
    <el-table 
    :data="tableData" 
    :header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
    @selection-change="handleSelectionChange"
    max-height="650"
    style="width: 100%"
    >  
        <el-table-column
        type="selection"
        align="center"
        width="55">
        </el-table-column>
        <el-table-column prop="ticketCode" label="退回单号" align="center" width="120">
            <template slot-scope="{row}">    
                <router-link :to="{ name: 'fallbackContent', query: { ticketCode: row.ticketCode, type: 'view' } }">
                    <span class="blue-color">{{ row.ticketCode }}</span>
                </router-link>    
            </template>    
        </el-table-column>
        <el-table-column prop="order" label="单据状态" align="center">
            <template slot-scope="{ row }">
                <span :style="{ color: color(row.state) }">{{ name(row.state) }}</span>
            </template>
        </el-table-column>  
        <el-table-column prop="createUserName" label="制单人" align="center"></el-table-column>   
        <el-table-column prop="createDate" label="创建时间" align="center" show-overflow-tooltip></el-table-column> 
        <el-table-column prop="ticketOrder" label="关联采购单号" align="center" show-overflow-tooltip></el-table-column>  
        <el-table-column prop="ticketIn" label="入库单号" align="center" show-overflow-tooltip></el-table-column>  
        <el-table-column prop="supplierName" label="供应商" align="center" show-overflow-tooltip />
        <el-table-column prop="whouseName" label="仓库" align="center" show-overflow-tooltip></el-table-column>  
        <!-- <el-table-column prop="purchaser" label="采购人" align="center" /> -->
        <el-table-column prop="totalCount" label="总数量" align="center" />
        <el-table-column prop="totalAmount" label="总金额" align="center" />
        <el-table-column prop="checkUserName" label="审核人" align="center" />
        <el-table-column prop="checkDate" label="审核时间" align="center" />
        <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip />
        <el-table-column prop="money" label="操作" align="center">
            <template slot-scope="{row}">
                <el-button type="text" 
                v-if="row.state === 1 && showButtons.audit"
                 @click="doAudit(row.ticketCode)">审核</el-button>
                <el-button type="text" v-if="showInvalid(row) && showButtons.invalid" @click="doInvalid(row.ticketCode)">作废</el-button>    
                <el-button type="text" v-if="showButtons.print" @click="printFallBackOrder(row.ticketCode)">打印退回单</el-button>
            </template>
        </el-table-column>
  </el-table>
</template>
<script>
import { mapState } from 'vuex'
export default {
    components: {
        // TableInfo,
    },
    computed: {
        ...mapState({
            colorList: state => state.ProcurementFallback.colorList
        }),
        color() {
            return (state) => {
                if (this.colorList[state]) return this.colorList[state].color
                return ''
            }
        },
        name() {
            return (state) => {
                if (this.colorList[state]) return this.colorList[state].name
                return ''
            }
        },
        showInvalid() {
            return (row) => {
                return (row.state === 1 || row.state === 3)
            }
        }
    },
    methods: {
        doAudit(ticketCode) {
            this.$emit('doAudit', ticketCode)
        },
        handleSelectionChange(row) {
            this.$emit('selectionChange', row)
        },
        doInvalid(ticketCode) {
            this.$emit('doInvalid', ticketCode)
        },
        printFallBackOrder(ticketCode) {
            this.$emit('printOrder', ticketCode)
        }
    },
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
        showButtons: {
            type: Object,
            required: true
        }
    },
}
</script>
<style scoped lang="scss">
.info {
    .head-info {
       .ul-head {
           padding: 15px 0;
           border: 1px solid #dfe6ec;
           margin: 0px;
           background-color: #f5f7fa;
           display: flex;
           font-weight: bold;
           color: #333;
       } 
    }
    ul {
        display: flex;
        padding: 15px 0;
        width: 100%;
        li {
            display: flex;
            justify-content: center;
            width: 20%;        
        }
        // li:nth-child(2), li:nth-child(3) {
        //     width: 15%;
        // }
        li:first-child{
            width: 5%;
        }
        // li:nth-child(5){
        //     width: 15%;
        // }
    }
}
</style>