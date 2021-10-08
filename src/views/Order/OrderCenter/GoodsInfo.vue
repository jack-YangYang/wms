<template>
    <main>
        <detail-title title="商品明细" />
        <goods-table :tableData="goodsTable" />
        <el-button type="primary" size="mini" @click="$router.go(-1)">返回</el-button>
    </main>
</template>
<script>
import detailTitle from '@/components/DetailTitle' 
import goodsTable from './components/goodTable'
import { message } from '@/utils/common'
import { mapState } from 'vuex'
export default {
    props: ['orderId'],
    components: {
        detailTitle,
        goodsTable
    },
    computed: {
        ...mapState('Order', [
            'goodsTable'
        ])
    },
    mounted() {
        if (!this.orderId) {
            message('warning', '未获取到订单编号')
            return
        }
        this.$store.dispatch('Order/getGoodsInfo', { order_id: this.orderId })
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