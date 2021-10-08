<template>
    <el-table
        :data="tableData"
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
        <el-table-column
            prop="sku"
            align="center"
            label="SKU"
        ></el-table-column>
        <el-table-column
            prop="skuName"
            align="center"
            label="中文名称"
        ></el-table-column>
        <!-- <el-table-column prop="spaceCode"  align="center" label="可用量/占用量/库存数量">
            <template slot-scope="{row}">
                <span>{{row.currentCount}}/{{row.occupyCount}}/{{row.totalCount}}</span>
            </template>
        </el-table-column>     -->
        <!-- <el-table-column prop="skuSpaces"  align="center" label="库位" /> -->
        <el-table-column prop="skuCount" align="center" label="入库数量">
            <template slot="header">
                <i style="color: red">*</i>
                <span>入库数量</span>
            </template>
            <template slot-scope="{ row }">
                <el-input
                    v-model.number="row.skuCount"
                    style="width: 80%"
                    :min="0"
                    :disabled="isShowBtn"
                    @input="changheCount(row.skuCount, row)"
                    placeholder="请输入"
                />
            </template>
        </el-table-column>
        <el-table-column prop="skuPrice" align="center" label="入库单价">
            <template slot="header">
                <i style="color: red">*</i>
                <span>入库单价</span>
            </template>
        </el-table-column>
        <el-table-column prop="skuPrice" align="center" label="头程金额">
            <template slot="header">
                <i style="color: red">*</i>
                <span>头程金额</span>
            </template>
            <template slot-scope="{ row }">
                <el-input-number
                    @input="changAmount(row)"
                    v-model="row.headAmount"
                    :precision="2"
                    :controls="false"
                    disabled
                    style="width: 80%"
                />
            </template>
        </el-table-column>
        <el-table-column prop="skuAmount" align="center" label="入库金额">
        </el-table-column>
        <el-table-column prop="money" align="center" label="操作">
            <template slot-scope="{ $index }">
                <el-button
                    size="small"
                    @click="deleteData($index)"
                    :disabled="isShowBtn"
                    >删除</el-button
                >
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
let Reg =
    /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,4})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/
import { message } from '@/utils/common'
import floatNum from '@/vendor/FloatNum'
import PopoverImage from '@/components/popoverImage'
import { mapMutations } from 'vuex'
export default {
    name: 'TableContent',
    props: {
        tableData: {
            type: Array,
            default: () => [],
        },
        isShowBtn: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        PopoverImage,
    },
    methods: {
        deleteData(index) {
            this.delDetailTable(index)
            this.APPORTION_FEE()
        },
        ...mapMutations('OtherIn', {
            delDetailTable: 'DELETE_ITEMS',
            APPORTION_FEE: 'APPORTION_FEE',
        }),
        changAmount(item) {
            // if (!item.headAmount || item.headAmount < 0) {
            //     item.headAmount = 0
            //     item.skuAmount = 0
            //     return
            // }
            // if (item.headAmount) {
            //     if (!Reg.test(item.headAmount)) {
            //         item.headAmount = 0
            //         item.skuAmount = 0
            //         return
            //     }
            // }
            // item.skuAmount = (item.skuCount * item.skuPrice + item.headAmount * 1).toFixed(4)
        },
        // getAmount(item) {
        //     console.log(Reg.test(item.headAmount))
        //     if (item.headAmount) {
        //         if (!Reg.test(item.headAmount)) {
        //             item.headAmount = 0
        //             item.skuAmount = 0
        //         }
        //     }
        // },
        changheCount(skuCount, item) {
            // if (!skuCount || skuCount < 0) {
            //     item.skuCount = 0
            //     item.skuAmount = 0
            //     return
            // }
            this.APPORTION_FEE()
            // item.skuAmount = (
            //     skuCount * item.skuPrice +
            //     item.headAmount * 1
            // ).toFixed(4)
        },
    },
}
</script>