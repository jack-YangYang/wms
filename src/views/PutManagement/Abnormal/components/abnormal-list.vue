<template>
    <ul>
        <li>
            <span>SKU</span>
            <span>计划入库数量</span>
            <span>质检合格数量</span>
            <span>差异数量</span>
        </li>
        <li v-for="item in list" :key="item.id">
            <span class="sku" @click="getPurchaseOrderInfo({ ticketCode: item.ticketCode, sku: item.sku, type: 4 })">{{ item.sku }}</span>
            <span>{{ item.planCount }}</span>
            <span>{{ item.passCount }}</span>
            <span>{{ item.planCount - item.passCount }}</span>
        </li>
    </ul>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        ...mapActions('Abnormal', ['getPurchaseOrderInfo'])
    }
}
</script>
<style lang="scss" scoped>
ul {
    padding-left: 0;
    padding: 0;
    margin: 0;
    li {
        display: flex;
        padding: 15px 0;
        border-bottom: 1px solid #ccc;
        span {
            flex: 1;
            text-align: center;
            font-weight: bold;
            color: #333333;
        }
        span.sku{
            cursor: pointer;
            color: #0063E6;
        }
    }
}
</style>