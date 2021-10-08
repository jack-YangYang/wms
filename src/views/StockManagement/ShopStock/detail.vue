<template>
    <main>
        <detail-title title="SKU库存详情" :tableData="asins" />
        <sku-table :tableData="asins" />
        <detail-title title="在途库存详情" />
        <trans-table :tableData="detail"   />
        <div class="back">
            <el-button type="primary" size="mini" @click="$router.go(-1)">返回</el-button>
        </div>
    </main>
</template>
<script>
import detailTitle from '@/components/DetailTitle'
import skuTable from './components/skuTable'
import transTable from './components/transTable'
import { mapActions, mapState } from 'vuex'
export default {
    components: {
        detailTitle,
        transTable,
        skuTable
    },
    computed: {
        ...mapState('Stock', [
            'asins',
            'detail'
        ])
    },
    methods: {
        ...mapActions('Stock', ['getContent']),
    },
    mounted() {
        const { whouseId, sku, shopId } = this.$route.params
        if (whouseId && sku && shopId) {
            this.getContent({ whouseId, shopId, sku })
        }
    }
}
</script>
<style scoped>
.back {
    display: flex;
    flex-direction: row-reverse;
    padding: 5px 0;
}
</style>