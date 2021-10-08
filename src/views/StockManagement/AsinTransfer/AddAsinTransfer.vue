<template>
    <main>
        <detail-title :title="detailTitle" />
        <detail-header>
            <span>{{ detailTitle }}</span>
            <span v-html="message" class="warning"></span>
        </detail-header>
        <detail-search :show="showContent" />
        <div class="remark">
            <el-input type="textarea" v-model="detail.remark" placeholder="请输入备注" :disabled="!showContent" />
        </div>
        <search-sku @doFilterSku="doFilterSku" :isDisabled="!showContent" />
        <detail-items :tableData="detailItems" :show="showContent" :whouseId="detail.whouseId" />
        <action-group 
        @handleClick="handleClick" 
        :isUpload="false"
        :show="showContent" />
    </main>
</template>
<script>
import detailTitle from '@/components/DetailTitle'
import detailHeader from '@/components/DetailTitle/head'
import detailSearch from './components/detailHead'
import searchSku from '@/components/SearchSku'
import detailItems from './components/detailTable'
import actionGroup from '../components/Action'
import { mapState, mapActions, mapMutations } from 'vuex'
import { confirmMsg, message } from '@/utils/common'
// 设置导出表格的头部
const tHeader = ['产品图片', '库存SKU', '中文名称', '调出ASIN', '可用量', '占用量', '调出ASIN库存数量', '调入ASIN', '调入ASIN库存数量', '调拨数量', '调拨单价', '调拨总金额']
// 设置要导出的属性
const filterVal = [
    'skuImage', 
    'sku', 
    'skuName', 
    'sourceAsin', 
    'skuUsableCount', 
    'skuOccupyCount', 
    'sourceSkuCount', 
    'distAsin',
    'distSkuCount',
    'count',
    'skuPrice',
    'totalAmount'
    ]
export default {
    components: {
        detailTitle,
        detailHeader,
        detailSearch,
        searchSku,
        detailItems,
        actionGroup
    },
    computed: {
        ...mapState('AsinTransfer', [
            'detailItems',
            'detail'
        ]),
        showContent() {
            return !this.state || this.state === 1
        },
        detailTitle() {
            if (!this.state) return '新增调拨单'
            if (this.state === 1) return '修改调拨单'
            if (this.state && this.state !== 1) return '调拨单详情'
            // return this.showContent ? '新增调拨单' : '调拨单详情'
        },
        uploadAddress() {
            const { whouseId, shopId } = this.detail
            return `${process.env.VUE_APP_FBA_API}/warehouse/sku/import/${whouseId}/${shopId}/${true}`
        }
    },
    data() {
        return {
            message: '',
            state: null,
            ticketCode: null,
            filename: 'asin调拨单',
            autoWidth: true,
            bookType: 'xls',
        }
    },
    beforeDestroy() {
        this.CAHNGE_ITEMS()
        this.CHANGE_DETAIL()
    },
    methods: {
        ...mapActions(['getAllwarehouse']),
        ...mapMutations('AsinTransfer', [
            'CAHNGE_ITEMS',
            'CHANGE_DETAIL'
        ]),
        ...mapActions('AsinTransfer', [
            'findSkuDetail',
            'getAsinDetail',
            'editASinShop',
            'createASinShop'
        ]),
        doFilterSku(sku) {
            const { whouseId, shopId } = this.detail
            if (!whouseId || !shopId) {
                message('warning', '请选择店铺和仓库')
                return
            }
            if (this.detailItems.find(item => item.sku === sku)) {
                message('warning', '当前已有重复的sku，请不要重复添加')
                return
            }
            this.findSkuDetail({ sku, whouseId, shopId })
        },
        // uploadSuccess() {
        //     const message = '导出成功会将当前的数据覆盖，要执行此操作吗？'
        //     confirmMsg('warning', '提示', message, () => {
        //         this.CAHNGE_ITEMS(response.data)
        //     })
        // },
        handleClick(flag) {
            this.actionsSelFunc(flag)
        },
        saveData() {
            if (!this.detailItems.length) {
                message('warning', '当前没有数据可以保存')
                return
            }
            if (!this.detailItems.every(item => item.sourceAsin && item.distAsin && item.count && item.count <= item.skuUsableCount)) {
                message('warning', '调入调出ASIN和调拨数量必须填写,并且调拨数量要小于可用数量')
                return
            }
            if (this.detailItems.every(item => item.sourceAsin === item.distAsin)) {
                message('warning', '调入调出ASIN不允许相同')
                return
            }
            const { remark, whouseId, shopId } = this.detail
            const data = {
                remark,
                whouseId,
                shopId,
                skuList: this.detailItems.map(({ sourceAsin, distAsin, sku, skuPrice, count }) => {
                    return {
                        sourceAsin,
                        distAsin,
                        sku,
                        price: skuPrice,
                        count
                    }
                })
            }
            if (!this.state) {
                this.createASinShop(data)
                return
            }
            if (this.state && this.state === 1) {
                this.editASinShop({ data, ticketCode: this.ticketCode })
            }
        },
        exportData() {
            if (!this.detailItems.length) {
                message('warning', '当前没有可以导出的数据')
                return
            }
            import("@/vendor/Export2Excel").then(excel => {
                
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
        actionsSelFunc(num) {
            switch (num) {
                case 0: /* 返回 */
                    this.$router.push({ name: 'AsinTransfer' })
                return
                case 2: /* 保存 */
                    this.saveData()
                return
                case 4: /* 导出 */
                    this.exportData()
                return
                case 5: /* 下载模板 */
                    this.downloadTemplate()
                return
            }
        },
    },
    mounted() {
        this.getAllwarehouse()
        const { state, ticketCode } = this.$route.query
        if (state && ticketCode) {
            this.state = +state
            this.ticketCode = ticketCode
            this.getAsinDetail({ ticketCode, state })
        }
    }
}
</script>
<style lang="scss" scoped>
main {
    .remark {
        padding: 5px 150px 5px 0;
        border-bottom: 1px solid #dfe6ec;
    }
}
</style>