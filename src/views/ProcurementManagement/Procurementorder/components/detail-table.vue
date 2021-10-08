<template>
    <el-table
        :data="detailItems"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
        style="width: 100%"
        class="pro-table"
        lazy
        ref="multipleTable"
        row-key="index"
        :load="load"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @selection-change="handleSelectionChange"
        >
        <el-table-column  width="50" align="center" type="selection" />
        <!-- <el-table-column type="expand">
        <template slot-scope="props">
            
        </template>
        </el-table-column> -->
        
        <el-table-column label="SKU" width="120" align="center" prop="sku">
            <template slot-scope="{row}">
                <span class="blue-color">{{ row.sku }}</span>
            </template>
        </el-table-column>
        <el-table-column label="图片" width="100" align="center">
                <template slot-scope="{row}">
                    <popover-image :skuImg="row.skuImage" :width="row.shopName ? 0 : '100%'"  />
                </template>
        </el-table-column>
        <el-table-column label="开发人" width="120" align="center" prop="developer" />
        <el-table-column label="品名"  align="center" prop="skuName" show-overflow-tooltip  />
        <el-table-column label="采购数量"  align="center" prop="purchaseCount" show-overflow-tooltip>
            <template slot-scope="{row}">
                <span class="gray-block">{{ row.purchaseCount }}</span>
            </template>
        </el-table-column>
        <el-table-column label="已入数量"  align="center" prop="inCount" show-overflow-tooltip>
            <template slot-scope="{row}">
                <span class="gray-block">{{ row.inCount }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="signCount" label="签收数量"  align="center" />
        <el-table-column label="入库数量"  align="center" prop="skuInAmount" show-overflow-tooltip v-if="type == 2">
            <template slot="header">
                <i>*</i>
                <span>入库数量</span>
            </template>
            <template slot-scope="{row}">
                <el-input 
                v-model.number="row.count" 
                oninput="value=value.replace(/[^\d]/g,'')" 
                @input="changheCount(row.count, row)"
                step-strictly
                placeholder="请输入" 
                style="width: 100%"
                />
            </template>
        </el-table-column>
        <el-table-column label="单价"  align="center" prop="price"  >
            <template slot="header">
                <i>*</i>
                <span>单价</span>
            </template>
            <template slot-scope="{row}">
                <span>{{ row.price }}</span>
            </template>
        </el-table-column>
        <el-table-column label="入库运费"  align="center" prop="expressPriceAmount"  >
        </el-table-column>
        <el-table-column label="入库税费"  align="center" prop="taxPriceAmount">
        </el-table-column>
        <el-table-column label="入库总金额"  align="center" prop="inAmount">
            <template slot-scope="{row}">
                <span>{{ row.inAmount }}</span>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import floatNumber from '@/vendor/FloatNum'
import PopoverImage from '@/components/popoverImage'
import { getPurchaseOrderInfo } from '@/api/common'
import { mapActions } from 'vuex'
export default {
    props: {
        detailItems: {
            type: Array,
            default: () => []
        },
        type: {
            default: 1
        }
    },
    components: {
        PopoverImage
    },
    data() {
        return {
            checkedKeys: false,
        }
    },
    watch: {
        detailItems: {
            handler(val) {
                val.forEach(item => {
                    item.skuInTotalAmount = floatNumber.add(floatNumber.add(item.taxPrice, item.expressPrice), floatNumber.multiply(item.count, item.price))
                })
            },
            deep: true
        }
    },
    computed: {
        show() {
            return this.type === 1
        }
    },
    methods: {
        async load(tree, treeNode, resolve) {
            const { data } = await getPurchaseOrderInfo({ ticketCode:tree.ticketCode, sku:tree.sku, type: 1 })
            data.forEach(item => {
                item.index = Math.floor(Math.random() * 1000 * 1000) + 2
                item.skuName = item.shopName
                item.childSku = item.sku
                item.sku = null
                item.count = 0
            })
            tree.children = data
            resolve(data)
        },
        // selectAll() {
        //     this.checkedKeys = !this.checkedKeys;
        //     this.splite(this.detailItems, this.checkedKeys);
        // },
        // splite(data, flag) {
        //     data.forEach((row) => {
        //     this.$refs.multipleTable.toggleRowSelection(row, flag);
        //         if (row.children != undefined) {
        //             this.splite(row.children);
        //             }
        //         });
        //     },
        handleSelectionChange(row) {
            this.$emit('handleSelectionChange', row)
        },
        // ...mapActions('Procurementorder', ['getPurchaseOrderInfo']),
        changheCount(count, item) {
            if (item.shopName === undefined) {
                if (!count || count < 0) {
                    item.count = 0
                    item.inAmount = 0
                    item.taxPriceAmount = 0 // 总税费
                    item.expressPriceAmount = 0 // 总运费
                    return
                }
            }
            else {
                if (!count || count < 0) {
                    item.count = 0
                }
            }
            if (item.shopName === undefined) { // 说明不是子集
                item.taxPriceAmount = item.taxPrice * count
                item.expressPriceAmount = item.expressPrice * count
                item.inAmount = (count * item.price + item.taxPriceAmount + item.expressPriceAmount).toFixed(4)
                return
            }
            this.detailItems.forEach(item => {
                item.count = item.children && item.children.reduce((total, children) => total + children.count * 1 || 0, 0)
                item.taxPriceAmount = item.taxPrice * item.count
                item.expressPriceAmount = item.expressPrice * item.count
                item.inAmount = (item.count * item.price + item.taxPriceAmount + item.expressPriceAmount).toFixed(4)
            })
            // item.count = item.children && item.children.reduce((total, children) => total + children.count * 1, 0)
        }
    }
}
</script>
<style lang="scss" scoped>
.pro-table {
    .el-table__body-wrapper tbody {
        .el-table__row el-table__row--level-1 {
            td .cell {
                display:none;
            }
        }
    }
}
</style>
<style lang="scss">
// i {
//     color: red;
// }
.pro-table {
    .el-table__body-wrapper tbody {
        .el-table__row.el-table__row--level-1 {
            td:first-child {
                .cell {
                    display:none;
                }
            }
        }
    }
}
</style>