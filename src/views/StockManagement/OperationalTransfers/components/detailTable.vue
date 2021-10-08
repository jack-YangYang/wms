<template>
    <el-table
    :data="tableData"
    >
        <el-table-column label="图片" align="center">
            <template slot-scope="{row}">
                <popover-image :skuImg="row.skuImage" width="50%" />
            </template>
        </el-table-column>
        <el-table-column label="库存SKU" align="center" prop="sku" />
        <el-table-column label="中文名称" prop="skuName" align="center" />
        <el-table-column label="调拨数量" prop="skuCount" align="center">
            <template slot-scope="{ row }">
                <el-input 
                v-model.number="row.skuCount"
                style="width: 80%"
                :min="0"
                :disabled="disabled" 
                @input="changheCount(row.skuCount, row)"
                placeholder="请输入"   />
            </template>
        </el-table-column>
        <el-table-column label="调拨总金额" prop="skuAmount" align="center" />
        <el-table-column label="操作" align="center">
            <template slot-scope="{$index}">
                <el-button type="primary" size="mini" :disabled="disabled" @click="del($index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import PopoverImage from '@/components/popoverImage'
export default {
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    components: {
        PopoverImage
    },
    methods: {
        del(index) {
            this.$emit('del', index)
        },
        changheCount(count, item) {
             if (!count) {
                item.skuAmount = 0
                return
            }
            item.skuAmount = count * item.skuPrice
        }
    }
}
</script>