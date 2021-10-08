<template>
    <el-table 
    :data="tableData" 
    :max-height="maxHeight"
    @selection-change="items => $emit('selectionData', items)"
    style="width: 100%"
    >
        <el-table-column type="selection" align="center" width="50" />
        <el-table-column label="单据编号" prop="createUserName" align="center">
           <template slot-scope="{row}">
               <span class="blue-color" @click="goToEditAsin(row)">{{ row.ticketCode }}</span>
           </template>
        </el-table-column>
        <el-table-column label="单据状态" prop="" align="center">
            <template slot-scope="{row}">
                <span :style="{color: getState(row.state, 'color')}">
                    {{ getState(row.state, 'label') }}
                </span>
            </template>
        </el-table-column>
        <el-table-column label="创建人" prop="createUserName" align="center" />
        <el-table-column label="创建时间" prop="createDate" align="center" />
        <el-table-column label="仓库" prop="whouseName" align="center" />
        <el-table-column label="店铺" prop="shopName" align="center" />
        <!-- <el-table-column label="SKU" prop="" align="center" />
        <el-table-column label="调出ASIN" prop="" align="center" />
        <el-table-column label="调入ASIN" prop="" align="center" /> -->
        <el-table-column label="调拨数量" prop="totalCount" align="center" />
        <el-table-column label="调拨金额" prop="totalAmount" align="center" />
        <el-table-column label="审核人" prop="checkUserName" align="center" />
        <el-table-column label="审核时间" prop="checkDate" align="center" />
        <el-table-column label="备注" prop="remark" align="center" />
        <el-table-column label="操作" prop="" align="center">
            <template slot-scope="{row}">
                <el-button type="text"
                :disabled="disableButton(row.state, 1)"
                 @click="$emit('auditAsin', row.ticketCode)">审核</el-button>
                <el-button 
                :disabled="disableButton(row.state, 2)"
                type="text" 
                @click="$emit('invalidAsin', row.ticketCode)">作废</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import { mapState } from 'vuex'
export default {
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
    },
    computed: {
        ...mapState('AsinTransfer', [
            'statusList'
        ]),
        disableButton() {
            return (state, type) => {
                if (type === 1) return state !== 1
                return state === 4 || state === 2
            }
        },
        getState() {
            return (state, type) => {
                if (this.statusList[state]) {
                    return this.statusList[state][type]
                }
                return ''
            }
        }
    },
    data() {
        return {
            maxHeight: window.innerHeight - 300
        }
    },
    methods: {
        goToEditAsin(item) {
            const { state, ticketCode } = item
            this.$router.push({
                name: 'AddAsinTransfer',
                query: {
                    state,
                    ticketCode
                }
            })
        }
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 300
        }
    }
}
</script>