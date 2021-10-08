<template>
    <el-table
    :data="spaceTableData"
    :max-height="maxHeight"
    style="width: 100%">
        <el-table-column type="index" align="center" label="序号" width="50" />
        <el-table-column prop="spaceCode" label="库位编号" align="center" />
        <el-table-column prop="skuCount" label="绑定的SKU个数" align="center">
            <template slot-scope="{row}">
                <el-button type="text" @click="findSku(row.spaceCode)">{{ row.skuCount }}</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="skuCount" label="库位状态" align="center">
            <template slot-scope="{row}">
                {{ row.state ? '占用' : '空闲'}}
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="{row}">
                <el-button icon="el-icon-edit" type="text" @click="editSpaceCode({ title: '编辑库位', row })">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import { mapMutations, mapState, mapActions } from 'vuex'
export default {
    computed: {
        ...mapState('Warehouse', [
            'spaceTableData'
        ]),
    },
    data() {
        return {
            maxHeight: window.innerHeight - 450
        }
    },
    methods: {
        // ...mapMutations('Warehouse', [
        //     'CHANGE_PARTITION_MODAL'
        // ]),
        ...mapActions('Warehouse', [
            'findSku',
            'editSpaceCode'

        ])
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 450
        }
    }
}
</script>