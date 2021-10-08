<template> 
    <el-table 
    :data="tableData" 
    :max-height="maxHeight"
    :cell-style="{padding:'10px 0px'}"
    :header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
    style="width: 100%"
    @selection-change="handleSelectionChange"
    >  
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="ticketCode" label="单据编号" align="center" show-overflow-tooltip>
            <template slot-scope="{ row }">
                <router-link :to="{ name: 'EditTransfers', query: query(row)}">
                    <span class="blue-color">{{ row.ticketCode }}</span>
                </router-link>
            </template>
        </el-table-column>
        <el-table-column prop="site" label="单据状态" align="center">
            <template slot-scope="{ row }">
                <span :style="{ color: colorList[row.state].color }">{{ colorList[row.state].type }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" align="center"></el-table-column> 
        <!-- <el-table-column prop="printState" label="拣货单状态" align="center">
            <template slot-scope="{ row }">
                <span :style="{ color: row.printState ? 'rgb(103, 194, 58)' : '#606266' }">{{ row.printState ? '已打印' : '未打印' }}</span>
            </template>
        </el-table-column>  -->
        <el-table-column prop="sourceWhouseName" label="调出仓库" align="center" show-overflow-tooltip />   
        <el-table-column prop="distWhouseName" label="调入仓库" align="center" show-overflow-tooltip />
        <el-table-column prop="createUserName" label="调拨人" align="center" />
        <el-table-column prop="totalCount" label="调拨数量" align="center" />
        <!-- <el-table-column prop="skuOccupyCount" label="SKU占用量" align="center" /> -->
        <el-table-column prop="totalAmount" label="调拨总金额" align="center" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" align="center" width="180">
            <template slot-scope="{ row }">
                <el-dropdown :split-button="true" type="priamry"  @command="handleCommand" size="mini" class="table-el-dropdown">
                    选择操作
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="showButtons.audit" :command="{ row, type: 'audit' }" style="width: 100px" :disabled="isDisabled(row.state)">审核</el-dropdown-item>
                        <!-- <el-dropdown-item :command="{ row, type: 'print' }" :disabled="row.printState === 1">打印拣货单</el-dropdown-item>
                        <el-dropdown-item :command="{ row, type: 'againPriit' }"  :disabled="row.printState === 0">二次打印拣货单</el-dropdown-item> -->
                        <!-- <el-dropdown-item :command="{ row, type: 'log' }" >操作日志</el-dropdown-item> -->
                        <el-dropdown-item v-if="showButtons.invalid" :command="{ row, type: 'invalid' }"  :disabled="row.state === 2 || row.state === 4 ">作废</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <!-- <el-button size="small" type="warning" @click="handleClick(row)" v-if="showButtons.audit" :disabled="row.state === 2 || row.state === 4 || row.state === 3">审核</el-button>
                <el-button size="small" type="danger" @click="invalid(row)"  :disabled="row.state === 2 || row.state === 4 ">作废</el-button> -->
            </template>
        </el-table-column>
  </el-table>
</template>
<script>
import { array } from 'jszip/lib/support'
import { confirmMsg } from '@/utils/common'
import { mapState } from 'vuex'
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
        }
    },
    data() {
        return {
            maxHeight: window.innerHeight - 250
        }
    },
    computed: {
         ...mapState({
            colorList: state => state.common.colorList
        }),
        isDisabled() {
            return (state) => {
                return [2, 3, 4].includes(state)
            }
        },
        query() {
            return (item) => {
                return {
                    ticketCode: item.ticketCode, 
                    type: item.state ===1 ? 'edit' : 'view'
                }
            }
        }
    },
    methods: {
        handleSelectionChange(data) {
            this.$emit('selectionChange', data)
        },
        handleCommand(item) {
            const { row, type } = item
            switch(type) {
                case 'audit':
                    this.$emit('audit', row.ticketCode)
                    return
                case 'invalid':
                    confirmMsg('warning', '提示', '你确定要作废吗?', () => {
                        this.$emit('invalid', row.ticketCode)         
                    })   
                    return
                case 'print':
                    this.$store.commit('Transfers/CHNAGE_CREATER_USER', sessionStorage.getItem('name'))
                    this.$emit('doPrint', row.ticketCode, 0)
                    return
                case 'edit': 
                    this.$router.push({
                        name: 'EditTransfers',
                        query: {
                            ticketCode: row.ticketCode,
                            type: 'edit'
                        }
                    })
                case 'againPriit':
                    this.$store.commit('Transfers/CHNAGE_CREATER_USER', sessionStorage.getItem('name'))
                    this.$emit('doPrint', row.ticketCode, 1)
                    return
                case 'log':
                    this.$emit('getLog', row.transferId)
            }
        },
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 250
        }
    }
}
</script>
<style  lang="scss">
.table-el-dropdown {
    .el-button-group {
        & > .el-button:nth-child(2) {
            height: 28px;
        }
    }
    .el-button {
        margin-right: 0 !important;
        background-color: #0063e6;
    }
    .el-dropdown__caret-button::before {
        width: 0;
    }
}
</style>