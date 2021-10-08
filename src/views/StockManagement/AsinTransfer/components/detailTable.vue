<template>
    <el-table
    :data="tableData"
    >
        <el-table-column label="产品图片" align="center">
            <template slot-scope="{row}">
                <popover-image :skuImg="row.skuImage"  />
            </template>
        </el-table-column>
        <el-table-column label="SKU" align="center" prop="sku" />
        <el-table-column label="中文名称" align="center" prop="skuName"  show-overflow-tooltip/>
        <el-table-column label="调出ASIN" align="center">
            <template slot-scope="{row}">
                <el-select 
                placeholder="请选择asin" 
                v-model="row.sourceAsin" 
                filterable
                v-if="show"
                @change="changeASsins(row.sourceAsin, 'sourceSkuCount', row)">
                    <el-option 
                    v-for="item in row.asinList" 
                    :value="item.asin"
                    :key="item.id"
                    :label="item.asin"/>
                </el-select>
                <span v-else>{{ row.sourceAsin }}</span>
            </template>
        </el-table-column>
        <el-table-column label="可用量/占用量/调出ASIN库存数量" align="center">
            <template slot-scope="{row}">
                {{ row.skuUsableCount }}/{{ row.skuOccupyCount }}/{{ row.sourceSkuCount }}
            </template>
        </el-table-column>
        <el-table-column label="调入ASIN" align="center">
            <template slot-scope="{row}">
                <el-select 
                placeholder="请选择asin" 
                filterable
                v-model="row.distAsin" 
                v-if="show"
                @change="changeASsins(row.distAsin, 'distSkuCount', row)">
                    <el-option 
                    v-for="item in row.asinList" 
                    :value="item.asin"
                    :key="item.id"
                    :label="item.asin"/>
                </el-select>
                <span v-else>{{ row.distAsin }}</span>
            </template>
        </el-table-column>
        <el-table-column label="调入ASIN库存数量" align="center" prop="distAsinCount">
            <template slot-scope="{row}">
                {{ row.distSkuCount }}
            </template>
        </el-table-column>
        <el-table-column label="调拨数量" align="center">
            <template slot-scope="{row}">
                <el-input-number 
                v-if="show"
                :controls="false" 
                v-model="row.count" 
                style="width:100px"
                :min="0"  
                placeholder="请输入调拨数量" />
                <span v-else>{{ row.count }}</span>
            </template>
        </el-table-column>
        <el-table-column label="调拨单价" align="center" prop="skuPrice">
            <!-- <template slot-scope="{row}">
                <span v-if="show">{{ row.skuPrice }}</span>
            </template> -->
        </el-table-column>
        <el-table-column label="调拨总金额" align="center">
            <template slot-scope="{row}">
                {{ getAmount(row) }}
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="{row, $index}">
                <el-button type="text" @click="DEL_ITEMS($idnex)" :disabled="!show">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import PopoverImage from '@/components/popoverImage'
import { getAssinsStock } from '@/api/AsinTransfer'
import { mapMutations } from 'vuex'
import { loading, loadingClose } from '@/utils/common'
export default {
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
        show: {
            type: Boolean,
            default: true
        },
        whouseId: {
            type: Number | String,
            default: ''
        }
    },
    computed: {
        getAmount() {
            return item => {
                if (item.count) {
                    item.totalAmount = item.count * item.skuPrice
                    return item.totalAmount
                }  
                item.totalAmount = 0          
                return item.totalAmount
            }
        }
    },
    methods: {
        ...mapMutations('AsinTransfer', ['DEL_ITEMS']),
        async changeASsins(asin, type, item) { 
            loading()
            try {
                const { shop_id, product_sku } = item.asinList.find(v => v.asin === asin)
                const { data: { skuCount, skuOccupyCount, skuUsableCount, skuPrice }, code } = await getAssinsStock({ asin, shopId: shop_id, sku: product_sku, whouseId: this.whouseId })
                loadingClose()
                if (code === 0) {             
                    item[type] = skuCount
                    if (type === 'sourceSkuCount') {           
                        item.skuUsableCount = skuUsableCount
                        item.skuOccupyCount = skuOccupyCount
                        item.skuPrice = skuPrice
                    }
                }
            } catch(e) {
                loadingClose()
            }
            
        },
    },
    components: {
        PopoverImage
    }
}
</script>