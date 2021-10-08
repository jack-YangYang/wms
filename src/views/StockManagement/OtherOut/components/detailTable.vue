<template> 
    <el-table 
    :data="tableData" 
    :summary-method="getSummaries"
    show-summary
    id="export-child"
    max-height="400"
    style="width: 100%"
    >  
        <!-- <el-table-column type="selection" width="55" align="center"/> -->
        <el-table-column prop="skuImg" align="center" label="产品图片">
            <template slot-scope="{ row }">
                <popover-image :skuImg="row.skuImage" />
            </template>    
        </el-table-column>
        <el-table-column prop="sku"  align="center" label="SKU"></el-table-column>
        <el-table-column prop="skuName" align="center" label="中文名称"></el-table-column>  
        <!-- <el-table-column prop="spaceCode"  align="center" label="可用量/占用量/库存数量">
            <template slot-scope="{row}">
                <span>{{row.currentCount}}/{{row.occupyCount}}/{{row.totalCount}}</span>
            </template>
        </el-table-column>     -->
        <!-- <el-table-column prop="spaceCode"  align="center" label="库位" /> -->
        <el-table-column prop="skuCount" align="center" label="出库数量">
            <template slot="header">
                <i style="color: red">*</i>
                <span>出库数量</span>
            </template>
            <template slot-scope="{ row }">
                <el-input
                v-model.number="row.skuCount" 
                oninput="value=value.replace(/[^\d]/g,'')" 
                style="width: 80%"
                :disabled="isShowBtn"
                placeholder="请输入" 
                :min="1" 
                @input="changheCount(row.skuCount, row)" />
            </template>
        </el-table-column>
        <el-table-column prop="skuPrice" align="center" label="出库单价">
            <template slot="header">
                <i style="color: red">*</i>
                <span>出库单价</span>
            </template>
            <!-- <template slot-scope="{ row }">
                <el-input-number
                v-model="row.skuPrice" 
                :controls="false"
                :disabled="isShowBtn || row.count >= row.currentCount + row.occupyCount"
                placeholder="请输入"  
                @blur="changeSkuPrice(row)"
                @input="changePrice(row)" />
            </template> -->
        </el-table-column>
        <el-table-column prop="headAmount" label="头程金额" align="center" />
        <!-- <el-table-column prop="skuPrice" align="center" label="头程金额">
            <template slot="header">
                <i style="color: red">*</i>
                <span>头程金额</span>
            </template>
            <template slot-scope="{ row }">
                <el-input v-model="row.headAmount" clearable placeholder="请输入"  
                oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.')" 
                @input="changePrice(row)" />
            </template>
        </el-table-column> -->
        <el-table-column prop="skuAmount" align="center" label="出库金额" >
            
        </el-table-column>
        <el-table-column prop="money" align="center" label="操作">
            <template slot-scope="{ $index }">
                <el-button size="small" @click="deleteData($index)" :disabled="isShowBtn">删除</el-button>
            </template>
        </el-table-column>
  </el-table>
</template>
<script>
let Reg = /^\d+(\.\d{1,2})?$/;
import floatNum from '@/vendor/FloatNum'
import PopoverImage from '@/components/popoverImage' 
import { mapMutations } from 'vuex';
export default {
    name: 'TableContent',
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
        isShowBtn: {
            type: Boolean,
            default: false
        }
    },
    components: {
        PopoverImage
    },
    methods: {
        ...mapMutations('OtherOut', {
            deleteData: 'DELETE_ITEMS'
        }),
        getSummaries(param) {
            const { columns, data } = param;
            console.log(data)
            const sums = [];
            const keys = ['skuCount', 'skuAmount']
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                if (keys.includes(column.property)) {       
                    const values = data.map(item => Number(item[column.property]));
                    // console.log(values)
                    if (!values.every(value => isNaN(value))) {
                        console.log(123, 'value')
                        sums[index] = values.reduce((prev, curr) => {
                        console.log(curr, 'curr')
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            console.log(floatNum.add(prev + curr), 'floatNum.add(prev + curr)')
                            return column.property === 'skuAmount' ? floatNum.add(prev, curr).toFixed(4) : floatNum.add(prev, curr);
                        } else {
                            return prev;
                        }
                        }, 0);
                    } else {
                        // console.log('sums')
                        sums[index] = 'N/A';
                    }
                }     
            });

            return sums;
        },
        changheCount(count, item) {
            if (!count || count < 0) {
                item.skuCount = 0
                item.skuAmount = 0
                return
            }
            item.headAmount = floatNum.multiply(item.headPrice, count).toFixed(4)
            item.skuAmount = floatNum.add(floatNum.multiply(count, item.skuPrice).toFixed(4), item.headAmount)
        }
    }
}
</script>