<template> 
    <el-table 
    :data="tableData" 
    :max-height="maxHeight"
    @selection-change="handleSelectionChange"
    style="width: 100%"
    >   <el-table-column type="selection" align="center" width="50" />
        <el-table-column prop="ticketCode" label="入库单号" align="center">
            <template slot-scope="{ row }">
                <router-link :to="{ name: 'EditOtherIn', query: query(row)}">
                    <span class="blue-color">{{ row.ticketCode }}</span>
                </router-link>
            </template>
        </el-table-column>
        <el-table-column prop="site" label="单据状态" align="center">
            <template slot-scope="{ row }">
                <span :style="{ color: getColor(row.state) }">{{ getStateName(row.state) }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" align="center" sortable />
        <el-table-column label="入库类别" align="center" >
            <template slot-scope="{row}">
                <span :style="{ color: getTypeColor(row.type) }">{{getType(row.type) }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="whouseName" label="仓库" align="center" />
        <el-table-column prop="shopName" label="店铺" align="center" show-overflow-tooltip />
        <el-table-column prop="createUserName" label="制单人" align="center" />
        <el-table-column prop="totalCount" label="入库数量" align="center" sortable />
        <el-table-column prop="headAmount" label="账单运费" align="center" sortable />
        <el-table-column prop="totalAmount" label="入库金额" align="center" sortable />
        <el-table-column prop="checkUserName" label="审核人" align="center" />
        <el-table-column prop="checkDate" label="审核时间" align="center" />
        <el-table-column prop="remark" label="备注" align="center" />
        <el-table-column label="操作" align="center" width="170">
            <template slot-scope="{ row }">
                <el-button 
                size="mini" 
                type="warning" 
                @click="handleClick(row)" 
                v-if="showButtons.audit"
                :disabled="disabledButtons(row)">审核</el-button>
                <el-button 
                size="mini" 
                type="danger"
                v-if="showButtons.invalid"
                @click="invalid(row)" 
                :disabled="disabledButtons(row)">作废</el-button>
            </template>
        </el-table-column>
  </el-table>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { confirmMsg  } from '@/utils/common'
export default {
    name: 'TableContent',
    computed: {
        ...mapState({
            documentsStatusList: state => state.OtherIn.documentsStatusList,
            tableData: state => state.OtherIn.tableData,
            otherInTypeFormat: state => state.OtherIn.otherInTypeFormat,
            showButtons: state => state.OtherIn.showButtons
        }),
        query() {
            return (item) => {
                return {
                    ticketCode: item.ticketCode,
                    type: item.state === 1 ? 'edit' : 'view'
                }
            }
        },
        getColor() {
            return (state) => {
                return this.documentsStatusList[state] ? this.documentsStatusList[state].color : ''
            }
        },
        getStateName() {
            return (state) => {
                return this.documentsStatusList[state] ? this.documentsStatusList[state].type : ''
            }
        },
        getType() {
            return (type) => {
                return this.otherInTypeFormat[type] ? this.otherInTypeFormat[type].name : ''
            }
        },
        getTypeColor() {
            return (type) => {
                return this.otherInTypeFormat[type] ? this.otherInTypeFormat[type].color : ''
            }
        },
        disabledButtons() {
            return (item) => {
                return item.state === 2 || item.state === 4 || item.state === 3
            }
        },
    },
    data() {
        return {
            maxHeight: window.innerHeight - 250
        }
    },
    methods: {
        // sortTable({ column, prop, order }) {

        // },
        handleClick(item) {
            this.$emit('audit', item.ticketCode)
        },
        ...mapMutations('OtherIn', {
            handleSelectionChange: 'SELECT_TABLE'
        }),
        invalid(row) {
            confirmMsg('warning', '提示', '你确定要作废吗?', () => {
                this.$emit('invalid', row.ticketCode)         
            })   
        }
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 250
        }
    }
}
</script>