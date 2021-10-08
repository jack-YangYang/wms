<template>
    <main>
        <detail-title title="新增运营调拨单" />
        <detail-header>
            <span>新增调拨单</span>
            <span v-html="msg" class="warning"></span>
        </detail-header>
        <add-and-edit-detail :detail="detail" :disabled="isDisabled" />
        <search-sku @doFilterSku="doFilterSku" />
        <detail-table :tableData="detailItems" @del="DEL_ITEMS" />
        <div class="action-remark">
            <div>
                <span>备注：</span>
                <el-input type="textarea" v-model="detail.remark" placeholder="请输入备注" />
            </div>
            <action-group
            :uploaddUrl="uploadAddress"
            @handleClick="handleClick" 
            @uploadSuccess="uploadSuccess" 
            :detail="detail"
            />
        </div>
    </main>
</template>
<script>
import detailTitle from '@/components/DetailTitle'
import detailHeader from '@/components/DetailTitle/head'
import addAndEditDetail from './components/addAndEditDetail'
import searchSku from '@/components/SearchSku'
import detailTable from './components/detailTable'
import actionGroup from '../components/Action'
import { mapActions, mapMutations, mapState } from 'vuex'
import { message, confirmMsg } from '@/utils/common'
export default {
    components: {
        detailTitle,
        detailHeader,
        searchSku,
        addAndEditDetail,
        actionGroup,
        detailTable
    },
    computed: {
        ...mapState('OperationalTransfers', [
            'detail',
            'detailItems'
        ]),
        isDisabled() {
            return this.$route.query.type === 'edit'
        },
        uploadAddress() {
            const { sourceWhouseId, sourceShopId } = this.detail
            return `${process.env.VUE_APP_FBA_API}/warehouse/sku/import/${sourceWhouseId}/${sourceShopId}/${true}`
        }
    },
    data() {
        return {
            ticketCode: null,
            msg: '切换仓库会导致下面SKU清空！',
            filename: '运营调拨单详情',
            bookType: 'xls',
            autoWidth: true,
        }
    },
    beforeDestroy() {
        this.CAHNGE_ITEMS([])
        this.CAHNGE_DETAIL()
        this.CHANGE_CONFIG_LIST()
    },
    methods: {
        ...mapActions('OperationalTransfers', [
            'findSkuDetail',
            'createTransfers',
            'getContentDetail'
        ]),
        ...mapActions(['getAllwarehouse']),
        ...mapMutations('OperationalTransfers', [
            'DEL_ITEMS',
            'CAHNGE_ITEMS',
            'CAHNGE_DETAIL',
            'CHANGE_CONFIG_LIST'
        ]),
        show() {
            const { type } = this.$route.query
            return type === 'edit'
        },
        doFilterSku(sku) {
            const { sourceWhouseId, distWhouseId, sourceShopId } = this.detail
            if (!sourceShopId || !sourceWhouseId) {
                message('warning', '调出店铺与调出仓库必须选择！')
                return
            }
            if (this.detailItems.find(item => item.sku === sku )) {
                message('warning', '当前的SKU已经存在')
                return
            }
            this.findSkuDetail({ whouseId: sourceWhouseId, shopId: sourceShopId, sku, required: true })
        },  
        handleClick(type) {
            switch (type) {
                case 0: /* 返回 */
                    this.$router.go(-1)
                return
                // case 1: /* 审核 */
                //     this.audit()
                // return
                case 2: /* 保存 */
                    this.saveData()
                return
                // case 3: /* 作废 */
                //     this.invalid()
                // return
                case 4: /* 导出 */
                    this.exportData()
                return
                case 5:
                    this.downloadTemplate()
            }
        },
        saveData() {
            if (!this.detailItems.length) {
                message('warning', '当前没有任何数据可以保存')
                return
            }
            const { distWhouseId, distShopId, sourceWhouseId, sourceShopId, remark } = this.detail
            if (!distWhouseId || !distShopId) {
                message('warning', '调入店铺与调入仓库必须选择！')
                return
            }
            if (sourceWhouseId === distWhouseId && distShopId === sourceShopId) {
                message('warning', '调出仓库跟调入仓库不允许相同')
                return
            }
            if (!this.detailItems.every(item => item.skuCount && !isNaN(item.skuCount))) {
                message('warning', '调拨数量必须大于0')
                return
            }
            const result = {
                distWhouseId,
                distShopId,
                sourceWhouseId,
                sourceShopId,
                remark,
                skuList: this.detailItems.map(({ sku, skuCount, skuPrice }) => {
                    return {
                        sku, 
                        count: skuCount,
                        price: skuPrice
                    }
                })
            }
            let data = { data: result }
            if (this.show) {
                data.ticketCode = this.ticketCode
            }
            this.createTransfers(data)
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
        downloadTemplate() {
            import("@/vendor/Export2Excel").then(excel => {
                // 设置导出表格的头部
                const tHeader = ['SKU', '调拨库存']
                excel.export_json_to_excel({
                // 导出的头部
                header: tHeader,
                // 导出的内容
                data: [],
                // 导出的文件名称
                filename: '运营调拨库存导入模板',
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
    },
    mounted() {
        const { ticketCode, type } = this.$route.query
        if (ticketCode && type) {
            this.ticketCode = ticketCode
            this.getContentDetail(ticketCode)
        }
        this.getAllwarehouse()
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