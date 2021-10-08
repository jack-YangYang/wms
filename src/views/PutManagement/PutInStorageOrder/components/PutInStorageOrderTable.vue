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
                <router-link :to="{ name: 'PutInStorageConent', query: { ticketCode: row.ticketCode, type: 1, state: row.state } }">
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
        <el-table-column prop="unit" label="计件/积分" align="center">
            <template slot-scope="{row}">
                {{ row.unit ? '积分' : '计件'}}
            </template>
        </el-table-column>
        <el-table-column prop="supplement" label="是否补单" align="center">
            <template slot-scope="{row}">
                {{ row.supplement ? '是' : '否'}}
            </template>
        </el-table-column>
        <el-table-column prop="supplement" label="是否需质检" align="center">
            <template slot-scope="{row}">
                {{ row.qa ? '是' : '否'}}
            </template>
        </el-table-column>
        <!-- <el-table-column prop="supplement" label="计件/积分" align="center">
            <template slot-scope="{row}">
                {{ row.qa ? '是' : '否'}}
            </template>
        </el-table-column> -->
        <!-- <el-ta<el-table-column prop="supplement" label="是否需质检" align="center">
            <template slot-scope="{row}">
                {{ row.qa ? '是' : '否'}}
            </template>
        </el-table-column>ble-column prop="shipOrder" label="快递单号" align="center" />
        <el-table-column prop="alibabaId" label="1688单号" align="center" /> -->
        <el-table-column prop="purchaseCount" label="入库单状态" align="center">
            <template slot-scope="{row}">
                <span :style="{ color: colorStateList[row.state] }">{{ row.state | getStateName(row.state) }}</span>
            </template>
        </el-table-column>  
        <!-- <el-table-column prop="" label="是否补单" align="center" show-overflow-tooltip />   -->
        <el-table-column prop="whouseName" label="仓库" align="center" show-overflow-tooltip />
        <!-- <el-table-column prop="shopName" label="店铺" align="center" show-overflow-tooltip /> -->
        <el-table-column prop="createUserName" label="制单员" align="center"></el-table-column>
        <el-table-column prop="createDate" label="制单时间" align="center" />
        <el-table-column prop="markUserName" label="贴标人" align="center" show-overflow-tooltip />
        <el-table-column prop="markDate" label="贴标时间" align="center" />
        <el-table-column prop="qaCount" label="质检合格数量" align="center"/>
        <el-table-column prop="planCount" label="计划入库数量" align="center" />
        <!-- <el-table-column prop="purchaseCount" label="采购量" align="center" /> -->
        <!-- <el-table-column prop="totalAmount" label="实际入库金额" align="center" />
        <el-table-column prop="createDate" label="计划入库金额" align="center" /> -->
        <el-table-column prop="inAmount" label="入库总金额" align="center">
            <template slot-scope="{row}">
                {{ inAmountTotal(row) }}
            </template>
        </el-table-column>
        <!-- <el-table-column prop="inTotalAmount" label="入库成本" align="center" /> -->
        <!-- <el-table-column prop="inExpressAmount" label="运费" align="center">
            <template slot-scope="{row}">
                {{ row.state === 3 ? row.planExpressAmount : row.inExpressAmount }}
            </template>
        </el-table-column> -->
        <!-- <el-table-column prop="checkDate" label="审核时间" align="center" /> -->
        <!-- <el-table-column prop="checkUser" label="审核人" align="center" /> -->
        <!-- <el-table-column prop="inTaxAmount" label="税费" align="center" /> -->
        <el-table-column prop="qaUserName" label="质检人" align="center" />
        <el-table-column prop="qaStartDate" label="开始质检时间" align="center" />
        <el-table-column prop="qaDate" label="质检完成时间" align="center" show-overflow-tooltip>
            <!-- <template slot-scope="{row}">
                {{ row.state === 3 ? '' : row.inspectionDate }}
            </template> -->
        </el-table-column>   
        <el-table-column prop="qaDate" label="耗时" align="center">
            <template slot-scope="{row}">
                {{ getTiming(row) }}
            </template>
        </el-table-column>   
        <!-- <el-table-column prop="shelfUserName" label="上架人" align="center" />
        <el-table-column prop="shelfDate" label="上架时间" align="center" />  -->
        <el-table-column prop="money" label="操作" align="center" fixed="right" width="130px">
            <template slot-scope="scope">
                <!-- <el-button type="text" :disabled="row.state !== 60" v-if="row.state !== 10 &&showButtons.mark" @click="confirmMark(row.ticketCode)">确认贴标</el-button>
                <el-button type="text" v-if="!isShow(row.state) && showButtons.invalid" @click="invalid(row.ticketCode)">作废</el-button>
                <router-link :to="{ name: 'PutInStorageConent', query: { ticketCode: row.ticketCode, type: 0, state: row.state } }">
                    <el-button type="text" v-if="row.state === 10 && showButtons.testing">质 检</el-button>
                    <el-button type="text" v-if="row.state === 70 && showButtons.edit">修 改</el-button>
                </router-link>     -->
                <div style="display: flex; justify-content: center" class="downmenu">
                    <el-button
                        class="down-button"
                        style="
                            border-top-right-radius: 0;
                            border-bottom-right-radius: 0;
                            padding-left: 10px;
                            padding-right: 10px;
                        "
                        type="info"
                        size="small"
                        :disabled="true"
                        >下拉选择</el-button
                    >
                    <el-dropdown
                        trigger="hover"
                        icon="el-icon-s-tools"
                        :show-timeout="0"
                        @command="operate"
                    >
                        <el-button
                            style="
                                border-top-left-radius: 0;
                                border-bottom-left-radius: 0;
                                border-left: 0;
                                width: 5px;
                            "
                            type="info"
                            size="small"
                        >
                            <div style="display: flex; justify-content: center">
                                <i class="el-icon-arrow-down el-icon--right" />
                            </div>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                v-if="
                                    !isShow(scope.row.state) &&
                                    showButtons.invalid
                                "
                                :command="
                                    beforeHandleCommand(
                                        '1',
                                        scope.$index,
                                        scope.row
                                    )
                                "
                            >
                                作废
                            </el-dropdown-item>
                            <el-dropdown-item
                                v-if="
                                    scope.row.state === 10 &&
                                    showButtons.testing
                                "
                                :command="
                                    beforeHandleCommand(
                                        '2',
                                        scope.$index,
                                        scope.row
                                    )
                                "
                            >
                                质检
                            </el-dropdown-item>
                            <el-dropdown-item
                                v-if="scope.row.state === 70 && showButtons.edit"
                                :command="
                                    beforeHandleCommand(
                                        '3',
                                        scope.$index,
                                        scope.row
                                    )
                                "
                            >
                                修改
                            </el-dropdown-item>
                            <el-dropdown-item
                                :disabled="scope.row.state !== 60"
                                v-if="
                                    scope.row.state !== 10 &&
                                    showButtons.true
                                "
                                :command="
                                    beforeHandleCommand(
                                        '4',
                                        scope.$index,
                                        scope.row
                                    )
                                "
                            >
                                确认贴标
                            </el-dropdown-item>
                            <el-dropdown-item
                                :disabled="scope.row.print != '0'"
                                v-if="showButtons.printOrder"
                                :command="
                                    beforeHandleCommand(
                                        '5',
                                        scope.$index,
                                        scope.row
                                    )
                                "
                            >
                                打印入库单
                            </el-dropdown-item>

                            <el-dropdown-item
                                :disabled="scope.row.detailPrint != '0'"
                                v-if="showButtons.printLabel"
                                :command="
                                    beforeHandleCommand(
                                        '6',
                                        scope.$index,
                                        scope.row
                                    )
                                "
                            >
                                打印商品标签
                            </el-dropdown-item>
                            <el-dropdown-item
                                v-if="showButtons.againprintLabel"
                                :command="
                                    beforeHandleCommand(
                                        '7',
                                        scope.$index,
                                        scope.row
                                    )
                                "
                            >
                                二次打印
                            </el-dropdown-item>
                            <!-- <el-dropdown-item
                                :disabled="scope.row.state !== 10 || scope.row.qaStartDate"
                                :command="
                                    beforeHandleCommand(
                                        '8',
                                        scope.$index,
                                        scope.row
                                    )
                                "
                            >
                                开始质检
                            </el-dropdown-item> -->
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </template>

        </el-table-column>
  </el-table>
</template>
<script>
import { confirmMsg } from '@/utils/common'
// :disabled="scope.row.detailPrint != '0'"
// :disabled="scope.row.print != '0'"
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState('PutInStorageOrder', [
            'colorStateList'
        ]),
        getTiming() {
            return item => {
                if (!item.qaDate || !item.qaStartDate) return '-'
                let timing = Math.abs(new Date(item.qaDate).getTime() - new Date(item.qaStartDate).getTime())/(1000 * 60)
                let hours = (timing / 60).toFixed(2)
                return hours + '时'
            }
        },
        inAmountTotal() {
            return item => {
                return item.qaAmount + item.qaExpressAmount + item.qaTaxAmount
            }
        },
        getTypeColor() {
            return (type) => {
                return type ? '#FD7272' : '#58B19F'
            }
        },
        isShow() {
            return (state) => {
                return [20, 100, 110].includes(state)
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
            maxHeight: window.innerHeight - 250,
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
        beforeHandleCommand(type, index, row) {
            return {
                type: type,
                index: index,
                row: row,
            }
        },
        invalid(ticketCode) {
            confirmMsg('warning', '提示', '你确定要作废吗？', () => {
                this.$emit('doInvalid', ticketCode)
            })
        },
        confirmMark(code) {
            this.$emit('mark', code)
        },
        operate({ type, index, row }) {
            //1.作废 2.质检 3.修改 4.确认贴标 5.打印入库单 6.打印商品标签 7.二次打印
            switch (type) {
                case '1':
                    confirmMsg('warning', '提示', '你确定要作废吗？', () => {
                        this.$emit('doInvalid', row.ticketCode)
                    })
                    break
                case '2':
                    this.$router.push({
                        name: 'PutInStorageConent',
                        query: {
                            ticketCode: row.ticketCode,
                            type: 0,
                            state: row.state,
                        },
                    })
                    break
                case '3':
                    this.$router.push({
                        name: 'PutInStorageConent',
                        query: {
                            ticketCode: row.ticketCode,
                            type: 0,
                            state: row.state,
                        },
                    })
                    break
                case '4':
                    this.$emit('mark', row.ticketCode)
                    break
                case '5':
                    this.$emit('printStorage', { type: 0, ticketCode: row.ticketCode })
                    break
                case '6':
                    this.$emit('printSkuLabel', row)
                    break
                case '7':
                    this.$emit('secondPrint', { type: 2, ticketCode: row.ticketCode })
                    break
                case '8':
                    this.$emit('startInspection', row.ticketCode)
            }
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
                    return '贴标完成'
                case 100:
                    return '上架完成'
                case 110:
                    return '采购退回'
            }
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
.downmenu {
    .el-button--info {
        margin-right: 0 !important;
    }
}
</style>