<template> 
    <el-table 
    :data="tableData" 
    :max-height="maxHeight"
    :height="height"
    style="width: 100%"
    @selection-change="handleSelectionChange"
    >  
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="checkCode" label="单据编号" align="center">
            <template slot-scope="{ row }">
                <router-link :to="{ name: 'Editinventory', query: query(row) }">
                    <span class="blue-color">{{ row.ticketCode }}</span>
                </router-link>
            </template>
        </el-table-column>
        <el-table-column prop="site" label="单据状态" align="center">
            <template slot-scope="{ row }">
                <span :style="{ color: getColor(row.state) }">{{ getType(row.state) }}</span>
            </template>
        </el-table-column>
        
        <el-table-column prop="whouseName" label="仓库" align="center"></el-table-column>    
        <el-table-column prop="originalCount" label="盘点前数量" align="center">
            <template slot-scope="{row}">
                {{ row.state === 2 ? row.originalCount : '-' }}
            </template>
        </el-table-column>
        <el-table-column prop="totalCount" label="盘点数量" align="center" />
        <el-table-column align="center" label="差值">
            <template slot-scope="{row}">
                {{ getCount(row) }}
            </template>
        </el-table-column>
        <!-- <el-table-column prop="skuOccupyCount" label="SKU占用量" align="center" /> -->
        <el-table-column prop="totalAmount" label="盘点总金额" align="center" />
        <el-table-column prop="createUserName" label="盘点人" align="center" />
        <el-table-column prop="createDate" label="制单日期" align="center"></el-table-column>  
        <el-table-column prop="checkUserName" label="审核人" align="center" />
        <el-table-column prop="checkDate" label="审核时间" align="center" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" align="center" width="240">
            <template slot-scope="{ row }">
                <el-button size="mini" type="warning" @click="handleClick(row)" :disabled="isDisabled(row.state)" v-if="showButtons.audit">审核</el-button>
                <el-button size="mini" type="danger" @click="invalid(row)" :disabled="isDisabled(row.state)" v-if="showButtons.invalid">作废</el-button>
                <router-link :to="{ name: 'Editinventory', query: { ticketCode: row.ticketCode, warehouseId: row.whouseId, type: 'edit' } }">
                    <!-- <el-button size="mini" type="danger" @click="edit(row)" v-if="!isDisabled(row.state)">修改</el-button> -->
                </router-link>          
            </template>
        </el-table-column>
  </el-table>
</template>
<script>
import { mapState } from 'vuex'
import { confirmMsg  } from '@/utils/common'
export default {
    name: 'TableContent',
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
        showButtons: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            maxHeight: window.innerHeight - 230
        }
    },
    computed: {
        ...mapState({
            colorList: state => state.common.colorList
        }),
        getCount() {
            return item => {
                if (item.state !== 2) return '-'
                if (item.originalCount !== '' && item.originalCount !== null) {
                    return Math.abs(item.originalCount - item.totalCount)
                }
                return '暂无'
            }
        },
        query() {
            return (item) => {
                return {
                    ticketCode: item.ticketCode, 
                    type: item.state ===1 ? 'edit' : 'view'
                }
            }
        },
        getColor() {
            return (state) => {
                return this.colorList[state] ? this.colorList[state].color : ''
            }
        },
        getType() {
            return (state) => {
                return this.colorList[state] ? this.colorList[state].type : ''
            }
        },
        isDisabled() {
            return (state) => {
                return [2, 3, 4].includes(state)
            }
        },
        height() {
            if (!this.tableData.length) {
                return '500px'
            }
        }
    },
    methods: {
        handleSelectionChange(val) {
            this.$emit('handleSelectionChange', val)
        },
        handleClick(item) {
            this.$emit('audit', item.ticketCode)
        },
        invalid(row) {
            confirmMsg('warning', '提示', '你确定要作废吗?', () => {
                this.$emit('invalid', row.ticketCode)         
            })   
        }
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 230
        }
    }
}
</script>