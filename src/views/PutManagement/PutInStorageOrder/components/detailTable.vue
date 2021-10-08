<template>
    <el-table
        :data="detailItems"
        class="putinstorageconent-table"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
        style="width: 100%"
        >
            <el-table-column label="图片" width="100" align="center">
                <template slot-scope="{row}">
                    <popover-image :skuImg="row.skuImage"  />
                </template>
            </el-table-column>
            <el-table-column label="质检要求" width="120" prop="qualityStd" align="center" show-overflow-tooltip>
                <!-- <template slot-scope="{row}">
                    <span class="have-color">{{ row.qualityStd }}</span>
                </template> -->
            </el-table-column>
            <el-table-column prop="developer" label="开发人" align="center"></el-table-column>
            <!-- <el-table-column prop="developer" label="是否补单" align="center">
                <template slot-scope="{row}">
                    {{ row.supplement  ? '是' :  '否'}}
                </template>
            </el-table-column> -->
            <el-table-column label="SKU" width="120" align="center" prop="sku">
                <template slot-scope="{row}">
                <span class="blue-color" @click="getPurchaseOrderInfo({ ticketCode: row.ticketCode, sku: row.sku, type: 2 })">{{ row.sku }}</span>
            </template>
            </el-table-column>
            <el-table-column label="品名"  align="center" prop="skuName" show-overflow-tooltip  />
            <el-table-column label="商品属性"  align="center" prop="transAttr">
                <!-- <template slot-scope="{row}">
                    <span class="have-color">{{ row.transAttr }}</span>
                </template> -->
            </el-table-column>
            <el-table-column label="重量"  align="center" prop="packWeight">
                
            </el-table-column>
            <el-table-column label="内箱长"  align="center" prop="inLong">
                <!-- <template slot-scope="{row}">
                    <el-input v-model="row.skuLength" clearable placeholder="" oninput="value=value.replace(/[^0-9.]/g,'')" v-if="type == 0" />
                    <span v-else class="have-color">{{ row.skuLength }}</span>
                </template> -->
            </el-table-column>
            <el-table-column label="内箱宽"  align="center" prop="inWide">
                <!-- <template slot-scope="{row}">
                    <el-input v-model="row.skuWide" clearable placeholder="" oninput="value=value.replace(/[^0-9.]/g,'')" v-if="type == 0" />
                    <span class="have-color" v-else>{{ row.skuWide }}</span>
                </template> -->
            </el-table-column>
            <el-table-column label="内箱高"  align="center" prop="inHeight">
                <!-- <template slot-scope="{row}">
                    <el-input v-model="row.skuHeight" clearable placeholder="" oninput="value=value.replace(/[^0-9.]/g,'')" v-if="type == 0" />
                    <span class="have-color" v-else>{{ row.skuHeight }}</span>
                </template> -->
            </el-table-column>
            <el-table-column label="入库数量"  align="center">
                <template slot="header">
                    <i>*</i>
                    <span>入库数量</span>
                </template>
                <template slot-scope="{row}">
                    <el-input
                    v-if="state !== 60"
                    v-model.number="row.qaCount" 
                    :disabled="type !== 0"  
                    oninput="value=value.replace(/[^\d]/g,'')" 
                    @input="changeCount(row.qaCount, row)" 
                    :controls="false" 
                    style="width: 100%" />
                    <el-input
                    v-else
                    v-model.number="row.planCount" 
                    :disabled="type !== 0"  
                    oninput="value=value.replace(/[^\d]/g,'')" 
                    @input="changeCount(row.planCount, row)" 
                    :controls="false" 
                    style="width: 100%" />
                </template>
            </el-table-column>
            <!-- <el-table-column label="入库成本"  align="center" prop="skuInAmount" /> -->
            <el-table-column label="单价"  align="center" prop="price" />
            <el-table-column label="运费"  align="center" prop="expressPriceAmount">
                <template slot="header">
                    <i>*</i>
                    <span>运费</span>
                </template>
            </el-table-column>
            <el-table-column label="税费"  align="center" prop="taxPriceAmount">
                <template slot="header">
                    <i>*</i>
                    <span>税费</span>
                </template>
            </el-table-column>
            <el-table-column label="入库总金额"  align="center" prop="">
                <template slot="header">
                    <i>*</i>
                    <span>入库总金额</span>
                </template>
                <template slot-scope="{row}">
                    <span>{{ row.inAmount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="计划入库"  align="center">
                <template slot="header">
                    <i>*</i>
                    <span>计划入库</span>
                </template>
                <template slot-scope="{row}">
                    <span class="have-color">{{ row.planCount }}</span>
                </template>
            </el-table-column>
    </el-table>
</template>
<script>
import PopoverImage from '@/components/popoverImage'
import { mapActions } from 'vuex'
export default {
    props: {
        detailItems: {
            type: Array, 
            default: () => []
        },
        state: {
            type: Number
        },
        type: {
            required: true
        }
    },
    components: {
        PopoverImage
    },
    methods: {
        ...mapActions('PutInStorageOrder', ['getPurchaseOrderInfo']),
        changeCount(count, item) {
            if (!count) {
                item.qaCount = 0
                item.taxPriceAmount = 0
                item.expressPriceAmount = 0
                item.inAmount = 0
                return
            }
            item.expressPriceAmount = count * item.expressPrice
            item.taxPriceAmount = count * item.taxPrice
            console.log(item.taxPriceAmount)
            item.inAmount = (count * item.price + item.expressPriceAmount + item.taxPriceAmount).toFixed(4)
        }
    }
}
</script>
<style scoped>
i {
    color: red;
}
</style>