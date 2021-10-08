<template>
    <el-table
    :data="spaceSkuTableData"
    style="width: 100"
    max-height="450px"
    >
        <el-table-column prop="skuName" label="SKU名称" align="center" />
        <el-table-column prop="sku" label="SKU" align="center" />
        <!-- <el-table-column prop="sku" label="操作" align="center" v-if="show">
            <template slot-scope="{$index}">
                <el-button type="text" @click="CAHNGE_SPACE_SKU_DATA($index)">解除绑定</el-button>
            </template>
        </el-table-column> -->
    </el-table>
</template>
<script>
import { mapMutations, mapState } from 'vuex'

export default {
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState('Warehouse', [
            'spaceSkuTableData'
        ])
    },
    methods: {
        ...mapMutations('Warehouse', ['CAHNGE_SPACE_SKU_DATA'])
    }
}
</script>