<template> 
    <el-table 
    :data="tableData" 
    :max-height="maxHeight"
    style="width: 100%"
    >  
        <el-table-column prop="whouseName" label="仓库名称" align="center"></el-table-column>  
        <el-table-column prop="shopName" label="店铺名称" align="center"></el-table-column>  
        <el-table-column prop="ticketCode" label="单号" align="center"></el-table-column>    
        <el-table-column prop="sku" label="SKU" align="center" />
        <el-table-column prop="count" label="占用数量" align="center" />
        <el-table-column prop="createDate" label="占用时间" align="center" />
        <el-table-column prop="type" label="占用类型" align="center">
            <template slot-scope="{row}">
                <span :style="{ color: getType(row.type, 'color') }">{{ getType(row.type, 'label') }}</span>
            </template>
        </el-table-column>
  </el-table>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name: 'TableContent',
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
    },
    computed: {
        ...mapState('Stock', [
            'typeList'
        ]),
        getType() {
            return (value, type) => {
                if (this.typeList.find(item => item.value === value)) {
                    return this.typeList.find(item => item.value === value)[type]
                }
            }
        }
    },
    data() {
        return {
            maxHeight: window.innerHeight - 230
        }
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 230
        }
    }
}
</script>