<template>
    <el-table 
    :data="tableData" 
    @selection-change="handleSelectionChange"
    :max-height="maxHeight"
    style="width: 100%"
    >  
        <el-table-column
        type="selection"
        align="center"
        width="55">
        </el-table-column>
        <el-table-column prop="ticketCode" label="入库单号" align="center">
            <template slot-scope="{row}">
                <router-link :to="{ name: 'ShelvesDetail', query: { ticketCode: row.ticketCode, type: 'view' } }">
                    <span class="blue-color">{{ row.ticketCode }}</span>
                </router-link>       
            </template>    
        </el-table-column>
        <!-- <el-table-column label="入库类型" align="center">
            <template slot-scope="{row}">
                <span :style="{color: getTypeColor(row.type)}">
                    {{ row.type ? '退货入库' : '采购入库' }}
                </span>
            </template>
        </el-table-column> -->
        <el-table-column prop="ticketOrder" label="关联单号" align="center">
            <!-- <template slot="header">
                <p class="header-incount" style="width:80px">关联采购单号</p>
            </template> -->
        </el-table-column>  
        <!-- <el-table-column prop="supplement" label="是否补单" align="center">
            <template slot-scope="{row}">
                {{ row.supplement ? '是' : '否'}}
            </template>
        </el-table-column>
        <el-table-column prop="supplement" label="是否需质检" align="center">
            <template slot-scope="{row}">
                {{ row.qa ? '是' : '否'}}
            </template>
        </el-table-column> -->
        <!-- <el-table-column prop="shipOrder" label="快递单号" align="center" />
        <el-table-column prop="alibabaId" label="1688单号" align="center" /> -->
        <el-table-column prop="purchaseCount" label="入库单状态" align="center">
            <template slot-scope="{row}">
                <span :style="{ color: stateListForamt[row.state].color }">{{ stateListForamt[row.state].name }}</span>
            </template>
        </el-table-column>  
        <!-- <el-table-column prop="" label="是否补单" align="center" show-overflow-tooltip />   -->
        <el-table-column prop="whouseName" label="入库仓库" align="center" show-overflow-tooltip />
        <!-- <el-table-column prop="shopName" label="入库店铺" align="center" show-overflow-tooltip /> -->
        <el-table-column prop="createUserName" label="制单员" align="center"></el-table-column>
        <el-table-column prop="createDate" label="制单时间" align="center" />
        <el-table-column prop="shelfUserName" label="上架人" align="center" show-overflow-tooltip />
        <el-table-column prop="shelfDate" label="上架时间" align="center" />
        <el-table-column prop="qaCount" label="上架数量" align="center"/>
        <!-- <el-table-column prop="qaCount" label="质检合格数量" align="center"/> -->
        <!-- <el-table-column prop="planCount" label="计划入库数量" align="center" /> -->
        <!-- <el-table-column prop="purchaseCount" label="采购量" align="center" /> -->
        <!-- <el-table-column prop="totalAmount" label="实际入库金额" align="center" />
        <el-table-column prop="createDate" label="计划入库金额" align="center" /> -->
        <!-- <el-table-column prop="inTotalAmount" label="入库总金额" align="center">
            <template slot-scope="{row}">
                {{ row.state === 3 ? row.inTotalAmount : row.state === 4 ? row.planTotalAmount : row.inTotalAmount }}
            </template>
        </el-table-column> -->
        <!-- <el-table-column prop="inTotalAmount" label="入库成本" align="center" /> -->
        <!-- <el-table-column prop="inExpressAmount" label="运费" align="center">
            <template slot-scope="{row}">
                {{ row.state === 3 ? row.planExpressAmount : row.inExpressAmount }}
            </template>
        </el-table-column> -->
        <!-- <el-table-column prop="checkDate" label="审核时间" align="center" /> -->
        <!-- <el-table-column prop="checkUser" label="审核人" align="center" /> -->
        <!-- <el-table-column prop="inTaxAmount" label="税费" align="center" /> -->
        <!-- <el-table-column prop="qaUserName" label="质检人" align="center" /> -->
        <!-- <el-table-column prop="qaDate" label="质检时间" align="center" show-overflow-tooltip> -->
            <!-- <template slot-scope="{row}">
                {{ row.state === 3 ? '' : row.inspectionDate }}
            </template> -->
        </el-table-column>   
        <!-- <el-table-column prop="shelfUserName" label="上架人" align="center" />
        <el-table-column prop="shelfDate" label="上架时间" align="center" />  -->
        <el-table-column prop="money" label="操作" align="center" fixed="right">
            <template slot-scope="{row}">    
                <router-link :to="{ name: 'ShelvesDetail', query: { ticketCode: row.ticketCode, type: 'edit' } }">
                    <el-button type="text" size="mini" v-if="row.state === 70 && showButtons.shelves">上架</el-button>
                </router-link>
            </template>
        </el-table-column>
  </el-table>
</template>
<script>
import { confirmMsg } from '@/utils/common'
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState('Shelves', [
            'stateListForamt'
        ]),
        getTypeColor() {
            return (type) => {
                return type ? '#FD7272' : '#58B19F'
            }
        },
        isShow() {
            return (state) => {
                return [20, 100].includes(state)
            }
        },
        show() {
            return (state) => {

            }
        },
        getAmount() {
            return (item) => {
                return item.planAmount - item.planExpressAmount - item.planTaxAmount
            }
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
    data() {
        return {
            checkAll: false,
            maxHeight: window.innerHeight - 210,
            // colorStateList: {
            //     1: '#E6A23C',
            //     2: '#e02433',
            //     3: '#67C23A',
            //     4: 'green',
            //     5: '#F56C6C',
            //     10: 'green'
            // }
        }
    },
    methods: {
        handleSelectionChange(row) {
            this.$emit('handleSelectionChange', row)
        },
        invalid(ticketCode) {
            confirmMsg('warning', '提示', '你确定要作废吗？', () => {
                this.$emit('doInvalid', ticketCode)
            })
        },
        confirmMark(code) {
            this.$emit('mark', code)
        },
    },
    filters: {
        getStateName(val) {
            switch(val) {
                case 10:
                    return '待质检'
                case 20:
                    return '已作废'
                case 60:
                    return '质检完成'
                case 70:
                    return '已贴标'
                case 100:
                    return '已入库'
                case 100:
                    return '已退回'
            }
        }
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 210
        }
    }
}
</script>
<style scoped lang="scss">
.header-incount {
    width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
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