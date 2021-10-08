<template>
    <main>
        <detail-title title="订单明细" />
        <order-table :tableData="ordersTable" />
        <el-button type="primary" size="mini" @click="$router.go(-1)">返回</el-button>
    </main>
</template>
<script>
import detailTitle from '@/components/DetailTitle' 
import orderTable from './components/orderInfoTable'
import { mapState } from 'vuex'
export default {
    props: ['orderId'],
    components: {
        detailTitle,
        orderTable
    },
    computed: {
        ...mapState('Order', ['ordersTable'])
    },
    mounted() {
        if (!this.orderId) {
            message('warning', '未获取到批次号')
            return
        }
        this.$store.dispatch('Order/getOrdersInfo', { ticket_num: this.orderId })
    }
}
</script>
<style scoped>
.el-button {
    float: right;
    margin-top: 15px !important;
    margin-right: 0 !important;
}
</style>