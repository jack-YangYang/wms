<template> 
    <el-table 
    :data="tableData" 
    :max-height="maxHeight"
    show-summary
    :summary-method="getSummaries"
    :default-sort = "{prop: 'skuCount', order: 'descending'}"
    style="width: 100%"
    >  
        <el-table-column prop="whouseName" label="仓库名称" align="center"></el-table-column>  
        <el-table-column prop="sku" label="SKU" align="center">
            <template slot-scope="{row}">
                <router-link :to="`/stock/shopstock/detail/${row.whouseId}/${row.shopId}/${row.sku}`">
                    <span class="blue-color">{{ row.sku }}</span>
                </router-link>
            </template>
        </el-table-column>  
        <el-table-column prop="skuName" label="商品名称" align="center" show-overflow-tooltip />        
        <el-table-column prop="shopName" label="店铺名称" align="center"></el-table-column>          
        <!-- <el-table-column prop="sku" label="SKU" align="center" /> -->
        <el-table-column prop="skuCount" sortable label="SKU库存数量" width="130" align="center" />
        <el-table-column prop="skuOccupyCount" label="SKU占用数量" align="center" /> 
        <el-table-column prop="skuUsableCount" label="SKU可用数量" align="center" />           
        <!-- <el-table-column prop="headAmount" label="头程金额" align="center" /> -->
        <el-table-column prop="skuPrice" label="成本单价" align="center" />      
        <el-table-column prop="skuAmount" label="成本金额" align="center" />
        <el-table-column prop="headPrice" label="头程单价" align="center" />
        <el-table-column prop="headAmount" label="头程金额" align="center" />
        <el-table-column prop="skuPrice" label="SKU库存单价" align="center">
            <template slot-scope="{row}">
                {{ row.headPrice + row.skuPrice }}
            </template>
        </el-table-column>
        <el-table-column prop="skuAmount" label="SKU库存金额" align="center">
            <template slot-scope="{row}">
                {{ row.headAmount + row.skuAmount }}
            </template>
        </el-table-column>
        <el-table-column prop="transCount" label="在途数量" align="center"></el-table-column>    
        <el-table-column prop="transPrice" label="在途单价" align="center" />
        <el-table-column prop="transAmount" label="在途金额" align="center" />
        <el-table-column prop="transHeadAmount" label="在途头程金额" align="center" />
        <el-table-column prop="spaceCode" label="库位号" align="center" />       
        
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
    data() {
        return {
            maxHeight: window.innerHeight - 200
        }
    },
    methods: {
        getSummaries(param) {
            const summariesList = ['skuCount', 'skuOccupyCount', 'skuUsableCount', 'transCount']
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                if (summariesList.includes(column.property)) {
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                                if (!isNaN(value)) {
                                    
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                        sums[index] += '';
                    } else {
                        sums[index] = '';
                    }
                }    
            });
            return sums;
        }
    },
    mounted() {
        window.onresize = () => {
            this.maxHeight = window.innerHeight - 200
        }
    }
}
</script>
<style lang="scss">
/* /deep/ 为深度操作符，可以穿透到子组件 */
// .el-table {
//     display: flex;
//     flex-direction: column;
// }

/* order默认值为0，只需将表体order置为1即可移到最后，这样合计行就上移到表体上方 */
.el-table__body-wrapper {
    order: 1;
}
/* 表格启用 fixed 属性后，样式会错乱，下面2句是补偿修复 */
.el-table__fixed-body-wrapper {
    top: 96px !important;
}
.el-table__fixed-footer-wrapper {
    z-index: 0;
}
</style>