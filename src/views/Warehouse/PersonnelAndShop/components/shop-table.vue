<template>
    <el-table
    border
    max-height="500"
    @selection-change="selectShopUserTable"
    :data="shopDataList">
        <el-table-column type="selection" align="center" width="50" v-if="showSearch"/>
        <el-table-column label="店铺名称" prop="shopName" align="center" />
    </el-table>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
    computed: {
        ...mapState('Warehouse', [
            'shopDataList',
            'showSearch'
        ])
    },
    methods: {
        ...mapMutations('Warehouse', {
            selectShopUserTable: 'SELECT_SHOP_USER_TABLE'
        })
    }
}
</script>