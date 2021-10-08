<template>
    <main>
        <detail-title title="新增入库单" />
        <detail-header>
            <span>新增入库单</span>
            <span v-html="msg" class="warning"></span>
        </detail-header>
        <detail-head :detail="detail" :show="true" />
        <search-sku @doFilterSku="doFilterSku">
            <billFee @billFeeChange="billFeeChange" />
        </search-sku>
        <detail-table :tableData="detailItems" />
        <div class="action-remark">
            <div>
                <span>备注：</span>
                <el-input
                    type="textarea"
                    v-model="detail.remark"
                    placeholder="请输入备注"
                />
            </div>
            <action-group
                @handleClick="handleClick"
                @uploadSuccess="uploadSuccess"
                :uploaddUrl="uploadAddress"
                :detail="detail"
            />
        </div>
    </main>
</template>
<script>
import detailTitle from '@/components/DetailTitle'
import detailHeader from '@/components/DetailTitle/head'
import detailHead from './components/detaiHead'
import searchSku from '@/components/SearchSku'
import detailTable from './components/detailTable'
import actionGroup from '../components/Action'
import billFee from './components/billFee.vue'
import { common, otherIn } from '@/mixins/otherStock'
import { mapActions, mapMutations, mapState } from 'vuex'
import { message } from '@/utils/common'
export default {
    data() {
        return {
            msg: '切换店铺或者仓库会导致下面SKU清空!',
        }
    },
    mixins: [common, otherIn],
    components: {
        detailTitle,
        searchSku,
        detailTable,
        actionGroup,
        detailHeader,
        detailHead,
        billFee,
    },
    computed: {
        ...mapState('OtherIn', ['detail', 'detailItems']),
        uploadAddress() {
            return `${process.env.VUE_APP_FBA_API}/warehouse/sku/import/${
                this.detail.whouseId
            }/${this.detail.shopId}/${false}`
        },
    },
    beforeDestroy() {
        this.GET_BY_HOUSE([])
    },
    mounted() {
        this.getAllwarehouse()
    },
    methods: {
        ...mapActions('OtherIn', ['findSkuDetail', 'createTransfer']),
        ...mapActions(['getAllwarehouse']),
        ...mapMutations('OtherIn', ['APPORTION_FEE', 'SET_LIST']),
        ...mapMutations(['GET_BY_HOUSE']),
        doFilterSku(sku) {
            if (!this.detail.shopId) {
                message('warning', '请先选择店铺')
                return
            }
            if (!this.detail.whouseId) {
                message('warning', '请先选择仓库')
                return
            }
            if (this.detailItems.find((item) => item.sku === sku)) {
                message('warning', '当前的SKU已经存在')
                return
            }
            const { whouseId, shopId } = this.detail
            this.findSkuDetail({ whouseId, shopId, sku, required: false }).then(
                () => {
                    this.APPORTION_FEE()
                }
            )
        },
        billFeeChange(value) {
            this.SET_LIST({
                label: 'billFee',
                value,
            })
            this.APPORTION_FEE()
        },
        saveData() {
            if (!this.detail.shopId) {
                message('warning', '请先选择店铺')
                return
            }
            if (!this.detail.whouseId) {
                message('warning', '请先选择仓库')
                return
            }
            if (!this.detail.type) {
                message('warning', '请先选择入库类型')
                return
            }
            if (!this.detailItems.length) {
                message('warning', '当前没有可保存的数据')
                return
            }
            if (
                !this.detailItems.every(
                    (item) => item.skuCount && !isNaN(item.skuCount)
                )
            ) {
                message('warning', '入库数量必须大于0')
                return
            }
            const { whouseId, shopId, type, remark } = this.detail
            let data = {
                whouseId,
                shopId,
                type,
                remark,
                skuList: this.detailItems.map((item) => {
                    return {
                        headAmount: item.headAmount,
                        sku: item.sku,
                        price: item.skuPrice,
                        count: item.skuCount,
                    }
                }),
            }
            this.createTransfer({ data })
        },
    },
}
</script>
<style scoped lang="scss">
main {
    .warning {
        color: #ff6b6b;
        padding-left: 10px;
    }
}
</style>