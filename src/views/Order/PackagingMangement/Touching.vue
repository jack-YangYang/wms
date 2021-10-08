<template>
    <main class="touching">
        <detail-title title="分拣核单详情" />
        <section class="section-content">
            <touching-detaill-head :headInfo="touchingInfo.ticket" />
            <el-input v-model="sku" placeholder="请扫描条形码或粘贴, 不要手动输入" clearable :autofocus="true" />
            <template v-if="touchingInfo.list.length">
                <touching-detail-item v-for="item in touchingInfo.list" :key="item.box_num" :item="item" />
            </template>
            <template v-else>
                <no-data-content />
            </template>
            <section class="btn-group">
                <el-button type="primary" size="mini" @click="$router.go(-1)">取消</el-button>
                <el-button type="primary" size="mini" @click="saveSubmit(false)">保存</el-button>
                <el-button type="primary" size="mini" @click="saveSubmit(true)">提交</el-button>
            </section>
        </section>
        
    </main>
</template>
<script>
import detailTitle from '@/components/DetailTitle' 
import touchingDetaillHead from './components/touching-detail-head'
import touchingDetailItem from './components/touching-detail-item'
import NoDataContent from "@/components/NoDataImages";
import { mapActions, mapState } from 'vuex'
import { message, debounce } from '@/utils/common'
export default {
    components: {
        detailTitle,
        touchingDetaillHead,
        touchingDetailItem,
        NoDataContent
    },
    props: ['orderId'],
    computed: {
        ...mapState('Order', ['touchingInfo']),
        sku: {
            get() {
                return this.$store.state.Order.sku
            },
            set(val) {
                this.$store.state.Order.sku = val
            }
        },
    },
    watch: {
        sku(val) {
            debounce(() => {
                this.checkSku({  batch_number: this.orderId, sku: val })
            }, 100)
        }
    },
    methods: {
        ...mapActions('Order', [
            'getTouchgingInfo',
            'checkSku',
            'cehckSubmit'
        ]),
        saveSubmit(type) {
            if (!type) {
                message('success', '保存成功')
                this.$router.go(-1)
                return
            }
            this.cehckSubmit({ batch_number: this.orderId })
        }
    },
    mounted() {
        if (!this.orderId) {
            message('warning', '当前未获取到批次号')
            return
        }
        this.getTouchgingInfo({ batch_number: this.orderId })
    }
}
</script>
<style scoped lang="scss">
main.touching {
    position: relative;
    .section-content {
        margin-top: 5px;
        padding: 5px 12px;
        border: 1px solid #ecf0f1;
        border-radius: 12px;
    }
    .el-input {
        width: 25%;
        margin: 10px 0;
    }
    .btn-group {
        position: fixed;
        bottom: 10px;
        width: 100%;
        z-index: 10;
        display: flex;
        justify-content: center;
    }
}
</style>