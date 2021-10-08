<template>
    <div class="left">
        <div>
            <span>店铺:</span>
            <el-select 
                v-if="show"
                v-model="detail.shopId"
                @change="changeShop(detail.shopId)"
                placeholder="请输入店铺名" 
                filterable 
                reserve-keyword
                remote
                :loading="loading"
                :remote-method="remoteMethod"
                >
                    <el-option v-for="item in shopList" :label="item.label" :value="item.value" :key="item.value" />
            </el-select>
            <span v-else>{{ detail.shopName }}</span>
        </div>
        <div>
            <span>主仓库:</span>
            <el-select v-if="show" v-model="detail.whouseId" @change="CAHNGE_ITEMS([])">
                <el-option v-for="item in waehouseList" :label="item.label" :value="item.value" :key="item.value" />
            </el-select>
            <span v-else>{{ detail.whouseName }}</span>
        </div>
        <div>
            <span>入库类别:</span>
            <el-select v-if="show" v-model="detail.type" @change="CHANGE_IN_TYPE(detail.type)">
                <el-option v-for="item in otherInTypeList" :label="item.name" :value="item.val" :key="item.val" />
            </el-select>
            <span v-else>{{ detail.typeName }}</span>
        </div>
        <!-- <div>
            <span>备注:</span>
            <el-input 
            type="textarea" 
            :disabled="!show"
            :maxlength="300"
            show-word-limit 
            v-model="detail.remark" />
        </div> -->
    </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        detail: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            query: ''
        }
    },
    watch:{
        'detail.shopId': {
            handler(val) {
                // this.getshopBindHouse({ shopId: val })
            }
        }
    },
    computed: {
       ...mapState({
        //    shopBindHouse: state => state.common.shopBindHouse,
           waehouseList: state => state.common.waehouseList,
           shopList: state => state.common.shopList,
           loading: state => state.common.loading,
           otherInTypeList: state => state.OtherIn.otherInTypeList
       })
    },
    methods: {
        ...mapMutations('OtherIn', ['CAHNGE_ITEMS', 'CHANGE_HOUSE', 'CHANGE_IN_TYPE']),
        ...mapActions(['getAllShop', 'getshopBindHouse']),
        remoteMethod(query) {
            this.getAllShop(query)
        },
        changeShop(val) {
            // this.CHANGE_HOUSE()
            // this.CAHNGE_ITEMS([])
        }
    }
}
</script>
<style scoped lang="scss">
div.left {
    border-right: 1px solid #dfe6ec;
    padding-left: 10px;
    // font-size: 12px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dfe6ec;
    & > div {
        display: flex;
        flex: 1;
        align-items: center;
        min-height: 48px;
        // border-bottom: 1px solid #dfe6ec;
        color: #34495e;
        & > span:nth-child(1) {
            margin-right: 10px;
            font-weight: 600;
        }
        .el-textarea {
            width: 80%;
            .el-textarea__inner {
                height: 80%;
            }
        }
    } 
    @media (max-width:1280px) {
        flex-wrap: wrap;
        border-bottom: none;
        & > div {
            flex: none;
            width: 100% ;
            border-bottom: 1px solid #dfe6ec;
            & > span:nth-child(1) {
                min-width: 60px;
                text-align: right;
            }
        }
    }
}
</style>