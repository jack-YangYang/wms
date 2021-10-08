<template>
    <main> 
        <detail-title title="修改调拨" />
        <detail-header>
            <span>修改调拨单</span>
            <span v-html="msg" class="warning"></span>
        </detail-header>
        <detail-content :detail="detail" :show="false" />
        <search-sku @doFilterSku="doFilterSku" :isDisabled="!show" />
        <table-content :tableData="detailItems" :disabled="!show"  @deleteData="deleteData"  />
        <div>
            <div>
                <span>备注：</span>
                <el-input type="textarea" v-model="detail.remark" :disabled="!show" placeholder="请输入备注" />
            </div>
            <action-group 
            @handleClick="handleClick" 
            @uploadSuccess="uploadSuccess" 
            :uploaddUrl="uploadAddress" 
            :detail="detail"  
            :show="show" />
        </div>
    </main>
</template>
<script>
import detailTitle from '@/components/DetailTitle'
import detailHeader from '@/components/DetailTitle/head'
import detailContent from './components/detailHead'
import searchSku from '@/components/SearchSku'
import actionGroup from '../components/Action'
import TableContent from './components/detailTable'
import { message, dateFormat, confirmMsg  } from '@/utils/common'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
    components: {
        detailTitle,
        detailHeader,
        detailContent,
        searchSku,
        TableContent,
        actionGroup
    },
    computed: {
        ...mapState({
            detailItems: state => state.Transfers.detailItems,
            detail: state => state.Transfers.detail
        }),
        uploadAddress() {
            return `${process.env.VUE_APP_FBA_API}/warehouse/sku/import/${this.detail.sourceWhouseId}/0/${true}`
        },
        show() {
            return this.$route.query.type === 'edit'
        }
    },
    data() {
        return {
            msg: '切换仓库会导致下面SKU清空!',
            transferCode: null,
            filename: '调拨单详情',
            ticketCode: null,
            bookType: 'xls',
            autoWidth: true,
            // uploaddUrl: `${process.env.VUE_APP_ERP_JAVA_DOMAIN}/warehouseTransfer/skuImport`,
            date: dateFormat(new Date()),
        }
    },
    beforeDestroy() {
        this.CLEAR_CONTENT()
    },
    mounted() {
        const { ticketCode, type } =  this.$route.query
        this.ticketCode = ticketCode
        this.getContent(ticketCode)
        if (type === 'edit') {
            this.getAllwarehouse()
        }
    },
    methods: {
        ...mapActions(['getAllwarehouse']),
        ...mapActions('Transfers', [
            'findSkuDetail',
            'createTransfer',
            'getContent'
        ]),
        ...mapMutations('Transfers', [
            'CLEAR_CONTENT',
            'CAHNGE_ITEMS',
            'DELETE_ITEMS'
        ]),
        async  doFilterSku(sku) {
            if (!this.detail.sourceWhouseId || !this.detail.distWhouseId) {
                message('warning', '请先选择仓库')
                return
            }
            if (this.detail.sourceWhouseId === this.detail.distWhouseId) {
                message('warning', '调入仓和调出仓两个仓库不能相同')
                return
            }
            if (this.detailItems.find(item => item.sku === sku)) {
                message('warning', '当前已有重复的sku，请不要重复添加')
                return
            }
            let params = {
                whouseId: this.detail.sourceWhouseId,
                required: true,
                shopId: 0,
                sku
            }
            this.findSkuDetail(params)
        },
        deleteData(index) {
            this.DELETE_ITEMS(index)
        },
        /* handleClick操作 */
        handleClick(flag) {
            this.actionsSelFunc(flag)
        },
        actionsSelFunc(num) {
            switch (num) {
                case 0: /* 返回 */
                    this.$router.push({ name: 'Transfers' })
                return
                case 1: /* 审核 */
                return
                case 2: /* 保存 */
                    this.saveData()
                return
                case 3: /* 作废 */
                return
                case 4: /* 导出 */
                    this.exportData()
                return
                case 5: /* 下载模板 */
                    this.downloadTemplate()
                return
            }
        },
        /* 保存 */
        saveData() {
            if (!this.detailItems.length) return
            if (!this.detailItems.every(item => item.skuCount && !isNaN(item.skuCount))) {
                message('warning', '调拨数量不允许为0并且只能为整数')
                return
            } 
            let data = {
                remark: this.detail.remark,
                sourceWhouseId: this.detail.sourceWhouseId,
                distWhouseId: this.detail.distWhouseId,
                skuList: this.detailItems.map(item => {
                    return {
                        count: item.skuCount,
                        sku: item.sku,
                        price: item.skuPrice
                    }
                })
            }
            this.createTransfer({ data, ticketCode: this.ticketCode })
        },
        /* 导出 */
        exportData() {
            if (!this.detailItems.length) {
                message('warning', '当前没有可以导出的数据')
                return
            }
            import("@/vendor/Export2Excel").then(excel => {sourceCurrentCount
                // 设置导出表格的头部
                const tHeader = ['产品图片', '库存SKU', '中文名称', '调出仓库库存数量', '调出库位', '调入仓库存数量', '调入库位', '调拨数量']
                // 设置要导出的属性
                const filterVal = ['skuImg', 'sku', 'skuName', 'sourceTotalCount', 'sourceSpaceCode', 'distCurrentCount', 'distSpaceCode', 'count']
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
        downloadTemplate() {
            import("@/vendor/Export2Excel").then(excel => {
                // 设置导出表格的头部
                const tHeader = ['SKU', '调拨数量']
                excel.export_json_to_excel({
                // 导出的头部
                header: tHeader,
                // 导出的内容
                data: [],
                // 导出的文件名称
                filename: '调拨单导入模板',
                // 导出的表格宽度是否自动
                autoWidth: this.autoWidth,
                // 导出文件的后缀类型
                bookType: 'xls'
                });
            });
        },
        /* 导入成功 */
        uploadSuccess(response) {
            const { data: { skuList = [], failList = [] } } = response
            if (!skuList.length) {
                let message = `导入全部失败，失败SKU：${failList.join()}`
                message('error', message)
                return
            }
            let { length } = failList
            let html = failList.map(item => {
                return `<span>${item}</span>&nbsp;`
            })
            let errorMessage = length ? `当前失败${length}条，失败SKU：<div style="word-break: break-word">${html}</div>` : '当前失败0条'
            const message = `${errorMessage},导出成功会将当前的数据覆盖，要执行此操作吗？`
            confirmMsg('warning', '提示', message, () => {
                this.CAHNGE_ITEMS(skuList)
            })
        },
    }
}
</script>
<style scoped lang="scss">
main {
    .warning {
        color:  #ff6b6b;
        padding-left: 10px;
    }
}
</style>