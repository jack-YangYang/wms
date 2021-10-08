<template>
    <div class="detail-content" id="content">
        <div>
            <div>
                <span>采购单号:</span>
                <span>{{ detail.ticketCode }}</span>
            </div>
            <div>
                <span>快递单号:</span>
                <span>{{ detail.shipCode }}</span>
            </div>
        </div>
        <div>
            <div>
                <span>1688单号:</span>
                <span>{{ detail.alibabaCode }}</span>
            </div>
            <div>
                <span>采购仓库:</span>
                <span>{{ detail.whouseName }}</span>
            </div>
        </div>
        <div>
            <!-- <div>
                <span>采购店铺:</span>
                <span>{{ detail.shopName }}</span>
            </div> -->
            <div>
                <span>采购总金额:</span>
                <span>{{ detail.purchaseAmount + detail.taxAmount + detail.expressAmount }}</span>
            </div>
            <div>
                <span>采购总运费:</span>
                <span>{{ detail.expressAmount }}</span>
            </div>
        </div>
        <div>          
            <div>
                <span>采购总税费:</span>
                <span>{{ detail.taxAmount }}</span>
            </div>
            <div>
                <span>采购数量:</span>
                <span>{{ detail.purchaseCount }}</span>
            </div>
        </div>
        <div>
            
            <div>
                <span>计件/积分:</span>
                <el-select v-model="detail.unit">
                    <el-option label="计件" :value="0" />
                    <el-option label="积分" :value="1" />
                </el-select>
            </div>
            <div></div>
        </div>
        <!-- <div>
            <div>
                <span>归档数量:</span>
                <span>{{ detail.archCount }}</span>
            </div>
            <div>
                <span>采购数量:</span>
                <span>{{ detail.purchaseCount }}</span>
            </div>
        </div> -->
        <!-- <div>
            <div>
                <span>采购仓库:</span>
                <el-select v-if="show" v-model="detail.whouseId" filterable>
                    <el-option v-for="item in waehouseList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
                <span v-else>{{ detail.whouseName }}</span>
            </div>
            <div>
                <span>店铺:</span>
                <el-select 
                v-if="show"
                v-model="detail.shopId"
                placeholder="请输入店铺名" 
                filterable 
                style="width: 178px" 
                remote
                :loading="loading"
                :remote-method="remoteMethod"
                >
                    <el-option v-for="item in shopList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
                <span v-else>{{ detail.shopName }}</span>
            </div>         
        </div> -->
        <div v-if="show">
            <div>
                <span>是否需质检:</span>
                <el-select v-model="detail.qa">
                    <el-option label="是" :value="1" />
                    <el-option label="否" :value="0" />
                </el-select>
            </div>
            <div>
                <span>是否补单:</span>
                <el-select v-model="detail.supplement">
                    <el-option label="是" :value="1" />
                    <el-option label="否" :value="0" />
                </el-select>
            </div>
        </div>
        <!-- <div>
            <div>
                <span>已入库总金额:</span>
                <span>{{ detail.inAmount }}</span>
            </div>
            <div></div>
        </div> -->
        <!-- <div v-show="!flag">
            <div>
                <span>采购总运费:</span>
                <span>{{ detail.expressAmount }}</span>
            </div>
            <div>
                <span>总金额:</span>
                <span>{{ detail.purchaseAmount }}</span>
            </div>
        </div> -->
        <!-- <div v-show="!flag">
            <div>
                <span>已入库总金额:</span>
                <span>{{ detail.inAmount }}</span>
            </div>
            <div></div>
        </div> -->
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
    props: {
        type: {
            type: Number,
            default: 1
        },
        flag: {
            type: Boolean,
            default: false
        },
        detail: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        purchaseAmount() {
            // return (item) => { 
                return this.detail.purchaseAmount + this.detail.taxAmount + this.detail.expressAmount
            // }
        },
        ...mapState({
            loading: state => state.common.loading,
            shopList: state => state.common.shopList,
            waehouseList: state => state.common.waehouseList
        }),
        show() {
            return this.type === 2
        }
    },
    methods: {
        ...mapActions(['getAllShop']),
        remoteMethod(query) {
            this.getAllShop(query)
        },
    },
}
</script>
<style scoped lang="scss">

</style>