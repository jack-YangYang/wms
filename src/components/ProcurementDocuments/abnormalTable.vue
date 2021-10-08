<template>
    <div class="barcode-table">
        <table border = "2">
            <tr>
                <td>SKU码</td>
                <td style="width: 100px">商品名称</td>
                <td>异常数量</td>
                <td>异常原因</td>
            </tr>         
            <tr v-for="(item, index) in tableData" :key="index">
                <td>
                    <barcode :value="item.sku" :width="1.2" :height="50" :fontSize="14" class="barcode" />
                </td>
                <td style="width: 100px">{{ item.skuName}}</td>
                <td>{{ item.planCount-item.passCount }}</td>
                <td>{{ detail.reason }}</td>
            </tr>
        </table>
        <TrackingTable />
    </div> 
</template>
<script>
import VueBarcode from 'vue-barcode';
import TrackingTable from './trackingTable'
export default {
    name:'AbnormalTable',
    components: {
        'barcode': VueBarcode,
        TrackingTable
    },
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
        detail: {
            type: Object,
        }
    }
}
</script>
<style lang="scss" scoped>
.barcode-table {
    & > table:nth-child(1) {
        width: 550px;
        // margin-bottom: 30px;
        // margin-top: 5px;
        border-collapse: collapse;/*border-collapse:collapse合并内外边距(去除表格单元格默认的2个像素内外边距*/
        margin-left: -2px;
        // margin-right: -2px;
        td {
            height: 12px;
            line-height: 12px;
            text-align: center;
            border: 2px solid #000;
            color: #000;
        }		
        th {
            background: #eee;
            font-weight: normal;
        }		
        tr {
            background: #fff;
        }		
    }
    & > table:nth-child(2) {
       width: 550px;
        margin-left: -2px;
    }
}
</style>