<template>
    <table border = "1" class="table2">
        <caption>跟踪表</caption>
        <tr>
            <td>流程</td>
            <td>责任人</td>
            <td>要求</td>
            <td>开始时间</td>
            <td>结束时间</td>
        </tr>         
        <tr>
            <td>收货入库</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>质检</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>贴标包装</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>上架</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </table>
</template>
<style scoped lang='scss'>
.table2 {
    width: 550px;
    // margin-top: 5px;
    margin-left: -2px;
    margin-bottom: -2px;
    border-collapse: collapse;/*border-collapse:collapse合并内外边距(去除表格单元格默认的2个像素内外边距*/
    caption {
        line-height: 20px;
        color: #000;
        font-weight: 600;
        font-size: 14px;
        border-top: 1px solid #000;
    }
    th,td {
				height: 16px;
				line-height: 16px;
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
</style>