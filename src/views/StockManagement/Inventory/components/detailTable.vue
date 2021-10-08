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
        <!-- <el-table-column label="仓位" align="center" /> -->
        <el-table-column label="盘点前库存" align="center" prop="originalCount">
            <template slot-scope="{row}">
                {{ state === 2 ? row.originalCount : '-' }}
            </template>
        </el-table-column>
        <el-table-column label="盘点数量" align="center" prop="skuCount">
            <template slot="header">
                <i style="color: red">*</i>
                <span>盘点数量</span>
            </template>
            <template slot-scope="{ row }">
                <el-input 
                v-model.number="row.skuCount"
                style="width: 80%"
                :disabled="disabled" 
                @input="changheCount(row.skuCount, row)"
                placeholder="请输入"   />
            </template>
        </el-table-column>
        <el-table-column label="差值" align="center" prop="originalCount">
            <template slot-scope="{row}">
                {{ getCount(row) }}
            </template>
        </el-table-column>
        <!-- <el-table-column label="库位" align="center" prop="skuSpaces" /> -->
        <el-table-column label="盘点单价" align="center" prop="skuPrice"  />
        <el-table-column label="盘点总金额" align="center" prop="skuAmount" />
        <!-- <el-table-column label="差值" align="center" /> -->
        <el-table-column label="操作" align="center">
            <template slot-scope="{$index}">
                <el-button type="primary" size="mini" :disabled="disabled" @click="del($index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import PopoverImage from '@/components/popoverImage'
import { mapMutations } from 'vuex'
export default {
    components: {
        PopoverImage
    },
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        },
        state: {
            type: Number,
            default: 2
        }
    },
    computed: {
        getCount() {
            return item => {
                if (this.state !== 2) return '-'
                if (item.originalCount !== '' && item.originalCount !== null) {
                    return item.originalCount - item.skuCount
                }
                return '暂无'
            }
        },
    },
    methods: {
        ...mapMutations('Inventory', {
            del: 'DEL_ITEIMS'
        }),
        changheCount(count, item) {
            if (!count || count < 0) {
                item.skuCount = 0
                item.skuAmount = 0
                return
            }
            item.skuAmount = Math.abs(((item.originalCount - item.skuCount) * item.skuPrice).toFixed(4))
        }
    }
}
</script>