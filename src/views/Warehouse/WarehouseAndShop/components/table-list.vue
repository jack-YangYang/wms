<template>
    <el-table
    :data="houseAndShopTableData"
    :max-height="maxHeight"
    style="width: 100%">
        <el-table-column type="index" align="center" label="序号" width="50" />
        <el-table-column prop="data" label="店铺所绑定的仓库">
            <template slot-scope="{row}">
                <whouse-name v-for="item in row.data" :whouseName="item.whouseName" :key="item.whouseId" />
            </template>
        </el-table-column>
        <el-table-column prop="shopName" label="店铺" align="center" />
        <el-table-column prop="site" label="站点" align="center" />
    </el-table>
</template>
<script>
import { mapState } from 'vuex'
import whouseName from './dataList'
export default {
    computed: {
        ...mapState('Warehouse', [
            'houseAndShopTableData',
        ]),
    },
    components: {
        whouseName
    },
    data() {
        return {
            maxHeight: window.innerHeight - 220
        }
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 220
        }
    }
}
</script>