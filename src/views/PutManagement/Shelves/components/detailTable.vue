<template>
    <el-table
        :data="detailItems"
        class="putinstorageconent-table"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
        style="width: 100%"
        >
            <el-table-column label="图片" width="100" align="center">
                <template slot-scope="{row}">
                    <el-popover placement="right" width="350" trigger="hover">
                                <img :src="row.skuImage" alt style="width:100%;" />
                                <div slot="reference" style="text-align: center">
                                <img
                                    :src="row.skuImage"
                                    alt
                                    style="height: 57px;width: 100%;"
                                />
                                </div>
                    </el-popover>
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
            <el-table-column label="SKU" width="120" align="center" prop="sku" />
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
            <el-table-column label="入库数量" prop="qaCount"  align="center">
                <template slot="header">
                    <i>*</i>
                    <span>上架数量</span>
                </template>
            </el-table-column>
            <el-table-column label="库位" prop="qaCount"  align="center" width="150">
                <template slot="header">
                    <i>*</i>
                    <span>库位</span>
                </template>
                <template slot-scope="{row}">
                    <span v-if="!isDisabled">{{ row.spaceCode.join() }}</span>
                    <el-select v-else v-model="row.space" placeholder="请选择库位">
                        <el-option v-for="item in row.spaceCode" :value="item" :key="item" :label="item" />
                    </el-select>
                </template>
            </el-table-column>
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
export default {
    props: {
        detailItems: {
            type: Array, 
            default: () => []
        },
        spaceCodelist: {
            type: Array,
            default: () => []
        },
        isDisabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        changeCount(value, item) {
            if (!value) {
                item.inAmount = 0
                return
            }
            item.inAmount = value * item.price + item.expressPrice + item.taxPrice
        }
    }
}
</script>
<style scoped>
i {
    color: red;
}
</style>