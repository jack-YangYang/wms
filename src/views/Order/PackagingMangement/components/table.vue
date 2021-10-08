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
            </template></el-table-column
        >
        <el-table-column prop="sku_count" label="SKU数量" align="center">
        </el-table-column>
        <el-table-column prop="order_count" label="订单数量" align="center" />
        <!-- <el-table-column prop="sku" label="SKU" align="center" /> -->
        <el-table-column prop="pack_staff_name" label="打包人" align="center" />

        <!-- <el-table-column prop="end_pick_date" label="拣货完成时间" align="center" /> -->
        <el-table-column
            prop="start_pack_date"
            label="拣货完成时间"
            align="center"
        />
        <el-table-column
            prop="end_pack_date"
            label="打包完成时间"
            align="center"
        ></el-table-column>
        <el-table-column prop="transPrice" label="状态" align="center">
            <template slot-scope="{ row }">
                <span :style="{ color: getColor(row.type) }">{{
                    row.type
                }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="transAmount" label="操作" align="center">
            <template slot-scope="{row}">
                <!-- <el-button type="text" size="mini" @click="goToPackaging(row.ticket_num)" v-if="showButtons.packaging">打包核单</el-button> -->
                <router-link :to="`/order/packaging/touching/${row.ticket_num}`">
                    <el-button type="text" size="mini" v-if="showButtons.packaging">打包核单</el-button>
                </router-link>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import { mapState } from 'vuex'
import { getToken, getStaffName, getStaffId } from '@/utils/auth'
export default {
    name: 'TableContent',
    props: {
        tableData: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        ...mapState('Order', ['packageStatusList', 'showButtons']),
        getColor() {
            return (type) => {
                console.log(this.packageStatusList)
                const item = this.packageStatusList.find(
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
        goToPackaging(orderId) {
            let token = getToken()
            let url = process.env.VUE_APP_PACKING_PRINT
            let staffId = getStaffId()
            let staffName = getStaffName()
            window.open(
                `${url}/packaging/touching?orderId=${orderId}&token=${token}&staffName=${staffName}&staffId=${staffId}`
            )
        },
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 230
        }
    },
}
</script>