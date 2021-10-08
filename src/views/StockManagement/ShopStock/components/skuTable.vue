<template> 
    <el-table 
    :data="tableData" 
    style="width: 100%"
    >  
        <el-table-column prop="asin" label="ASIN" align="center"></el-table-column>    
        <!-- <el-table-column prop="skuOccupyCount" label="占用数量" align="center"></el-table-column>     -->
        <el-table-column prop="skuUsableCount" label="可用数量" align="center" />
        <el-table-column prop="skuCount" label="库存数量" align="center" />
        <el-table-column prop="transCount" label="在途数量" align="center" />
        <el-table-column prop="skuAmount" label="金额" align="center" />
  </el-table>
</template>
<script>
    // const App = () => (<div id="app">
    //     <HelloWorld msg="Welcome to Your React App" />
    // </div>);
export default {
    name: 'TableContent',
    // components: {
    //     demo: App
    // },
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
    },
}
</script>