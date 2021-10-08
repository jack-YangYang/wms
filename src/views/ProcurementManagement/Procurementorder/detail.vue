<template>
    <main>
        <detail-title />
        <detail-header>
            <span>采购单号: {{ ticketCode }}</span>
        </detail-header>
        <detail-content  :detail="detail" :flag="false" :type="type" />
        <detail-table :detailItems="detailItems" @handleSelectionChange="handleSelectionChange" :type="type" />
        <div class="content-table">
            <ul>
                <li>
                    <router-link :to="{ name: 'Procurementorder' }">
                        <el-button type="primary" size="mini">返回</el-button>
                    </router-link>     
                </li>
                <li>
                    <el-button type="primary" v-if="type == 2" size="mini" @click="generatePutinStorageOrder">生成入库单</el-button>
                </li>
                <li>
                    <span>入库备注：</span>
                    <el-input v-model="note" :disabled="type == 1" clearable placeholder="请输入" type="textarea" maxlength="300" show-word-limit />
                </li>
            </ul>
        </div>
        <transition name="fade-transform" mode="out-in">
            <shop-info-module 
            :tableData="shopInfoTable" 
            :type="1"
            :showModule="showShopInfoModule" 
            @handleSubmit="GET_SHOP_INFO_DATA"
            v-if="showShopInfoModule" />
        </transition>
    </main>
</template>
<script>
import detailTitle from '@/components/DetailTitle'
import detailHeader from '@/components/DetailTitle/head'
import detailContent from './components/detailContent'
import detailTable from './components/detail-table'
import shopInfoModule from '@/components/GetShopInfo'
import { mapActions, mapMutations, mapState } from 'vuex'
import { message } from '@/utils/common'
export default {
    components: {
        detailTitle,
        shopInfoModule,
        detailHeader,
        detailTable,
        detailContent
    },
    data() {
        return {
            checkedList: [],
            type: 2,
            note: null,
            ticketCode: null
        }
    },
    computed: {
        ...mapState('Procurementorder', [
            'detail',
            'showShopInfoModule',
            'shopInfoTable',
            'detailItems'
        ])
    },
    methods: {
        handleSelectionChange(row) {
            this.checkedList = row
        },
        ...mapActions('Procurementorder', [
            'getPurchaseOrderDetail',
        ]),
        ...mapMutations('Procurementorder', [
            'GET_SHOP_INFO_DATA'
        ]),
        ...mapActions(['getAllwarehouse']),
        fn(data) {
            return data.filter(item => this.checkFn(item))
        },
        checkFn(item) {
            return item.count <= (item.purchaseCount - item.signCount) && item.count && !isNaN(item.count)
        },
        generatePutinStorageOrder() {
            /* 判断当前有没有填写入库数量 */
            let list = [] // 父集数据
            let childList = [] // 
            if (this.detailItems.length === 1) {
                list = this.fn(this.detailItems)
                childList = this.fn(this.detailItems[0].children || [])
            }
            else if (!this.checkedList.length || this.checkedList.length > 1) {
                message('warning', '请先勾选需要生成入库单的单据并且只能勾选一条')
                return
            } 
            else {
                list = this.fn(this.checkedList)
                childList = this.fn(this.checkedList[0].children || [])
            }
            if (!list.length && !childList.length) {
                message('warning', '入库数量不能大于采购量和签收量的差值')
                return
            }
            const { whouseId, shopId, supplement, qa, unit } = this.detail
            const prepareData = list.map(({ sku, count }) => {
                return {
                    sku,
                    count
                }
            })
            let data = {
                ticketOrder: this.ticketCode,
                whouseId,
                type: 0,
                unit,
                supplement,
                qa,
                remark: this.note,
                priceList: list.map(({ price, taxPrice, sku, expressPrice }) => {
                    return {
                        price,
                        taxPrice,
                        expressPrice,
                        sku
                    }
                })
            }
            this.$store.dispatch('Procurementorder/generatePurchaseIn', { details: data, prepareData, childList })
        },
    },
    async created() {
        let { ticketCode, type } =  this.$route.query
        this.ticketCode = ticketCode
        this.type = type * 1
        this.getPurchaseOrderDetail({ ticketCode, type })
        if (type * 1 === 2) {
            this.getAllwarehouse()
        }
        // await this.$store.dispatch('Procurementorder/getPurchaseOrderDetail', { ticketCode, type })
    }
}
</script>
<style scoped lang="scss">
.content-table {
        ul {
            display: flex;
            list-style: none;
            align-items: center;
            flex-direction: row-reverse;
            background: #F5F7FA;
            margin: 0;
            padding: 10px 0;
            li:last-child {
                width: 30%;
                display: flex;
                align-items: center;
                span {
                    color: #34495e;
                    min-width: 100px;
                    display: inline-block;
                    text-align: right;
                }
            }
            li {
                margin-right: 15px;
            }
        }
        i {
            color: red;
        }
        .gray-block {
            background-color: #34495e;
            width: 80%;
            display: inline-block;
            height: 32px;
            line-height: 32px;
        }
        font-size: 14px;
    }
</style>