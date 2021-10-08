<template>
    <el-table 
    :data="tableData" 
    style="width: 100%"
    @selection-change="selectionChange"
    >  
        <el-table-column type="selection" width="50" align="center" />
        <!-- <el-table-column prop="purchaseId" label="产品图片" align="center">
            <template slot-scope="{row}">    
                <el-popover placement="right" width="350" trigger="hover">
                    <img :src="row.skuImg" alt style="width:100%;" />
                    <div slot="reference" style="text-align: center">
                        <img
                        :src="row.skuImg"
                        alt
                        style="height: 67px;width: 80%;"
                        />
                    </div>
                </el-popover>
            </template>    
        </el-table-column> -->
        <el-table-column prop="sku" label="sku" align="center">
            <template slot-scope="{row}">
                {{ row.sku }}
            </template>
        </el-table-column>
        <el-table-column prop="shopName" align="center" label="店铺" />
        <!-- <el-table-column prop="skuName" label="中文名称" align="center" show-overflow-tooltip />
        <el-table-column prop="spaceCode" label="库位" align="center"></el-table-column>  -->
        <el-table-column prop="outCount" label="出库数量" align="center">
            <template slot="header">
                <i>*</i>
                <span>出库数量</span>
            </template>
            <template slot-scope="{row}">
                <el-input-number :min="1" v-model.number="row.inCount" :controls="false" v-if="!isDisabled" />
                <el-input-number :min="1" v-model.number="row.count" :controls="false" disabled v-else />
                <!-- <span class="block">{{ !isDisabled ? row.inCount :row.skuCount }}</span> -->
            </template>
        </el-table-column> 
        <el-table-column prop="price" label="出库单价" align="center">
            <template slot="header">
                <i>*</i>
                <span>出库单价</span>
            </template>
            <!-- <template slot-scope="{row}">
                <span  class="block">{{ getPrice(row) }}</span>
            </template> -->
        </el-table-column>  
        <el-table-column prop="inAmount" label="出库金额" align="center">
            <template slot-scope="{row}">
                <span  class="block">{{ getinAmount(row) }}</span>
            </template>
        </el-table-column>  
  </el-table>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
        isDisabled: {
            type: Boolean,
            default: false
        }
    },
    components: {
        // TableInfo,
    },
    computed: {
        getinAmount() {
            return item => {
                if (item.price && item.inCount) {
                    return item.inCount * item.price
                }
                if (!item.inCount) return '-'
            }
        },
        getPrice() {
            return item => {
                if (item.price) {
                    return item.price
                }
                return item.skuPrice
            }
        },
        ...mapState({
            colorList: state => state.common.colorList
        })
    },
    methods: {
        selectionChange(items) {
            this.$emit('selectionChange', items)
        },
        ...mapActions('ProcurementFallback', ['getPurchaseOrderInfo'])
    }
}
</script>
<style scoped lang="scss">
.el-table {
    i {
        color: red;
    }
    .block {
        display: inline-block;
        width: 80%;
        background-color: #cccccc;
        color: #333333;
        text-align: center;
        height: 36px;
        line-height: 36px;
    }
}
</style>