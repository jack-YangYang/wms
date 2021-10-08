<template>
    <main>
        <detail-title title="运营调拨" />
        <detail-header>
            <span>运营调拨单详情</span>
            <!-- <span v-html="msg" class="warning"></span> -->
        </detail-header>
        <detail-content :detail="detail" />
        <detail-table :tableData="detailItems" :disabled="true" />
        <div class="action-remark">
            <div>
                <span>备注：</span>
                <el-input type="textarea" v-model="detail.remark" :disabled="true" placeholder="请输入备注" />
            </div>
            <action-group :show="false"  @handleClick="handleClick"  />
        </div>
    </main>
</template>
<script>
import detailTitle from '@/components/DetailTitle'
import detailHeader from '@/components/DetailTitle/head'
import detailContent from './components/detailHead'
import detailTable from './components/detailTable'
import actionGroup from '../components/Action'
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
    data() {
        return {
            filename: '运营调拨单详情',
            bookType: 'xls',
            autoWidth: true,
        }
    },
    computed: {
        ...mapState('OperationalTransfers', [
            'detail',
            'detailItems'
        ])
    },
    components: {
        detailTitle,
        actionGroup,
        detailHeader,
        detailTable,
        detailContent
    },
    beforeDestroy() {
        this.CAHNGE_ITEMS([])
        this.CAHNGE_DETAIL()
    },
    methods: {
        ...mapActions('OperationalTransfers', [
            'getContent'
        ]),
        ...mapMutations('OperationalTransfers', ['CAHNGE_ITEMS', 'CAHNGE_DETAIL']),
        handleClick(type) {
            switch (type) {
                case 0: /* 返回 */
                    this.$router.go(-1)
                return
                case 4: /* 导出 */
                    this.exportData()
            }
        },
        /* 导出数据 */
        exportData() {
            if (!this.detailItems.length) {
                message('warning', '当前没有可以导出的数据')
                return
            }
            import("@/vendor/Export2Excel").then(excel => {
                // 设置导出表格的头部
                const tHeader = ['库存SKU', '中文名称', '调拨单价', '调拨数量', '调拨总金额']
                // 设置要导出的属性
                const filterVal = ['sku', 'skuName', 'skuPrice', 'skuCount', 'skuAmount']
                // 获取当前展示的表格数据
                const list = this.detailItems;
                // 将要导出的数据进行一个过滤
                const data = this.formatJson(filterVal, list);
                // 调用我们封装好的方法进行导出Excel
                excel.export_json_to_excel({
                // 导出的头部
                header: tHeader,
                // 导出的内容
                data,
                // 导出的文件名称
                filename: this.filename,
                // 导出的表格宽度是否自动
                autoWidth: this.autoWidth,
                // 导出文件的后缀类型
                bookType: this.bookType
                });
            });
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
    },
    mounted() {
        const { ticketCode } = this.$route.query
        if (ticketCode) {
            this.getContent(ticketCode)
        }
    }
}
</script>