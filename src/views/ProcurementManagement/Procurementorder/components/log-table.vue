<template>
    <el-table
        :data="tableData"
        max-height="300"
        border
        style="width: 100%"
    >
        <el-table-column
            label="编号"
            align="center"
            width="50"
            type="index"
        />
        <el-table-column
            label="操作人"
            align="center"
            prop="operatorName"
        ></el-table-column>
        <el-table-column
            label="操作时间"
            align="center"
            prop="operateTime"
        ></el-table-column>
        <el-table-column
            label="动作"
            align="center"
            prop="operateText"
        ></el-table-column>
    </el-table>
</template>
<script>
import { mapState } from 'vuex'
export default {
    props: {
        tableData: {
            type: Array,
            default: () => []
        }
    }
}
</script>