<template>
    <el-table
        :data="tableData"
        max-height="450"
        border
        style="width: 100%"
    >
        <el-table-column
            label="编号"
            align="center"
            width="50"
            type="index"
        />
        <el-table-column label="单号ID" prop="logId" align="center" />
        <!-- <el-table-column
            label="模块名称"
            align="center"
            prop="modelName"
        ></el-table-column> -->
        <el-table-column
            label="操作用户名称"
            align="center"
            prop="userName"
        ></el-table-column>
        <el-table-column
            label="操作时间	"
            align="center"
            prop="operationTime"
        ></el-table-column>
        <el-table-column
            label="操作事项	"
            show-overflow-tooltip
            align="center"
            prop="body"
        >
            <template slot-scope="{row}">
               {{ row.msg }}
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
export default {
    props: {
        tableData: {
            type: Array,
            default: () => []
        }
    },
    // filters: {
    //     logoInfo(item) {
    //         let info = JSON.parse(JSON.stringify(item))
    //         console.log(info)
    //         return info.msg
    //     }
    // },
    computed: {
        tableDataList() {
            this.tableData.forEach(item => {
                item.body = JSON.parse(item.body)
            })
            // console.log(this.tableData)
            return this.tableData
        }
    }
}
</script>