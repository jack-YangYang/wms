<template>
    <el-table
    :data="tableData"
    :max-height="maxHeight"
    @selection-change="handleSelectionChange"
    :default-sort = "{prop: 'createDate', order: 'descending'}"
    >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="单号" align="center">
            <template slot-scope="{row}">
                <router-link :to="{ name: 'OperationalTransfersDetail', query: { ticketCode: row.ticketCode, type: 'view' } }">
                    <span class="blue-color">{{ row.ticketCode }}</span>
                </router-link>
            </template>
        </el-table-column>
        <el-table-column label="调出店铺" prop="sourceShopName" align="center" />
        <el-table-column label="调出仓库" prop="sourceWhouseName" align="center" />
        <el-table-column label="调入店铺" prop="distShopName" align="center" />
        <el-table-column label="调入仓库" prop="distWhouseName" align="center" />   
        <el-table-column label="总数量" prop="totalCount" align="center" />
        <el-table-column label="总金额" prop="totalAmount" align="center" />
        <el-table-column label="状态" prop="state" align="center">
            <template slot-scope="{ row }">
                <span :style="{ color: getStateColor(row.state) }">{{ getStateName(row.state) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="创建人" prop="createUserName" align="center" />
        <el-table-column label="创建时间" prop="createDate" align="center" sortable />
        <el-table-column label="审核人" prop="checkUserName" align="center"/>
        <el-table-column label="审核时间" prop="checkDate" align="center"/> 
        <el-table-column label="备注" prop="remark" align="center" />
        <el-table-column label="操作" align="center" width="240">
            <template slot-scope="{row}">
                <el-button type="warning" size="mini" @click="audit(row.ticketCode)" v-if="showAudit(row.state) && showButtons.audit">审核</el-button>
                <el-button type="danger" size="mini" @click="invalid(row.ticketCode)" v-if="showIavalid(row.state) && showButtons.invalid">作废</el-button>
                <router-link :to="{ path: '/stock/operationaltransfers/add', query: query(row) }">
                    <el-button type="primary" size="mini" v-if="showIavalid(row.state) && showButtons.edit">修改</el-button>
                </router-link>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import { mapState } from 'vuex'
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        // showIavalid: {
        //     type: Boolean,
        //     default: true
        // },
        showButtons: {
            required: true
        },
        tableData: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        ...mapState('OperationalTransfers', [
            'stateList'
        ]),
        showAudit() {
            return (state) => {
                return !this.show && [10, 30].includes(state)
            }
        },
        showIavalid() {
            return (state) => {
                return this.show && ![50, 60].includes(state)
            }
        },
        query() {
            return (item) => {
                return {
                    ticketCode: item.ticketCode,
                    type: 'edit'
                }
            }
        },
        getStateName() {
            return (state) => {
                return this.stateList[state] ? this.stateList[state].name : ''
            }
        },
        getStateColor() {
            return (state) => {
                return this.stateList[state] ? this.stateList[state].color : ''
            }
        },
    },
    data() {
        return {
            maxHeight: window.innerHeight - 250
        }
    },
    methods: {
        audit(ticketCode) {
            this.$emit('doAudit', ticketCode)
        },
        handleSelectionChange(data) {
            this.$emit('selectionChange', data)
        },
        invalid(ticketCode) {
            this.$emit('doInvalid', ticketCode)
        }
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 250
        }
    }
}
</script>