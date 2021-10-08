<template>
    <el-table 
    :data="tableData" 
    :cell-style="{padding: '10px 0'}"
    @selection-change="handleSelectionChange"
    :max-height="maxHeight"
    style="width: 100%"
    >  
        <el-table-column
        type="selection"
        align="center"
        width="45">
        </el-table-column>
        <el-table-column prop="purchaseIn" label="入库单号" align="center">
            <template slot-scope="{row}">    
                <router-link :to="{ name: 'AbnormalContent', query: { ticketCode: row.ticketCode } }">
                    <span class="blue-color">{{ row.ticketCode }}</span>
                </router-link>
            </template>    
        </el-table-column>
        <el-table-column prop="ticketOrder" label="关联单号" align="center" /> 
        <!-- <el-table-column prop="shipOrder" label="快递单号" align="center" /> -->
        <!-- <el-table-column prop="alibabaOrder" label="1688订单号" align="center" /> -->
        <el-table-column prop="whouseName" label="仓库" align="center" />
        <el-table-column prop="supplierName" label="供应商" align="center" />
        <el-table-column prop="qaUserName" label="质检人" align="center" /> 
        <el-table-column prop="purchaser" label="采购员" align="center" /> 
        <el-table-column prop="qaDate" label="质检人时间" align="center" /> 
        <el-table-column prop="resolvedDate" label="解决时间" align="center" /> 
        <el-table-column prop="resolvedUserName" label="解决人" align="center" /> 
        <el-table-column prop="planCount" label="计划入库数量" align="center" /> 
        <el-table-column prop="passCount" label="质检合格数量" align="center" /> 
        <el-table-column prop="expressAmount" label="差异数量" align="center">
            <template slot-scope="{ row }">
                {{ row.planCount - row.passCount }}
            </template>
        </el-table-column>
        <el-table-column prop="reason" label="差异原因" align="center" /> 
        <!-- <el-table-column prop="fileCount" label="附件数量" align="center" /> -->
        <el-table-column prop="fileCount" label="异常状态" align="center">
            <template slot-scope="{row}">
                {{ row.resolved ? '已解决' : '未解决'}}
            </template>
        </el-table-column>
        <el-table-column prop="followedUserName" label="异常跟进人" align="center" />
        <el-table-column prop="followedDate" label="异常跟进时间" align="center" />
        <el-table-column prop="resolvedDate" label="异常解决时间" align="center" />
        <el-table-column prop="memo" label="内部标签" align="center" show-overflow-tooltip />
        <el-table-column  label="操作" align="center">
            <template slot-scope="{row}">
                <el-button type="text" 
                v-if="!row.followed"
                @click="startSoveAbnormal(row.ticketCode)">
                开始解决异常
                </el-button>
                <el-button type="text" @click="doEdit(row)" v-if="showButtons.edit">编辑</el-button>
                <el-button type="text" v-if="!row.resolved && showButtons.solve" @click="solveAbnormal(row)">解决异常</el-button>
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
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
        showButtons: {
            required: true
        }
    },
    data() {
        return {
            maxHeight: window.innerHeight - 220
        }
    },
    methods: {
        doEdit(item) {
            this.$emit('doEdit', { type: true, item })
        },
        handleSelectionChange(data) {
            this.$emit('selectionChange', data)
        },
        startSoveAbnormal(ticketCode) {
            this.$emit('startSoveAbnormal', ticketCode)
        },
        solveAbnormal(item) {
            this.$emit('solveAbnormal', item)
        }
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 220
        }
    }
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