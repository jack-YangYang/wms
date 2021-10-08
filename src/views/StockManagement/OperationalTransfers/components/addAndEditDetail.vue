<template>
    <div class="detail-content" id="content">
        <div>
            <div>
                <span>调出店铺:</span>
                <el-select 
                    v-model="detail.sourceShopId"
                    :disabled="disabled"
                    @change="changeSpurceShop(detail.sourceShopId)"
                    placeholder="请输入店铺名" 
                    filterable 
                    reserve-keyword
                    remote
                    :loading="sourceShopLoading"
                    :remote-method="getAllSourceShopList"
                    >
                        <el-option v-for="item in sourceShopList" :label="item.shopName" :value="item.id" :key="item.value" />
                </el-select>
            </div>
            <div>
                <span>调出仓库:</span>
                <el-select v-model="detail.sourceWhouseId" @change="CAHNGE_ITEMS([])"  :disabled="disabled" >
                    <el-option v-for="item in waehouseList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </div>  
            
        </div>
        <div>
            <div>
                <span>调入店铺:</span>
                <el-select 
                    v-model="detail.distShopId"
                     :disabled="disabled"
                    @change="changeDistShop(detail.distShopId)"
                    placeholder="请输入店铺名" 
                    filterable 
                    reserve-keyword
                    remote
                    :loading="distShopLoading"
                    :remote-method="getAllDistShopList"
                    >
                        <el-option v-for="item in distShopList" :label="item.shopName" :value="item.id" :key="item.value" />
                </el-select>
            </div>    
            <div>
                <span>调入仓库:</span>
                <el-select v-model="detail.distWhouseId" :disabled="disabled" >
                    <el-option v-for="item in waehouseList" :label="item.label" :value="item.value" :key="item.value"/>
                </el-select>
            </div>       
        </div>  
    </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
    props: {
        detail: {
            type: Object,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState('OperationalTransfers', [
            'sourceShopLoading',
            'distShopLoading',
            'sourceWhouseList',
            'distWhouseList',
            'sourceShopList',
            'distShopList'
        ]),
        ...mapState({
            waehouseList: state => state.common.waehouseList,
        })
    },
    watch: {
        'detail.sourceShopId': {
            handler(val) {
                // this.getSourceShopBindHouse(val)
            }
        },
        'detail.distShopId': {
            handler(val) {
                // this.getDistShopBindHouse(val)
            }
        }
    },
    methods: {
        ...mapMutations('OperationalTransfers', [
            'CAHNGE_ITEMS',
            ''
        ]),
        changeSpurceShop(val) {
            this.detail.sourceWhouseId = null
            // this.getSourceShopBindHouse(val)
        },
        changeDistShop(val) {
            this.detail.distWhouseId = null
            // this.getDistShopBindHouse(val)
        },
        ...mapActions('OperationalTransfers', [
            'getAllSourceShopList',
            'getAllDistShopList',
            'getSourceShopBindHouse',
            'getDistShopBindHouse'
        ]),
    }
}
</script>