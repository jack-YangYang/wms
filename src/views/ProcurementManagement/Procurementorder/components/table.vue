<template>
    <el-table 
    :data="tableData" 
    :max-height="maxHeight"
    @selection-change="handleSelectionChange"
    style="width: 100%"
    >  
        <el-table-column
        type="selection"
        align="center"
        width="55">
        </el-table-column>
        <el-table-column prop="ticketCode" label="采购单号" align="center">
            <template slot-scope="{row}">    
                <router-link :to="{ name: 'StorageContent', query: { ticketCode: row.ticketCode, type: 1 } }">
                    <span class="blue-color">{{ row.ticketCode }}</span>
                </router-link>    
            </template>    
        </el-table-column>
        <el-table-column prop="poCode" label="PO单号" align="center" />
        <el-table-column prop="order" label="供应商信息" align="center">
            <template slot-scope="{ row }">
                <span class="green-color">【供应商：{{ row.supplierName }}】</span>
            </template>
        </el-table-column>  
        <el-table-column prop="order" label="采购单状态" align="center">
            <template slot-scope="{ row }">
                <span :style="{ color: getStateColor(row.state) }">{{ getState(row.state) }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="order" label="入库单状态" align="center">
            <template slot-scope="{ row }">
                <span :style="{ color: getInstateColor(row.instate) }">{{ getInstate(row.instate) }}</span>
            </template>
        </el-table-column>  
        <el-table-column prop="createDate" label="制单时间" align="center" />
        <el-table-column prop="estimateArrivalDate" label="预计到货时间" align="center" />
        <el-table-column prop="checkDate" label="审核时间" align="center"></el-table-column>   
        <el-table-column prop="purchaser" label="采购员" align="center"></el-table-column> 
        <el-table-column prop="shipCode" label="快递单号" align="center"></el-table-column>  
        <el-table-column prop="alibabaCode" label="1688订单号" align="center"></el-table-column>  
        <el-table-column prop="whouseName" label="仓库" align="center" />
        <!-- <el-table-column prop="shopName" label="店铺" align="center" /> -->
        <el-table-column prop="purchase_amount" label="采购总金额" align="center">
            <template slot-scope="{row}">
                {{ purchaseAmount(row) }}
            </template>
        </el-table-column>  
        <el-table-column prop="signCount" label="签收数量" align="center"></el-table-column>  
        <el-table-column prop="expressAmount" label="总运费" align="center" />
        <el-table-column prop="taxAmount" label="总税费" align="center"></el-table-column>  
        <el-table-column prop="inCount" label="已入库数量" align="center"></el-table-column> 
        <!-- <el-table-column  label="待入库数量" align="center">
            <template slot-scope="{row}">
                <span>{{ row.inCount - row.stockCount }}</span>
            </template>
        </el-table-column>   -->
        <!-- <el-table-column prop="taxAmount" label="待入库数量" align="center">
            <template slot-scope="{row}">
                
            </template>
        </el-table-column>   -->
        <!-- <el-table-column prop="inCount" label="签收量" align="center">
            <template slot-scope="{row}">
                <span>{{ row.inCount }}/{{ row.purchaseCount }}</span>
            </template>
        </el-table-column>    -->
        <el-table-column prop="purchaseCount" label="采购量" align="center"></el-table-column>    
        <el-table-column prop="money" label="操作" align="center">
            <template slot-scope="{row}">
                <router-link :to="{ name: 'StorageContent', query: { ticketCode: row.ticketCode, type: 2 } }">
                    <el-button type="text" v-if="showCreate(row.state) && showButtons.create">生成入库单</el-button>
                </router-link>    
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
        ...mapState('Procurementorder', [
            'instateList',
            'stateList'
        ]),
        purchaseAmount() {
            return (item) => { 
                return item.purchaseAmount + item.taxAmount + item.expressAmount
            }
        },
        showCreate() {
            return (type) => {
                return type === 20
            }
        },
        getState() {
            return (state) => {
                if (this.stateList.find(item => item.value === state)) {
                    return this.stateList.find(item => item.value === state).label
                }
            }
        },
        getStateColor() {
            return (state) => {
                if (this.stateList.find(item => item.value === state)) {
                    return this.stateList.find(item => item.value === state).color
                }
            }
        },
        getInstate() {
            return (state) => {
                if (this.instateList.find(item => item.value === state)) {
                    return this.instateList.find(item => item.value === state).label
                }
            }
        },
        getInstateColor() {
            return (state) => {
                if (this.instateList.find(item => item.value === state)) {
                    return this.instateList.find(item => item.value === state).color
                }
            }
        },
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
            maxHeight: window.innerHeight - 250
            
        }
    },
    methods: {
        handleSelectionChange(row) {
            this.$emit('handleSelectionChange', row)
        }
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 250
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