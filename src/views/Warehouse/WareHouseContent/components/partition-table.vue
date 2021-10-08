<template>
    <el-table
    :data="partitionTableData"
    :max-height="maxHeight"
    style="width: 100%">
        <el-table-column type="index" align="center" label="序号" width="50" />
        <el-table-column prop="name" label="分区名称" align="center">
            <template slot-scope="{ row }">
                <el-button type="text" @click="filterSpace(row.id, row.whouseId)">{{ row.name }}</el-button>
            </template>
        </el-table-column>
        <!-- <el-table-column prop="staffName" label="分区负责人" align="center" /> -->
        <el-table-column label="操作" align="center">
            <template slot-scope="{row}">
                <el-button 
                icon="el-icon-edit" 
                type="text"  
                @click="CHANGE_PARTITION_MODAL({ type: true, title: '编辑区位', row })"
                >编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
export default {
    computed: {
        ...mapState('Warehouse', [
            'partitionTableData'
        ]),
    },
    data() {
        return {
            maxHeight: window.innerHeight - 350
        }
    },
    methods: {
        ...mapMutations('Warehouse', [
            'CHANGE_PARTITION_MODAL'
        ]),
        filterSpace(id, whouseId) {
            this.$emit('filterSpace', id, whouseId)
        }
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 350
        }
    }
}
</script>