<template>
    <el-table
        :data="tableData"
        :max-height="maxHeight"
        style="width: 100%"
        @selection-change="selectionChange"
    >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="ticket_num" label="批次号" align="center">
            <template slot-scope="{ row }">
                <router-link :to="`/order/picking/orderinfo/${row.ticket_num}`">
                    <span class="blue-color">{{ row.ticket_num }}</span>
                </router-link>
            </template>
        </el-table-column>
        <!-- <el-table-column prop="sku" label="SKU" align="center" /> -->
        <el-table-column prop="order_count" label="订单数量" align="center" />
        <el-table-column prop="sku_count" label="SKU数量" align="center" />
        <el-table-column prop="pack_size" label="是否大件" align="center" />
        <el-table-column prop="warehouse" label="仓库" align="center" />
        <el-table-column prop="partition" label="分区" align="center" />
        <el-table-column prop="pick_staff_name" label="拣货人" align="center" />
        <el-table-column
            prop="start_pick_date"
            label="开始拣货时间"
            align="center"
        />
        <el-table-column
            prop="end_pick_date"
            label="拣货完成时间"
            align="center"
        ></el-table-column>
        <el-table-column prop="type" label="拣货状态" align="center">
            <template slot-scope="{ row }">
                <span :style="{ color: getColor(row.type) }">{{
                    row.type
                }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="is_printed" label="是否打印拣货单" align="center">
            <template slot-scope="{ row }">
                {{ row.is_printed ? '已打印' : '未打印' }}
            </template>
        </el-table-column>
        <el-table-column prop="transAmount" label="操作" align="center">
            <template slot-scope="{ row }">
                <el-button
                    type="text"
                    size="mini"
                    @click="
                        printPicking({ pick_batch_number: row.ticket_num, type: 1, params })
                    "
                    v-if="showButtons.print"
                    :disabled="disabledFun(row)"
                    >打印拣货单</el-button
                >
                <el-button
                    type="text"
                    size="mini"
                    @click="
                        printPicking({ pick_batch_number: row.ticket_num, type: 2, params })
                    "
                    v-if="showButtons.printAgain"
                    :disabled="disabledFunAgnin(row)"
                    >二次打印</el-button
                >
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
    name: 'TableContent',
    props: {
        tableData: {
            type: Array,
            default: () => [],
        },
        params: {
            type: Object,
            required: true,
        }
    },
    computed: {
        ...mapState('Order', ['pickingStatusList', 'showButtons']),
        disabledFun() {
            return (item) => {
                return item.type === '已作废' || item.is_printed === 1 && item.sec_print === 0
            }
        },
        disabledFunAgnin() {
            return (item) => {
                return item.type === '已作废' || item.is_printed === 0 || item.sec_print === 1
            }
        },
        getColor() {
            return (type) => {
                const item = this.pickingStatusList.find(
                    (item) => item.label === type
                )
                if (item) {
                    return item.color
                }
            }
        },
    },
    data() {
        return {
            maxHeight: window.innerHeight - 230,
        }
    },
    methods: {
        selectionChange(items) {
            this.$emit('selectionChange', items)
        },
        ...mapActions('Order', ['printPicking']),
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 230
        }
    },
}
</script>