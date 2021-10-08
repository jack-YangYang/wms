<template>
    <main> 
        <detail-title title="修改出库单" />
        <detail-header>
            <span>修改出库单</span>
            <span v-html="msg" class="warning"></span>
        </detail-header>
        <detail-head :detail="detail"/>
        <search-sku @doFilterSku="doFilterSku" :isDisabled="!show" />
        <detail-table :tableData="detailItems" :isShowBtn="!show" />
        <div class="action-remark">
            <div>
                <span>备注：</span>
                <el-input type="textarea" v-model="detail.remark" placeholder="请输入备注" />
            </div>
            <action-group 
            @handleClick="handleClick" 
            @uploadSuccess="uploadSuccess" 
            :uploaddUrl="uploadAddress" 
            :detail="detail"  
            :show="show" />
        </div>
    </main>
</template>
<script>
import detailTitle from '@/components/DetailTitle'
import detailHeader from '@/components/DetailTitle/head'
import detailHead from './components/detailHead'
import searchSku from '@/components/SearchSku'
import actionGroup from '../components/Action'
import detailTable from './components/detailTable'
import { message  } from '@/utils/common'
import { mapState, mapActions } from 'vuex'
import { common, otherOut } from '@/mixins/otherStock'
export default {
    components: {
        detailTitle,
        actionGroup,
        detailHeader,
        detailHead,
        detailTable,
        searchSku,
    },
    data() {
        return {
            msg: '切换仓库会导致下面SKU清空!'
        }
    },
    mixins: [common, otherOut],
    computed: {
        ...mapState({
            detail: state => state.OtherOut.detail,
            detailItems: state => state.OtherOut.detailItems,
            ownWarehouseList: state => state.common.ownWarehouseList,
        }),
        uploadAddress() {
            return `${process.env.VUE_APP_FBA_API}/warehouse/sku/import/${this.detail.whouseId}/${this.detail.shopId}/${true}`
        },
        show() {
            const { type } = this.$route.query
            return type === 'edit'
        }
    },
    mounted() {
        // this.getTypeList()
        let { ticketCode } = this.$route.query
        this.ticketCode = ticketCode
        this.getContent(ticketCode)
        this.getAllwarehouse()
        // this.routerName = name
        // this.getAllWarehoureList()
    },
    methods: {
        doFilterSku(sku) {
            if (!this.detail.whouseId ) {
                message('warning', '请先选择仓库')
                return
            }
            if (this.detailItems.find(item => item.sku === sku)) {
                message('warning', '当前已有重复的sku，请不要重复添加')
                return
            }
            const { whouseId, shopId} = this.detail
            this.findSkuDetail({ whouseId, sku, shopId })
        },
        ...mapActions(['getAllwarehouse']),
        ...mapActions('OtherOut', [
            'getContent',
            'findSkuDetail',
            'createTransfer'
        ]),
        /* 保存 */
        saveData() {
            if (!this.detail.whouseId ) {
                message('warning', '请先选择仓库')
                return
            }
            if (!this.detail.type) {
                message('warning', '请先选择出库类型')
                return
            }
            if (!this.detailItems.length) {
                message('warning', '当前没有可保存的数据')
                return
            }
            if (!this.detailItems.every(item => item.skuCount && !isNaN(item.skuCount))) {
                message('warning', '入库数量必须大于0')
                return
            }
            const { whouseId, shopId, type, remark } = this.detail
            let data = {
                whouseId,
                shopId,
                type,
                remark,
                skuList: this.detailItems.map(item => {
                    return {
                        sku: item.sku,
                        price: item.skuPrice,
                        count: item.skuCount,
                    }
                })
            }
            this.createTransfer({ data, ticketCode: this.ticketCode})
        },
    }
}
</script>
<style scoped lang="scss">
main {
    .warning {
        color:  #ff6b6b;
        padding-left: 10px;
    }
}
</style>