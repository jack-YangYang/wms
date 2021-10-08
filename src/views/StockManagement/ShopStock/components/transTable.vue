<template> 
    <el-table 
    :data="tableData" 
    style="width: 100%"
    >  
        <el-table-column prop="totalTransCount" label="在途总数量" align="center"></el-table-column>    
        <el-table-column prop="oceanTransCount" label="海运在途" align="center"></el-table-column>    
        <el-table-column prop="airTransCount" label="空运在途" align="center" />
        <el-table-column prop="kaTransCount" label="卡航在途" align="center" />
        <el-table-column prop="railTransCount" label="铁路在途" align="center" />
  </el-table>
</template>
<script>
export default {
    name: 'TableContent',
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
    },
}
</script>