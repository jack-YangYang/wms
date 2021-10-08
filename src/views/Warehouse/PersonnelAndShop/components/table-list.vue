<template>
    <el-table
    :data="personnerTableData"
    @selection-change="selectionChange"
    :max-height="maxHeight"
    style="width: 100%">
        <el-table-column type="selection" align="center" width="50" />
        <el-table-column type="index" align="center" label="序号" width="50" />
        
        <el-table-column prop="data" label="绑定的店铺集合" align="center">
            <template slot-scope="{row}">
                <el-button type="text" @click="findShipList({ staffId:row.staffId, type: 0, count: row.count })">{{ row.count }}</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="staffName" label="人员姓名" align="center" />
        <el-table-column align="center" label="是否全选">
            <template slot-scope="{row}">
                {{ row.isSelectAll ? '是' : '否' }}
            </template>
        </el-table-column>
        <el-table-column  label="操作" align="center">
            <template slot-scope="{row}">
                <el-button icon="el-icon-edit" type="text" v-if="showButtons.edit" @click="findShipList({ staffId:row.staffId, type: 1 })">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
    props: {
        showButtons: {
            required: true
        }
    },
    computed: {
        ...mapState('Warehouse', [
            'personnerTableData',
        ]),
    },
    data() {
        return {
            maxHeight: window.innerHeight - 220
        }
    },
    methods: {
        ...mapMutations('Warehouse', {
            selectionChange: 'SELECT_DATA',
            changeUserShopModule: 'CHANGE_SHOP_USER'
        }),
        ...mapActions('Warehouse', ['findShipList'])
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 220
        }
    }
}
</script>