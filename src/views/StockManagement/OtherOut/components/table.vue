<template> 
    <el-table 
    :data="tableData" 
    :max-height="maxHeight"
    @selection-change="handleSelectionChange"
    style="width: 100%"
    :header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
    >   <el-table-column type="selection" align="center" width="50" />
        <el-table-column prop="ticketCode" label="出库单号" align="center">
            <template slot-scope="{ row }">
                <router-link :to="{ name: 'EditOtherOut', query: query(row) }">
                    <span class="blue-color">{{ row.ticketCode }}</span>
                </router-link>
            </template>
        </el-table-column>
        <el-table-column prop="site" label="单据状态" align="center">
            <template slot-scope="{ row }">
                <span :style="{ color: documentsStatusList[row.state].color }">{{ documentsStatusList[row.state].type }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" align="center" sortable />
        <el-table-column label="出库类别" align="center" >
            <template slot-scope="{row}">
                <span :style="{ color:  outTypeFormat[row.type].color }">{{ outTypeFormat[row.type].name }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="whouseName" label="仓库" align="center" />
        <el-table-column prop="shopName" label="店铺" align="center" show-overflow-tooltip />
        <el-table-column prop="createUserName" label="制单人" align="center" />
        <el-table-column prop="totalCount" label="出库数量" align="center" sortable />
        <el-table-column prop="headAmount" label="头程金额" align="center" sortable />
        <el-table-column prop="totalAmount" label="出库金额" align="center" sortable />
        <el-table-column prop="checkUserName" label="审核人" align="center" />
        <el-table-column prop="checkDate" label="审核时间" align="center" />
        <el-table-column prop="remark" label="备注" align="center" />
        <el-table-column label="操作" align="center" width="170">
            <template slot-scope="{ row }">
                <el-button 
                size="small" 
                type="warning" 
                @click="handleClick(row)" 
                v-if="showButtons.audit"
                :disabled="disabledButtons(row)">审核</el-button>
                <el-button 
                size="small" 
                type="danger"
                @click="invalid(row)"
                v-if="showButtons.invalid"
                :disabled="disabledInvalid(row)">作废</el-button>
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
            documentsStatusList: state => state.OtherOut.documentsStatusList,
            tableData: state => state.OtherOut.tableData,
            outTypeFormat: state => state.OtherOut.outTypeFormat,
            showButtons: state => state.OtherOut.showButtons
        }),
        query() {
            return (item) => {
                return {
                    ticketCode: item.ticketCode,
                    type: item.state === 1 ? 'edit' : 'view'
                }
            }
        },
        disabledInvalid() {
            return (item) => {
                return item.state === 2 || item.state === 4
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
        ...mapMutations('OtherOut', {
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