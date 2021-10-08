<template>
    <el-table 
    :data="tableData" 
    max-height="450"
    style="width: 100%"
    >  
        <el-table-column prop="type" label="类型" align="center" />
        <el-table-column align="center">
            <template slot="header">
                {{ getTdHeader }}
            </template>
            <template slot-scope="{row}">
                {{ getTdValue(row) }}
            </template>
        </el-table-column>
        <el-table-column prop="staff_name" label="操作人" align="center" />
        <el-table-column prop="created_at" label="操作时间" align="center" />
    </el-table>
</template>
<script>
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState('Order', {
            tableData: 'logTableData',
            type: 'type'
        }),
        getTdHeader() {
            return this.type === 'order' ? '订单号' : '批次号'
        },
        getTdValue() {
            return item => {
                if (this.type === 'order') {
                    return item.nt_order_id
                }
                return item.ticket_num
            }
        }
    }
}
</script>